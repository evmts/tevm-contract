import { defineConfig } from 'vocs/config'

export default defineConfig({
	title: 'Tevm Contract',
	titleTemplate: '%s · Tevm Contract',
	description: 'The type-safe contract kernel shared by the Tevm node and the Tevm bundler.',
	baseUrl: process.env['VERCEL_ENV'] === 'production' ? 'https://contract.tevm.sh' : process.env['VERCEL_URL'],
	rootDir: '.',
	// vocs 2.x renders with Waku/RSC by default. This site is pure content, so
	// pre-render everything and ship it as static files.
	renderStrategy: 'full-static',
	logoUrl: {
		light: '/tevm-logo-light.png',
		dark: '/tevm-logo-dark.png',
	},
	iconUrl: '/tevm-logo.webp',
	ogImageUrl: 'https://vocs.dev/api/og?logo=%logo&title=%title&description=%description',
	// vocs 2.x moved `theme.accentColor` / `theme.colorScheme` to the top level.
	accentColor: '#0085FF',
	colorScheme: 'light dark',
	editLink: {
		link: (filePath) => `https://github.com/evmts/tevm-contract/blob/main/site/${filePath}`,
		text: 'Edit on GitHub',
	},
	socials: [
		{ icon: 'github', link: 'https://github.com/evmts/tevm-contract' },
		{ icon: 'telegram', link: 'https://t.me/+ANThR9bHDLAwMjUx' },
	],
	topNav: [
		{ text: 'Guides', link: '/getting-started', match: '/getting-started' },
		{ text: 'API', link: '/api/create-contract', match: '/api' },
		{
			text: 'Ecosystem',
			items: [
				{ text: 'Tevm', link: 'https://tevm.sh' },
				{ text: 'Node', link: 'https://node.tevm.sh' },
				{ text: 'Contract', link: 'https://contract.tevm.sh' },
				{ text: 'Bundler', link: 'https://bundler.tevm.sh' },
				{ text: 'Utils', link: 'https://utils.tevm.sh' },
				{ text: 'Logger', link: 'https://logger.tevm.sh' },
				{ text: 'Test', link: 'https://test.tevm.sh' },
				{ text: 'Ethers', link: 'https://ethers.tevm.sh' },
				{ text: 'MUD', link: 'https://mud.tevm.sh' },
				{ text: 'CLI', link: 'https://cli.tevm.sh' },
				{ text: 'Examples', link: 'https://examples.tevm.sh' },
			],
		},
	],
	sidebar: [
		{
			text: 'Introduction',
			items: [
				{ text: 'What is @tevm/contract?', link: '/' },
				{ text: 'Getting started', link: '/getting-started' },
				{ text: 'How it fits into Tevm', link: '/ecosystem' },
			],
		},
		{
			text: 'Guides',
			items: [
				{ text: 'Creating a contract', link: '/guides/creating-contracts' },
				{ text: 'Reading state', link: '/guides/reading' },
				{ text: 'Writing state', link: '/guides/writing' },
				{ text: 'Events and filters', link: '/guides/events' },
				{ text: 'Deploying contracts', link: '/guides/deploying' },
				{ text: 'Using with viem and ethers', link: '/guides/interop' },
				{ text: 'Bundler-generated contracts', link: '/guides/bundler' },
				{ text: 'Prebuilt contracts', link: '/guides/prebuilt-contracts' },
			],
		},
		{
			text: 'API reference',
			items: [
				{ text: 'createContract', link: '/api/create-contract' },
				{ text: 'Contract', link: '/api/contract' },
				{ text: 'CreateContractParams', link: '/api/create-contract-params' },
				{ text: 'Action creators', link: '/api/action-creators' },
				{ text: 'Prebuilt contract exports', link: '/api/contract-lib' },
			],
		},
	],
})
