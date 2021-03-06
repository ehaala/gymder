'use strict';
module.exports = (sequelize, DataTypes) => {
  var gym = sequelize.define('gym', {
    name: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.gym.belongsToMany(models.user, {through: "usersGyms"});
        models.gym.hasMany(models.review);
      }
    }
  });
  return gym;
};