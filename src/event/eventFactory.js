import { formatAbi } from '@tevm/utils'

/**
 * Creates the event action creators from the given parameters.
 * This factory function generates a set of typed event creators for a contract,
 * allowing for easy and type-safe creation of event filters.
 *
 * @param {object} params - The parameters for creating event action creators.
 * @param {ReadonlyArray<import('@tevm/utils').AbiEvent>} params.events - The ABI of the contract events.
 * @param {import('@tevm/utils').Hex | undefined} [params.bytecode] - The bytecode of the contract (optional).
 * @param {import('@tevm/utils').Hex | undefined} [params.deployedBytecode] - The deployed bytecode of the contract (optional).
 * @param {import('@tevm/utils').Address | undefined} [params.address] - The address of the deployed contract (optional).
 *
 * @example
 * ```javascript
 * import { eventsFactory } from './eventFactory.js'
 *
 * const abi = [
 *   {
 *     type: 'event',
 *     name: 'Transfer',
 *     inputs: [
 *       { type: 'address', name: 'from', indexed: true },
 *       { type: 'address', name: 'to', indexed: true },
 *       { type: 'uint256', name: 'value', indexed: false }
 *     ]
 *   }
 * ]
 *
 * const events = eventsFactory({ events: abi })
 *
 * // Create a filter for the Transfer event
 * const transferFilter = events.Transfer({
 *   fromBlock: 'latest',
 *   toBlock: 'latest',
 *   args: {
 *     from: '0x0000000000000000000000000000000000000001',
 *     to: '0x0000000000000000000000000000000000000002'
 *   }
 * })
 * ```
 */
export const eventsFactory = ({ events, bytecode, deployedBytecode, address }) =>
	Object.fromEntries(
		events.map((eventAbi) => {
			const { name: eventName } = eventAbi
			/** @type {[import('@tevm/utils').AbiEvent]} */
			const abi = [eventAbi]
			const humanReadableAbi = formatAbi(abi)
			/**
			 * Creates an event filter for a specific event.
			 * @param {object} [params] - The parameters for creating the event filter.
			 * @param {import('@tevm/utils').BlockNumber | import('@tevm/utils').BlockTag} [params.fromBlock] - The starting block for the filter.
			 * @param {import('@tevm/utils').BlockNumber | import('@tevm/utils').BlockTag} [params.toBlock] - The ending block for the filter.
			 * @param {object} [params.args] - The indexed arguments to filter by.
			 * @param {boolean} [params.strict] - Whether to use strict matching for arguments.
			 */
			const creator = (params) => {
				return {
					eventName,
					abi: abi.slice(),
					humanReadableAbi: [...humanReadableAbi],
					bytecode,
					deployedBytecode,
					address,
					...params,
				}
			}
			creator.abi = abi.slice()
			creator.eventName = eventName
			creator.humanReadableAbi = [...humanReadableAbi]
			creator.bytecode = bytecode
			creator.deployedBytecode = deployedBytecode
			creator.address = address
			return [eventName, creator]
		}),
	)
