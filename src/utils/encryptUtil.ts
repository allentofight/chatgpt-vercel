import * as CryptoJS from 'crypto-js';


const secretKey = import.meta.env.CLIENT_SECRET_KEY;

export function encrypt(message: string): string {
  const encrypted = CryptoJS.AES.encrypt(message, secretKey);
  return encrypted.toString();
}


export function decrypt(encryptedMessage: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
  const originalMessage = bytes.toString(CryptoJS.enc.Utf8);
  return originalMessage;
}