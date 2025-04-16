import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	site: "https://dayala1.github.io",
	base: "/",
	vite: {
		assetsInclude: ['**/*.glb', '**/*.gltf'],
		plugins: [tailwindcss()],
	},
	alias: {
		"@components": "./src/components",
		"@scripts": "./src/scripts",
		"@lib": "./src/lib",
		"@assets": "./src/assets",
		"@layouts": "./src/layouts",
		"@config": "./src/config",
	},

});
