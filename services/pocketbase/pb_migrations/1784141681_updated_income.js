/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_146481054")

  // remove field
  collection.fields.removeById("bool3276064887")

  // add field
  collection.fields.addAt(5, new Field({
    "help": "The amount that has already been allocated",
    "hidden": false,
    "id": "number1526336415",
    "max": null,
    "min": 0,
    "name": "amount_allocated",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_146481054")

  // add field
  collection.fields.addAt(5, new Field({
    "help": "",
    "hidden": false,
    "id": "bool3276064887",
    "name": "allocated",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // remove field
  collection.fields.removeById("number1526336415")

  return app.save(collection)
})
