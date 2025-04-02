// import express, { Request, Response } from 'express'
import express from 'express'
import authController from '../controllers/auth.controller'
import authMiddleware from '../middleware/auth.middleware'
import aclMiddleware from '../middleware/acl.middleware';
import { ROLES } from '../utils/constant';
import mediaMiddleware from '../middleware/media.middleware';
import mediaController from '../controllers/media.controller';

const router = express.Router()

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login )
router.get("/auth/me", authMiddleware, authController.me)
router.post("/auth/activation", authController.activation)

// Only for testing middleware based on role
// router.get(
//      "/test-acl", 
//      [authMiddleware, aclMiddleware([ROLES.MEMBER])], 
//      (req: Request, res: Response) => {
//           res.status(200).json({
//                data: "success",
//                message: "OK"
//           })
// })


router.post("/media/upload-single", [ authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]), mediaMiddleware.single("file")], mediaController.single )
router.post("/media/upload-multiple", [ authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]), mediaMiddleware.multiple("files")], mediaController.multiple)
router.delete("/media/remove", mediaController.remove)

export default router