import { EntityManager } from "typeorm";

declare global {
  export type serverContext = { em: EntityManager };
}
