import { NextFunction, Response, Request } from "express"
import { IReqUser } from "../utils/interfaces";

// High-Order Function (membuat function untuk di dalamnya membuat function lagi)
export default (roles: string[]) => {
  return (req: IReqUser, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
          return res.status(403).json({
                    data: null,
                    message: "Forbidden"
               })
    }

    next();
  };
};