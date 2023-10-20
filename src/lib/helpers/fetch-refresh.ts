import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export default async function fetchRefresh(
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>,
	path: string
) {
	const req = fetch(path);
	if (!browser) return req;

	const res = await req;
	if (res.status === 401) {
		// prevent from refreshing / fetching on each endpoint call.
		// soo we need to put fetch request in the browser (global object)
		// we are saving current promise in window browser, when request would finish, then set request to null
		if (!window.refreshPromise) {
			window.refreshPromise = fetch('/api/auth/refresh').finally(() => {
				window.refreshPromise = null;
			});
		}
		const refreshResponse = await window.refreshPromise;
		if (!refreshResponse.ok) throw error(401, 'Session Expired');
		return fetch(path);
	} else {
		return res;
	}
}
