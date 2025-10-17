import { Schema, model, models, InferSchemaType } from 'mongoose';

const AccountSchema = new Schema({
  platform: { type: String, enum: ['google','linkedin'], required: true },
  unipile_account_id: { type: String, required: true, unique: true },
  label: { type: String },
  email: { type: String },
  linkedin_profile: { type: String },
  user_name: { type: String }, // from Hosted Auth notify name param if you use it
}, { timestamps: true });

export type AccountType = InferSchemaType<typeof AccountSchema>;
export default models.Account || model('Account', AccountSchema);
