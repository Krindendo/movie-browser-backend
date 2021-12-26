const Actor = require("../models/Actor");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createActor = async (req, res, next) => {
  const { name } = req.body;
  try {
    const isActorExists = await Actor.findOne({ name: name });
    if (isActorExists) {
      throw new CustomError.NotFoundError(`Actor already exist : ${name}`);
    }

    const actor = await Actor.create(req.body);
    res.status(StatusCodes.CREATED).json({ actor });
  } catch (err) {
    next(err);
  }
};

const getAllActors = async (req, res, next) => {
  try {
    const actors = await Actor.find({}).limit(10);
    res.status(StatusCodes.OK).json({ actors });
  } catch (err) {
    next(err);
  }
};

const getSingleActor = async (req, res, next) => {
  const { id: actorId } = req.params;
  try {
    const actor = await Actor.findOne({ _id: actorId });
    res.status(StatusCodes.OK).json({ actor });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createActor,
  getAllActors,
  getSingleActor
};
