import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server";
import { HOST, PORT } from "./constants";
import { DealerAuthEntity } from "./DealerAuthEntity";
import { AuthResolver } from "./resolver";
import { buildSubgraphSchema } from "./helpers/buildSubgraphSchema";

async function initServer() {
  await createConnection({
    type: "postgres",
    host: "dealership_auth_db",
    port: 5432,
    username: "test",
    password: "password",
    database: "db",
    entities: [DealerAuthEntity],
    synchronize: true,
  });

  const schema = await buildSubgraphSchema({
    resolvers: [AuthResolver],
    orphanedTypes: [DealerAuthEntity],
  });

  const server = new ApolloServer({
    schema,
    introspection: true,
  });

  const { url } = await server.listen({ port: PORT, host: HOST });

  console.log(`Running on ${url}`);
}

initServer();
