const express = require("express");
const router = express.Router();

const { getAllMovies, getSingleMovie, createMovie } = require("../controllers/movieController");

const { getSingleMovieComments } = require("../controllers/commentController");

router.route("/").get(getAllMovies);
//router.route("/").post(createMovie);

router.route("/:id").get(getSingleMovie);

router.route("/:id/comments").get(getSingleMovieComments);

module.exports = router;
