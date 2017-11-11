const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const {User} = require('./../server/models/user');

var id='5a0365ee5a2b490a345e663f';

/*if(!ObjectID.isValid(id)){
    console.log('ID not valid');
}

Todo.find({
    _id:id
}).then((todos) => {
    console.log(todos);
});

Todo.findOne({
    _id:id
}).then((todos) => {
    console.log(todos);
});


Todo.findById(id).then((todos) => {
    if(!todos){
       return console.log('ID not found');
    }

    console.log(todos);
}).catch((e) => console.log(e));*/

User.findById(id).then((users) => {
    if(!users){
        return console.log('User not found');
    }
    console.log('The user details are:', users);
}).catch((err) => console.log(err));