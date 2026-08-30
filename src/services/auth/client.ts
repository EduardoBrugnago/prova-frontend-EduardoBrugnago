import { env } from '../../app/config/env';
import { createClient } from '../api/createClient';

export const authClient = createClient(env.API_URL, { service: 'auth', withRefresh: false });
