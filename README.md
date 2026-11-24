# @tevm/contract

`@tevm/contract` is Tevm's shared, type-safe contract kernel. It defines the contract surface used by both the
[Tevm core node](https://github.com/evmts/tevm) and Tevm's bundler packages, so contract descriptions and
generated actions have one stable representation across the ecosystem.

This repository is the standalone home of the package formerly maintained at `packages/contract` in the Tevm
monorepo. Its Git history was preserved during the extraction.

## Install

```sh
pnpm add @tevm/contract
```

The package does not require a Tevm node at runtime. Consumers that execute the actions produced here should install
the appropriate Tevm client separately. Action objects also work with viem’s ABI encoders.

The package temporarily consumes the published `@tevm/utils` compatibility package from Tevm core. That dependency
will be replaced by [Voltaire](https://github.com/evmts/voltaire); there is intentionally no standalone
`tevm-utils` repository.

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
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm build
pnpm check:package
pnpm test:coverage
pnpm test:e2e
pnpm bench
```

Use `pnpm test:unit` for unit tests and `pnpm test:fuzz` for the property tests alone. The fuzz suite defaults to
320 cases per property and a fixed seed. Reproduce a run with `FUZZ_SEED=518833 FUZZ_RUNS=320 pnpm test:fuzz`.

The end-to-end suite requires a build and executes deployment, reads, writes, logs, and reverts in a local EVM using the
ESM and CommonJS entry points. Benchmarks report throughput and latency. CI runs the benchmark
suite to catch execution errors.

Add a changeset with `pnpm changeset`. Merging the generated version PR publishes to npm with
provenance once npm trusted publishing is configured for `evmts/tevm-contract` and `release.yml`.
See the [npm trusted publishing setup](https://docs.npmjs.com/trusted-publishers/).

## Documentation

The documentation site lives in [`site/`](./site) and is built with [vocs](https://vocs.dev) 2.x. GitHub Actions builds the
site, and the Vercel GitHub integration deploys main to [contract.tevm.sh](https://contract.tevm.sh). The umbrella Tevm
documentation remains at [tevm.sh](https://tevm.sh).

```sh
pnpm docs:dev      # local dev server
pnpm docs:build    # production build -> site/dist/public
pnpm docs:preview  # serve the production build
```

`pnpm run docs` is separate: it runs TypeDoc to regenerate the markdown API reference in [`docs/`](./docs) from source
JSDoc.

## License

[MIT](./LICENSE)
