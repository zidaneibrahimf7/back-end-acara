import express, { Request, Response } from 'express'
import authController from '../controllers/auth.controller'
import authMiddleware from '../middleware/auth.middleware'
import aclMiddleware from '../middleware/acl.middleware';
import { ROLES } from '../utils/constant';
import mediaMiddleware from '../middleware/media.middleware';
import mediaController from '../controllers/media.controller';
import categoryController from '../controllers/category.controller';
import regionController from '../controllers/region.controller';
import eventController from '../controllers/event.controller';
import ticketController from '../controllers/ticket.controller';
import bannerController from '../controllers/banner.controller';
import orderController from '../controllers/order.controller';

const router = express.Router()

router.post("/auth/register", authController.register, 
     /** 
          #swagger.tags = ['Auth']
          #swagger.requestBody = {
               required: true,
               schema: {$ref: "#/components/schemas/RegisterRequest"}
          }
     */
);
router.post("/auth/login", authController.login, 
     /** 
          #swagger.tags = ['Auth']
          #swagger.requestBody = {
               required: true,
               schema: {$ref: "#/components/schemas/LoginRequest"}
          }
     */
)
router.get("/auth/me", authMiddleware, authController.me, 
     /**
          #swagger.tags = ['Auth']
          #swagger.security = [{
               "bearerAuth": []
          }]
     */
)
router.post("/auth/activation", authController.activation,
     /** 
          #swagger.tags = ['Auth']
          #swagger.requestBody = {
               required: true,
               schema: {$ref: "#/components/schemas/ActivationRequest"}
          }
     */
)
router.put("/auth/update-profile", [authMiddleware, aclMiddleware([ROLES.MEMBER])], authController.updateProfile,
     /** 
          #swagger.tags = ['Auth']
          #swagger.security = [{
               "bearerAuth": {}
          }]
          #swagger.requestBody = {
               required: true,
               schema: {$ref: "#/components/schemas/UpdateProfileRequest"}
          }
     */
)
router.put("/auth/update-password",[authMiddleware, aclMiddleware([ROLES.MEMBER])],  authController.updatePassword
     /** 
          #swagger.tags = ['Auth']
          #swagger.security = [{
               "bearerAuth": {}
          }]
          #swagger.requestBody = {
               required: true,
               schema: {$ref: "#/components/schemas/UpdatePasswordRequest"}
          }
     */
)

// Only for testing middleware based on role
router.get(
     "/test-acl", 
     [authMiddleware, aclMiddleware([ROLES.MEMBER])],
     (req: Request, res: Response) => {
          res.status(200).json({
               data: "success",
               message: "OK"
          })
})

router.post("/category/createCategory", [authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.create, 
     /* 
          #swagger.tags = ['Category']
          #swagger.security = [{
               "bearerAuth": {}
          }]
               #swagger.requestBody = {
                    required: true,
                    schema: {
                         $ref: "#/components/schemas/CreateCategoryRequest"
                    }
               }
     */
);
router.get("/category", categoryController.findAll, 
     /* 
          #swagger.tags = ['Category']
     */
);
router.get("/category/:id", categoryController.findOne,
     /* 
          #swagger.tags = ['Category']
     */
);
router.put("/category/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.update, 
     /* 
          #swagger.tags = ['Category']
          #swagger.security = [{
               "bearerAuth": {}
          }]
          #swagger.requestBody = {
               required: true,
               schema: {
                    $ref: "#/components/schemas/CreateCategoryRequest"
               }
          }
     */
);
router.delete("/category/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.remove,
     /* 
          #swagger.tags = ['Category']
          #swagger.security = [{
               "bearerAuth": {}
          }]
     */
);

router.post("/media/upload-single", [ authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]), mediaMiddleware.single("file")], mediaController.single,
     /*
          #swagger.tags = ['Media']
          #swagger.security = [{
               "bearerAuth": {}
          }]
          #swagger.requestBody = {
               required: true,
               content: {
                    "multipart/form-data": {
                         schema: {
                              type: "object",
                              properties: {
                                   file: {
                                        type: "string",
                                        format: "binary"
                                   }
                              }
                         }
                    }
               }
          }
     */
)
router.post("/media/upload-multiple", [ authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]), mediaMiddleware.multiple("files")], mediaController.multiple,
     /* 
          #swagger.tags = ['Media']
          #swagger.security = [{
               "bearerAuth": {}
          }]
          #swagger.requestBody = {
               required: true,
               content: {
                    "multipart/form-data": {
                         schema: {
                              type: "object",
                              properties: {
                                   files: {
                                        type: "string",
                                        format: "binary"
                                   }
                              }
                         }
                    }
               }
          }
     */
)
router.delete("/media/remove", mediaController.remove, 
     /* 
          #swagger.tags = ['Media']
          #swagger.security = [{
               "bearerAuth": {}
          }]
          #swagger.requestBody = {
               required: true,
               schema: {
                    $ref: "#/components/schemas/RemoveMedia"
               }
          }
     */
)

