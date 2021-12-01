const Movie = require("../models/Movie");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getAllMovies = async (req, res, next) => {
  let { title, rating, releasedSort, titleSort, skip } = req.query;
  if (title) title = parseInt(title);
  if (rating) rating = parseInt(rating);
  if (releasedSort) releasedSort = parseInt(releasedSort);
  if (titleSort) titleSort = parseInt(titleSort);
  if (skip) skip = parseInt(skip);

  let movies;
  try {
    if (rating) {
      // title, rating, releasedSort, titleSort, skip
      movies = await Movie.searchEngine(
        title,
        rating,
        releasedSort,
        titleSort,
        skip
      );
    } else {
      movies = await Movie.find({}).limit(10);
    }
    res.status(StatusCodes.OK).json({ movies });
  } catch (err) {
    next(err);
  }
};

const getSingleMovie = async (req, res, next) => {
  const { id: movieId } = req.params;
  try {
    const movie = await Movie.findOne({ _id: movieId });

    if (!movie) {
      throw new CustomError.NotFoundError(`No movie with id : ${movieId}`);
    }

    res.status(StatusCodes.OK).json({ movie });
  } catch (err) {
    next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(StatusCodes.OK).json({ movie });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllMovies,
  getSingleMovie,
  createMovie,
};

/*
  treba sortirati po 
  tekstu
  Najnoviji, Najstariji, po Abecedi, po broju glasova
  oceni
  Zandrovi
*/
