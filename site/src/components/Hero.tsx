'use client'

import { useCallback, useState } from 'react'
import { highlightTs } from './highlight.js'

const INSTALL = 'pnpm add @tevm/contract'

const SAMPLE = `import { createContract } from '@tevm/contract'

const DAI = createContract({
  name: 'DAI',
  humanReadableAbi: [
    'function balanceOf(address) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
  ],
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
})

// Pure data. No client, no transport, no network.
const action = DAI.read.balanceOf('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')`

export function Hero() {
	const [copied, setCopied] = useState(false)

	const copy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(INSTALL)
		} catch {
			const ta = document.createElement('textarea')
			ta.value = INSTALL
			document.body.appendChild(ta)
			ta.select()
			document.execCommand('copy')
			ta.remove()
		}
		setCopied(true)
		setTimeout(() => setCopied(false), 1600)
	}, [])

	return (
		<section className="tevm-hero">
			<span className="tevm-hero-eyebrow">@tevm/contract</span>
			<h1 className="tevm-hero-title">
				One typed contract.
				<br />
				Every Tevm surface.
			</h1>
			<p className="tevm-hero-sub">
				Turn an ABI into typed <code>read</code>, <code>write</code>, <code>events</code>, and <code>deploy</code>{' '}
				action objects — pure functions returning plain data, shared by the Tevm node and the Tevm bundler, and accepted
				by viem and wagmi out of the box.
			</p>
			<div className="tevm-hero-actions">
				<button
					type="button"
					className="tevm-install"
					data-copied={copied}
					onClick={copy}
					aria-label="Copy install command"
				>
					<span className="tevm-install-prompt">$</span>
					<code>{INSTALL}</code>
					<span className="tevm-install-copy">{copied ? 'copied' : 'copy'}</span>
				</button>
				<a className="tevm-hero-cta" href="/getting-started">
					Get started →
				</a>
				<a className="tevm-hero-ghost" href="/api/create-contract">
					API reference
				</a>
			</div>
			<div className="tevm-codecard">
				<div className="tevm-codecard-bar">
					<span className="tevm-codecard-dot" />
					<span className="tevm-codecard-dot" />
					<span className="tevm-codecard-dot" />
					<span className="tevm-codecard-title">dai.ts</span>
				</div>
				<pre>
					<code>{highlightTs(SAMPLE)}</code>
				</pre>
			</div>
		</section>
	)
}
