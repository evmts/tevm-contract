'use client'

import { type ReactNode, useState } from 'react'

type Raw = { __raw: string }
const raw = (s: string): Raw => ({ __raw: s })
const isRaw = (v: unknown): v is Raw => typeof v === 'object' && v !== null && '__raw' in v

type Json = string | number | boolean | null | Raw | Json[] | { [k: string]: Json }

const IND = '  '

function renderValue(value: Json, depth: number, key: () => number): ReactNode[] {
	if (isRaw(value))
		return [
			<span key={key()} className="tok-num">
				{value.__raw}
			</span>,
		]
	if (value === null)
		return [
			<span key={key()} className="tok-key">
				null
			</span>,
		]
	if (typeof value === 'boolean')
		return [
			<span key={key()} className="tok-key">
				{String(value)}
			</span>,
		]
	if (typeof value === 'number')
		return [
			<span key={key()} className="tok-num">
				{String(value)}
			</span>,
		]
	if (typeof value === 'string')
		return [
			<span key={key()} className="tok-str">
				'{value}'
			</span>,
		]
	if (Array.isArray(value)) {
		if (value.length === 0) return ['[]']
		const out: ReactNode[] = ['[\n']
		value.forEach((item, i) => {
			out.push(IND.repeat(depth + 1))
			out.push(...renderValue(item, depth + 1, key))
			out.push(i < value.length - 1 ? ',\n' : '\n')
		})
		out.push(IND.repeat(depth), ']')
		return out
	}
	const entries = Object.entries(value)
	if (entries.length === 0) return ['{}']
	const out: ReactNode[] = ['{\n']
	entries.forEach(([k, v], i) => {
		out.push(IND.repeat(depth + 1))
		out.push(
			<span key={key()} className="tok-prop">
				{k}
			</span>,
		)
		out.push(': ')
		out.push(...renderValue(v, depth + 1, key))
		out.push(i < entries.length - 1 ? ',\n' : '\n')
	})
	out.push(IND.repeat(depth), '}')
	return out
}

function JsonBlock({ value }: { value: Json }) {
	let k = 0
	const key = () => k++
	return <pre className="tevm-explorer-json">{renderValue(value, 0, key)}</pre>
}

const VITALIK = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const SPENDER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

const balanceOfAbi = {
	type: 'function',
	name: 'balanceOf',
	stateMutability: 'view',
	inputs: [{ name: 'account', type: 'address' }],
	outputs: [{ name: '', type: 'uint256' }],
}
const totalSupplyAbi = {
	type: 'function',
	name: 'totalSupply',
	stateMutability: 'view',
	inputs: [],
	outputs: [{ name: '', type: 'uint256' }],
}
const allowanceAbi = {
	type: 'function',
	name: 'allowance',
	stateMutability: 'view',
	inputs: [
		{ name: 'owner', type: 'address' },
		{ name: 'spender', type: 'address' },
	],
	outputs: [{ name: '', type: 'uint256' }],
}
const transferAbi = {
	type: 'function',
	name: 'transfer',
	stateMutability: 'nonpayable',
	inputs: [
		{ name: 'to', type: 'address' },
		{ name: 'amount', type: 'uint256' },
	],
	outputs: [{ name: '', type: 'bool' }],
}
const approveAbi = {
	type: 'function',
	name: 'approve',
	stateMutability: 'nonpayable',
	inputs: [
		{ name: 'spender', type: 'address' },
		{ name: 'amount', type: 'uint256' },
	],
	outputs: [{ name: '', type: 'bool' }],
}
const transferEventAbi = {
	type: 'event',
	name: 'Transfer',
	inputs: [
		{ name: 'from', type: 'address', indexed: true },
		{ name: 'to', type: 'address', indexed: true },
		{ name: 'value', type: 'uint256', indexed: false },
	],
}
const approvalEventAbi = {
	type: 'event',
	name: 'Approval',
	inputs: [
		{ name: 'owner', type: 'address', indexed: true },
		{ name: 'spender', type: 'address', indexed: true },
		{ name: 'value', type: 'uint256', indexed: false },
	],
}

function readAction(fnAbi: object, hr: string, args: Json[]): Json {
	return {
		abi: [fnAbi as Json],
		humanReadableAbi: [hr],
		functionName: (fnAbi as { name: string }).name,
		address: DAI,
		to: DAI,
		...(args.length ? { args } : {}),
	}
}

type Entry = {
	group: 'read' | 'write' | 'events' | 'deploy'
	label: string
	call: string
	action: Json
	consumers: string[]
}

