const express = require("express");
const router = express.Router();
const {
  createActor,
  getAllActors,
  getSingleActor,
} = require("../controllers/actorCotroller");
const { authenticateUser } = require("../middleware/authentication");

router.route("/").get(getAllActors);
//router.route("/").post(authenticateUser, createActor);
router.route("/:id").get(getSingleActor);

module.exports = router;
