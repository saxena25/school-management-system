import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// });
export default defineConfig({
	plugins: [
		react(), tailwindcss()
	],

	build: {
		outDir: "build",
	},
	base: "/",

	// Set your port back to 3000
	server: {
		open: true,
		port: 3000,
	},
});