package main

import (
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	_ "github.com/H3rmt/LocalFileSharing/migrations"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

const (
	env_host = "HOST"
	env_port = "PORT"
	env_name = "APP_NAME"

	env_admin_email    = "ADMIN_EMAIL"
	env_admin_password = "ADMIN_PASSWORD"
	env_user_password  = "USER_PASSWORD"
)

const username = "generated-user"

func main() {
	app := pocketbase.New()

	// run if serve command is executed
	if len(os.Args) > 1 && os.Args[1] == "serve" {
		host, present := os.LookupEnv(env_host)
		if !present {
			host = "0.0.0.0"
			fmt.Printf("missing %s env, using '%s'\n", env_host, host)
		}
		port, present := os.LookupEnv(env_port)
		if !present {
			port = "80"
			fmt.Printf("missing %s env, using '%s'\n", env_port, port)
		}

		os.Args = append(os.Args, fmt.Sprintf("--http=%s:%s", host, port))
	}

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Admin UI
		// (the isGoRun check is to enable it only during development)
		Automigrate: strings.HasPrefix(os.Args[0], os.TempDir()),
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./dist"), false))

		e.Router.GET("/api/name", func(c echo.Context) error {
			name, present := os.LookupEnv(env_name)
			if !present {
				name = "Local File Sharing"
			}
			Jname := struct {
				Name string `json:"name"`
			}{
				Name: name,
			}

			return c.JSON(http.StatusOK, Jname)
		}, apis.ActivityLogger(app))

		e.Router.GET("/api/size", func(c echo.Context) error {
			var totalSize int64
			filepath.WalkDir("pb_data/storage", func(path string, d fs.DirEntry, err error) error {
				if d != nil && !d.IsDir() {
					info, err := d.Info()
					if err != nil {
						log.Print(err)
						return c.String(http.StatusInternalServerError, "")
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
			return c.JSON(http.StatusOK, Jsize)
		}, apis.ActivityLogger(app), apis.RequireAdminOrRecordAuth())

		return nil
	})

	// app.OnAfterBootstrap().Add(func(e *core.BootstrapEvent) error {
	// migrations were not applied yet
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		// create admin
		admin_email, present := os.LookupEnv(env_admin_email)
		if !present {
			admin_email = "admin@example.com"
			fmt.Printf("missing %s env, using '%s'\n", env_admin_email, admin_email)
		}
		admin_passwd, present := os.LookupEnv(env_admin_password)
		if !present {
			return fmt.Errorf("%s env not set", env_admin_password)
		}
		user_passwd, present := os.LookupEnv(env_user_password)
		if !present {
			return fmt.Errorf("%s env not set", env_user_password)
		}

		old_admin, _ := e.App.Dao().FindAdminByEmail(admin_email)
		if old_admin == nil {
			// create new admin
			admin := &models.Admin{}
			admin.Email = admin_email
			admin.SetPassword(admin_passwd)

			err := e.App.Dao().SaveAdmin(admin)
			if err != nil {
				return err
			} else {
				fmt.Println("created admin")
			}
		} else {
			old_admin.SetPassword(admin_passwd)

			err := e.App.Dao().SaveAdmin(old_admin)
			if err != nil {
				return err
			} else {
				fmt.Println("updated admin")
			}
		}

		// create user
		old_user, _ := e.App.Dao().FindAuthRecordByUsername("users", username)
		if old_user == nil {
			collection, err := e.App.Dao().FindCollectionByNameOrId("users")
			if err != nil {
				return err
			}
			user := models.NewRecord(collection)
			user.SetUsername(username)
			user.SetPassword(user_passwd)

			err = e.App.Dao().SaveRecord(user)
			if err != nil {
				return err
			} else {
				fmt.Println("created user")
			}
		} else {
			old_user.SetPassword(user_passwd)

			err := e.App.Dao().SaveRecord(old_user)
			if err != nil {
				return err
			} else {
				fmt.Println("updated user")
			}
		}

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
