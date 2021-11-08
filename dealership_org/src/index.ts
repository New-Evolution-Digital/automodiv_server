import "reflect-metadata";
import cors from "cors";
import express, { Response } from "express";
import { createConnection } from "typeorm";

import { host, port } from "./constants";
import { DealershipOrg } from "./entities/DealershipOrg";
import { OrgRes, resolverOrgReference } from "./resolvers";
import { ApolloServer } from "apollo-server-express";
import { buildSubgraphSchema } from "./helpers/buildSubgraphSchema";
import morgan from "morgan";

function displayService() {
  let displayHost: string;
  displayHost = host !== "0.0.0.0" ? host : "http://localhost";

  console.log(`Running on ${displayHost}:${port}`);
  console.log(`GraphQL listening on ${displayHost}:${port}/graphql`);
}

async function initDB() {
  let config;
  if (!!process.env.DATABASE_URL) {
    config = {
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    };
  } else {
    config = {
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      host: "dealership_org_db"
    };
  }

  await createConnection({
    type: "postgres",
    entities: [DealershipOrg],
    synchronize: true,
    ...config
  });
}

async function main() {
  await initDB();

  // Set up Apollo
  const schema = await buildSubgraphSchema(
    {
      resolvers: [OrgRes],
      orphanedTypes: [DealershipOrg]
    },
    {
      DealerOrg: { __resolverReference: resolverOrgReference }
    }
  );

  const app = express();
  app.use(
    cors({
      origin: process.env.ORIGIN_URL || "http://localhost:3000",
      credentials: true
    })
  );

  const server = new ApolloServer({
    introspection: true,
    schema
  });

  await server.start();

  process.env.NODE_ENV === "development" && app.use(morgan("dev"));
  server.applyMiddleware({ app, cors: false });

  app.get("/", (_, res: Response) => {
    res.status(200).send("<h1>Organization Server is up and running</h1>");
  });

  app.listen(port);
  displayService();
}

main();
