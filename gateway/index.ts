import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import waitOn from "wait-on";
import { HOST, PORT } from "./constants";

async function initServer() {
  const gateway = new ApolloGateway({
    serviceList: [
      { name: "dealership_auth", url: "http://dealership_auth:7001/graphql" },
    ],
  });

  const app = express();

  const server = new ApolloServer({
    gateway,
    context: ({ req, res }) => ({ req, res }),
  });

  await server.start();

  app.use(cors({ origin: "http://localhost:7000", credentials: true }));

  server.applyMiddleware({ app, cors: false });

  app.listen({ port: PORT, host: HOST });

  console.log(`Running on http://${HOST}:${PORT}`);
  console.log(`GraphQL on http://${HOST}:${PORT}/graphql`);
}

waitOn({ resources: ["http://dealership_auth:7001/"] }).then(() => {
  initServer();
});
