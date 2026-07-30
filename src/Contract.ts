import type { Address, EncodeDeployDataParameters, Hex, ParseAbi } from '@tevm/utils'
import type { EventActionCreator } from './event/EventActionCreator.js'
import type { ReadActionCreator } from './read/ReadActionCreator.js'
import type { WriteActionCreator } from './write/WriteActionCreator.js'

/**
 * Represents a specific contract with its ABI and optional bytecode.
 * Contracts provide type-safe interfaces for interacting with smart contracts,
 * including read and write methods, event filtering, and deployment.
 *
 * @template TName - The name of the contract
 * @template THumanReadableAbi - The human-readable ABI of the contract
 * @template TAddress - The address of the contract (optional)
 * @template TBytecode - The creation bytecode of the contract (optional)
 * @template TDeployedBytecode - The deployed bytecode of the contract (optional)
 * @template TCode - The runtime bytecode of the contract (optional)
 *
 * @example
 * Creating and using a Contract instance:
 * ```typescript
 * import { createContract } from '@tevm/contract'
 * import { createMemoryClient } from 'tevm'
 *
 * const client = createMemoryClient()
 * await client.tevmReady()
 *
 * const MyContract = createContract({
 *   name: 'MyToken',
 *   humanReadableAbi: [
 *     'function balanceOf(address account) view returns (uint256)',
 *     'function transfer(address to, uint256 amount) returns (bool)',
 *     'event Transfer(address indexed from, address indexed to, uint256 value)'
 *   ],
 *   address: '0x1234567890123456789012345678901234567890'
 * })
 *
 * // Read contract state
 * const { data: balance } = await client.tevmContract(
 *   MyContract.read.balanceOf('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
 * )
 *
 * // Write to contract
 * const result = await client.tevmContract(
 *   MyContract.write.transfer('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 1000n)
 * )
 *
 * // Create event filter
 * const logs = await client.getLogs(
 *   MyContract.events.Transfer({ fromBlock: 'latest' })
 * )
 * ```
 *
 * @example
 * Using with other libraries:
 * ```typescript
 * import { createContract } from '@tevm/contract'
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const MyContract = createContract({
 *   humanReadableAbi: ['function balanceOf(address account) view returns (uint256)'],
 *   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
 * })
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http()
 * })
 *
 * const balance = await client.readContract(
 *   MyContract.read.balanceOf('0x0000000000000000000000000000000000000001')
 * )
 * ```
 */
export type Contract<
	TName extends string,
	THumanReadableAbi extends ReadonlyArray<string>,
	TAddress extends undefined | Address = undefined,
	TBytecode extends undefined | Hex = undefined,
	TDeployedBytecode extends undefined | Hex = undefined,
	TCode extends undefined | Hex = undefined,
