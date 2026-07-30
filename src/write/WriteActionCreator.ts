import type {
	AbiParametersToPrimitiveTypes,
	Address,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
	FormatAbi,
	Hex,
	ParseAbi,
} from '@tevm/utils'

/**
 * Utility type to get the value type of an object.
 * @template T - The object type.
 */
export type ValueOf<T> = T[keyof T]

/**
 * A mapping of payable and nonpayable contract methods to action creators.
 * This type provides a way to create type-safe write actions for contract methods.
 *
 * @template THumanReadableAbi - The human-readable ABI of the contract.
 * @template TAddress - The address of the contract (optional).
 * @template TCode - The runtime bytecode of the contract (optional).
 * @template TAddressArgs - Additional arguments for the address (derived from TAddress).
 *
 * @example
 * ```typescript
 * import { createContract } from '@tevm/contract'
 *
 * const Token = createContract({
 *   humanReadableAbi: ['function transfer(address to, uint256 amount) returns (bool)'],
 *   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
 * })
 *
 * const transferAction = Token.write.transfer(
 *   '0x0000000000000000000000000000000000000001',
 *   1000n,
 * )
 * ```
 */
export type WriteActionCreator<
	THumanReadableAbi extends readonly string[],
	TAddress extends Address | undefined,
	TCode extends Hex | undefined,
	// We have address and to so we support both tevm and viem with natively
	TAddressArgs = TAddress extends undefined ? {} : { address: TAddress; to: TAddress },
> = {
	// For each payable and nonpayable function in the abi, create an action creator
	[TFunctionName in ExtractAbiFunctionNames<ParseAbi<THumanReadableAbi>, 'payable' | 'nonpayable'>]: (<
		// Extract the names of the functions
		// Use generic args to maintain typesafety. This is adapted from viem
		TArgs extends AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']
		> &
			any[] = AbiParametersToPrimitiveTypes<ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']> &
			any[],
	>(
		// Take the same args as the function
		...args: TArgs
	) => {
		functionName: TFunctionName
		humanReadableAbi: FormatAbi<[ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]>
		abi: [ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]
		address: TAddress
		to: TAddress
	} & (TCode extends undefined ? {} : { code: TCode }) &
		(TArgs['length'] extends 0
			? {}
			: {
					args: TArgs
				}) &
		TAddressArgs) & {
		functionName: TFunctionName
		humanReadableAbi: FormatAbi<[ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]>
		abi: [ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]
	} & (TCode extends undefined ? {} : { code: TCode }) &
		TAddressArgs
}
