const mongoose = require("mongoose");
const validator = require("validator");

const CommentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      maxlength: 50,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    movie_id: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Please provide movie id"],
    },
    text: {
      type: String,
      required: [true, "Please provide comment"],
      maxlength: 300,
      minlength: 3,
    },
    date: {
      type: Date,
      required: [true, "Please provide date"],
    },
  },
  { versionKey: false }
);
CommentSchema.index({ movie: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Comment", CommentSchema);
