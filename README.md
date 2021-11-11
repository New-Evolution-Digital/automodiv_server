# backend_pae

Backend server utilizing Docker, Typescript, Apollo, GraphQL, and TypeOrm

## Service

1. Gateway
2. Dealership_Auth
3. Dealership_Org
4. Dealership_Inv

## Containers

1. gateway
2. dealership_auth
3. dealership_auth_db: Postgres
4. dealership_auth_redis: Redis
5. dealership_org
6. dealership_org_db: Postgres
7. dealership_inv
8. dealership_inv_db: Postgres

## Docker: Run Instructions

In order to run server on development, please make sure you have docker installed on your system.

### 1) Build Packages

Run the following bash command to start all docker containers

```console
docker-compose build
```

### 2) Create Env for Composition

```
cp .env.example .env
```

Run the following bash command to start all docker containers

```console
docker-compose --env-file .env up
```

> **Issues With Docker**
>
> In the case one encounters errors with either databases, redis, or one of the services, first try the following bash command
>
> ```console
> docker-compose down
> ```
>
> Then repeat the installation steps
