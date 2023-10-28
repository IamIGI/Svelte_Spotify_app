<script lang="ts">
	import { afterNavigate, preloadData } from '$app/navigation';
	import { IconButton } from '$components';
	import { page } from '$app/stores';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	let backStack: string[] = [];
	let forwardStack: string[] = [];
	let navClicked = false;

	afterNavigate(({ from, to }) => {
		if (!from) return;

		if (navClicked) {
			navClicked = false;
			return;
		}
		backStack = [...backStack, from.url.pathname];
		forwardStack = [];
	});

	const preloadBackwardPage = () => {
		if (backStack.length === 0) return;
		const page = backStack[backStack.length - 1];
		preloadData(page);
	};

	const preloadForwardPage = () => {
		if (forwardStack.length === 0) return;
		const page = forwardStack[forwardStack.length - 1];
		preloadData(page);
	};

	const navigateBack = () => {
		if (backStack.length === 0) return;
		navClicked = true;
		history.back();

		const currPage = $page.url.pathname;
		forwardStack = [...forwardStack, currPage];
		backStack = backStack.slice(0, -1);
	};

	const navigateForward = () => {
		if (forwardStack.length === 0) return;
		navClicked = true;
		history.forward();

		const currPage = $page.url.pathname;
		backStack = [...backStack, currPage];
		forwardStack = forwardStack.slice(0, -1);
	};
</script>

<IconButton
	icon={ChevronLeft}
	label="Go back"
	disabled={backStack.length === 0}
	on:mouseover={preloadBackwardPage}
	on:click={navigateBack}
	class="nav-button"
/>
<IconButton
	icon={ChevronRight}
	label="Go forward"
	disabled={forwardStack.length === 0}
	on:mouseover={preloadForwardPage}
	on:click={navigateForward}
	class="nav-button"
/>

<style lang="scss">
	:global(button.nav-button) {
		background-color: var(--menu-background-color);
		margin-right: 5px;
		border-radius: 100%;
		height: 34px;
		width: 34px;
		&:active {
			background-color: var(--accent-color);
		}
		:global(html.no-js) & {
			display: none;
		}
		&:hover {
			background-color: var(--light-gray);
		}
	}
</style>
