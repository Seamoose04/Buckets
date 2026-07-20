import { TypedPocketBase } from '@repo/pocketbase';
import PocketBase from 'pocketbase';

let cachedPB: Promise<TypedPocketBase> | undefined = undefined;

async function Authenticate(): Promise<TypedPocketBase> {
	const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;
	if (PB_URL === undefined) {
		throw new Error("'NEXT_PUBLIC_POCKETBASE_URL' not defined");
	}

	const PB_EMAIL = process.env.PB_ADMIN_EMAIL;
	if (PB_EMAIL === undefined) {
		throw new Error("'PB_ADMIN_EMAIL' not defined");
	}

	const PB_PASS = process.env.PB_ADMIN_PASSWORD;
	if (PB_PASS === undefined) {
		throw new Error("'PB_ADMIN_PASSWORD`' not defined");
	}

	const pbClient = new PocketBase(PB_URL) as TypedPocketBase;
	await pbClient.collection('_superusers').authWithPassword(PB_EMAIL, PB_PASS);

	return pbClient;
}

export function GetPBAdmin(): Promise<TypedPocketBase> {
	if (cachedPB === undefined) {
		cachedPB = Authenticate();
	}

	return cachedPB;
}
