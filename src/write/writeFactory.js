import { functionActions } from '../functionActions.js'

/**
 * Creates write action creators from contract parameters.
 * This factory function generates a set of typed write action creators for a contract,
 * allowing for easy and type-safe creation of write actions for payable and nonpayable functions.
 *
 * @param {object} params - The parameters for creating write action creators.
 * @param {import('@tevm/utils').Abi} params.methods - The ABI of the contract methods.
 * @param {import('@tevm/utils').Abi} params.errors - The ABI of the contract errors.
 * @param {import('@tevm/utils').Hex | undefined} [params.code] - The runtime bytecode of the contract (optional).
 * @param {import('@tevm/utils').Address | undefined} [params.address] - The address of the deployed contract (optional).
 * @returns {import('./WriteActionCreator.js').WriteActionCreator<any, any, any>} An object containing write action creators for each payable and nonpayable function in the ABI.
 *
 * @example
 * ```javascript
 * import { writeFactory } from './writeFactory.js'
 *
 * const abi = [
 *   {
 *     type: 'function',
 *     name: 'transfer',
 *     inputs: [
 *       { type: 'address', name: 'to' },
 *       { type: 'uint256', name: 'amount' }
 *     ],
 *     outputs: [{ type: 'bool' }],
 *     stateMutability: 'nonpayable'
 *   }
 * ]
 *
 * const writeActions = writeFactory({
 *   methods: abi,
 *   errors: [],
 *   address: '0x0000000000000000000000000000000000000001',
 *   code: '0x6000'
 * })
 *
 * // Create a write action for the transfer function
 * const transferAction = writeActions.transfer(
 *   '0x0000000000000000000000000000000000000002',
 *   1000n
 * )
 * ```
 */
export const writeFactory = (params) => functionActions(params, ['nonpayable', 'payable'])
