<script lang="ts">
	import { PlaylistForm } from '$components';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<h2>Add a new playlist!</h2>

<PlaylistForm userID={data.user?.id} {form} />
