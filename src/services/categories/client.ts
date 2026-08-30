import { env } from '../../app/config/env';
import { createClient } from '../api/createClient';

export const categoriesClient = createClient(env.API_URL, { service: 'categorias' });
