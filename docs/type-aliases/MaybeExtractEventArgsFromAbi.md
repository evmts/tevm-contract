[**@tevm/contract**](../README.md)

***

[@tevm/contract](../README.md) / MaybeExtractEventArgsFromAbi

# Type Alias: MaybeExtractEventArgsFromAbi\<TAbi, TEventName\>

> **MaybeExtractEventArgsFromAbi**\<`TAbi`, `TEventName`\> = `TAbi` *extends* `Abi` \| readonly `unknown`[] ? `TEventName` *extends* `string` ? `GetEventArgs`\<`TAbi`, `TEventName`\> : `undefined` : `undefined`

Defined in: [src/event/EventActionCreator.ts:31](https://github.com/evmts/tevm-contract/blob/main/src/event/EventActionCreator.ts#L31)

Extracts event arguments from an ABI.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `TAbi` *extends* `Abi` \| readonly `unknown`[] \| `undefined` | The ABI type, can be an Abi, readonly unknown[], or undefined. |
| `TEventName` *extends* `string` \| `undefined` | The name of the event, can be a string or undefined. |

## Example

```typescript
import type { MaybeExtractEventArgsFromAbi } from '@tevm/contract'
import type { ParseAbi } from '@tevm/utils'

type TransferArgs = MaybeExtractEventArgsFromAbi<
  ParseAbi<['event Transfer(address indexed from, address indexed to, uint256 value)']>,
  'Transfer'
>
```
