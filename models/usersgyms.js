'use strict';
module.exports = (sequelize, DataTypes) => {
  var usersGyms = sequelize.define('usersGyms', {
    userId: DataTypes.INTEGER,
    gymId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return usersGyms;
};