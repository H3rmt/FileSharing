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
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
	godotenv.Load("../.env")
	os.Args = append(os.Args, fmt.Sprintf("--http=%s", os.Getenv("PUBLIC_HOST")))

	app := pocketbase.New()

	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Admin UI
		// (the isGoRun check is to enable it only during development)
		Automigrate: isGoRun,
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./dist"), false))

		return nil
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/size", func(c echo.Context) error {
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
		}, apis.ActivityLogger(app))

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
