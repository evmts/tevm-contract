import { describe, expect, it } from 'vitest'
import { AdvancedContract, ERC20, ERC721, ErrorContract, SimpleContract } from '../index.js'

const prebuiltContracts = [AdvancedContract, ERC20, ERC721, ErrorContract, SimpleContract]

describe('prebuilt contract exports', () => {
	it.each(prebuiltContracts)('$name ships a parsed ABI and deployable bytecode', (contract) => {
		expect(contract.abi.length).toBeGreaterThan(0)
		expect(contract.humanReadableAbi.length).toBe(contract.abi.length)
		expect(contract.bytecode).toMatch(/^0x[0-9a-f]+$/i)
		expect(contract.deployedBytecode).toMatch(/^0x[0-9a-f]+$/i)
	})

	it('creates deploy actions with each contract constructor signature', () => {
		expect(SimpleContract.deploy(42n).args).toEqual([42n])
		expect(ERC20.deploy('Token', 'TKN').args).toEqual(['Token', 'TKN'])
		expect(ERC721.deploy('Collectible', 'NFT').args).toEqual(['Collectible', 'NFT'])
		expect(AdvancedContract.deploy(1n, true, 'hello', '0x0000000000000000000000000000000000000001').args).toEqual([
			1n,
			true,
			'hello',
			'0x0000000000000000000000000000000000000001',
		])
		expect(ErrorContract.deploy()).not.toHaveProperty('args')
	})

	it('exposes representative read, write, and event creators from the package root', () => {
		expect(SimpleContract.read.get.functionName).toBe('get')
		expect(SimpleContract.write.set.functionName).toBe('set')
		expect(SimpleContract.events.ValueSet.eventName).toBe('ValueSet')
		expect(ERC20.read.balanceOf.functionName).toBe('balanceOf')
		expect(ERC721.write.transferFrom.functionName).toBe('transferFrom')
		expect(AdvancedContract.read.getAllValues.functionName).toBe('getAllValues')
		expect(ErrorContract.write.revertWithSimpleCustomError.functionName).toBe('revertWithSimpleCustomError')
	})
})
