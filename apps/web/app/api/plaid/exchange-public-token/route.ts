import { Encrypt } from "@/lib/encryption";
import { plaidClient } from "@/lib/plaid";
import { GetPBAdmin, Upsert } from "@/lib/pocketbase";
import { TypedPocketBase, Collections, AccountsRecord, AccountsResponse } from "@repo/pocketbase";
import { AccountBase, AccountSubtype, ItemPublicTokenExchangeResponse } from "plaid";

const PUBLIC_TOKEN_PATTERN = /^public-(sandbox|production)-[a-f0-9-]+$/;

export async function POST(request: Request): Promise<Response> {
	try {
		const requestObj = await request.json();
		const publicToken: unknown = requestObj.public_token;
		if (typeof publicToken !== 'string') {
			return Response.json({ error: "Expected a 'public_token' (string)" }, { status: 400 });
		}
		if (!PUBLIC_TOKEN_PATTERN.test(publicToken)) {
			return Response.json({ error: "'public_token' should be in the format: '[type]-[environment]-[uuid]'" }, { status: 400 });
		}

		const exchangedResponse: ItemPublicTokenExchangeResponse = (await plaidClient.itemPublicTokenExchange({ public_token: publicToken })).data;
		const accounts: AccountBase[] = (await plaidClient.accountsGet({ access_token: exchangedResponse.access_token })).data.accounts;
		const institution = (await plaidClient.itemGet({ access_token: exchangedResponse.access_token })).data.item.institution_name;
		if (institution === undefined || institution === null) {
			return Response.json({ error: "'institution_name' came back undefined/null" }, { status: 500 });
		}
		
		let checking: AccountBase | undefined = accounts.find((account: AccountBase) => {
			return account.subtype === AccountSubtype.Checking;
		});
		let savings: AccountBase | undefined = accounts.find((account: AccountBase) => {
			return account.subtype === AccountSubtype.Savings;
		});

		if (checking === undefined) {
			return Response.json({ error: "'Checking' account not found in plaid"}, { status: 500 });
		}
		if (savings === undefined) {
			return Response.json({ error: "'Savings' account not found in plaid"}, { status: 500 });
		}

		const encrypted = Encrypt(exchangedResponse.access_token);
		if (encrypted === undefined) {
			return Response.json({ error: "Encryption failed" }, { status: 500 });
		}

		const checkingAccountData: Partial<AccountsRecord> = {
			account_type: 'checking',
			institution_name: institution,
			plaid_account_id: checking.account_id,
			plaid_access_token: encrypted,
			plaid_item_id: exchangedResponse.item_id
		};
		await Upsert(Collections.Accounts, 'account_type = "checking"', checkingAccountData);

		const savingsAccountData: Partial<AccountsRecord> = {
			account_type: 'savings',
			institution_name: institution,
			plaid_account_id: savings.account_id,
			plaid_access_token: encrypted,
			plaid_item_id: exchangedResponse.item_id
		};
		await Upsert(Collections.Accounts, 'account_type = "savings"', savingsAccountData);

		return Response.json({ success: true }, { status: 201 });
	} catch (error: any) {
		console.error('Plaid public token exchange failed:', error.response?.data ?? error);
		return Response.json({ error: 'Failed to exchange token' }, { status: 500 });
	}
}
