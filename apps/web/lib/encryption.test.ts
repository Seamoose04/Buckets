import { describe, test, expect } from 'vitest';
import { randomBytes } from 'crypto';
import { Encrypt, Decrypt } from './encryption';

describe('Encryption/Decryption', () => {
	test('round-trip string matches original', () => {
		const original = 'hello there!';

		const encrypted = Encrypt(original);
		expect(encrypted).toBeDefined();
		
		const decrypted = Decrypt(encrypted!);
		expect(decrypted).toBe(original);
	});
	test('same plaintext, different result', () => {
		const original = 'hello there!';

		const encrypted1 = Encrypt(original);
		expect(encrypted1).toBeDefined();

		const encrypted2 = Encrypt(original);
		expect(encrypted2).toBeDefined();

		expect(encrypted1!).not.toBe(encrypted2!);
	});
	test('tampering is detected', () => {
		const original = 'hello there';

		const encrypted = Encrypt(original);
		expect(encrypted).toBeDefined();

		const tampered = encrypted!.substring(0, 5)
			+ (encrypted!.substring(5, 7) !== '00' ? '00' : '10')
			+ encrypted!.substring(7);

		const decrypted = Decrypt(tampered);
		expect(decrypted).toBeUndefined();
	});
	test('different encrypt and decrypt keys', () => {
		const original = 'hello there';

		const originalKey = process.env.PLAID_ENCRYPT_KEY;
		process.env.PLAID_ENCRYPT_KEY = randomBytes(32).toString('hex');
		const encrypted = Encrypt(original);
		process.env.PLAID_ENCRYPT_KEY = originalKey;
		expect(encrypted).toBeDefined();

		const decrypted = Decrypt(encrypted!);
		expect(decrypted).toBeUndefined();
	});
});
