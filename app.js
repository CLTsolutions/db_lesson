require('dotenv').config()

const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
  process.env.DB_DBNAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
)

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
  },
})

/*=============
* ONE TO ONE *
==============*/
const Profile = sequelize.define('Profile', {
  birthday: {
    type: DataTypes.DATE,
  },
})

// User.hasOne(Profile)
User.hasOne(Profile, {
  onDelete: 'CASCADE',
})
Profile.belongsTo(User)

/*=============
* ONE TO MANY *
==============*/
const Order = sequelize.define('Order', {
  shipDate: {
    type: DataTypes.DATE,
  },
})

User.hasMany(Order)
Order.belongsTo(User)

/*=============
* MANY TO MANY *
==============*/
const Class = sequelize.define('Class', {
  className: {
    type: DataTypes.STRING,
  },
  stateDate: {
    type: DataTypes.DATE,
  },
})

User.belongsToMany(Class, { through: 'Users_Classes' })
Class.belongsToMany(User, { through: 'Users_Classes' })

// iife - semicolon or else won't work
;(async () => {
  //   try {
  //     await sequelize.authenticate()
  //     console.log('Connection has been established successfully')
  //   } catch (err) {
  //     console.log('Unable to connect to the db:', err)
  //   }
  await sequelize.sync({ force: true })

  let myUser = await User.create({ username: 'Chelsey' })
  let myProfile = await Profile.create({ birthday: new Date() })
  console.log(await myUser.getProfile())
  await myUser.setProfile(myProfile)
  console.log(await myUser.getProfile())

  let resultsUser = await User.findOne({
    where: {
      id: 1,
    },
  })
  console.log(resultsUser.getProfile())
})()
