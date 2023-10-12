package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `{
			"id": "ihr5eiyab1g0f1w",
			"created": "2023-10-12 22:09:26.120Z",
			"updated": "2023-10-12 22:09:26.120Z",
			"name": "files",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "nn73ugzn",
					"name": "name",
					"type": "text",
					"required": true,
					"presentable": false,
					"unique": false,
					"options": {
						"min": 3,
						"max": null,
						"pattern": ""
					}
				},
				{
					"system": false,
					"id": "vojf86vy",
					"name": "new",
					"type": "bool",
					"required": false,
					"presentable": false,
					"unique": false,
					"options": {}
				},
				{
					"system": false,
					"id": "6tgwz6ei",
					"name": "file",
					"type": "file",
					"required": false,
					"presentable": false,
					"unique": false,
					"options": {
						"maxSelect": 99,
						"maxSize": 524288000,
						"mimeTypes": [],
						"thumbs": [
							"300x300"
						],
						"protected": false
					}
				}
			],
			"indexes": [
				"CREATE UNIQUE INDEX ` + "`" + `idx_rXiTYUH` + "`" + ` ON ` + "`" + `files` + "`" + ` (` + "`" + `name` + "`" + `)"
			],
			"listRule": "",
			"viewRule": "",
			"createRule": "",
			"updateRule": "",
			"deleteRule": null,
			"options": {}
		}`

		collection := &models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return daos.New(db).SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("ihr5eiyab1g0f1w")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
