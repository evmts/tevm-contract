[**@tevm/contract**](../README.md)

***

[@tevm/contract](../README.md) / EventActionCreator

# Type Alias: EventActionCreator\<THumanReadableAbi, TBytecode, TDeployedBytecode, TAddress, TAddressArgs\>

> **EventActionCreator**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\> = \{ \[TEventName in ExtractAbiEventNames\<ParseAbi\<THumanReadableAbi\>\>\]: (params: Pick\<CreateEventFilterParameters\<ExtractAbiEvent\<ParseAbi\<THumanReadableAbi\>, TEventName\>, ParseAbi\<THumanReadableAbi\>, TStrict, TFromBlock, TToBlock, TEventName, MaybeExtractEventArgsFromAbi\<ParseAbi\<THumanReadableAbi\>, TEventName\>\>, "fromBlock" \| "toBlock" \| "args" \| "strict"\>) =\> CreateEventFilterParameters\<ExtractAbiEvent\<ParseAbi\<THumanReadableAbi\>, TEventName\>, ParseAbi\<THumanReadableAbi\>, TStrict, TFromBlock, TToBlock, TEventName, MaybeExtractEventArgsFromAbi\<ParseAbi\<THumanReadableAbi\>, TEventName\>\> & \{ abi: \[ExtractAbiEvent\<ParseAbi\<THumanReadableAbi\>, TEventName\>\]; bytecode: TBytecode; deployedBytecode: TDeployedBytecode; eventName: TEventName \} & \{ abi: \[ExtractAbiEvent\<ParseAbi\<THumanReadableAbi\>, TEventName\>\]; bytecode: TBytecode; deployedBytecode: TDeployedBytecode; eventName: TEventName; humanReadableAbi: FormatAbi\<\[ExtractAbiEvent\<ParseAbi\<THumanReadableAbi\>, TEventName\>\]\> \} & TAddressArgs \}

Defined in: [event/EventActionCreator.ts:83](https://github.com/evmts/tevm-contract/blob/main/src/event/EventActionCreator.ts#L83)

A mapping of event names to action creators for events. Can be used to create event filters in a typesafe way.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `THumanReadableAbi` *extends* readonly `string`[] | - | The human-readable ABI of the contract. |
| `TBytecode` *extends* `Hex` \| `undefined` | - | The bytecode of the contract. |
| `TDeployedBytecode` *extends* `Hex` \| `undefined` | - | The deployed bytecode of the contract. |
| `TAddress` *extends* `Address` \| `undefined` | - | The address of the contract. |
| `TAddressArgs` | `TAddress` *extends* `undefined` ? `object` : `object` | Additional arguments for the address. |

## Example

```typescript
import { createContract } from '@tevm/contract'

const Token = createContract({
  humanReadableAbi: [
    'event Transfer(address indexed from, address indexed to, uint256 value)',
  ],
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
})

const filter = Token.events.Transfer({
  fromBlock: 'latest',
  toBlock: 'latest',
  args: {
    from: '0x0000000000000000000000000000000000000001',
    to: '0x0000000000000000000000000000000000000002',
  },
})
```
