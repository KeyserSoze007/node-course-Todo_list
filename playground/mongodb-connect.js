const MongoClient= require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
    if(err){
        return console.log('Unable to connect to the server');
    }
    console.log('Connected to the server');

    db.collection('Users').find({name:'Andrew'}).toArray().then((user) => {
        console.log(JSON.stringify(user,undefined,2));
    }, (err) => {
        console.log('Unable to fetch data', err);
    });

    db.collection('Users').find().count().then((count) => {
        console.log(count);
    }, (err) => {
        console.log('Cannot get the count', err);
    });
    /*db.collection('Users').insertOne({
        name:'Satam',
        age:25,
        location:'India'
    }, (err,result) => {
        if(err){
            return console.log("An error occured:", err);
        }
        console.log(JSON.stringify(result.ops,undefined,2));
    });*/

    db.close();
});