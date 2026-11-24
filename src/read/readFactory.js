import { functionActions } from '../functionActions.js'

/**
 * Creates read action creators from contract parameters.
 * This factory function generates a set of typed read action creators for a contract,
 * allowing for easy and type-safe creation of read actions for view and pure functions.
 *
 * @param {object} params - The parameters for creating read action creators.
 * @param {import('@tevm/utils').Abi} params.methods - The ABI of the contract methods.
 * @param {import('@tevm/utils').Abi} params.errors - The ABI of the contract errors.
 * @param {import('@tevm/utils').Hex | undefined} [params.code] - The runtime bytecode of the contract (optional).
 * @param {import('@tevm/utils').Address | undefined} [params.address] - The address of the deployed contract (optional).
 * @returns {import('./ReadActionCreator.js').ReadActionCreator<any, any, any>} An object containing read action creators for each view and pure function in the ABI.
 *
 * @example
 * ```javascript
 * import { readFactory } from './readFactory.js'
 *
 * const abi = [
 *   {
 *     type: 'function',
 *     name: 'balanceOf',
 *     inputs: [{ type: 'address', name: 'account' }],
 *     outputs: [{ type: 'uint256' }],
 *     stateMutability: 'view'
 *   }
 * ]
 *
 * const readActions = readFactory({
 *   methods: abi,
 *   errors: [],
 *   address: '0x0000000000000000000000000000000000000001',
 *   code: '0x6000'
 * })
 *
 * // Create a read action for the balanceOf function
 * const balanceAction = readActions.balanceOf(
 *   '0x0000000000000000000000000000000000000002'
 * )
 * ```
 */
export const readFactory = (params) => functionActions(params, ['pure', 'view'])
