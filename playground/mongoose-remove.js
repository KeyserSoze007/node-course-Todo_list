const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const {User} = require('./../server/models/user');

/*Todo.remove({}).then((result) => {
    console.log(result);
});

Todo.findOneAndRemove
Todo.findByIdAndRemove*/

Todo.findByIdAndRemove('5a05311098805412a441124f').then((todo) => {
    console.log(todo);
});