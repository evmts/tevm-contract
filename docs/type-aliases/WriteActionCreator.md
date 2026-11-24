[**@tevm/contract**](../README.md)

***

[@tevm/contract](../README.md) / WriteActionCreator

# Type Alias: WriteActionCreator\<THumanReadableAbi, TAddress, TCode, TAddressArgs\>

> **WriteActionCreator**\<`THumanReadableAbi`, `TAddress`, `TCode`, `TAddressArgs`\> = \{ \[TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "payable" \| "nonpayable"\>\]: (args: TArgs) =\> \{ abi: readonly \[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName, "payable" \| "nonpayable"\>, ...(...)\[\]\]; functionName: TFunctionName; humanReadableAbi: FormatAbi\<\[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName, "payable" \| "nonpayable"\>\]\> \} & (TCode extends undefined ? \{\} : \{ code: TCode \}) & (TArgs\["length"\] extends 0 ? \{\} : \{ args: TArgs \}) & TAddressArgs & \{ abi: readonly \[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName, "payable" \| "nonpayable"\>\]; functionName: TFunctionName; humanReadableAbi: FormatAbi\<\[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName, "payable" \| "nonpayable"\>\]\> \} & (TCode extends undefined ? \{\} : \{ code: TCode \}) & TAddressArgs \}

Defined in: [src/write/WriteActionCreator.ts:41](https://github.com/evmts/tevm-contract/blob/main/src/write/WriteActionCreator.ts#L41)

A mapping of payable and nonpayable contract methods to action creators.
This type provides a way to create type-safe write actions for contract methods.

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
  humanReadableAbi: ['function transfer(address to, uint256 amount) returns (bool)'],
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
})

const transferAction = Token.write.transfer(
  '0x0000000000000000000000000000000000000001',
  1000n,
)
```
