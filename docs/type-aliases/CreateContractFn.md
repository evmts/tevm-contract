[**@tevm/contract**](../README.md)

***

[@tevm/contract](../README.md) / CreateContractFn

# Type Alias: CreateContractFn

> **CreateContractFn** = \<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`, `THumanReadableAbi`\>(`{
	name,
	humanReadableAbi,
	bytecode,
	deployedBytecode,
	code,
}`) => [`Contract`](Contract.md)\<`TName`, `Extract`\<`TAbi`\[`number`\], \{ `anonymous`: `true`; `type`: `"event"`; \}\> *extends* `never` ? `THumanReadableAbi` : `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Defined in: [src/CreateContractFn.ts:59](https://github.com/evmts/tevm-contract/blob/main/src/CreateContractFn.ts#L59)

Type of `createContract` factory function.
Creates a tevm Contract instance from a human readable ABI or JSON ABI.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `TName` *extends* `string` | - | The name of the contract |
| `TAbi` *extends* readonly `string`[] \| `Abi` | - | The ABI type (either string[] for human readable or Abi for JSON) |
| `TAddress` *extends* `undefined` \| `Address` | `undefined` | The contract address type (optional) |
| `TBytecode` *extends* `undefined` \| `Hex` | `undefined` | The contract bytecode type (optional) |
| `TDeployedBytecode` *extends* `undefined` \| `Hex` | `undefined` | The deployed bytecode type (optional) |
| `TCode` *extends* `undefined` \| `Hex` | `undefined` | The runtime bytecode type (optional) |
| `THumanReadableAbi` *extends* readonly `string`[] | `TAbi` *extends* readonly `string`[] ? `TAbi` : `TAbi` *extends* `Abi` ? `FormatAbi`\<`TAbi`\> : `never` | - |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `{ 	name, 	humanReadableAbi, 	bytecode, 	deployedBytecode, 	code, }` | [`CreateContractParams`](CreateContractParams.md)\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\> |

## Returns

[`Contract`](Contract.md)\<`TName`, `Extract`\<`TAbi`\[`number`\], \{ `anonymous`: `true`; `type`: `"event"`; \}\> *extends* `never` ? `THumanReadableAbi` : `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Examples

Using a human readable ABI:
```typescript
import { createContract } from '@tevm/contract'

const contract = createContract({
  name: 'ERC20',
  humanReadableAbi: [
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
  ],
})
```

Using a JSON ABI:
```typescript
import { createContract } from '@tevm/contract'

const jsonAbi = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  }
] as const

const contract = createContract({
  name: 'ERC20',
  abi: jsonAbi,
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',  // DAI token address on Ethereum mainnet
})

const action = contract.read.balanceOf('0x0000000000000000000000000000000000000001')
```

## Throws

If neither `humanReadableAbi` nor `abi` is supplied at runtime.

## Throws

If `address` is not a valid Ethereum address.

## Throws

If a human-readable ABI item cannot be parsed.
