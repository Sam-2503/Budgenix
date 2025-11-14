import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';


// User interface and schema
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  income: number;
  categories?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}


//Define User Schema
const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    categories: { type: [String], default: [] },
    income: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// Hash password only when modified
UserSchema.pre<IUser>('save', async function comparePassword(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {

  return bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUser>('User', UserSchema);
export default User;
