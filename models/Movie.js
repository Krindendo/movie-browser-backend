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

MovieSchema.statics.searchEngine = async function (
  title,
  rating,
  releasedSort,
  titleSort,
  skip
) {
  if (releasedSort === "desc") releasedSort = -1;
  else if (releasedSort === "asc") releasedSort = 1;

  if (titleSort === "desc") titleSort = -1;
  else if (titleSort === "asc") titleSort = 1;

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
      title: titleSort,
    },
  };
  const orderByReleased = {
    $sort: {
      released: releasedSort,
    },
  };
  const project = {
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
  };
  const howMuchToSkip = {
    $skip: skip,
  };
  const limit = {
    $limit: 10,
  };

  const content = [];
  if (title) content.push(titleSearch);
  if (rating) content.push(orderByRating);
  if (titleSort) content.push(orderByTitle);
  if (releasedSort) content.push(orderByReleased);
  if (skip) content.push(howMuchToSkip);
  content.push(project);
  content.push(limit);

  console.log("title", typeof title, title);
  console.log("rating", typeof rating, rating);
  console.log("releasedSort", typeof releasedSort, releasedSort);
  console.log("titleSort", typeof titleSort, titleSort);
  console.log("skip", typeof skip, skip);
  console.log("content", content);

  const result = await this.aggregate(content);

  try {
    await this.model("Movie").find({ result });
  } catch (error) {
    console.log("aggregate error", error);
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
