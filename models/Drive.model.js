const { Schema, model } = require("mongoose");
const driveSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  transport: {
    type: Boolean,
    required: [true, "is the drive completed is required"],
  },
  owner: {
    type: Schema.Types.ObjectId, //this is the _id of a user
    ref: "User",
    required: true,
  },
});

const DriveModel = model("Drive", driveSchema);
module.exports = DriveModel;
