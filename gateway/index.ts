import { ApolloGateway, ServiceEndpointDefinition } from "@apollo/gateway";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import waitOn from "wait-on";
import { host, originLink, port, serviceLinkList } from "./constants";

dotenv.config();

let serviceList: ServiceEndpointDefinition[] = [];

for (const key in serviceLinkList) {
  if (Object.prototype.hasOwnProperty.call(serviceLinkList, key)) {
    const link = serviceLinkList[key];
    serviceList.push({ name: key, url: link });
  }
}

async function initServer() {
  const gateway = new ApolloGateway({
    serviceList,
  });

  const app = express();

  const server = new ApolloServer({
    gateway,
    context: ({ req, res }) => ({ req, res }),
  });

  await server.start();

  app.use(cors({ origin: originLink, credentials: true }));

  server.applyMiddleware({ app, cors: false });

  app.listen({ port, host });
  const hostString = host === "0.0.0.0" ? "localhost" : host;
  const portString = port && ":" + port;
  console.log(`Running on http://${hostString}${portString}`);
  console.log(`GraphQL on http://${hostString}${portString}/graphql`);
}

waitOn({ resources: ["http://dealership_auth:7001/"] }).then(() => {
  initServer();
});
