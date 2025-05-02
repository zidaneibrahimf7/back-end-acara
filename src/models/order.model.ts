import mongoose, { ObjectId } from "mongoose";
import * as Yup from 'yup'
import { USER_MODEL_NAME } from "./user.model";
import { TICKET_MODEL_NAME } from "./ticket.model";
import { EVENT_MODEL_NAME } from "./event.model";
import { getId } from "../utils/id";
import payments, {TypeResponseMidtrans} from "../utils/payments";

const Schema = mongoose.Schema

export const ORDER_MODEL_NAME = "Order"

export const orderDAO = Yup.object({
     createdBy: Yup.string().required(),
     events: Yup.string().required(),
     ticket: Yup.string().required(),
     quantity: Yup.number().required()
});

export type TypeOrder = Yup.InferType<typeof orderDAO>

export enum OrderStatus {
     PENDING = "pending",
     COMPLETED = "completed",
     CANCEL = "cancel"
}

export type TypeVoucher = {
     voucherId: string;
     isPrint: boolean;
}

export interface Order extends Omit<TypeOrder, "createdBy" | "events" | "ticket" > {
     total: number;
     status: string;
     payment: TypeResponseMidtrans;
     createdBy: ObjectId;
     events: ObjectId;
     orderId: string;
     ticket: ObjectId;
     quantity: number;
     vouchers: TypeVoucher[]
}

const OrderSchema = new Schema<Order>({
     orderId: {
          type: Schema.Types.String,
     },
     createdBy: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: USER_MODEL_NAME
     },
     events: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: EVENT_MODEL_NAME
     },
     total: {
          type: Schema.Types.Number,
          required: true
     },
     payment: {
          type: {
               token: {
                    type: Schema.Types.String,
                    required: true
               },
               redirect_url: {
                    type: Schema.Types.String,
                    required: true
               }
          }
     },
     status: {
          type: Schema.Types.String,
          enum: [OrderStatus.PENDING, OrderStatus.COMPLETED, OrderStatus.CANCEL],
          default: OrderStatus.PENDING
     },
     ticket: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: TICKET_MODEL_NAME
     },
     quantity: {
          type: Schema.Types.Number,
          required: true
     },
     vouchers: {
          type: [{
               voucherId: {
                    type: Schema.Types.String,
                    required: true
               },
               isPrint: {
                    type: Schema.Types.Boolean,
                    required: true
               }
          }]
     }
}, {timestamps: true, versionKey: false}).index({ orderId: "text"})

OrderSchema.pre("save", async function(){
     const order = this
     order.orderId = getId()
     order.payment = await payments.createLink({
          transaction_details: {
               gross_amount: order.total,
               order_id: order.orderId
          }
     })
})

const OrderModel = mongoose.model(ORDER_MODEL_NAME, OrderSchema)

export default OrderModel