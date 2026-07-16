/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_3549233588",
        "help": "",
        "hidden": false,
        "id": "relation3105530224",
        "maxSelect": 0,
        "minSelect": 0,
        "name": "from",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_3549233588",
        "help": "",
        "hidden": false,
        "id": "relation3616002756",
        "maxSelect": 0,
        "minSelect": 0,
        "name": "to",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "number2392944706",
        "max": null,
        "min": null,
        "name": "amount",
        "onlyInt": false,
        "presentable": false,
        "required": true,
        "system": false,
        "type": "number"
      },
      {
        "help": "",
        "hidden": false,
        "id": "select11490771",
        "maxSelect": 0,
        "name": "scope",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "same_bucket",
          "cross_bucket"
        ]
      },
      {
        "help": "",
        "hidden": false,
        "id": "select1045090739",
        "maxSelect": 0,
        "name": "direction",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "need_to_want",
          "want_to_need"
        ]
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text1001949196",
        "max": 0,
        "min": 10,
        "name": "reason",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      }
    ],
    "id": "pbc_3825328000",
    "indexes": [],
    "listRule": null,
    "name": "transfers",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3825328000");

  return app.delete(collection);
})
