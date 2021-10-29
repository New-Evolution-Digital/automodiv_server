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
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [DealerAuthEntity],
    synchronize: process.env.NODE_ENV === "development",
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
      origin: "http://localhost:3000",
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
        httpOnly: process.env.NODE_ENV === "development",
        sameSite: process.env.GRAPHQL_DEV ? "none" : "lax",
        secure: true,
      },
      saveUninitialized: false,
      secret: process.env.secret || "secret",
      resave: false,
    })
  );

  const getPlugins = () => {
    if (process.env.NODE_ENV !== "development") {
      return [];
    }
    return [apolloLogging];
  };

  const server = new ApolloServer({
    introspection: true,
    plugins: getPlugins(),
    schema,
    context: ({ req, res }) => ({ req, res, redis }),
  });

  await server.start();
  server.applyMiddleware({ app, cors: false });

  app.get("/", (_, res) => {
    res.status(200).send("Server Is Working").end();
  });

  app.listen({ port: PORT, host: HOST });

  console.log(`Running on ${HOST}:${PORT}`);
}

initServer();
