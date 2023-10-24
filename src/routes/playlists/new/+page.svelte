<script lang="ts">
	import Button from '$components/Button.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<h2>Add a new playlist!</h2>

<form method="POST">
	<input hidden name="userID" value={data.user?.id} />
	<div class="field" class:has-error={form?.nameError}>
		<label for="playlist-name">Name *</label>
		<input
			type="text"
			id="playlist-name"
			name="name"
			placeholder="Playlist name"
			value={form?.name || ''}
		/>
		{#if form?.nameError}
			<p class="error">{form?.nameError}</p>
		{/if}
	</div>
	<div class="field">
		<label for="playlist-description">Description</label>
		<input
			type="text"
			id="playlist-description"
			name="description"
			placeholder="Playlist description"
			value={form?.description || ''}
		/>
	</div>

	{#if form?.apiError}
		<p class="error">{form.apiError}</p>
	{/if}

	<div class="submit-button">
		<Button element="button" type="submit">Create Playlist</Button>
	</div>
</form>
