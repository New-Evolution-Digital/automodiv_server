import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server";
import { HOST, PORT } from "./constants";
import { DealerAuthEntity } from "./entities/DealerAuthEntity";
import { AuthResolver } from "./resolver";
import { buildSubgraphSchema } from "./helpers/buildSubgraphSchema";
import { resolveDealerAuthReference } from "./dealer-reference";

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
    logging: true,
  });

  const schema = await buildSubgraphSchema(
    {
      resolvers: [AuthResolver],
      orphanedTypes: [DealerAuthEntity],
    },
    {
      DealerAuthEntity: { __resolverReference: resolveDealerAuthReference },
    }
  );

  const apolloLogging = {
    async requestDidStart(requestContext: any) {
      console.log("Request started! Query:\n" + requestContext.request.query);
    },
  };

  const server = new ApolloServer({
    introspection: true,
    plugins: [apolloLogging],
    schema,
  });

  const { url } = await server.listen({ port: PORT, host: HOST });

  console.log(`Running on ${url}`);
}

initServer();
