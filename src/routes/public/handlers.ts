import { Request, Response } from "express";

function healthHandler(req: Request, res: Response) {
  res.send("Server is alive\n");
}

// eslint-disable-next-line import/prefer-default-export
export { healthHandler };
