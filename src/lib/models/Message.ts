import { Schema, model, models, InferSchemaType } from 'mongoose';

const MessageSchema = new Schema({
  platform: { type: String, enum: ['google','linkedin'], required: true },
  account_id: { type: String }, // Unipile account id (emails)
  message_id: { type: String, required: true, unique: true }, // Unipile message id OR Unipile email id
  provider_message_id: { type: String }, // e.g., Gmail provider message id for reply_to
  chat_id: { type: String }, // LinkedIn chat id
  email_id: { type: String }, // Unipile email id
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String },
  text: { type: String },
  created_at: { type: Date, default: Date.now },
}, { timestamps: true });

export type MessageType = InferSchemaType<typeof MessageSchema>;
export default models.Message || model('Message', MessageSchema);
