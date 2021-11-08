import { DealershipOrg } from "../entities/DealershipOrg";
import { getRepository } from "typeorm";
import { OrganizationResolver as OrgRes } from "./DealershipOrg.Resolver";

async function resolverOrgReference(
  reference: Pick<DealershipOrg, "id">
): Promise<DealershipOrg | undefined> {
  return await getRepository(DealershipOrg, "default").findOne(reference.id);
}

export { OrgRes, resolverOrgReference };
