/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3825328000")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "autodate2862495610",
    "name": "date",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3825328000")

  // remove field
  collection.fields.removeById("autodate2862495610")

  return app.save(collection)
})
