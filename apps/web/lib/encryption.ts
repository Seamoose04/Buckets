import { CipherGCM, createCipheriv, createDecipheriv, DecipherGCM, randomBytes } from "crypto";

function EncryptKey(): Buffer | undefined {
	const encryptKeyStr = process.env.PLAID_ENCRYPT_KEY;
	if (encryptKeyStr === undefined) {
		console.error("'PLAID_ENCRYPT_KEY' key not found");
		return undefined;
	}
	
	const encryptKey = Buffer.from(encryptKeyStr, 'hex');
	if (encryptKey.length !== 32) {
		console.error(`'PLAID_ENCRYPT_KEY' is an invalid length: ${encryptKey.length} (should be 32)`);
		return undefined;
	}
	
	return encryptKey;
}

export function Encrypt(plaintext: string): string | undefined {
	const key = EncryptKey();
	if (key === undefined) {
		return undefined;
	}
	const initVector: Buffer = randomBytes(12);
	const cipher: CipherGCM = createCipheriv('aes-256-gcm', key, initVector);
	const output: Buffer = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
	const authTag: Buffer = cipher.getAuthTag();
	return [initVector.toString('hex'), output.toString('hex'), authTag.toString('hex')].join(":");
}

export function Decrypt(encryptedText: string): string | undefined {
	const key = EncryptKey();
	if (key === undefined) {
		return undefined;
	}
	const dataRaw = encryptedText.split(":");
	if (dataRaw.length !== 3) {
		console.error("Decrypt: invalid secret (should have 3 parts)");
		return undefined;
	}
	const data: Buffer[] = dataRaw.map((d: string): Buffer => {
		return Buffer.from(d, 'hex');
	});
	const [initVector, output, authTag] = data;
	if (initVector === undefined || output === undefined || authTag === undefined) {
		console.error("Decrypt: invalid secret");
		return undefined;
	}
	let decipher: DecipherGCM = createDecipheriv('aes-256-gcm', key, initVector);
	decipher = decipher.setAuthTag(authTag);
	try {
		const plaintext: string = Buffer.concat([decipher.update(output), decipher.final()]).toString('utf8');
		return plaintext;
	} catch {
		console.error("Decrypt: DATA WAS LIKELY TAMPERED WITH");
		return undefined;
	}
}
