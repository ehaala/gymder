'use strict';
module.exports = (sequelize, DataTypes) => {
  var review = sequelize.define('review', {
    content: DataTypes.STRING,
    name: DataTypes.STRING,
    gymId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.review.belongsTo(models.gym);
      }
    }
  });
  return review;
};