const ENTRIES: Entry[] = [
	{
		group: 'read',
		label: 'balanceOf',
		call: `DAI.read.balanceOf('${VITALIK}')`,
		action: readAction(balanceOfAbi, 'function balanceOf(address account) view returns (uint256)', [VITALIK]),
		consumers: ['client.tevmContract(action)', 'viem readContract', 'wagmi useReadContract'],
	},
	{
		group: 'read',
		label: 'totalSupply',
		call: 'DAI.read.totalSupply()',
		action: readAction(totalSupplyAbi, 'function totalSupply() view returns (uint256)', []),
		consumers: ['client.tevmContract(action)', 'viem readContract', 'wagmi useReadContract'],
	},
	{
		group: 'read',
		label: 'allowance',
		call: `DAI.read.allowance('${VITALIK}', '${SPENDER}')`,
		action: readAction(allowanceAbi, 'function allowance(address owner, address spender) view returns (uint256)', [
			VITALIK,
			SPENDER,
		]),
		consumers: ['client.tevmContract(action)', 'viem readContract', 'wagmi useReadContract'],
	},
	{
		group: 'write',
		label: 'transfer',
		call: `DAI.write.transfer('${SPENDER}', 1000000000000000000n)`,
		action: {
			abi: [transferAbi as Json],
			humanReadableAbi: ['function transfer(address to, uint256 amount) returns (bool)'],
			functionName: 'transfer',
			address: DAI,
			to: DAI,
			args: [SPENDER, raw('1000000000000000000n')],
		},
		consumers: ['client.tevmContract(action)', 'viem writeContract', 'wagmi useWriteContract'],
	},
	{
		group: 'write',
		label: 'approve',
		call: `DAI.write.approve('${SPENDER}', 2000000000000000000n)`,
		action: {
			abi: [approveAbi as Json],
			humanReadableAbi: ['function approve(address spender, uint256 amount) returns (bool)'],
			functionName: 'approve',
			address: DAI,
			to: DAI,
			args: [SPENDER, raw('2000000000000000000n')],
		},
		consumers: ['client.tevmContract(action)', 'viem writeContract', 'wagmi useWriteContract'],
	},
	{
		group: 'events',
		label: 'Transfer',
		call: `DAI.events.Transfer({ fromBlock: 'latest', args: { from: '${VITALIK}' } })`,
		action: {
			eventName: 'Transfer',
			abi: [transferEventAbi as Json],
			humanReadableAbi: ['event Transfer(address indexed from, address indexed to, uint256 value)'],
			address: DAI,
			fromBlock: 'latest',
			args: { from: VITALIK },
		},
		consumers: ['client.eth.getLogs(filter)', 'viem getLogs', 'wagmi useWatchContractEvent'],
	},
	{
		group: 'events',
		label: 'Approval',
		call: "DAI.events.Approval({ fromBlock: 'latest' })",
		action: {
			eventName: 'Approval',
			abi: [approvalEventAbi as Json],
			humanReadableAbi: ['event Approval(address indexed owner, address indexed spender, uint256 value)'],
			address: DAI,
			fromBlock: 'latest',
		},
		consumers: ['client.eth.getLogs(filter)', 'viem getLogs', 'wagmi useWatchContractEvent'],
	},
	{
		group: 'deploy',
		label: 'deploy',
		call: 'DAI.deploy()',
		action: {
			bytecode: raw("'0x608060405234801561001057600080fd5b50…'"),
			abi: raw('/* full DAI JSON ABI */'),
		},
		consumers: ['client.tevmDeploy(action)', 'viem deployContract', 'wagmi useDeployContract'],
	},
]

const GROUPS: { id: Entry['group']; label: string; dot: string }[] = [
	{ id: 'read', label: 'read', dot: 'dot dot-read' },
	{ id: 'write', label: 'write', dot: 'dot dot-write' },
	{ id: 'events', label: 'events', dot: 'dot dot-event' },
	{ id: 'deploy', label: 'deploy', dot: 'dot dot-deploy' },
]

export function ActionExplorer() {
	const [selected, setSelected] = useState('balanceOf')

	const entry = ENTRIES.find((e) => `${e.group}:${e.label}` === selected) ?? ENTRIES[0]!

	return (
		<div className="tevm-explorer">
			<div className="tevm-explorer-nav">
				{GROUPS.map((group) => (
					<div key={group.id}>
						<div className="tevm-explorer-group">DAI.{group.label}</div>
						{ENTRIES.filter((e) => e.group === group.id).map((e) => (
							<button
								key={e.label}
								type="button"
								className="tevm-explorer-item"
								data-active={`${e.group}:${e.label}` === selected}
								onClick={() => setSelected(`${e.group}:${e.label}`)}
							>
								<span className={group.dot} />
								{e.label}
							</button>
						))}
					</div>
				))}
			</div>
			<div className="tevm-explorer-pane">
				<div className="tevm-explorer-label">Action creator call</div>
				<div className="tevm-explorer-call">{entry.call}</div>
				<div className="tevm-explorer-label">Returns — plain data, nothing executed</div>
				<JsonBlock value={entry.action} />
				<div className="tevm-explorer-label">Accepted by</div>
				<div className="tevm-explorer-chips">
					{entry.consumers.map((c) => (
						<span key={c} className="tevm-chip">
							{c}
						</span>
					))}
				</div>
			</div>
		</div>
	)
}
