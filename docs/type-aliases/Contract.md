[**@tevm/contract**](../README.md)

***

[@tevm/contract](../README.md) / Contract

# Type Alias: Contract\<TName, TAbi, TAddress, TBytecode, TDeployedBytecode, TCode\>

> **Contract**\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\> = `object`

Defined in: [src/Contract.ts:78](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L78)

Represents a specific contract with its ABI and optional bytecode.
Contracts provide type-safe interfaces for interacting with smart contracts,
including read and write methods, event filtering, and deployment.

## Examples

Creating and using a Contract instance:
```typescript
import { createContract } from '@tevm/contract'
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()
await client.tevmReady()

const MyContract = createContract({
  name: 'MyToken',
  humanReadableAbi: [
    'function balanceOf(address account) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint256 value)'
  ],
  address: '0x1234567890123456789012345678901234567890'
})

// Read contract state
const { data: balance } = await client.tevmContract(
  MyContract.read.balanceOf('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
)

// Write to contract
const result = await client.tevmContract(
  MyContract.write.transfer('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 1000n)
)

// Create event filter
const logs = await client.getLogs(
  MyContract.events.Transfer({ fromBlock: 'latest' })
)
```

Using with other libraries:
```typescript
import { createContract } from '@tevm/contract'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const MyContract = createContract({
  humanReadableAbi: ['function balanceOf(address account) view returns (uint256)'],
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
})

const client = createPublicClient({
  chain: mainnet,
  transport: http()
})

const balance = await client.readContract(
  MyContract.read.balanceOf('0x0000000000000000000000000000000000000001')
)
```

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `TName` *extends* `string` | - | The name of the contract |
| `TAbi` *extends* `Abi` \| readonly `string`[] | - | The JSON or human-readable ABI of the contract |
| `TAddress` *extends* `undefined` \| `Address` | `undefined` | The address of the contract (optional) |
| `TBytecode` *extends* `undefined` \| `Hex` | `undefined` | The creation bytecode of the contract (optional) |
| `TDeployedBytecode` *extends* `undefined` \| `Hex` | `undefined` | The deployed bytecode of the contract (optional) |
| `TCode` *extends* `undefined` \| `Hex` | `undefined` | The runtime bytecode of the contract (optional) |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="abi"></a> `abi` | `JsonAbi`\<`TAbi`\> | The JSON ABI. Human-readable input is parsed into JSON. **Example** `import { ERC20 } from '@tevm/contract' console.log(ERC20.abi.find((item) => item.type === 'function' && item.name === 'balanceOf')) // { name: 'balanceOf', inputs: [...], outputs: [...], ... }` | [src/Contract.ts:102](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L102) |
| <a id="address"></a> `address` | `TAddress` | The configured address of the contract. If not set, it will be undefined. Use the `withAddress` method to set or change the address. | [src/Contract.ts:90](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L90) |
| <a id="bytecode"></a> `bytecode` | `TBytecode` | The creation bytecode of the contract. | [src/Contract.ts:112](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L112) |
| <a id="code"></a> `code` | `TCode` | The runtime bytecode of the contract, encoded with constructor arguments. | [src/Contract.ts:107](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L107) |
| <a id="deploy"></a> `deploy` | (...`args`) => `EncodeDeployDataParameters`\<`JsonAbi`\<`TAbi`\>\> | Builds the parameters needed to deploy the contract. Returns `{ abi, bytecode }`, plus `args` when the constructor takes arguments. Constructor argument types are inferred from the `constructor` entry in the ABI. Requires the contract to have been created with `bytecode`. **Throws** `Bytecode is required to generate deploy data` if the contract has no `bytecode`. This is a runtime check with no type-level guard, so check `contract.bytecode` first when building contracts dynamically. **Example** `import { SimpleContract } from '@tevm/contract' import { createMemoryClient, PREFUNDED_ACCOUNTS } from 'tevm' const client = createMemoryClient() await client.tevmReady() const result = await client.tevmDeploy({ from: PREFUNDED_ACCOUNTS[0].address, ...SimpleContract.deploy(42n), addToMempool: true, }) await client.tevmMine({ blockCount: 1 }) if (!result.createdAddress) throw new Error('deployment failed') const counter = SimpleContract.withAddress(result.createdAddress)` | [src/Contract.ts:208](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L208) |
| <a id="deployedbytecode"></a> `deployedBytecode` | `TDeployedBytecode` | The deployed bytecode of the contract. | [src/Contract.ts:117](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L117) |
| <a id="events"></a> `events` | [`EventActionCreator`](EventActionCreator.md)\<`TAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`\> | Action creators for events. Used to create event filters in a type-safe way. **Example** `import { ERC20 } from '@tevm/contract' const transferFilter = ERC20.events.Transfer({ args: { from: '0x0000000000000000000000000000000000000001' }, })` | [src/Contract.ts:147](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L147) |
| <a id="humanreadableabi"></a> `humanReadableAbi` | `HumanReadableAbi`\<`TAbi`\> | The human-readable ABI. JSON input is formatted as Solidity signatures. **Example** `import { ERC20 } from '@tevm/contract' console.log(ERC20.humanReadableAbi) // ['constructor(string name, string symbol)', ...]` | [src/Contract.ts:129](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L129) |
| <a id="name"></a> `name?` | `TName` | The name of the contract. If imported, this will match the name of the contract import. | [src/Contract.ts:134](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L134) |
| <a id="read"></a> `read` | [`ReadActionCreator`](ReadActionCreator.md)\<`HumanReadableAbi`\<`TAbi`\>, `TAddress`, `TCode`\> | Action creators for contract view and pure functions. **Example** `import { ERC20 } from '@tevm/contract' const token = ERC20.withAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F') const balanceAction = token.read.balanceOf( '0x0000000000000000000000000000000000000001', )` | [src/Contract.ts:161](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L161) |
| <a id="withaddress"></a> `withAddress` | \<`TNewAddress`\>(`address`) => `Contract`\<`TName`, `TAbi`, `TNewAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\> | Adds an address to the contract. Read and write actions include `address` and `to`, and event filter actions include `address`. The method returns a new contract. The address is checksummed with `getAddress` before being stored, so `contract.address` is always EIP-55 regardless of the casing passed in. **Throws** If the address is not a valid Ethereum address. **Example** `import { ERC20 } from '@tevm/contract' const Dai = ERC20.withAddress('0x6b175474e89094c44da98b954eedeac495271d0f') console.log(Dai.address) // '0x6B175474E89094C44Da98b954EedeAC495271d0F' — checksummed console.log(ERC20.address) // undefined — the original is untouched` | [src/Contract.ts:236](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L236) |
| <a id="withcode"></a> `withCode` | (`encodedBytecode`) => `Contract`\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `Hex`\> | Updates the bytecode of the contract. Returns a new contract instance with the updated code. **Example** `import { SimpleContract } from '@tevm/contract' const local = SimpleContract.withCode('0x6000') const action = local.read.get() console.log(action.code) // '0x6000'` | [src/Contract.ts:254](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L254) |
| <a id="write"></a> `write` | [`WriteActionCreator`](WriteActionCreator.md)\<`HumanReadableAbi`\<`TAbi`\>, `TAddress`, `TCode`\> | Action creators for contract payable and nonpayable functions. **Example** `import { ERC20 } from '@tevm/contract' const token = ERC20.withAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F') const transferAction = token.write.transfer( '0x0000000000000000000000000000000000000001', 1000n, )` | [src/Contract.ts:176](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L176) |
