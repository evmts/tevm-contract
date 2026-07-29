# @tevm/contract

`@tevm/contract` is Tevm's shared, type-safe contract kernel. It defines the contract surface used by both the
[Tevm core node](https://github.com/evmts/tevm-monorepo) and Tevm's bundler packages, so contract descriptions and
generated actions have one stable representation across the ecosystem.

This repository is the standalone home of the package formerly maintained at `packages/contract` in the Tevm
monorepo. Its Git history was preserved during the extraction.

## Install

```sh
pnpm add @tevm/contract
```

The package does not require a Tevm node at runtime. Consumers that execute the actions produced here should install
the appropriate Tevm client separately.

## Usage

```ts
import { createContract } from '@tevm/contract'

const greeter = createContract({
	name: 'Greeter',
	humanReadableAbi: ['function greet() view returns (string)'],
	address: '0x0000000000000000000000000000000000000001',
})

const action = greeter.read.greet()
```

`createContract` accepts either a human-readable ABI or a JSON ABI. The returned value exposes typed read, write,
event, deployment, `withAddress`, and `withCode` action creators.

## Development

This repository uses Node.js 24 and pnpm 9.

```sh
pnpm install
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

Package releases are managed with Changesets. Add a changeset with `pnpm changeset`; merging the generated version PR
publishes to npm with provenance.

API documentation belongs at [contract.tevm.sh](https://contract.tevm.sh). The umbrella Tevm documentation remains at
[tevm.sh](https://tevm.sh).

## License

[MIT](./LICENSE)
