import { RequestHandler } from "express";

import mongoose from "mongoose";

export const db = async () => {
  try {
    const link = await mongoose.connect(process.env.MONGO_URI as string);

    console.log(`Db connected Succesfuly ${link.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
