migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ues9zfp19erh0mb")

  collection.updateRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ues9zfp19erh0mb")

  collection.updateRule = null

  return dao.saveCollection(collection)
})
