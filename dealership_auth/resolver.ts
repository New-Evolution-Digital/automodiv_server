import { Args, ArgsType, Field, Mutation, Query, Resolver } from "type-graphql";
import { DealerAuthEntity } from "./entities/DealerAuthEntity";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { getRepository } from "typeorm";
dotenv.config();

@ArgsType()
export class DealerAdminInputType {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field(() => String)
  password: string;
}

@Resolver()
export class AuthResolver {
  @Query(() => [DealerAuthEntity], { nullable: true })
  async getAllUsers(): Promise<DealerAuthEntity[]> {
    return await getRepository(DealerAuthEntity).find();
  }

  @Mutation(() => DealerAuthEntity)
  async registerDealerAdmin(
    @Args() { email, password, username }: DealerAdminInputType
  ): Promise<DealerAuthEntity> {
    const hashed = await bcrypt.hash(password, 15);
    const newAdminInstance = DealerAuthEntity.create({
      email,
      password: hashed,
      username,
    });
    return await newAdminInstance.save();
  }
}
