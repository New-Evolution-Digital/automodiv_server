import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";
import { HOST, PORT } from "./constants";

async function initServer() {
  const gateway = new ApolloGateway({
    serviceList: [{ name: "dealership_auth", url: "http://172.29.0.3:7001" }],
  });

  const server = new ApolloServer({
    gateway,
  });

  const { url } = await server.listen({ port: PORT, host: HOST });

  console.log(`Running on ${url}`);
}

initServer();
