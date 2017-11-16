const expect= require('expect');
const request= require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {ObjectId} = require('mongodb');

const {todos,populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

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


describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var new_text = "Updated text";

        request(app)
        .patch(`/todos/${id}`)
        .send({
            text: new_text,
            completed: true
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(new_text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        }).end(done);
    });

    it('should clear completedAt when completed is false', (done) => {
        var hexId= todos[1]._id.toHexString();
        new_text = "Updated text2";

        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            text: new_text,
            completed: false
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(new_text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        }).end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {

        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 if not authenticated', (done) => {

        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email='saaa@mal.com';
        var password='12ffff';

        request(app)
        .post('/users')
        .send({email,password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if(err){
                return done(err);
            }

            User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            });
        });
    });

    it('should return validation error if request invalid', (done) => {
        var email='assss.com';
        var password='1234';

        request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end(done);
    });

    it('should not create a user if email already in use', (done) => {
        var email='sayan@abc.com';
        var password='abcd123';

        request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email:users[1].email,
            password:users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
        })
        .end((err,res) => {
            if(err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[0]).toInclude({
                    access:'auth',
                    token: res.headers['x-auth']
                })
                done();
            }).catch((err) => done(err));
        });
    });

    it('should reject invalid request', (done) => {
        var email='sayan@abc.com';
        var password='1234ff';

        request(app)
        .post('/users/login')
        .send({email,password})
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toNotExist();
        })
        .end((err,res) => {
            if(err){
                return done(err);
            }

            User.findOne({email}).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((err) => done(err));
        });
    });
});