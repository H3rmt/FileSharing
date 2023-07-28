package main

import (
	"fmt"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
	"log"
)

func main() {
	app := pocketbase.New()

	//app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
	//	e.Router.AddRoute(echo.Route{
	//		Method: http.MethodGet,
	//		Path:   "/api/hello",
	//		Handler: func(c echo.Context) error {
	//			return c.String(http.StatusOK, "Hello world!")
	//		},
	//		Middlewares: []echo.MiddlewareFunc{
	//			apis.ActivityLogger(app),
	//			apis.RequireAdminAuth(),
	//		},
	//	})
	//
	//	return nil
	//})

	app.OnRecordBeforeCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		// overwrite the newly submitted "posts" record status to pending
		if e.Record.Collection().Name == "files" {
			fmt.Print("file record created")
			fmt.Print(e.UploadedFiles)
			e.UploadedFiles = make(map[string][]*filesystem.File)
		}

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
