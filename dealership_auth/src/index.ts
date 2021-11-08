import "reflect-metadata";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { createConnection } from "typeorm";
import morgan from "morgan";

import { HOST, PORT } from "./constants";
import { DealerAuthEntity } from "./entities/DealerAuthEntity";
import { AuthResolver } from "./resolver";
import { buildSubgraphSchema } from "./helpers/buildSubgraphSchema";
import { resolveDealerAuthReference } from "./dealer-reference";

dotenv.config();

async function initServer() {
  let config;
  if (!!process.env.DATABASE_URL) {
    config = {
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    };
  } else {
    config = {
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      host: "dealership_auth_db",
    };
  }

  await createConnection({
    type: "postgres",
    entities: [DealerAuthEntity],
    synchronize: true,
    ...config,
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
  let redis: Redis.Redis;
  (() => {
    if (process.env.REDIS_URL) redis = new Redis(process.env.REDIS_URL);
    else redis = new Redis(6379, "dealership_auth_redis", {});
  })();

  const app = express();

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
  process.env.NODE_ENV === "development" && app.use(morgan("dev"));
  app.use(
    cors({
      origin: process.env.ORIGIN_LINK,
      credentials: true,
    })
  );

  app.use(
    session({
      name: "amdid",
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: process.env.GRAPHQL_DEV === "true" ? "none" : "lax",
        secure: process.env.NODE_ENV !== "development",
      },
      saveUninitialized: false,
      secret: process.env.REDIS_SECRET || "secret",
      resave: false,
    })
  );
  app.get("/", (_, res) => {
    res.status(200).send("Dealership Auth Server Is Working").end();
  });

  server.applyMiddleware({ app, cors: false });

  app.listen({ port: PORT, host: HOST });

  let displayHost: string;
  displayHost = HOST !== "0.0.0.0" ? HOST : "http://localhost";

  console.log(`Running on ${displayHost}:${PORT}`);
  console.log(`GraphQL listening on ${displayHost}:${PORT}/graphql`);
}

initServer();
