import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export default function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        params: req.params,
        body: req.body,
        query: req.query,
      });
      next();
    } catch (e) {
      next(e);
    }
  };
}
