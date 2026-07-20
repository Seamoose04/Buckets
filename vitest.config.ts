import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		env: {
			PLAID_ENCRYPT_KEY: 'a'.repeat(64),
		},
	},
});
