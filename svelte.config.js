// svelte.config.js
import adapter from '@sveltejs/adapter-node'; // Make sure this is installed: npm i -D @sveltejs/adapter-node
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        // This adapter creates the 'build' directory with a node server.
        adapter: adapter()
    }
};
export default config;