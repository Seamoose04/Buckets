/// <reference path="../pb_data/types.d.ts" />

const generateTypes = (e) => {
	const pwdResult = toString($os.cmd("pwd").output())
	console.log("hook cwd:", pwdResult)
	console.log("Collection changed - Running type generation...")
	try {
		const cmd = $os.cmd(
			"npx",
			"pocketbase-typegen",
			"--db",
			"pb_data/data.db",
			"--out",
			"../../packages/pocketbase/src/generated-types.ts"
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
