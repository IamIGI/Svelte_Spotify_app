<script lang="ts">
	import { ItemPage } from '$components';
	import Button from '$components/Button.svelte';
	import Card from '$components/Card.svelte';
	import TrackList from '$components/TrackList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: artist = data.artist;
	$: artistTopTracks = data.artistTopTracks;
	$: color = data.color;
	$: sections = data.artistSections;
	$: console.log(data);

	const followersFormat = Intl.NumberFormat('en', { notation: 'compact' });
</script>

<ItemPage
	title={artist.name}
	{color}
	image={artist.images && artist?.images?.length > 0 ? artist.images[0].url : undefined}
	type={artist.type}
>
	<p class="meta" slot="meta">
		<span class="tracks-count">{followersFormat.format(artist.followers.total)} Followers</span>
	</p>
	<h2>Top Tracks</h2>
	<TrackList
		tracks={artistTopTracks.tracks}
		userPlaylists={data.userAllPlaylists?.filter((pl) => pl.owner.id === data.user?.id)}
	/>
</ItemPage>

{#each sections as section}
	<section class="content-row">
		<div class="content-row-header">
			<div class="right">
				<h2 class="section-title">{section.title}</h2>
			</div>
			<div class="left">
				<Button element="a" href={section.path} variant="outline"
					>See All <span class="visually-hidden">{section.title}</span></Button
				>
			</div>
		</div>
		<div class="grid-items">
			{#each section.items as item}
				<div class="grid-item" style="background-color: black;">
					<Card {item} />
				</div>
			{/each}
		</div>
	</section>
{/each}

<style lang="scss">
	.meta {
		font-size: functions.toRem(14);
		font-weight: 600;
	}
	.content-row {
		margin-bottom: 40px;
		.content-row-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20px;

			.section-title {
				font-size: functions.toRem(22);
				font-weight: 600;
				margin: 0;
			}
		}
	}
</style>
