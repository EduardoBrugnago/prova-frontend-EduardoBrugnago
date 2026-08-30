import { env } from '../../app/config/env';
import { createClient } from '../api/createClient';

export const productsClient = createClient(env.API_URL, { service: 'produtos' });
