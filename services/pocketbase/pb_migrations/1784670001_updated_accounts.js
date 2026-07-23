/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2324088501")

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select5099651",
    "maxSelect": 0,
    "name": "account_type",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "checking",
      "savings"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2324088501")

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select5099651",
    "maxSelect": 0,
    "name": "account_type",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "checkings",
      "savings"
    ]
  }))

  return app.save(collection)
})
