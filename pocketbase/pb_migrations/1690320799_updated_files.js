migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ues9zfp19erh0mb")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_qxL40d7` ON `files` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ues9zfp19erh0mb")

  collection.indexes = []

  return dao.saveCollection(collection)
})
