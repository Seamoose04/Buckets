/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3549233588")

  // update collection data
  unmarshal({
    "name": "glasses"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3549233588")

  // update collection data
  unmarshal({
    "name": "glass"
  }, collection)

  return app.save(collection)
})
