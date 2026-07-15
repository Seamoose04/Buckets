import PocketBase from "pocketbase";
import type { TypedPocketBase } from "./generated-types.ts";

export function createClient(url: string): TypedPocketBase {
	return new PocketBase(url) as TypedPocketBase;
}
