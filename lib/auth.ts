/*
Contains helpers for anything authentication or authorisation
 */
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "./prisma";

// The following function is a high order function
export const validateRoute = (handler) => {
  // handler is any function that takes a request and a response
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { TRAX_ACCESS_TOKEN: token } = req.cookies; // Destructure and rename to token

    if (token) {
      let user;

      try {
        const { id } = jwt.verify(token, "hello");
        user = await prisma.user.findUnique({
          where: { id },
        });

        if (!user) {
          throw new Error("Not real user");
        }
      } catch (e) {
        res.status(401);
        res.json({ error: "Not Authorised" });
        return;
      }
      return handler(req, res, user);
    }

    res.status(401);
    res.json({ error: "Not Authorised" });
  };
};
