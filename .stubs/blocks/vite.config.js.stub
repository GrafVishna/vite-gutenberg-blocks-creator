import { defineConfig } from "vite";
import { createViteBlock } from "vite-gutenberg-blocks-creator";

export default defineConfig({
	plugins: [createViteBlock()],
	build: {
		minify: true,
		sourcemap: false,
		cssMinify: true
	},
	esbuild: {
		minifyIdentifiers: false,
		minifySyntax: false,
		minifyWhitespace: false
	},
	css: {
		devSourcemap: true,
		buildSourcemap: false,
	}
});
