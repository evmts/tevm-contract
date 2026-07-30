type Site = {
	name: string
	host: string
	desc: string
	current?: boolean
}

const SITES: Site[] = [
	{ name: 'Tevm', host: 'tevm.sh', desc: 'The Ethereum virtual machine, in TypeScript' },
	{ name: 'Node', host: 'node.tevm.sh', desc: 'EVM node, memory client & actions' },
	{ name: 'Contract', host: 'contract.tevm.sh', desc: 'Typed contract kernel', current: true },
	{ name: 'Bundler', host: 'bundler.tevm.sh', desc: 'Import .sol files in TypeScript' },
	{ name: 'Voltaire', host: 'voltaire.tevm.sh', desc: 'Ethereum primitives and cryptography' },
	{ name: 'Logger', host: 'logger.tevm.sh', desc: 'Structured logging for Tevm' },
	{ name: 'Test', host: 'test.tevm.sh', desc: 'Matchers & fixtures for EVM tests' },
	{ name: 'Ethers', host: 'ethers.tevm.sh', desc: 'ethers.js adapter for Tevm' },
	{ name: 'MUD', host: 'mud.tevm.sh', desc: 'MUD framework integration' },
	{ name: 'CLI', host: 'cli.tevm.sh', desc: 'Command-line tooling' },
	{ name: 'Examples', host: 'examples.tevm.sh', desc: 'Cookbook & starter projects' },
]

export function EcosystemGrid() {
	return (
		<div className="tevm-eco">
			{SITES.map((site) =>
				site.current ? (
					<span key={site.host} className="tevm-eco-card" data-current="true">
						<span className="tevm-eco-here">you are here</span>
						<span className="tevm-eco-name">{site.name}</span>
						<span className="tevm-eco-host">{site.host}</span>
						<span className="tevm-eco-desc">{site.desc}</span>
					</span>
				) : (
					<a key={site.host} className="tevm-eco-card" href={`https://${site.host}`}>
						<span className="tevm-eco-name">{site.name}</span>
						<span className="tevm-eco-host">{site.host}</span>
						<span className="tevm-eco-desc">{site.desc}</span>
					</a>
				),
			)}
		</div>
	)
}
