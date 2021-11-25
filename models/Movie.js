const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    genres: {
      type: Array,
      required: [true, "Please provide genres"],
    },
    actors: {
      type: Array,
      required: [true, "Please provide actors"],
    },
    title: {
      type: String,
      required: [true, "Please provide title"],
    },
    fullplot: {
      type: String,
      required: [true, "Please provide fullplot"],
    },
    released: {
      type: Date,
      required: [true, "Please provide released"],
    },
    directors: {
      type: Array,
      required: [true, "Please provide directors"],
    },
    lastupdated: {
      type: Date,
      required: [true, "Please provide date"],
    },
    year: {
      type: Number,
      required: [true, "Please provide year"],
    },
    imdb: {
      type: Object,
      required: [true, "Please provide imdb"],
    },
  },
  { versionKey: false }
);

MovieSchema.statics.searchEngine = async function (title) {
  const result = await this.aggregate([
    {
      $search: {
        index: "default",
        text: {
          query: title,
          path: "title",
        },
      },
    },
    {
      $project: {
        title: 1,
        year: 1,
        fullplot: 1,
        _id: 1,
        score: {
          $meta: "searchScore",
        },
        highlight: {
          $meta: "searchHighlights",
        },
      },
    },
    {
      $limit: 10,
    },
  ]);

  try {
    await this.model("Movie").find({ title: title });
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoose.model("Movie", MovieSchema);
