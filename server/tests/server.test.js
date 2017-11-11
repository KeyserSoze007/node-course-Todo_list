const expect= require('expect');
const request= require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');
const {ObjectId} = require('mongodb');

const todos=[{
    _id: new ObjectId(),
    text: 'First test todo'
}, {
    _id: new ObjectId(),
    text: 'Second test todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text='Test todo text';


        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err,res) => {
            if(err){
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));

        });
    });

    it('should not create a todo', (done) => {

        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,res) => {
            if(err){
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((err) => done(err));
        });
    });
});




describe('GET /todos', () => {
    it('should return all Todos', (done) => {

        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.length).toBe(2);
        })
        .end(done);
    });
});


describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {

        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(todos[0].text)
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {

        request(app)
        .get(`/todos/${new ObjectId().toHexString()}`)
        .expect(404)
        .end(done)
    });

    it('should return 404 for non-object ids', (done) => {

        request(app)
        .get('/todos/1234')
        .expect(404)
        .end(done)
    });

});


describe('DELETE /todos/:id', () => {
    it('should delete a todo', (done) => {
        var hexId=todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err,res) => {
            if(err){
                return done(err);
            }

            Todo.findById(hexId).then((todos) => {
                expect(todos).toNotExist();
                done();
            }).catch((err) => done(err));

        });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
        .delete(`/todos/${new ObjectId().toHexString()}`)
        .expect(404)
        .end(done)
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
        .delete('/todos/1234')
        .expect(404)
        .end(done)
    });

});

