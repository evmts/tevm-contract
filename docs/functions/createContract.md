[**@tevm/contract**](../README.md)

***

[@tevm/contract](../README.md) / createContract

# Function: createContract()

> **createContract**\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`, `THumanReadableAbi`\>(`__namedParameters`): [`Contract`](../type-aliases/Contract.md)\<`TName`, `Extract`\<`TAbi`\[`number`\], \{ `anonymous`: `true`; `type`: `"event"`; \}\> *extends* `never` ? `THumanReadableAbi` : `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Defined in: [src/createContract.js:73](https://github.com/evmts/tevm-contract/blob/main/src/createContract.js#L73)

Creates a Tevm Contract instance from a human-readable ABI or JSON ABI.
This function is the core of Tevm's contract interaction capabilities,
allowing for type-safe and easy-to-use contract interfaces.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TName` *extends* `string` | - |
| `TAbi` *extends* `Abi` \| readonly `string`[] | - |
| `TAddress` *extends* `` `0x${string}` `` \| `undefined` | `undefined` |
| `TBytecode` *extends* `` `0x${string}` `` \| `undefined` | `undefined` |
| `TDeployedBytecode` *extends* `` `0x${string}` `` \| `undefined` | `undefined` |
| `TCode` *extends* `` `0x${string}` `` \| `undefined` | `undefined` |
| `THumanReadableAbi` *extends* readonly `string`[] | `TAbi` *extends* readonly `string`[] ? `TAbi` : `TAbi` *extends* `Abi` ? `FormatAbi`\<`TAbi`\> : `never` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`CreateContractParams`](../type-aliases/CreateContractParams.md)\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\> |

## Returns

[`Contract`](../type-aliases/Contract.md)\<`TName`, `Extract`\<`TAbi`\[`number`\], \{ `anonymous`: `true`; `type`: `"event"`; \}\> *extends* `never` ? `THumanReadableAbi` : `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Throws

If neither humanReadableAbi nor abi is provided.

## Throws

If `address` is not a valid Ethereum address.

## Throws

If a human-readable ABI item cannot be parsed.

## Examples

Using a human-readable ABI:
```typescript
import { createContract } from '@tevm/contract'

const contract = createContract({
  name: 'ERC20',
  humanReadableAbi: [
    'function balanceOf(address account) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint256 value)'
  ],
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI token address
})

const balanceAction = contract.read.balanceOf(
  '0x0000000000000000000000000000000000000001',
)
const transferAction = contract.write.transfer(
  '0x0000000000000000000000000000000000000002',
  1000n,
)
const transferFilter = contract.events.Transfer({
  fromBlock: 'latest',
  args: { from: contract.address },
})
```

Using a JSON ABI:
```typescript
import { createContract } from '@tevm/contract'

const contract = createContract({
  name: 'ERC20',
  abi: [
    {
      inputs: [{ name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ] as const,
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
})

const action = contract.read.balanceOf(
  '0x0000000000000000000000000000000000000001',
)
```

## See

 - [Contract](../type-aliases/Contract.md) for the full API of the returned Contract instance.
 - [https://contract.tevm.sh/guides/creating-contracts](https://contract.tevm.sh/guides/creating-contracts) for more information on working with contracts in Tevm.
 - [https://contract.tevm.sh/api/contract](https://contract.tevm.sh/api/contract) for detailed Contract type documentation.