router.get("/regions", regionController.getAllProvinces,
     /* 
          #swagger.tags = ['Region']
     */
);
router.get("/regions/:id/province", regionController.getProvince, 
     /* 
          #swagger.tags = ['Region']
     */
);
router.get("/regions/:id/regency", regionController.getRegency,
     /* 
          #swagger.tags = ['Region']
     */
);
router.get("/regions/:id/district", regionController.getDistrict,
     /* 
          #swagger.tags = ['Region']
     */
);
router.get("/regions/:id/village", regionController.getVillage,
     /* 
          #swagger.tags = ['Region']
     */
);
router.get("/regions-search", regionController.findByCity,
     /* 
          #swagger.tags = ['Region']
     */
)

router.post("/events/createEvent", [authMiddleware, aclMiddleware([ROLES.ADMIN])], eventController.create, 
     /* 
          #swagger.tags = ['Events']
          #swagger.security = [{
               "bearerAuth": {}
          }]
          #swagger.requestBody = {
               required: true,
               schema: {
                    $ref: "#/components/schemas/CreateEventRequest"
               }
          }
     */
);
router.get("/events", eventController.findAll,
     /*
     #swagger.tags = ['Events']
     #swagger.parameters['limit'] = {
          in: 'query',
          type: 'number',
          default: 10
     }
     #swagger.parameters['page'] = {
          in: 'query',
          type: 'number',
          default: 1
     }
     #swagger.parameters['category'] = {
          in: 'query',
          type: 'string'
     }
     #swagger.parameters['isOnline'] = {
          in: 'query',
          type: 'boolean'
     }
     #swagger.parameters['isPublish'] = {
          in: 'query',
          type: 'boolean'
     }
     #swagger.parameters['isFeatured'] = {
          in: 'query',
          type: 'boolean'
     }
     */
);
router.get("/events/:id", eventController.findOne,
     /* 
          #swagger.tags = ['Events']
     */
);
router.put("/events/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], eventController.update, 
     /* 
          #swagger.tags = ['Events']
          #swagger.security = [{
               "bearerAuth": {}
          }]
          #swagger.requestBody = {
               required: true,
               schema: {
                    $ref: "#/components/schemas/CreateEventRequest"
               }
          }
     */
);
router.delete("/events/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], eventController.remove,
     /* 
          #swagger.tags = ['Events']
          #swagger.security = [{
               "bearerAuth": {}
          }]
     */
);
router.get("/events/:slug/slug", eventController.findOneBySlug, 
     /* 
          #swagger.tags = ['Events']
     */
);

