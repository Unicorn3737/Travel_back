const { Schema, model } = require("mongoose");
const driveSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  days: {
    type: String,
    required: true,
  },
  transport: {
    type: Boolean,
    required: [true, "is the drive completed is required"],
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId, //this is the _id of a user
    ref: "User",
    required: true,
  },
});

const DriveModel = model("Drive", driveSchema);
module.exports = DriveModel;
