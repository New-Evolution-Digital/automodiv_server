import { ApolloGateway, ServiceEndpointDefinition } from "@apollo/gateway";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import waitOn from "wait-on";
import { host, originLink, port, serviceLinkList } from "./constants";

dotenv.config();

let serviceList: ServiceEndpointDefinition[] = [];
let resources: string[] = [];

for (const key in serviceLinkList) {
  if (Object.prototype.hasOwnProperty.call(serviceLinkList, key)) {
    const link = serviceLinkList[key];
    serviceList.push({ name: key, url: `${link}/graphql` });
    resources.push(link);
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
  app.get("/", (_, res) => {
    res.status(200).send("<h1>Gateway Is Fully Functional</h1>");
  });
  app.listen(port);
  const hostString = host === "0.0.0.0" ? "localhost" : host;
  const portString = port && ":" + port;
  console.log(`Running on http://${hostString}${portString}`);
  console.log(`GraphQL on http://${hostString}${portString}/graphql`);
}

waitOn({ resources }).then(() => {
  initServer();
});
