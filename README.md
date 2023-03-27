# Squid template project

A starter [Squid](https://subsquid.io) project to demonstrate its structure and conventions.
It accumulates [kusama](https://kusama.network) account transfers and serves them via GraphQL API.

## Summary

- [Squid template project](#squid-template-project)
  - [Summary](#summary)
  - [Prerequisites](#prerequisites)
  - [Quickly running the sample](#quickly-running-the-sample)
  - [Migrate to FireSquid](#migrate-to-firesquid)
  - [Public archives for Parachains](#public-archives-for-parachains)
  - [Self-hosted archive](#self-hosted-archive)
  - [Dev flow](#dev-flow)
    - [1. Define database schema](#1-define-database-schema)
    - [2. Generate TypeORM classes](#2-generate-typeorm-classes)
    - [3. Generate database migration](#3-generate-database-migration)
    - [4. Generate TypeScript definitions for substrate events, calls and storage](#4-generate-typescript-definitions-for-substrate-events-calls-and-storage)
  - [Deploy the Squid](#deploy-the-squid)
  - [Project conventions](#project-conventions)
  - [Types bundle](#types-bundle)
  - [Differences from polkadot.js](#differences-from-polkadotjs)
  - [Graphql server extensions](#graphql-server-extensions)
    - [Run in Docker](#run-in-docker)

## Prerequisites

* node 16.x
* docker
* npm -- note that `yarn` package manager is not supported

## Quickly running the sample

Example commands below use [make(1)](https://www.gnu.org/software/make/).
Please, have a look at commands in [Makefile](Makefile) if your platform doesn't support it.
On Windows we recommend to use [WSL](https://docs.microsoft.com/en-us/windows/wsl/).

```bash
# 1. Update Squid SDK and install dependencies
npm run update
npm ci

# 2. Run your node

# 3. Run archive docker
make archive

# 4. Compile type generations from your node
make typegen

# 5. Compile your entities from your schema
make codegen

# 6. Compile your project
make build

# 7. Start target Postgres database and detach
make up

# 8. Generate migrations from your schema.
# Do not generate migrations if you already generated them
make generate

# 9. Make migrations to your database.
# Do no run migrations if you already applied them
make migrate

# 10. Start the processor
make process

# 11. The command above will block the terminal
#    being busy with fetching the chain data, 
#    transforming and storing it in the target database.
#
#    To start the graphql server open the separate terminal
#    and run
make serve

# In case your database migrations fails remove `db`
# and start process from step #7.

# To remove archive docker container run
make archive-down

# To remove processor docker container run
make down
```

## Migrate to FireSquid

To migrate old (v5) Squids to FireSquid, follow the [Migration Guide](https://docs.subsquid.io/migrate/migrate-to-fire-squid)

## Public archives for Parachains

Subsquid provides archive data sources for most parachains, with API playgrounds available on the [Aquarium Archive](https://app.subsquid.io/aquarium/archives) page.

The list of public archive data source endpoints is also maintained in the `@subsquid/archive-registry` npm package for programmatic access. Use `lookupArchive(<network name>, <lookup filters>)` to look up the archive endpoint by the network name, e.g.

```typescript
processor.setDataSource({
  archive: lookupArchive("kusama", { release: "FireSquid" })
  //...
});
```

To make sure you're indexing the right chain one can additionally filter by the genesis block hash:

```typescript
processor.setDataSource({
  archive: lookupArchive("kusama", { 
    release: "FireSquid", 
    genesis: "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe" 
  }),
  //...
});
```

If the chain is not yet supported, 
please fill out the [form](https://forms.gle/Vhr3exPs4HrF4Zt36) to submit a request.

## Self-hosted archive

To run an archive locally, inspect [archive/docker-compose.yml](archive/docker-compose.yml) 
and provide the WebSocket endpoint for your node, then start it with

```bash
docker compose -f archive/docker-compose.yml up
```

To drop the archive, run

```bash
docker compose -f archive/docker-compose.yml down -v
```

The archive gateway will be started at port `8888` and it can immediately be used with the processor (even if it's not in sync):

```typescript
processor.setDataSource({
  archive: `http://localhost:8888/graphql`,
});
```

Additionally, an explorer GraphQL API and a playground will be started at `http://localhost:4350/graphql`. While optional, it's a useful tool for debugging and on-chain data exploration.

## Dev flow

### 1. Define database schema

Start development by defining the schema of the target database via `schema.graphql`.
Schema definition consists of regular graphql type declarations annotated with custom directives.
Full description of `schema.graphql` dialect is available [here](https://docs.subsquid.io/docs/develop-a-squid/define-a-squid-schema).

### 2. Generate TypeORM classes

Mapping developers use [TypeORM](https://typeorm.io) entities
to interact with the target database during data processing. All necessary entity classes are
generated by the squid framework from `schema.graphql`. This is done by running `npx squid-typeorm-codegen`
command.

### 3. Generate database migration

All database changes are applied through migration files located at `db/migrations`.
`squid-typeorm-migration(1)` tool provides several commands to drive the process.
It is all [TypeORM](https://typeorm.io/#/migrations) under the hood.

```bash
# Connect to database, analyze its state and generate migration to match the target schema.
# The target schema is derived from entity classes generated earlier.
# Don't forget to compile your entity classes beforehand!
npx squid-typeorm-migration generate

# Create template file for custom database changes
npx squid-typeorm-migration create

# Apply database migrations from `db/migrations`
npx squid-typeorm-migration apply

# Revert the last performed migration
npx squid-typeorm-migration revert         
```

### 4. Generate TypeScript definitions for substrate events, calls and storage 

This is an optional part, but it is very advisable. 

Event, call and runtime storage data come to mapping handlers as raw untyped json. 
While it is possible to work with raw untyped json data, 
it's extremely error-prone and the json structure may change over time due to runtime upgrades.

Squid framework provides tools for generating type-safe wrappers around events, calls and runtime storage items for
each historical change in the spec version.

Typical usage looks as follows:

```typescript
function getTransferEvent(ctx: EventHandlerContext) {
    // instantiate the autogenerated type-safe class for Balances.Transfer event
    const event = new BalancesTransferEvent(ctx);
    // for each runtime version, reduce the data to a common interface
    if (event.isV1020) {
        const [from, to, amount, fee] = event.asV1020;
        return {from, to, amount};
    } else if (event.isV1050) {
        const [from, to, amount] = event.asV1050;
        return {from, to, amount};
    } else {
        return event.asV9130;
    }
}
``` 

To generate type-safe wrappers for events, calls and storage items, use `squid-substrate-typegen(1)`. It expects a
config file of the following structure:

```json5
{
  "outDir": "src/types",
  // List of chain spec versions.
  // Can be given as:
  //    1. Squid archive URL
  //    2. JSON lines file created by `squid-substrate-metadata-explorer(1)`
  "specVersions": "https://kusama.archive.subsquid.io/graphql",
  "events": [ // list of events to generate. To generate all events, set "events": true.
    "Balances.Transfer"
  ],
  "calls": [ // list of calls to generate. To generate all calls, set "calls": true.   
    "Timestamp.set"
  ],
  "storage": [
    "System.Account" // list of storage items. To all storage items, set "storage": true
  ]
}
```

In the [current template](typegen.json), the list of spec versions is
specified as an archive URL. However, one can do without archive 
or simply pre-download spec versions via `squid-substrate-metadata-explorer(1)` tool.

```bash
# Explore the chain (may take some time)
npx squid-substrate-metadata-explorer \
  --chain wss://kusama-rpc.polkadot.io \
  --out kusamaVersions.jsonl
  
# Download spec versions from archive
npx squid-substrate-metadata-explorer \
  --archive https://kusama.archive.subsquid.io/graphql \
  --out kusamaVersions.jsonl
```

## Deploy the Squid

After a local run, obtain a deployment key by signing into [Aquarium](https://app.subsquid.io/start) and run 

```sh
npx sqd auth -k YOUR_DEPLOYMENT_KEY
```

Next, inspect the Squid CLI help to deploy and manage your squid:

```sh
npx sqd squid --help
```

For more information, consult the [Deployment Guide](https://docs.subsquid.io/docs/deploy-squid/).

## Project conventions

Squid tools assume a certain project layout.

* All compiled js files must reside in `lib` and all TypeScript sources in `src`. 
The layout of `lib` must reflect `src`.
* All TypeORM classes must be exported by `src/model/index.ts` (`lib/model` module).
* Database schema must be defined in `schema.graphql`.
* Database migrations must reside in `db/migrations` and must be plain js files.
* `squid-*(1)` executables consult `.env` file for a number of environment variables.

## Types bundle

Substrate chains that have blocks with metadata versions below 14 don't provide enough 
information to decode their data. For those chains, external [type](https://polkadot.js.org/docs/api/start/types.extend) [definitions](https://polkadot.js.org/docs/api/start/types.extend) are required.

Subsquid tools include definitions for many chains, however sometimes external 
definitions are still required.

You can pass them as a special json file (types bundle) of the following structure:

```json5
{
  "types": {
    "AccountId": "[u8; 32]"
  },
  "typesAlias": {
    "assets": {
      "Balance": "u64"
    }
  },
  "versions": [
    {
      "minmax": [0, 1000], // spec version range with inclusive boundaries
      "types": {
        "AccountId": "[u8; 16]"
      },
      "typesAlias": {
        "assets": {
          "Balance": "u32"
        }
      }
    }
  ]
}
```

* `.types` - scale type definitions similar to [polkadot.js types](https://polkadot.js.org/docs/api/start/types.extend#extension)
* `.typesAlias` - similar to [polkadot.js type aliases](https://polkadot.js.org/docs/api/start/types.extend#type-clashes)
* `.versions` - per-block range overrides/patches for above fields.

All fields in the type bundle are optional and applied on top of a fixed set of well-known frame types.

Note, that although the structure of subsquid types bundle is very similar to the one from polkadot.js,
those two are not fully compatible.

## Differences from polkadot.js

Polkadot.js provides lots of [specialized classes](https://polkadot.js.org/docs/api/start/types.basics) for various types of data. 
Even primitives like `u32` are exposed through special classes.
In contrast, the squid framework works only with plain js primitives and objects.
For instance, account data is passed to the handler context as a plain byte array.  To convert it into a standard human-readable format one should explicitly use a utility lib `@subsquid/ss58`:

```typescript 
    // ...
    from: ss58.codec('kusama').encode(rec.from),
    to: ss58.codec('kusama').encode(rec.to),
```



## Graphql server extensions

It is possible to extend `squid-graphql-server(1)` with custom
[type-graphql](https://typegraphql.com) resolvers and to add request validation.
For more details, consult [Docs](https://docs.subsquid.io/reference/api-extensions)


### Run in Docker

First, install [Docker](https://docs.docker.com/get-docker/) and
[Docker Compose](https://docs.docker.com/compose/install/).

Then run the following command to start full application:

```bash
./scripts/docker-run.sh
```

You can use either the `latest` tag or specific one in the docker-compose-full configuration.
