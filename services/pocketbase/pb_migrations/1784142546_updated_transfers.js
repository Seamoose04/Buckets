/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3825328000")

  // add field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1031858107",
    "help": "",
    "hidden": false,
    "id": "relation4009337739",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "accountability_partner_notified",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3825328000")

  // remove field
  collection.fields.removeById("relation4009337739")

  return app.save(collection)
})
