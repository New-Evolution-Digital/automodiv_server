import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { getRepository } from "typeorm";
import { DealershipOrg } from "../entities/DealershipOrg";

@InputType()
class DealershipOrgInputs implements Partial<DealershipOrg> {
  @Field({ nullable: true })
  readonly name?: string;

  @Field({ nullable: true })
  readonly street_address?: string;

  @Field({ nullable: true })
  readonly city?: string;

  @Field({ nullable: true })
  readonly state?: string;

  @Field(() => Int, { nullable: true })
  readonly zip?: number;

  @Field(() => Int, { nullable: true })
  readonly default_dealer_number?: number;
}

@Resolver()
export class OrganizationResolver {
  async orgExist(id: number) {
    const orgRepo = getRepository(DealershipOrg);
    const org = await orgRepo.findOne(id);
    if (org) return true;
    return false;
  }

  @Mutation(() => DealershipOrg)
  async createOrg(
    @Arg("rootId") rootId: number
  ): Promise<DealershipOrg | undefined> {
    const orgRepo = getRepository(DealershipOrg);
    return await orgRepo.create({ root_user: rootId, admins: [rootId] }).save();
  }

  @Query(() => DealershipOrg, { nullable: true })
  async getOrgByAdminID(
    @Arg("rootId", () => Int, { description: "Admin's ID Number" })
    root_user: number
  ): Promise<DealershipOrg | undefined> {
    const orgRepo = getRepository(DealershipOrg);

    return await orgRepo.findOne({ root_user });
  }

  @Mutation(() => DealershipOrg)
  async updateOrg(
    @Arg("orgId") orgId: number,
    @Arg("updatedInfo") updateInfo: DealershipOrgInputs
  ): Promise<DealershipOrg | undefined> {
    const orgRepo = getRepository(DealershipOrg);
    if (!this.orgExist(orgId)) {
      return undefined;
    }

    await orgRepo.update(orgId, updateInfo);
    return await orgRepo.findOne(orgId);
  }

  @Query(() => [DealershipOrg])
  async getAllOrgs(): Promise<DealershipOrg[] | undefined> {
    const orgRepo = getRepository(DealershipOrg);
    return await orgRepo.find();
  }
}
