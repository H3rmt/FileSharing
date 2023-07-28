migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ues9zfp19erh0mb")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3ycsoggm",
    "name": "new",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ues9zfp19erh0mb")

  // remove
  collection.schema.removeField("3ycsoggm")

  return dao.saveCollection(collection)
})
