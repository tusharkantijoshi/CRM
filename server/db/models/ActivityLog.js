import mongoose from "mongoose";
import baseSchema from "../schemas/base.schema.js";

const ActivityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ["create", "update", "delete"],
    required: true,
  },
  entity: {
    type: String,
    required: true,
  },
  entity_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  details: {
    type: Object,
    default: {},
  },
  ...baseSchema,
});

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);

export default ActivityLog;
