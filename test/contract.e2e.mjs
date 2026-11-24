import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { createEVM } from '@ethereumjs/evm'
import { createAddressFromString } from '@ethereumjs/util'
import { ErrorContract, SimpleContract } from '@tevm/contract'
import {
	decodeErrorResult,
	decodeEventLog,
	decodeFunctionResult,
	encodeDeployData,
	encodeEventTopics,
	encodeFunctionData,
	getAddress,
	hexToBytes,
	toHex,
} from 'viem'

const require = createRequire(import.meta.url)

async function deploy(evm, deployment) {
	const result = await evm.runCall({ data: hexToBytes(encodeDeployData(deployment)), gasLimit: 2_000_000n })
	assert.equal(result.execResult.exceptionError, undefined)
	assert.ok(result.createdAddress)
	return getAddress(result.createdAddress.toString())
}

function execute(evm, action) {
	return evm.runCall({
		to: createAddressFromString(action.to),
		data: hexToBytes(encodeFunctionData(action)),
		gasLimit: 200_000n,
	})
}

test('the ESM entry deploys a counter, reads and writes storage, and decodes its log', async () => {
	const evm = await createEVM()
	const counter = SimpleContract.withAddress(await deploy(evm, SimpleContract.deploy(42n)))
	const read = counter.read.get()
	const initial = await execute(evm, read)
	assert.equal(initial.execResult.exceptionError, undefined)
	assert.equal(decodeFunctionResult({ ...read, data: toHex(initial.execResult.returnValue) }), 42n)

	const write = await execute(evm, counter.write.set(100n))
	assert.equal(write.execResult.exceptionError, undefined)
	assert.equal(write.execResult.logs?.length, 1)
	const [address, topics, data] = write.execResult.logs[0]
	const filter = counter.events.ValueSet({ fromBlock: 'latest' })
	assert.equal(getAddress(toHex(address)), filter.address)
	assert.deepEqual(
		topics.map((topic) => toHex(topic)),
		encodeEventTopics(filter),
	)
	assert.deepEqual(
		decodeEventLog({ abi: filter.abi, data: toHex(data), topics: topics.map((topic) => toHex(topic)) }),
		{
			eventName: filter.eventName,
			args: { newValue: 100n },
		},
	)

	const updated = await execute(evm, read)
	assert.equal(updated.execResult.exceptionError, undefined)
	assert.equal(decodeFunctionResult({ ...read, data: toHex(updated.execResult.returnValue) }), 100n)
})

test('the CommonJS entry decodes a custom error from a real revert', async () => {
	const { ErrorContract: commonJsErrorContract } = require('@tevm/contract')
	assert.deepEqual(commonJsErrorContract.abi, ErrorContract.abi)
	const evm = await createEVM()
	const contract = commonJsErrorContract.withAddress(await deploy(evm, commonJsErrorContract.deploy()))
	const action = contract.write.revertWithCustomErrorSingleParam()
	const { execResult } = await execute(evm, action)
	assert.equal(execResult.exceptionError?.error, 'revert')
	const decoded = decodeErrorResult({ abi: action.abi, data: toHex(execResult.returnValue) })
	assert.equal(decoded.errorName, 'ErrorWithSingleParam')
	assert.deepEqual(decoded.args, [100n])
})
