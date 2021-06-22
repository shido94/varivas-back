/**
 * Add domain name of all models to the global object as an object named "domain"
 */


const domain = {};
domain.User = require("../models/user");
domain.Post = require("../models/post");
domain.Follower = require("../models/follower");

module.exports = domain