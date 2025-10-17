import { UnipileClient } from 'unipile-node-sdk';

const apiKey = process.env.UNIPILE_API_KEY as string;
const baseUrl = (process.env.UNIPILE_API_URL || 'https://api1.unipile.com:13111').replace(/\/$/, '');

if (!apiKey) {
  throw new Error('Missing UNIPILE_API_KEY');
}

export const client = new UnipileClient(baseUrl, apiKey);
