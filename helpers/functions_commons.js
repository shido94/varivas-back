const cons = require("../config/web_string");

/**
 * @name: queryError
 * @description: This module is used to send the `query error` response for any action back to the client.
 * @param {object} request
 * @param {object} data this is data that can be send to back to the client with the response.
 * @returns {object} res.json() function. Which is used to send the encrypted response to the client side.
 */
exports.queryError = function (res, data = {}, message = '') {
  return res.json({
      error_code: cons.query_err_format,
      error_string: message ? message : cons.query_err_format_msg,
      result: data
  });
};

/**
 * @name: authError
 * @description: This module is used to send the `authentication error` response for any action back to the client.
 * @param {object} request
 * @param {object} data this is data that can be send to back to the client with the response.
 * @returns {object} res.json() function. Which is used to send the encrypted response to the client side.
 */
exports.authError = function (res, data = []) {
  return res.json({
      error_code: cons.unauthorize,
      error_string: cons.unauthorize_msg,
  });
};

exports.validation = function (res, code, message){
  return res.json({
    error_code: code,
    error_string: message
  });
}

/**
 * @name: actionSuccess
 * @description: This module is used to send the `success` response for any action back to the client.
 * @param {object} request
 * @param {object} data this is data that can be send to back to the client with the response.
 * @returns {object} res.json() function. Which is used to send the encrypted response to the client side.
 */
exports.actionSuccess = function (res, data = [], message) {
  return res.json({
      error_code: cons.success,
      error_string: message ? message : cons.success_msg,
      result: data
    }
  );
};

/**
 * @name: alreadyError
 * @description: This module is used to send the `query error` response for any action back to the client.
 * @param {object} request
 * @param {object} data this is data that can be send to back to the client with the response.
 * @returns {object} res.json() fucntion. Which is used to send the encrypted response to the client side.
 */
exports.alreadyExistError = function (res, data = []) {
  return res.json({
      error_code: cons.already_exists_code,
      error_string: cons.already_exists_msg,
      //result: data
  });
};

/**
 * @name: paramMissingError
 * @description: This module is used to send the `parameter missing error` response for any action back to the client.
 * @param {object} request
 * @param {object} data this is data that can be send to back to the client with the response.
 * @returns {object} functions.res_json() function. Which is used to send the encrypted response to the client side.
 */
 exports.paramMissingError = function (res, data = []) {
  return res.json({
      error_code: cons.param_missing,
      error_string: cons.param_missing_msg,
  });
};
