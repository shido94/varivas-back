const express = require("express");
const router = express.Router();
const passport = require("passport");
const function_c = require('../helpers/functions_commons');
const jwt = require('../helpers/auth1');
const ObjectId = require('mongoose').Types.ObjectId;

// Handle the facebook sign-in
router.get('/auth/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }));

router.get( '/auth/google/callback',passport.authenticate( 'google', {
        successRedirect: '/user/login/success',
        failureRedirect: '/user/login/error'
}));

router.get('/login/error', function (req, res) {
  Logger.error('Error on social login');
  return function_c.queryError(res);
});

router.get('/login/success', function (req, res) {
  // Generate token from userId
  const token = jwt.createToken(req.user._id);
  return res.redirect(`${process.env.UI_URL}/user/${token}`);
});

router.post('/token/validate', jwt.validateToken, async function (req, res) {
  const user = await domain.User.findById(req.user.id, 'email name image');
  const output = {
    token: req.body.token,
    user: user
  }

  return function_c.actionSuccess(res, output);
});

// GET: display user's profile
router.get("/profile", jwt.checkAuth, async (req, res) => {
  try {

    const user = await domain.User.findById(req.user.id);
    return function_c.actionSuccess(res, user);

  } catch (error) {
    Logger.error('Error on get profiles: ', error);
    return function_c.queryError(res, error);
  }
});

// POST: Follow user
router.post("/follow/:id", jwt.checkAuth, async (req, res) => {
  try {
    const followUserId = req.params.id;

    const status = await domain.Follower.findOne({userId: req.user.id, followUserId: req.params.id})

    let follows = {}
    // If found, Unfollow the user
    if (status) {
      await domain.Follower.findOneAndRemove({
        userId: req.user.id, followUserId: req.params.id
      });
    } else {
      // Otherwise add new User
      const followUser = domain.Follower();
      followUser.userId = req.user.id;
      followUser.followUserId = ObjectId(followUserId);
      await followUser.save();
      follows = followUser;
    }
    return function_c.actionSuccess(res, follows);

  } catch (error) {
    Logger.error('Error on social login ');
    return function_c.queryError(res, error);
  }
});

router.get('/follows/:id', async (req, res) => {
  try {

    const follows = await domain.Follower.findOne({followUserId: ObjectId(req.params.id)});
    return function_c.actionSuccess(res, follows);

  } catch (error) {
    Logger.error('Error on get follows details');
    return function_c.queryError(res, error);
  }
})

// GET: Followers user
router.get("/followers", jwt.checkAuth, async (req, res) => {
  try {

    const followers = await domain.Follower.aggregate([
      {
        $match: {
          followUserId: ObjectId(req.user.id)
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
    ])
    return function_c.actionSuccess(res, followers);

  } catch (error) {
    Logger.error('Error on social login ');
    return function_c.queryError(res, error);
  }
});

// GET: User follows List
router.get("/follows", jwt.checkAuth, async (req, res) => {
  try {

    const followers = await domain.Follower.aggregate([
      {
        $match: {
          userId: ObjectId(req.user.id)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'followUserId',
          foreignField: '_id',
          as: 'follows'
        }
      },
      {
        $unwind: '$follows'
      }
    ])
    return function_c.actionSuccess(res, followers);

  } catch (error) {
    Logger.error('Error on follows list: ', error);
    return function_c.queryError(res, error);
  }
});

module.exports = router;
