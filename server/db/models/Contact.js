import mongoose from "mongoose";
import { EMAIL_REGEX, PHONE_REGEX } from "../../utils/validation.js";
import baseSchema from "../schemas/base.schema.js";

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return !v || EMAIL_REGEX.test(v); // Allow empty/null, but validate if present
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return !v || PHONE_REGEX.test(v); // Allow empty/null, but validate if present
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  company: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Lead", "Prospect", "Customer"],
    default: "Lead",
  },
  notes: {
    type: String,
  },
  ...baseSchema,
});

const Contact = mongoose.model("Contact", ContactSchema);

export default Contact;
