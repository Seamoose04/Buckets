/// <reference path="../pb_data/types.d.ts" />

const generateTypes = (e) => {
	console.log("Collection changed - Running type generation...")
	try {
		const cmd = $os.cmd(
			"npx",
			"pocketbase-typegen",
			"--db",
			"services/pocketbase/pb_data/data.db",
			"--out",
			"packages/pocketbase/src/generated-types.ts"
		)
		const result = toString(cmd.output())
		console.log(result)
	} catch (err) {
		console.log("Type generation failed (non-fatal):", err)
	}
	e.next()
}

onCollectionAfterCreateSuccess(generateTypes)
onCollectionAfterUpdateSuccess(generateTypes)
onCollectionAfterDeleteSuccess(generateTypes)
