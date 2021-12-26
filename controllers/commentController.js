const Comment = require("../models/Comment");
const Movie = require("../models/Movie");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createComment = async (req, res, next) => {
  const { movie_id: movieId, text } = req.body;
  const { name, userId } = req.user;
  req.body.user_id = userId;
  req.body.name = name;

  if (!movieId || !text) {
    throw new CustomError.BadRequestError("Please provide movieId and comment");
  }

  try {
    const isValidMovie = await Movie.findOne({ _id: movieId });

    if (!isValidMovie) {
      throw new CustomError.NotFoundError(`No movie with id : ${movieId}`);
    }

    const alreadySubmitted = await Comment.findOne({
      movie_id: movieId,
      user_id: userId
    });
    if (alreadySubmitted) {
      throw new CustomError.BadRequestError("Already submitted comment for this movie");
    }

    const comment = await Comment.create(req.body);
    res.status(StatusCodes.CREATED).json({ comment });
  } catch (err) {
    next(err);
  }
};
const updateComment = async (req, res, next) => {
  const { id: commentId } = req.params;

  try {
    const comment = await Comment.findOne({ _id: commentId });

    if (!comment) {
      throw new CustomError.NotFoundError(`No comment with id ${commentId}`);
    }

    checkPermissions(req.user.userId, comment.user_id.toString());
    comment.text = req.body.text;
    await comment.save();
    res.status(StatusCodes.OK).json({ comment });
  } catch (err) {
    next(err);
  }
};
const deleteComment = async (req, res, next) => {
  const { id: commentId } = req.params;
  try {
    const comment = await Comment.findOne({ _id: commentId });

    if (!comment) {
      throw new CustomError.NotFoundError(`No comment with id ${commentId}`);
    }
    checkPermissions(req.user.userId, comment.user_id.toString());
    await comment.remove();
    res.status(StatusCodes.OK).json({ msg: "Success! Comment removed" });
  } catch (err) {
    next(err);
  }
};

const getSingleComment = async (req, res, next) => {
  const { id: commentId } = req.params;
  try {
    const comment = await Comment.findOne({ _id: commentId });

    if (!comment) {
      throw new CustomError.NotFoundError(`No comment with id ${commentId}`);
    }

    res.status(StatusCodes.OK).json({ comment });
  } catch (err) {
    next(err);
  }
};

const getSingleMovieComments = async (req, res, next) => {
  const { id: movieId } = req.params;
  try {
    const comments = await Comment.find({ movie_id: movieId });
    res.status(StatusCodes.OK).json({ comments });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getSingleComment,
  getSingleMovieComments
};
