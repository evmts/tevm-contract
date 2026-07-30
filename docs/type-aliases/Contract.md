[**@tevm/contract**](../README.md)

***

[@tevm/contract](../README.md) / Contract

# Type Alias: Contract\<TName, THumanReadableAbi, TAddress, TBytecode, TDeployedBytecode, TCode\>

> **Contract**\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\> = `object`

Defined in: [Contract.ts:75](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L75)

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
| `THumanReadableAbi` *extends* `ReadonlyArray`\<`string`\> | - | The human-readable ABI of the contract |
| `TAddress` *extends* `undefined` \| `Address` | `undefined` | The address of the contract (optional) |
| `TBytecode` *extends* `undefined` \| `Hex` | `undefined` | The creation bytecode of the contract (optional) |
| `TDeployedBytecode` *extends* `undefined` \| `Hex` | `undefined` | The deployed bytecode of the contract (optional) |
| `TCode` *extends* `undefined` \| `Hex` | `undefined` | The runtime bytecode of the contract (optional) |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="abi"></a> `abi` | `ParseAbi`\<`THumanReadableAbi`\> | The JSON ABI of the contract. **Example** `import { ERC20 } from '@tevm/contract' console.log(ERC20.abi.find((item) => item.type === 'function' && item.name === 'balanceOf')) // { name: 'balanceOf', inputs: [...], outputs: [...], ... }` | [Contract.ts:99](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L99) |
| <a id="address"></a> `address` | `TAddress` | The configured address of the contract. If not set, it will be undefined. Use the `withAddress` method to set or change the address. | [Contract.ts:87](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L87) |
| <a id="bytecode"></a> `bytecode` | `TBytecode` | The creation bytecode of the contract. | [Contract.ts:109](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L109) |
| <a id="code"></a> `code` | `TCode` | The runtime bytecode of the contract, encoded with constructor arguments. | [Contract.ts:104](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L104) |
| <a id="deploy"></a> `deploy` | (...`args`) => `EncodeDeployDataParameters`\<`ParseAbi`\<`THumanReadableAbi`\>\> | Builds the parameters needed to deploy the contract. Returns `{ abi, bytecode }`, plus `args` when the constructor takes arguments. Constructor argument types are inferred from the `constructor` entry in the ABI. Requires the contract to have been created with `bytecode`. **Throws** `Bytecode is required to generate deploy data` if the contract has no `bytecode`. This is a runtime check with no type-level guard, so check `contract.bytecode` first when building contracts dynamically. **Example** `import { SimpleContract } from '@tevm/contract' import { createMemoryClient, PREFUNDED_ACCOUNTS } from 'tevm' const client = createMemoryClient() await client.tevmReady() const result = await client.tevmDeploy({ from: PREFUNDED_ACCOUNTS[0].address, ...SimpleContract.deploy(42n), addToMempool: true, }) await client.tevmMine({ blockCount: 1 }) if (!result.createdAddress) throw new Error('deployment failed') const counter = SimpleContract.withAddress(result.createdAddress)` | [Contract.ts:205](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L205) |
| <a id="deployedbytecode"></a> `deployedBytecode` | `TDeployedBytecode` | The deployed bytecode of the contract. | [Contract.ts:114](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L114) |
| <a id="events"></a> `events` | [`EventActionCreator`](EventActionCreator.md)\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`\> | Action creators for events. Used to create event filters in a type-safe way. **Example** `import { ERC20 } from '@tevm/contract' const transferFilter = ERC20.events.Transfer({ args: { from: '0x0000000000000000000000000000000000000001' }, })` | [Contract.ts:144](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L144) |
| <a id="humanreadableabi"></a> `humanReadableAbi` | `THumanReadableAbi` | The human-readable ABI of the contract. **Example** `import { ERC20 } from '@tevm/contract' console.log(ERC20.humanReadableAbi) // ['constructor(string name, string symbol)', ...]` | [Contract.ts:126](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L126) |
| <a id="name"></a> `name?` | `TName` | The name of the contract. If imported, this will match the name of the contract import. | [Contract.ts:131](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L131) |
| <a id="read"></a> `read` | [`ReadActionCreator`](ReadActionCreator.md)\<`THumanReadableAbi`, `TAddress`, `TCode`\> | Action creators for contract view and pure functions. **Example** `import { ERC20 } from '@tevm/contract' const token = ERC20.withAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F') const balanceAction = token.read.balanceOf( '0x0000000000000000000000000000000000000001', )` | [Contract.ts:158](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L158) |
| <a id="withaddress"></a> `withAddress` | \<`TNewAddress`\>(`address`) => `Contract`\<`TName`, `THumanReadableAbi`, `TNewAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\> | Adds an address to the contract. All action creators will include the `address` and `to` properties once added. This method returns a new contract; it does not modify the existing contract. The address is checksummed with `getAddress` before being stored, so `contract.address` is always EIP-55 regardless of the casing passed in. **Throws** If the address is not a valid Ethereum address. **Example** `import { ERC20 } from '@tevm/contract' const Dai = ERC20.withAddress('0x6b175474e89094c44da98b954eedeac495271d0f') console.log(Dai.address) // '0x6B175474E89094C44Da98b954EedeAC495271d0F' — checksummed console.log(ERC20.address) // undefined — the original is untouched` | [Contract.ts:234](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L234) |
| <a id="withcode"></a> `withCode` | (`encodedBytecode`) => `Contract`\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `Hex`\> | Updates the bytecode of the contract. Returns a new contract instance with the updated code. **Example** `import { SimpleContract } from '@tevm/contract' const local = SimpleContract.withCode('0x6000') const action = local.read.get() console.log(action.code) // '0x6000'` | [Contract.ts:252](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L252) |
| <a id="write"></a> `write` | [`WriteActionCreator`](WriteActionCreator.md)\<`THumanReadableAbi`, `TAddress`, `TCode`\> | Action creators for contract payable and nonpayable functions. **Example** `import { ERC20 } from '@tevm/contract' const token = ERC20.withAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F') const transferAction = token.write.transfer( '0x0000000000000000000000000000000000000001', 1000n, )` | [Contract.ts:173](https://github.com/evmts/tevm-contract/blob/main/src/Contract.ts#L173) |
