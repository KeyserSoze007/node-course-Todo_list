var express=require('express');
var bodyParser=require('body-parser');


var {mongoose}= require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app=express();

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});


app.get('/todos', (req,res) => {
    Todo.find().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.listen(3000,() => {
    console.log('Server started on Port 3000');
});

module.exports= {app};


/*var newUser=new User({
    email: '  satam.fiem@gmail.com '
});

newUser.save().then((doc) => {
    console.log(doc);
}, (err) => {
    console.log('Cannot show the document', err);
});*/

/*

var newTodo = new Todo({
    text: 'Complete Dinner',
    completed: true,
    completedAt: 13.01
});

newTodo.save().then((doc) => {
    console.log(doc);
}, (err) => {
    console.log('Cannot show the Todo',err);
});*/