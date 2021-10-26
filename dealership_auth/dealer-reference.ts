import { DealerAuthEntity } from "./entities/DealerAuthEntity";
import { getRepository } from "typeorm";

export async function resolveDealerAuthReference(
  reference: Pick<DealerAuthEntity, "id">
): Promise<DealerAuthEntity | undefined> {
  return await getRepository(DealerAuthEntity, "default").findOne(reference.id);
}
