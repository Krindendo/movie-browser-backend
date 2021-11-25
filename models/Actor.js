const mongoose = require("mongoose");

const ActorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      maxlength: 50,
      minlength: 3,
    },
    professions: {
      type: Array,
      required: [true, "Please provide professions"],
    },
    movies: {
      type: Array,
      required: [true, "Please provide movie"],
    },
    born_date: {
      type: Date,
      required: [true, "Please provide born_date"],
    },
    biography: {
      type: String,
      required: [true, "Please provide biography"],
    },
    image: {
      type: String,
      required: [true, "Please provide image"],
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Actor", ActorSchema);
