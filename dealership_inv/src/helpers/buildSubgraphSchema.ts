import {
  buildSchema,
  BuildSchemaOptions,
  createResolversMap
} from "type-graphql";
import { specifiedDirectives } from "graphql";
import gql from "graphql-tag";
import { federationDirectives } from "@apollo/subgraph/dist/directives";
import {
  buildSubgraphSchema as buildApolloSubgraphSchema,
  printSubgraphSchema
} from "@apollo/subgraph";
import { addResolversToSchema, GraphQLResolverMap } from "apollo-graphql";

export async function buildSubgraphSchema(
  options: Omit<BuildSchemaOptions, "skipCheck">,
  referenceResolvers?: GraphQLResolverMap<any>
) {
  const schema = await buildSchema({
    ...options,
    directives: [
      ...specifiedDirectives,
      ...federationDirectives,
      ...(options.directives || [])
    ],
    skipCheck: true
  });

  let subgraphSchema = buildApolloSubgraphSchema({
    typeDefs: gql(printSubgraphSchema(schema)),
    resolvers: createResolversMap(schema) as any
  });

  if (referenceResolvers) {
    addResolversToSchema(subgraphSchema, referenceResolvers);
  }

  return subgraphSchema;
}
