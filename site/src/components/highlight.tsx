import type { ReactNode } from 'react'

const KEYWORDS = new Set([
	'import',
	'from',
	'export',
	'const',
	'let',
	'var',
	'return',
	'new',
	'async',
	'await',
	'function',
	'type',
])

const TOKEN_RE =
	/(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|\b(0x[0-9a-fA-F…]+|\d[\d_]*)\b|\b(import|from|export|const|let|var|return|new|async|await|function|type)\b|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)(?=\s*:)/gm

export function highlightTs(code: string): ReactNode[] {
	const out: ReactNode[] = []
	let last = 0
	let key = 0
	for (const line of code.split('\n')) {
		let lineLast = 0
		TOKEN_RE.lastIndex = 0
		let m: RegExpExecArray | null
		while ((m = TOKEN_RE.exec(line)) !== null) {
			if (m.index > lineLast) out.push(line.slice(lineLast, m.index))
			const [full, com, str, num, kw, fn, prop] = m
			const cls = com
				? 'tok-com'
				: str
					? 'tok-str'
					: num
						? 'tok-num'
						: kw
							? 'tok-key'
							: fn
								? 'tok-fn'
								: prop
									? 'tok-prop'
									: undefined
			out.push(
				cls ? (
					<span key={key++} className={cls}>
						{full}
					</span>
				) : (
					full
				),
			)
			lineLast = m.index + full.length
			if (full.length === 0) TOKEN_RE.lastIndex++
		}
		out.push(line.slice(lineLast))
		out.push('\n')
		last = lineLast
	}
	void last
	return out
}
