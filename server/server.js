var express=require('express');
var bodyParser=require('body-parser');


var {mongoose}= require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');


var app=express();
const port= process.env.PORT||3000;

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


app.get('/todos/:id', (req,res) => {
    var id= req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id).then((todos) => {
        if(!todos){
           return res.status(404).send({});
        }
        //console.log(JSON.stringify(todos,undefined,2));
        res.send(todos);
    }, (err) => {
        res.status(400).send(err);
    });
});


app.listen(port,() => {
    console.log(`Server started on Port {port}`);
});

module.exports= {app};


/*var newUser=new User({
    email: '  satam.fiem@gmail.com '
});

newUser.save().then((doc) => {
    console.log(doc);
}, (err) => {
    console.log('Cannot show the document', err);
});
*/
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