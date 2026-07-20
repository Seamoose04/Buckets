import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const PLAID_ID = process.env.PLAID_CLIENT_ID;
if (PLAID_ID === undefined) {
	throw new Error("'PLAID_CLIENT_ID' not defined");
}

const PLAID_SECRET = process.env.PLAID_SECRET;
if (PLAID_SECRET === undefined) {
	throw new Error("'PLAID_SECRET' not defined");
}

const PLAID_ENV = process.env.PLAID_ENV;
if (PLAID_ENV === undefined) {
	throw new Error("'PLAID_ENV' not defined");
}
if (!['PROD', 'SAND'].includes(PLAID_ENV)) {
	throw new Error("'PLAID_ENV' must be one of ['PROD', 'SAND']");
}

const config = new Configuration({
	basePath: PLAID_ENV === 'PROD' ? PlaidEnvironments.production : PlaidEnvironments.sandbox,
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': PLAID_ID,
			'PLAID-SECRET': PLAID_SECRET,
		},
	},
});

export const plaidClient = new PlaidApi(config);