> = {
	/**
	 * The configured address of the contract. If not set, it will be undefined.
	 * Use the `withAddress` method to set or change the address.
	 */
	address: TAddress

	/**
	 * The JSON ABI of the contract.
	 * @example
	 * ```typescript
	 * import { ERC20 } from '@tevm/contract'
	 *
	 * console.log(ERC20.abi.find((item) => item.type === 'function' && item.name === 'balanceOf'))
	 * // { name: 'balanceOf', inputs: [...], outputs: [...], ... }
	 * ```
	 */
	abi: ParseAbi<THumanReadableAbi>

	/**
	 * The runtime bytecode of the contract, encoded with constructor arguments.
	 */
	code: TCode

	/**
	 * The creation bytecode of the contract.
	 */
	bytecode: TBytecode

	/**
	 * The deployed bytecode of the contract.
	 */
	deployedBytecode: TDeployedBytecode

	/**
	 * The human-readable ABI of the contract.
	 * @example
	 * ```typescript
	 * import { ERC20 } from '@tevm/contract'
	 *
	 * console.log(ERC20.humanReadableAbi)
	 * // ['constructor(string name, string symbol)', ...]
	 * ```
	 */
	humanReadableAbi: THumanReadableAbi

	/**
	 * The name of the contract. If imported, this will match the name of the contract import.
	 */
	name?: TName

	/**
	 * Action creators for events. Used to create event filters in a type-safe way.
	 * @example
	 * ```typescript
	 * import { ERC20 } from '@tevm/contract'
	 *
	 * const transferFilter = ERC20.events.Transfer({
	 *   args: { from: '0x0000000000000000000000000000000000000001' },
	 * })
	 * ```
	 */
	events: EventActionCreator<THumanReadableAbi, TBytecode, TDeployedBytecode, TAddress>

	/**
	 * Action creators for contract view and pure functions.
	 * @example
	 * ```typescript
	 * import { ERC20 } from '@tevm/contract'
	 *
	 * const token = ERC20.withAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F')
	 * const balanceAction = token.read.balanceOf(
	 *   '0x0000000000000000000000000000000000000001',
	 * )
	 * ```
	 */
	read: ReadActionCreator<THumanReadableAbi, TAddress, TCode>

	/**
	 * Action creators for contract payable and nonpayable functions.
	 * @example
	 * ```typescript
	 * import { ERC20 } from '@tevm/contract'
	 *
	 * const token = ERC20.withAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F')
	 * const transferAction = token.write.transfer(
	 *   '0x0000000000000000000000000000000000000001',
	 *   1000n,
	 * )
	 * ```
	 */
	write: WriteActionCreator<THumanReadableAbi, TAddress, TCode>

	/**
	 * Builds the parameters needed to deploy the contract. Returns `{ abi, bytecode }`, plus
	 * `args` when the constructor takes arguments. Constructor argument types are inferred from
	 * the `constructor` entry in the ABI.
	 *
	 * Requires the contract to have been created with `bytecode`.
	 *
	 * @throws {Error} `Bytecode is required to generate deploy data` if the contract has no
	 * `bytecode`. This is a runtime check with no type-level guard, so check `contract.bytecode`
	 * first when building contracts dynamically.
	 *
	 * @example
	 * ```typescript
	 * import { SimpleContract } from '@tevm/contract'
	 * import { createMemoryClient, PREFUNDED_ACCOUNTS } from 'tevm'
	 *
	 * const client = createMemoryClient()
	 * await client.tevmReady()
	 *
	 * const result = await client.tevmDeploy({
	 *   from: PREFUNDED_ACCOUNTS[0].address,
	 *   ...SimpleContract.deploy(42n),
	 *   addToMempool: true,
	 * })
	 * await client.tevmMine({ blockCount: 1 })
	 *
	 * if (!result.createdAddress) throw new Error('deployment failed')
	 * const counter = SimpleContract.withAddress(result.createdAddress)
	 * ```
	 */
	deploy: (
		...args: EncodeDeployDataParameters<ParseAbi<THumanReadableAbi>> extends { args: infer TArgs }
			? TArgs extends ReadonlyArray<any>
				? TArgs
				: []
			: []
	) => EncodeDeployDataParameters<ParseAbi<THumanReadableAbi>>

	/**
	 * Adds an address to the contract. All action creators will include
	 * the `address` and `to` properties once added. This method returns a new contract;
	 * it does not modify the existing contract.
	 *
	 * The address is checksummed with `getAddress` before being stored, so `contract.address` is
	 * always EIP-55 regardless of the casing passed in.
	 *
	 * @param {Address} address - The address the contract is deployed at
	 * @returns {Contract} A new contract instance bound to the address
	 * @throws {InvalidAddressError} If the address is not a valid Ethereum address.
	 *
	 * @example
	 * ```typescript
	 * import { ERC20 } from '@tevm/contract'
	 *
	 * const Dai = ERC20.withAddress('0x6b175474e89094c44da98b954eedeac495271d0f')
	 * console.log(Dai.address)   // '0x6B175474E89094C44Da98b954EedeAC495271d0F' — checksummed
	 * console.log(ERC20.address) // undefined — the original is untouched
	 * ```
	 */
	withAddress: <TNewAddress extends Address>(
		address: TNewAddress,
	) => Contract<TName, THumanReadableAbi, TNewAddress, TBytecode, TDeployedBytecode, TCode>

	/**
	 * Updates the bytecode of the contract.
	 * Returns a new contract instance with the updated code.
	 * @param {Hex} encodedBytecode - The encoded bytecode of the contract
	 * @returns {Contract} A new contract instance with updated code
	 * @example
	 * ```typescript
	 * import { SimpleContract } from '@tevm/contract'
	 *
	 * const local = SimpleContract.withCode('0x6000')
	 * const action = local.read.get()
	 * console.log(action.code) // '0x6000'
	 * ```
	 */
	withCode: (encodedBytecode: Hex) => Contract<TName, THumanReadableAbi, TAddress, TBytecode, TDeployedBytecode, Hex>
}
