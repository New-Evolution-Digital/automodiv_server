import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 7001;
export const HOST: string = "0.0.0.0";
