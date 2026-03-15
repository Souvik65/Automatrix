import Cryptr from 'cryptr';

if (!process.env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
}

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);

export const encrypt = (text: string) => cryptr.encrypt(text);
export const decrypt = (text: string) => cryptr.decrypt(text);