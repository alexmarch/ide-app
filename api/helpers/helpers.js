// Generated by CoffeeScript 1.7.1
(function() {
  var helpers;

  helpers = function(app) {
    return function(req, res, next) {
      app.locals.is_auth_user = function() {
        return true;
      };
      next();
    };
  };

  module.exports = helpers;

}).call(this);

//# sourceMappingURL=helpers.map