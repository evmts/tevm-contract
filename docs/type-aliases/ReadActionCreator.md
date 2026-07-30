[**@tevm/contract**](../README.md)

***

[@tevm/contract](../README.md) / ReadActionCreator

# Type Alias: ReadActionCreator\<THumanReadableAbi, TAddress, TCode, TAddressArgs\>

> **ReadActionCreator**\<`THumanReadableAbi`, `TAddress`, `TCode`, `TAddressArgs`\> = \{ \[TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "pure" \| "view"\>\]: (args: TArgs) =\> \{ abi: \[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]; functionName: TFunctionName; humanReadableAbi: FormatAbi\<\[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]\> \} & (TCode extends undefined ? \{\} : \{ code: TCode \}) & (TArgs\["length"\] extends 0 ? \{\} : \{ args: TArgs \}) & TAddressArgs & \{ abi: \[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]; functionName: TFunctionName; humanReadableAbi: FormatAbi\<\[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]\> \} & (TCode extends undefined ? \{\} : \{ code: TCode \}) & TAddressArgs \}

Defined in: [read/ReadActionCreator.ts:40](https://github.com/evmts/tevm-contract/blob/main/src/read/ReadActionCreator.ts#L40)

A mapping of view and pure contract methods to action creators.
This type provides a way to create type-safe read actions for contract methods.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `THumanReadableAbi` *extends* readonly `string`[] | - | The human-readable ABI of the contract. |
| `TAddress` *extends* `Address` \| `undefined` | - | The address of the contract (optional). |
| `TCode` *extends* `Hex` \| `undefined` | - | The runtime bytecode of the contract (optional). |
| `TAddressArgs` | `TAddress` *extends* `undefined` ? `object` : `object` | Additional arguments for the address (derived from TAddress). |

## Example

```typescript
import { createContract } from '@tevm/contract'

const Token = createContract({
  humanReadableAbi: ['function balanceOf(address account) view returns (uint256)'],
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
})

const balanceAction = Token.read.balanceOf(
  '0x0000000000000000000000000000000000000001',
)
```
