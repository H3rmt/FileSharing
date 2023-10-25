package main

import (
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"

	_ "github.com/H3rmt/LocalFileSharing/migrations"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

const username = "generated-user"

func main() {
	godotenv.Load("../.env")

	app := pocketbase.New()

	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Admin UI
		// (the isGoRun check is to enable it only during development)
		Automigrate: isGoRun,
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./dist"), false))

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
			return c.String(http.StatusOK, fmt.Sprint(totalSize))
		}, apis.ActivityLogger(app), apis.RequireAdminOrRecordAuth())

		return nil
	})

	app.OnAfterBootstrap().Add(func(e *core.BootstrapEvent) error {
		// create admin
		admin_email, present := os.LookupEnv("ADMIN_EMAIL")
		if !present {
			admin_email = "admin@example.com"
			fmt.Println("missing ADMIN_EMAIL env, using 'admin@example.com'")
		}
		admin_passwd, present := os.LookupEnv("ADMIN_PASSWORD")
		if !present {
			return fmt.Errorf("ADMIN_PASSWORD env not set")
		}
		user_passwd, present := os.LookupEnv("USER_PASSWORD")
		if !present {
			return fmt.Errorf("USER_PASSWORD env not set")
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
