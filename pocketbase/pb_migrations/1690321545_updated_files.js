migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ues9zfp19erh0mb")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ues9zfp19erh0mb")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
