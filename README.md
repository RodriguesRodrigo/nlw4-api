# Dependencies

- node 14.0.0
- npm 6.14.4

# Run project

Clone the project, go to the project dir and install all dependencies

```
npm install
```

When the instalation is finished, run the project:

```
npm run dev
```

# Migrations

## Create migrations:

```bash
npm run migration-create <NameMigration>
```

## Execute migrations:

```bash
npm run migration-run
```

## Revert migrations:

```
npm run migration-revert
```

# Run tests

> Make sure that the test database is not created before run tests.

To run the tests is simple, you just need to run this command:

```
npm run test
```
