import jwt from "jsonwebtoken"
import { NextFunction , Request , Response } from "express";

const auth = async (req : Request, res : Response, next : NextFunction) => {
    try {
      let token =
        req?.cookies?.token ||
        req?.body?.token || req?.header("Authorization")?.replace("Bearer ", "");
        
  
      if (!token) {
        return res.status(401).json({ success: false, message: "Token Missing" });
      }
  
      try {
        const decode = await jwt.verify(token, "secret");
        req.body.user = decode;
      } catch (error) {
        return res
          .status(401)
          .json({ success: false, message: "Token is invalid" });
      }
  
      next();
    } catch (error) {
  
      return res.status(401).json({
        success: false,
        message: "Please login to perform this action",
      });
    }
  };

module.exports = auth