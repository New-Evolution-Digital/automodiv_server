import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 7000;
const host = process.env.HOST || "0.0.0.0";
let originLink: string | undefined = process.env.ORIGIN_LINK;

if (process.env.NODE_ENV === "development" && process.env.GRAPHQL_DEV)
  originLink = "https://studio.apollographql.com";

export { host, originLink, port };

export let serviceLinkList: { [key: string]: string } = {
  dealership_auth:
    process.env.DEALERSHIP_AUTH_URL || "http://dealership_auth:7001",
};
