import { Request, Response } from "express";
import { Redis } from "ioredis";
import { EntityManager } from "typeorm";

declare global {
  export type serverContext = {
    req: Request & { session: Express.Session };
    redis: Redis;
    res: Response;
  };
}
