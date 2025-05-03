import mongoose, { Schema } from "mongoose";
import * as Yup from 'yup';

export const categoryDTO = Yup.object({
     name: Yup.string().required(),
     description: Yup.string().required(),
     icon: Yup.string().required()
})

export const CATEGORY_MODEL_NAME = "Category"

export type Category = Yup.InferType<typeof categoryDTO>

const CategorySchema = new Schema<Category>({
     name: {
          type: Schema.Types.String,
          required: true
     },
     description: {
          type: Schema.Types.String,
          required: true
     },
     icon: {
          type: Schema.Types.String,
          required: true
     }
}, {
     timestamps: true, versionKey: false
})

const categoryModel = mongoose.model(CATEGORY_MODEL_NAME, CategorySchema)

export default categoryModel
