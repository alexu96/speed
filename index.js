const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const express = require('express');
const bodyParser = require('body-parser');
const { STRING } = require('sequelize');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sequelize = new Sequelize('user', 'root', 'root', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

sequelize.authenticate().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err)
})

const users = sequelize.define('restaurant', {
    restaurant_id: {
        primaryKey: true,
        type: Sequelize.UUID,
    },
    restaurnt_name: Sequelize.STRING,
    address: Sequelize.STRING,
    vegOnly:Sequelize.BOOLEAN,
    cost:Sequelize.STRING,
    isOpen:Sequelize.BOOLEAN,
    cusineTypes: { 
        type: Sequelize.STRING, 
        default:[],
        get: function() {
            return JSON.parse(this.getDataValue('cusineTypes'));
        }, 
        set: function(val) {
            return this.setDataValue('cusineTypes', JSON.stringify(val));
        }
    }
});

users.sync().then((data) => {
}).catch((err)=>{
    console.log(err)
});

users.sync().then((data) => {
}).catch((err)=>{
    console.log(err)

});


app.post('/addrows', async (req, res) => {
    await users.create({restaurant_id:req.body.restaurant_id,restaurnt_name:req.body.restaurnt_name,address:req.body.address,vegOnly:req.body.vegOnly,cost:req.body.cost,isOpen:req.body.isOpen,cusineTypes:req.body.cusineTypes});
    res.send("inserted data");
})


  //Get all veg restaurant
app.get('/VegRestaurt', (req, res) => {
    users.findAll({
        where: {
            vegOnly:true
        }, 
    }).then(function (data) {
        res.send(data)
    })
  })

  //Get all veg restaurant that have low cost
  app.get('/VegLowCost', async(req, res) => {
    await users.findAll({
        where:{
            cost:"low"
        }
    }).then((data)=>{
        res.send(data)
    })
  })


  //Get all veg restaurant that have low cost and have cuisines “french”
  app.get('/VegLowFrench', async (req, res) => {
    await sequelize.query(`SELECT * FROM restaurants WHERE cost = "low" AND cusineTypes LIKE  '%french\%'`).then((data)=>{
        res.send(data)
    })
  })


//Get all restaurant that have (high or low) cost and have cuisines “french” or “italian”
app.get('/Resturant', async(req, res) => {
    await sequelize.query(`SELECT * FROM restaurants WHERE (cost = "high" OR "low") AND (cusineTypes LIKE '%"french"%') OR (cusineTypes LIKE '%"italian"%')`).then((data)=>{
        res.send(data)
    })
    
  })


  //Get all restaurant that have (high or low) cost and have cuisines “french” and “italian”
app.get('/VegDetails', async (req, res) => {
    await sequelize.query(`SELECT * FROM restaurants WHERE (cost = "high" OR "low") AND (cusineTypes LIKE '%"french"%') AND (cusineTypes LIKE '%"italian"%')`).then((data)=>{
        res.send(data)
    })
  })

app.get("/",(req,res)=>{
    res.send("hi")
})

app.listen(3000, function () {
    console.log('Express server is listening on port 8000');
});