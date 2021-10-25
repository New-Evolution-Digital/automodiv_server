import { createConnection } from "typeorm";
import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/federation";
import { DealerAuthEntity } from "./DealerAuthEntity";
import { HOST, PORT } from "./constants";

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

  const typeDefs = gql`
    type Query {
      me: User
    }

    type User {
      id: ID!
      username: String
    }
  `;

  const resolvers = {
    Query: {
      me() {
        return { id: "1", username: "@ava" };
      },
    },
  };

  const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs: typeDefs, resolvers }]),
    introspection: true,
  });

  const { url } = await server.listen({ port: PORT, host: HOST });

  console.log(`Running on ${url}`);
}

initServer();
