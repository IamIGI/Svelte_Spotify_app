import { fetchRefresh } from '$helpers';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, parent, depends, route }) => {
	depends(`app:${route.id}`);

	const { user } = await parent();

	const artistReq = fetchRefresh(fetch, `/api/spotify/artists/${params.id}`);
	const artistTopTracksReq = fetchRefresh(
		fetch,
		`/api/spotify/artists/${params.id}/top-tracks?market=${user?.country}`
	);

	const [artistRes, artistTopTracksRes] = await Promise.all([artistReq, artistTopTracksReq]);

	if (!artistRes.ok) throw error(artistRes.status, 'Failed to load artist profile');

	if (!artistTopTracksRes.ok)
		throw error(artistTopTracksRes.status, 'Failed to load artist top tracks');

	const artistJSON: SpotifyApi.ArtistObjectFull = await artistRes.json();
	const artistTopTracksJSON: SpotifyApi.ArtistsTopTracksResponse = await artistTopTracksRes.json();

	let color = null;

	if (artistJSON.images.length > 0) {
		const colorRes = await fetch(
			`/api/average-color?${new URLSearchParams({ image: artistJSON.images[0].url }).toString()}`
		);

		if (colorRes.ok) {
			color = (await colorRes.json()).color;
		}
	}

	// fetch artist additional info
	const artistAlbumsReq = fetch(
		`/api/spotify/artists/${params.id}/albums?limit=6&include_groups=album,single`
	);
	const artistAppearsOnReq = fetch(
		`/api/spotify/artists/${params.id}/albums?limit=6&include_groups=appears_on`
	);
	const relatedArtistsReq = fetchRefresh(
		fetch,
		`/api/spotify/artists/${params.id}/related-artists?limit=6`
	);

	const [artistAlbumsRes, relatedArtistsRes, artistAppearsOnRes] = await Promise.all([
		artistAlbumsReq,
		relatedArtistsReq,
		artistAppearsOnReq
	]);

	if (!artistAlbumsRes.ok) throw error(artistAlbumsRes.status, 'Failed to load artists albums');
	if (!relatedArtistsRes.ok) throw error(relatedArtistsRes.status, 'Failed to load artists albums');
	if (!artistAppearsOnRes.ok)
		throw error(relatedArtistsRes.status, 'Failed to load artists appearsOn data');

	const artistAlbumsJSON: SpotifyApi.ArtistsAlbumsResponse = await artistAlbumsRes.json();
	const artistAppearsOnJSON: SpotifyApi.ArtistsAlbumsResponse = await artistAppearsOnRes.json();
	const relatedArtistsJSON: SpotifyApi.ArtistsRelatedArtistsResponse =
		await relatedArtistsRes.json();

	return {
		artist: artistJSON,
		artistTopTracks: artistTopTracksJSON,
		color,
		artistSections: [
			{ title: 'Albums', path: `/artist/${params.id}/albums`, items: artistAlbumsJSON.items },
			{
				title: 'Appears on',
				path: `/artist/${params.id}/appears-on`,
				items: artistAppearsOnJSON.items
			},
			{
				title: 'Related artists',
				path: `/artist/${params.id}/related-artists`,
				items: relatedArtistsJSON.artists.slice(0, 6)
			}
		]
	};
};
