import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
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

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => DealerAuthEntity, { nullable: true })
  user?: DealerAuthEntity;
}

@Resolver()
export class AuthResolver {
  @Query(() => DealerAuthEntity, { nullable: true })
  async me(@Ctx() { req }: serverContext) {
    if (!req.session.userId) {
      return null;
    }

    return await DealerAuthEntity.findOne(req.session.userId);
  }

  @Query(() => [DealerAuthEntity], { nullable: true })
  async getAllUsers(): Promise<DealerAuthEntity[]> {
    return await getRepository(DealerAuthEntity).find();
  }

  @Mutation(() => UserResponse)
  async registerDealerAdmin(
    @Args() { email, password, username }: DealerAdminInputType,
    @Ctx() { req }: serverContext
  ): Promise<UserResponse> {
    const hashed = await bcrypt.hash(password, 15);
    const newAdminInstance = DealerAuthEntity.create({
      email,
      password: hashed,
      username,
    });

    let user;
    try {
      user = await newAdminInstance.save();
    } catch (error) {
      if (error.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }

    req.session.userId = user?.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: serverContext
  ): Promise<UserResponse> {
    const user = await DealerAuthEntity.findOne({ where: { email } });

    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "this email doesn't exist",
          },
        ],
      };
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Email/Password Combo Doesn't Exist",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }
}
