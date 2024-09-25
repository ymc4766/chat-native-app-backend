import { hash, compare, genSalt } from "bcrypt";
import { Document, model, Schema } from "mongoose";

interface AuthVerificationDocument extends Document {
  owner: Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const verificationSchema = new Schema<AuthVerificationDocument, {}, Methods>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 86400,
    default: Date.now(),
  },
});

verificationSchema.pre("save", async function (next) {
  if (!this.isModified("token")) {
    next();
  }

  const salt = await genSalt(10);

  this.token = await hash(this.token, salt);
});

verificationSchema.methods.compareToken = async function (token) {
  return await compare(token, this.token);
};

const AuthVerificationModalToken = model(
  "AuthVerificationToken",
  verificationSchema
);
export default AuthVerificationModalToken;
