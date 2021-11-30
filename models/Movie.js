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

MovieSchema.statics.searchEngine = async function (title, rating, released) {
  //asc, desc
  if (released === "desc") {
    released = -1;
  } else {
    released = 1;
  }
  const titleSearch = {
    $match: {
      title: { $regex: title, $options: "i" },
    },
  };

  const orderByRating = {
    $match: {
      "imdb.rating": {
        $gte: rating,
      },
    },
  };

  const orderByTitle = {
    $sort: {
      title: released,
    },
  };

  const orderByReleased = {
    $sort: {
      released: released,
    },
  };
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
      $limit: 5,
    },
  ]);

  try {
    await this.model("Movie").find(result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoose.model("Movie", MovieSchema);

// [
//   [
//     {
//       $search: {
//         index: "default",
//         text: {
//           query: "te",
//           path: "title",
//         },
//       },
//     },
//     {
//       $match: {
//         "imdb.rating": {
//           $gte: 8,
//         },
//       },
//     },
//     {
//       $sort: {
//         title: -1,
//       },
//     },
//     {
//       $sort: {
//         released: -1,
//       },
//     },
//     {
//       $project: {
//         title: 1,
//         year: 1,
//         fullplot: 1,
//         _id: 1,
//         score: {
//           $meta: "searchScore",
//         },
//         highlight: {
//           $meta: "searchHighlights",
//         },
//       },
//     },
//     {
//       $skip: 0,
//     },
//     {
//       $limit: 10,
//     },
//   ],
// ];
