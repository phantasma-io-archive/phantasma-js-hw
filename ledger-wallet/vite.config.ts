import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import wasm from 'vite-plugin-wasm';
import { Buffer } from 'buffer';

//import inject from '@rollup/plugin-inject';

export default defineConfig({
	build: {
		target: 'esnext' // This allows top-level await
	},
	plugins: [sveltekit(), wasm()],
	define: {
		'global.Buffer': Buffer
	},

	server: {
		hmr: {
			overlay: false
		}
	},
	resolve: {
		alias: {
			/*"stream": "vite-compatible-readable-stream",*/
			stream: 'stream-browserify',
			process: 'process/browser',
			zlib: 'browserify-zlib',
			util: 'util',
			path: 'path-browserify',
			crypto: 'crypto'
			//Buffer: 'buffer'
			//Buffer: 'buffer'
		}
	}
});