router.post("/tickets/createTicket", [authMiddleware, aclMiddleware([ROLES.ADMIN])], ticketController.create, 
     /* 
          #swagger.tags = ['Ticket']
          #swagger.security = [{
               "bearerAuth": {}
          }]
          #swagger.requestBody = {
               required: true,
               schema: {
                    $ref: "#/components/schemas/CreateTicketRequest"
               }
          }
     */
);
router.get("/tickets", ticketController.findAll,
     /* 
          #swagger.tags = ['Ticket']
     */
);
router.get("/tickets/:id", ticketController.findOne, 
     /* 
          #swagger.tags = ['Ticket']
     */
);
router.put("/tickets/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], ticketController.update,  
     /* 
          #swagger.tags = ['Ticket']
          #swagger.security = [{
               "bearerAuth": {}
          }]
          #swagger.requestBody = {
               required: true,
               schema: {
                    $ref: "#/components/schemas/CreateTicketRequest"
               }
          }
     */
    );
router.delete("/tickets/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], ticketController.remove,  
     /* 
          #swagger.tags = ['Ticket']
          #swagger.security = [{
               "bearerAuth": {}
          }]
     */
);
router.get("/tickets/:eventId/events", ticketController.findAllByEvent, 
     /* 
          #swagger.tags = ['Ticket']
     */
);

router.post("/banner/createBanner", [authMiddleware, aclMiddleware([ROLES.ADMIN])], bannerController.create, 
     /* 
          #swagger.tags = ['Banner']
          #swagger.security = [{
               "bearerAuth": {}
          }]
          #swagger.requestBody = {
               required: true,
               schema: {
                    $ref: "#/components/schemas/CreateBannerRequest"
               }
          }
     */
    );
router.get("/banner", bannerController.findAll, 
     /* 
          #swagger.tags = ['Banner']
     */);
router.get("/banner/:id", bannerController.findOne, 
     /* 
          #swagger.tags = ['Banner']
     */);
router.put("/banner/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], bannerController.update, 
     /* 
          #swagger.tags = ['Banner']
          #swagger.security = [{
               "bearerAuth": {}
          }]
          #swagger.requestBody = {
               required: true,
               schema: {
                    $ref: "#/components/schemas/CreateBannerRequest"
               }
          }
     */
    );
router.delete("/banner/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], bannerController.remove, 
     /* 
          #swagger.tags = ['Banner']
          #swagger.security = [{
               "bearerAuth": {}
          }]
     */
);



router.post("/orders/createOrder", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])], orderController.create, 
       /*
          #swagger.tags = ['Order']
          #swagger.security = [{
               "bearerAuth": ""
          }]
          #swagger.requestBody = {
               required: true,
               schema: {
                    $ref: "#/components/schemas/CreateOrderRequest"
               }
          }
     */
);
router.get("/orders", [authMiddleware, aclMiddleware([ROLES.ADMIN])], orderController.findAll,
     /*
          #swagger.tags = ['Order']
          #swagger.security = [{
               "bearerAuth": ""
          }]
     */
);
router.get("/orders/:orderId", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])], orderController.findOne,
    /*
          #swagger.tags = ['Order']
          #swagger.security = [{
               "bearerAuth": ""
          }]
     */
);

router.get("/orders-history", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])], orderController.findAllByMember,
    /*
          #swagger.tags = ['Order']
          #swagger.security = [{
               "bearerAuth": ""
          }]
     */
);

router.delete("/orders/:orderId", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])], orderController.remove, 
     /*
          #swagger.tags = ['Order']
          #swagger.security = [{
               "bearerAuth": ""
          }]
     */
)
router.put("/orders/:orderId/completed", [authMiddleware, aclMiddleware([ROLES.ADMIN])], orderController.complete
     /*
     #swagger.tags = ['Order']
     #swagger.security = [{
          "bearerAuth": ""
     }]
     */
);

router.put("/orders/:orderId/pending", [authMiddleware, aclMiddleware([ROLES.ADMIN])], orderController.pending, 
     /*
          #swagger.tags = ['Order']
          #swagger.security = [{
               "bearerAuth": ""
          }]
     */
)

router.put("/orders/:orderId/cancel", [authMiddleware, aclMiddleware([ROLES.ADMIN])], orderController.cancel,
     /*
          #swagger.tags = ['Order']
          #swagger.security = [{
               "bearerAuth": ""
          }]
     */
)

export default router