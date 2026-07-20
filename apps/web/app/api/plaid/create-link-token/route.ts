import { plaidClient } from "@/lib/plaid";
import { CountryCode, Products } from "plaid";

export async function POST() {
	try {
		const linkToken = await plaidClient.linkTokenCreate({
			client_name: 'Buckets',
			language: 'en',
			country_codes: [CountryCode.Us],
			user: {  client_user_id: 'user' },
			products: [Products.Transactions]
		});
		return Response.json({ link_token: linkToken.data.link_token });
	} catch (error: any) {
		console.error('Plaid link token creation failed:', error.response?.data ?? error);
		return Response.json({ error: 'Failed to create link token' }, { status: 500 });
	}
}
