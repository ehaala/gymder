'use strict';
module.exports = (sequelize, DataTypes) => {
  var schedule = sequelize.define('schedule', {
    day: DataTypes.STRING,
    time: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return schedule;
};