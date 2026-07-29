import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts'],
	outDir: 'dist',
	target: ['chrome91', 'firefox90', 'edge91', 'safari15', 'ios15', 'opera77'],
	format: ['cjs', 'esm'],
	splitting: false,
	treeshake: true,
	sourcemap: true,
	clean: false,
	skipNodeModulesBundle: true,
})
