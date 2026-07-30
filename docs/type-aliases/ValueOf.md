[**@tevm/contract**](../README.md)

***

[@tevm/contract](../README.md) / ValueOf

# Type Alias: ValueOf\<T\>

> **ValueOf**\<`T`\> = `T`\[keyof `T`\]

Defined in: [event/EventActionCreator.ts:52](https://github.com/evmts/tevm-contract/blob/main/src/event/EventActionCreator.ts#L52)

Utility type to get the value type of an object.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The object type. |

## Example

```typescript
import type { ValueOf } from '@tevm/contract'

type Status = ValueOf<{ ready: 'ready'; failed: 'failed' }>
// 'ready' | 'failed'
```
