const mongoose = require("mongoose");
const validator = require("validator");

const CommentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      maxlength: 50,
      minlength: 3
    },
    // email: {
    //   type: String,
    //   required: [true, "Please provide email"],
    //   validate: {
    //     validator: validator.isEmail,
    //     message: "Please provide valid email",
    //   },
    // },
    movie_id: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Please provide movie id"]
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Please provide user id"]
    },
    text: {
      type: String,
      required: [true, "Please provide comment"],
      maxlength: 300,
      minlength: 3
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false }
);
CommentSchema.index({ movie_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model("Comment", CommentSchema);
