migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ues9zfp19erh0mb")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q2berbvs",
    "name": "name",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 3,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eey2qlia",
    "name": "file",
    "type": "file",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 99,
      "maxSize": 104857600,
      "mimeTypes": [],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ues9zfp19erh0mb")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q2berbvs",
    "name": "name",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eey2qlia",
    "name": "file",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 99,
      "maxSize": 5242880,
      "mimeTypes": [],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
})
