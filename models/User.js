import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  phone: { type: String, unique: true },
  chatId: { type: String, unique: true, sparse: true },
});

export default mongoose.model("User", UserSchema);
