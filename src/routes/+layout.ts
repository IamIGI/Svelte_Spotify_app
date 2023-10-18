import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

// we need to return data which we get, because this that have to be accessed by higher app levels.
// Levels: +layout.server.ts (server) ->  +layout.ts (client) -> +layout.svelte (app)
export const load: LayoutLoad = ({ data, url }) => {
	const { user } = data || {};

	if (user && url.pathname === '/login') throw redirect(307, '/');
	if (!user && url.pathname !== '/login') throw redirect(307, '/login');

	return { user };
};
