import { formatAbi } from '@tevm/utils'

/**
 * Groups eligible overloads once and retains the last declaration as creator metadata.
 * @param {{
 *   methods: import('@tevm/utils').Abi
 *   errors: import('@tevm/utils').Abi
 *   address?: import('@tevm/utils').Address | undefined
 *   code?: import('@tevm/utils').Hex | undefined
 * }} params
 * @returns {Record<string, ((...args: unknown[]) => {
 *   abi: import('@tevm/utils').Abi
 *   humanReadableAbi: string[]
 *   functionName: string
 *   address?: import('@tevm/utils').Address
 *   to?: import('@tevm/utils').Address
 *   code?: import('@tevm/utils').Hex
 *   args?: unknown[]
 * }) & {
 *   functionName: string
 *   abi: [import('@tevm/utils').AbiFunction]
 *   humanReadableAbi: string[]
 *   code: import('@tevm/utils').Hex | undefined
 *   address?: import('@tevm/utils').Address
 *   to?: import('@tevm/utils').Address
 * }>}
 * @param {ReadonlyArray<import('@tevm/utils').AbiFunction['stateMutability']>} mutabilities
 */
export const functionActions = ({ methods, errors, address, code }, mutabilities) => {
	/** @type {Map<string, { method: import('@tevm/utils').AbiFunction; overloads: import('@tevm/utils').AbiFunction[] }>} */
	const groups = new Map()
	for (const method of methods) {
		if (method.type !== 'function' || !mutabilities.includes(method.stateMutability)) continue

		const group = groups.get(method.name)
		if (group) {
			group.method = method
			group.overloads.push(method)
		} else {
			groups.set(method.name, { method, overloads: [method] })
		}
	}

	const addressFields = address === undefined ? {} : { address, to: address }
	const codeFields = code === undefined ? {} : { code }
	return Object.fromEntries(
		Array.from(groups, ([functionName, { method, overloads }]) => {
			const humanReadableAbi = formatAbi([method])
			const actionAbi = [...overloads, ...errors]

			/** @param {...unknown} args */
			const creator = (...args) => ({
				abi: [...actionAbi],
				humanReadableAbi: [...humanReadableAbi],
				functionName,
				...codeFields,
				...addressFields,
				...(args.length > 0 ? { args } : {}),
			})

			return [
				functionName,
				Object.assign(
					creator,
					{
						functionName,
						abi: /** @type {[import('@tevm/utils').AbiFunction]} */ ([method]),
						humanReadableAbi: [...humanReadableAbi],
						code,
					},
					addressFields,
				),
			]
		}),
	)
}
