import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT || 7002;
export const host: string = "0.0.0.0";
