import "reflect-metadata";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { createConnection } from "typeorm";

import { HOST, PORT } from "./constants";
import { DealerAuthEntity } from "./entities/DealerAuthEntity";
import { AuthResolver } from "./resolver";
import { buildSubgraphSchema } from "./helpers/buildSubgraphSchema";
import { resolveDealerAuthReference } from "./dealer-reference";

dotenv.config();

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
    // logging: true,
  });

  const apolloLogging = {
    async requestDidStart(requestContext: any) {
      console.log("Request started! Query:\n" + requestContext.request.query);
    },
  };

  const schema = await buildSubgraphSchema(
    {
      resolvers: [AuthResolver],
      orphanedTypes: [DealerAuthEntity],
    },
    {
      DealerAuthEntity: { __resolverReference: resolveDealerAuthReference },
    }
  );

  const RedisStore = connectRedis(session);
  const redis = new Redis(6379, "dealership_auth_redis");

  const app = express();
  app.use(
    cors({
      credentials: true,
    })
  );

  app.use(
    session({
      name: "neaid",
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "none",
      },
      saveUninitialized: false,
      secret: process.env.secret || "secret",
      resave: false,
    })
  );

  const server = new ApolloServer({
    introspection: true,
    plugins: [apolloLogging],
    schema,
    context: ({ req, res }) => ({ req, res, redis }),
  });

  await server.start();
  server.applyMiddleware({ app, cors: false });

  app.listen({ port: PORT, host: HOST });

  console.log(`Running on ${HOST}:${PORT}`);
}

initServer();
