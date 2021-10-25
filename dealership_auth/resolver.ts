import { DealerAuthEntity } from "./DealerAuthEntity";
import { Query, Resolver } from "type-graphql";

@Resolver(() => DealerAuthEntity)
export class AuthResolver {
  @Query(() => String, { nullable: true })
  me() {
    return "hello";
  }
}
