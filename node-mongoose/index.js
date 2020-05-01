const mongoose = require('mongoose');

const Dishes = require('./models/dishes')
const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(url);
connect.then((db) => {
    console.log('Connection set up.... !!');
    //var newDishes = Dishes({
    Dishes.create({  
    name: 'Mansi',
        description: 'Hello here'
    })
    //newDishes.save()
        .then((dish) => {
            console.log("Dish Data...");
            console.log(dish);
            return Dishes.findByIdAndUpdate(dish._id, {
                $set : { description: 'Updated test '}
            },{
             new : true
            }).exec();
        })
        .then((dish) => {
            console.log('push data to dish..')
            console.log(dish);
            dish.comments.push({
                rating: 5,
                comment: 'I\'m getting a sinking feeling!',
                author: 'Yash'
            });
            return dish.save();
        }).then((dish) => {
            console.log('dish to remove')
            console.log(dish)
            return Dishes.remove();
        })
        // .then((dishes) => {
        //     console.log("Dishes Data...");
        //     console.log(dishes);
        //     return Dishes.remove();
        // })
        .then(() => {
            console.log("Connection close...");
            return mongoose.connection.close();
        }).catch((err) => {
            console.log(err)})
       
}) .catch((err) => {
    console.log(err);
});