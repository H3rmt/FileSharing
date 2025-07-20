package main

import (
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	_ "github.com/H3rmt/FileSharing/migrations"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

const (
	envHost = "HOST"
	envPort = "PORT"
	envName = "APP_NAME"

	envAdminEmail    = "ADMIN_EMAIL"
	envAdminPassword = "ADMIN_PASSWORD"
	envUserPassword  = "USER_PASSWORD"
)

const nodePort = "4321"
const nodeHost = "0.0.0.0"
const generatedEmail = "generated-user@example.com"

func redirect(c *core.RequestEvent) error {
	//println(c.Request.RequestURI)

	// Erstellt eine neue Anfrage an den Node.js-Server
	req, err := http.NewRequest(c.Request.Method, fmt.Sprintf("http://%s:%s%s", nodeHost, nodePort, c.Request.RequestURI), c.Request.Body)
	if err != nil {
		err = fmt.Errorf("error creating request: %w", err)
		println(err.Error())
		return c.String(http.StatusInternalServerError, err.Error())
	}

	// Kopiert die Header aus der ursprünglichen Anfrage
	for name, values := range c.Request.Header {
		for _, value := range values {
			req.Header.Add(name, value)
		}
	}

	// Sendet die Anfrage und erhält eine Antwort
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		err = fmt.Errorf("error sending request: %w", err)
		println(err.Error())
		return c.String(http.StatusInternalServerError, err.Error())
	}
	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(resp.Body)

	// Liest den Antwortkörper und sendet ihn zurück an den Client
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		err = fmt.Errorf("error reading response: %w", err)
		println(err.Error())
		return c.String(http.StatusInternalServerError, err.Error())
	}
	return c.Blob(http.StatusOK, resp.Header.Get("Content-Type"), body)
}

func main() {
	app := pocketbase.New()
	var host string
	var port string

	// run if serve command is executed
	if len(os.Args) > 1 && os.Args[1] == "serve" {
		var present bool
		host, present = os.LookupEnv(envHost)
		if !present {
			host = "0.0.0.0"
			fmt.Printf("missing %s env, using '%s'\n", envHost, host)
		}
		port, present = os.LookupEnv(envPort)
		if !present {
			port = "80"
			fmt.Printf("missing %s env, using '%s'\n", envPort, port)
		}

		os.Args = append(os.Args, fmt.Sprintf("--http=%s:%s", host, port))
	}

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Admin UI
		// (the isGoRun check is to enable it only during development)
		Automigrate: strings.HasPrefix(os.Args[0], os.TempDir()),
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// start node server
		cmd := exec.Command("node", "./dist/server/entry.mjs")
		cmd.Env = append(os.Environ(), fmt.Sprintf("HOST=%s", nodeHost), fmt.Sprintf("PORT=%s", nodePort), fmt.Sprintf("POCKETBASE_URL=http://%s:%s", host, port))
		cmd.Stdout = os.Stdout // Leitet die Standardausgabe des Node.js-Servers in die Standardausgabe des Go-Programms um
		cmd.Stderr = os.Stderr // Leitet die Standardfehler des Node.js-Servers in die Standardfehler des Go-Programms um
		err := cmd.Start()
		if err != nil {
			log.Fatal(err)
		}
		log.Printf("Node server started with PID %d\n", cmd.Process.Pid)
		go func() {
			err := cmd.Wait()
			if err != nil {
				log.Printf("Node server terminated with error: %v\n", err)
			} else {
				log.Println("Node server terminated successfully")
			}
		}()
		se.Router.GET("/", redirect)
		se.Router.GET("/*", redirect)

		se.Router.GET("/info", func(re *core.RequestEvent) error {
			staticFS := os.DirFS(".")
			return re.FileFS(staticFS, "info.json")
		})

		se.Router.GET("/api/name", func(re *core.RequestEvent) error {
			name, present := os.LookupEnv(envName)
			if !present {
				name = "File Sharing"
			}
			Jname := struct {
				Name string `json:"name"`
			}{
				Name: name,
			}
			return re.JSON(http.StatusOK, Jname)
		})

		se.Router.GET("/api/size", func(re *core.RequestEvent) error {
			var totalSize int64
			_ = filepath.WalkDir("pb_data/storage", func(path string, d fs.DirEntry, err error) error {
				if d != nil && !d.IsDir() {
					info, err := d.Info()
					if err != nil {
						log.Print(err)
						return re.String(http.StatusInternalServerError, "")
					}
					if !strings.HasSuffix(info.Name(), ".attrs") {
						totalSize += info.Size()
					}
				}
				return nil
			})
			Jsize := struct {
				Size int64 `json:"size"`
			}{
				Size: totalSize,
			}
			return re.JSON(http.StatusOK, Jsize)
		}).Bind(apis.RequireAuth("_superusers", "users"))

		return se.Next()
	})

	// app.OnAfterBootstrap().Add(func(e *core.BootstrapEvent) error {
	// migrations were not applied yet
	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// create admin
		adminEmail, present := os.LookupEnv(envAdminEmail)
		if !present {
			adminEmail = "admin@example.com"
			fmt.Printf("missing %s env, using '%s'\n", envAdminEmail, adminEmail)
		}
		adminPasswd, present := os.LookupEnv(envAdminPassword)
		if !present {
			return fmt.Errorf("%s env not set", envAdminPassword)
		}
		userPasswd, present := os.LookupEnv(envUserPassword)
		if !present {
			return fmt.Errorf("%s env not set", envUserPassword)
		}

		oldAdmin, _ := se.App.FindAuthRecordByEmail(core.CollectionNameSuperusers, adminEmail)
		if oldAdmin == nil {
			collection, err := se.App.FindCollectionByNameOrId(core.CollectionNameSuperusers)
			if err != nil {
				return err
			}
			record := core.NewRecord(collection)
			record.SetEmail(adminEmail)
			record.SetPassword(adminPasswd)
			err = se.App.Save(record)
			if err != nil {
				return err
			} else {
				fmt.Println("created admin")
			}
		} else {
			oldAdmin.SetPassword(adminPasswd)
			err := se.App.Save(oldAdmin)
			if err != nil {
				return err
			} else {
				fmt.Println("updated admin")
			}
		}

		// create user
		oldUser, _ := se.App.FindAuthRecordByEmail("users", generatedEmail)
		if oldUser == nil {
			collection, err := se.App.FindCollectionByNameOrId("users")
			if err != nil {
				return err
			}
			record := core.NewRecord(collection)
			record.SetEmail(generatedEmail)
			record.SetPassword(userPasswd)
			err = se.App.Save(record)
			if err != nil {
				return err
			} else {
				fmt.Println("created user")
			}
		} else {
			oldUser.SetPassword(userPasswd)
			err := se.App.Save(oldUser)
			if err != nil {
				return err
			} else {
				fmt.Println("updated user")
			}
		}

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
