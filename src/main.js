import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		encoding: 'mp3'
	}
});

export default app;
