const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
   'google_auth',
   'root',
   'root',
   {
      host: 'localhost',
      dialect: 'mysql'
   }
);



(async function (params) {

   try {
      await sequelize.authenticate()
      console.log('Connection has been established successfully.');

   } catch (error) {
      console.error('Unable to connect to the database: ', error);

   }
})()


const User = sequelize.define("google_user", {
   username: DataTypes.TEXT,
   googleid: DataTypes.TEXT,
});

(async function () {
   try{
      await sequelize.sync();
      console.log('table created');
   }catch(err){
       console.log(err);
       console.log('error occured');
   }
})();


exports.User = User;


