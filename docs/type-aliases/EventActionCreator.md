[**@tevm/contract**](../README.md)

***

[@tevm/contract](../README.md) / EventActionCreator

# Type Alias: EventActionCreator\<TSourceAbi, TBytecode, TDeployedBytecode, TAddress, TAddressArgs, TAbi\>

> **EventActionCreator**\<`TSourceAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`, `TAbi`\> = \{ \[TEventName in ExtractAbiEventNames\<TAbi\>\]: (params?: Pick\<CreateEventFilterParameters\<ExtractAbiEvent\<TAbi, TEventName\>, TAbi, TStrict, TFromBlock, TToBlock, TEventName, MaybeExtractEventArgsFromAbi\<TAbi, TEventName\>\>, "fromBlock" \| "toBlock" \| "args" \| "strict"\>) =\> CreateEventFilterParameters\<ExtractAbiEvent\<TAbi, TEventName\>, TAbi, TStrict, TFromBlock, TToBlock, TEventName, MaybeExtractEventArgsFromAbi\<TAbi, TEventName\>\> & \{ abi: \[ExtractAbiEvent\<TAbi, TEventName\>\]; bytecode: TBytecode; deployedBytecode: TDeployedBytecode; eventName: TEventName; humanReadableAbi: FormatAbi\<\[ExtractAbiEvent\<TAbi, TEventName\>\]\> \} & TAddressArgs & \{ abi: \[ExtractAbiEvent\<TAbi, TEventName\>\]; bytecode: TBytecode; deployedBytecode: TDeployedBytecode; eventName: TEventName; humanReadableAbi: FormatAbi\<\[ExtractAbiEvent\<TAbi, TEventName\>\]\> \} & TAddressArgs \}

Defined in: [src/event/EventActionCreator.ts:84](https://github.com/evmts/tevm-contract/blob/main/src/event/EventActionCreator.ts#L84)

A mapping of event names to action creators for events. Can be used to create event filters in a typesafe way.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `TSourceAbi` *extends* `Abi` \| readonly `string`[] | - | The JSON or human-readable ABI of the contract. |
| `TBytecode` *extends* `Hex` \| `undefined` | - | The bytecode of the contract. |
| `TDeployedBytecode` *extends* `Hex` \| `undefined` | - | The deployed bytecode of the contract. |
| `TAddress` *extends* `Address` \| `undefined` | - | The address of the contract. |
| `TAddressArgs` | `TAddress` *extends* `undefined` ? `object` : `object` | Additional arguments for the address. |
| `TAbi` *extends* `Abi` | `TSourceAbi` *extends* readonly `string`[] ? `ParseAbi`\<`TSourceAbi`\> : `Extract`\<`TSourceAbi`, `Abi`\> | The JSON ABI used to construct event filters. |

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
