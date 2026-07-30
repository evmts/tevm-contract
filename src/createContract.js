import { InvalidParamsError } from '@tevm/errors'
import { formatAbi, getAddress, parseAbi } from '@tevm/utils'
import { eventsFactory } from './event/eventFactory.js'
import { readFactory } from './read/readFactory.js'
import { writeFactory } from './write/writeFactory.js'

/**
 * Creates a Tevm Contract instance from a human-readable ABI or JSON ABI.
 * This function is the core of Tevm's contract interaction capabilities,
 * allowing for type-safe and easy-to-use contract interfaces.
 *
 * @type {import('./CreateContractFn.js').CreateContractFn}
 * @throws {InvalidParamsError} If neither humanReadableAbi nor abi is provided.
 * @throws {InvalidAddressError} If `address` is not a valid Ethereum address.
 * @throws {Error} If a human-readable ABI item cannot be parsed.
 *
 * @example
 * Using a human-readable ABI:
 * ```typescript
 * import { createContract } from '@tevm/contract'
 *
 * const contract = createContract({
 *   name: 'ERC20',
 *   humanReadableAbi: [
 *     'function balanceOf(address account) view returns (uint256)',
 *     'function transfer(address to, uint256 amount) returns (bool)',
 *     'event Transfer(address indexed from, address indexed to, uint256 value)'
 *   ],
 *   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI token address
 * })
 *
 * const balanceAction = contract.read.balanceOf(
 *   '0x0000000000000000000000000000000000000001',
 * )
 * const transferAction = contract.write.transfer(
 *   '0x0000000000000000000000000000000000000002',
 *   1000n,
 * )
 * const transferFilter = contract.events.Transfer({
 *   fromBlock: 'latest',
 *   args: { from: contract.address },
 * })
 * ```
 *
 * @example
 * Using a JSON ABI:
 * ```typescript
 * import { createContract } from '@tevm/contract'
 *
 * const contract = createContract({
 *   name: 'ERC20',
 *   abi: [
 *     {
 *       inputs: [{ name: 'account', type: 'address' }],
 *       name: 'balanceOf',
 *       outputs: [{ type: 'uint256' }],
 *       stateMutability: 'view',
 *       type: 'function',
 *     },
 *   ] as const,
 *   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
 * })
 *
 * const action = contract.read.balanceOf(
 *   '0x0000000000000000000000000000000000000001',
 * )
 * ```
 *
 * @see {@link Contract} for the full API of the returned Contract instance.
 * @see {@link https://contract.tevm.sh/guides/creating-contracts} for more information on working with contracts in Tevm.
 * @see {@link https://contract.tevm.sh/api/contract} for detailed Contract type documentation.
 */
export const createContract = ({
	name,
	humanReadableAbi: _humanReadableAbi,
	abi: _abi,
	address,
	deployedBytecode,
	code,
	bytecode,
}) => {
	const { abi, humanReadableAbi } = (() => {
		if (_abi) {
			return { abi: _abi, humanReadableAbi: formatAbi(_abi) }
		}
		if (_humanReadableAbi) {
			return { abi: parseAbi(_humanReadableAbi), humanReadableAbi: _humanReadableAbi }
		}
		throw new InvalidParamsError('Must provide either humanReadableAbi or abi', {
			docsPath: '/learn/contracts/',
		})
	})()

	const methods = abi.filter((field) => {
		return field.type === 'function'
	})
	const events = abi.filter((field) => {
		return field.type === 'event'
	})
	const errors = abi.filter((field) => {
		return field.type === 'error'
	})
	const optionalArgs = {
		...(address !== undefined ? { address: getAddress(address) } : {}),
		...(code !== undefined ? { code } : {}),
		...(bytecode !== undefined ? { bytecode } : {}),
		...(deployedBytecode !== undefined ? { deployedBytecode } : {}),
	}
	const baseContract = {
		...optionalArgs,
		name,
		abi: abi,
		humanReadableAbi,
		// TODO make this more internally typesafe
		events: eventsFactory({ events, ...optionalArgs }),
		// TODO make this more internally typesafe
		write: writeFactory({ methods, errors, ...optionalArgs }),
		// TODO make this more internally typesafe
		read: readFactory({ methods, errors, address, ...optionalArgs }),
	}
	/**
	 * @param {import('@tevm/utils').Address} address
	 */
	const withAddress = (address) => {
		const formattedAddress = getAddress(address)
		return createContract(
			/** @type {any}*/ ({
				...baseContract,
				address: formattedAddress,
			}),
		)
	}

	/**
	 * @param {import('@tevm/utils').Hex} encodedBytecode
	 */
	const withCode = (encodedBytecode) => {
		return createContract(
			/** @type {any} */ ({
				...baseContract,
				code: encodedBytecode,
			}),
		)
	}

	return /**@type any*/ ({
		...baseContract,
		withCode,
		withAddress,
		/**
		 * @param {Array<any>} args
		 */
		deploy: (...args) => {
			const maybeArgs = args.length > 0 ? { args } : {}
			if (!baseContract.bytecode) {
				throw new Error('Bytecode is required to generate deploy data')
			}
			return {
				...maybeArgs,
				bytecode: baseContract.bytecode,
				abi,
			}
		},
	})
}
