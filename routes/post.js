const express = require("express");
const router = express.Router();
const passport = require("passport");
const function_c = require('../helpers/functions_commons');
const validationModule = require('../helpers/validation');
const jwt = require('../helpers/auth1');
const ObjectId = require('mongoose').Types.ObjectId;

// POST: Add post
router.post("/", jwt.checkAuth, async (req, res) => {
  try {
    const status = validationModule.validateRequestBody(req, res, ['title', 'description']);
    Logger.info("status" + status);
    if (!status) {
      return function_c.paramMissingError(res);
    }
    const body = req.body;

    const post = domain.Post();
    post.title = body.title;
    post.description = body.description;
    post.userId = req.user.id;

    await post.save();
    return function_c.actionSuccess(res, post);

  } catch (error) {
    Logger.error('Error on adding post: ', error);
    return function_c.queryError(res, 'Error on adding post');
  }
});

router.get('/', async (req, res) => {
  try {

    const posts = await domain.Post.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      }
    ]);

    return function_c.actionSuccess(res, posts);

  } catch (error) {
    Logger.error('Error on getting post: ', error);
    return function_c.queryError(res, error);
  }
});

router.get('/my', jwt.checkAuth, async (req, res) => {
  try {

    const posts = await domain.Post.aggregate([
      {
        $match: {
          userId: ObjectId(req.user.id)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      }
    ]);

    return function_c.actionSuccess(res, posts);

  } catch (error) {
    Logger.error('Error on getting post: ', error);
    return function_c.queryError(res, error);
  }
});

router.get('/:postId', jwt.checkAuth, async (req, res) => {
  try {

    let post = await domain.Post.aggregate([
      {
        $match: {
          _id: ObjectId(req.params.postId)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      }
    ]);

    post = post.length ? post[0]: {}

    const follows = await domain.Follower.findOne({userId: req.user.id, followUserId: ObjectId(post.user._id)});

    return function_c.actionSuccess(res, {post , follows});

  } catch (error) {
    Logger.error('Error on getting post details: ', error);
    return function_c.queryError(res, error);
  }
});

module.exports = router;
