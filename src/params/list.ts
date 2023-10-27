import type { ParamMatcher } from '@sveltejs/kit';

//list parameter matcher
export const match: ParamMatcher = (param) => {
	return ['section', 'category', 'artist', 'profile'].includes(param);
};
