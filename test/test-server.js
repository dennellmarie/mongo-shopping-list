global.DATABASE_URL = 'mongodb://localhost/mongo_shopping_list';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/items');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        server.runServer(function() {
            Item.create({name: 'Broad beans'},
                        {name: 'Tomatoes'},
                        {name: 'Peppers'}, function() {
                done();
            });
        });
    });
    
    describe('Shopping List', function() {
    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0]._id.should.be.a('string');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body._id.should.be.a('string');
                res.body.name.should.equal('Kale');
                chai.request(app)
                    .get('/items')
                    .end(function(err, res) {
                        should.equal(err, null);
                        res.body.length.should.equal(4);
                        done();
                    });
            });
    });
    it('should not POST if name exists in storage', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Peppers'})
            .end(function(err, res) {
                err.should.not.be.null;
                err.should.have.status(409);
                res.should.be.json;
                done();
            });
    });
    it('should not POST if id exists', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Peppers', '_id': 3})
            .end(function (err, res) {
                err.should.not.be.null;
                res.should.have.status(409);
                res.should.be.json;
                done();
            });
    });
    it('should not POST if body data does not exist', function(done) {
        chai.request(app)
            .post('/items')
            .send()
            .end(function(err,res){
                err.should.not.be.null;
                //res.should.have.status(400);
                res.should.be.json;
                done();
            });
    });
    it('should not POST without valid json', function(done) {
        chai.request(app)
        .post('/items')
        //.send(variable = "variable")
        .end(function(err, res) {
            err.should.not.be.null;
            //res.body.should.equal('item name missing');
            //res.should.have.status(400);
            res.should.be.json;
            done();
        });
    });
    it('should edit an item on PUT', function(done) {
        chai.request(app)
        .put('/items/3')
        .send({'name': 'Pepper', '_id': 3})
        .end(function(err, res) {
            //should.equal(err, null);
            //res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('_id');
            res.body.name.should.be.a('string');
            res.body._id.should.be.a('number');
            res.body.name.should.equal('Pepper');
            done();
        })
    });
    it('should not PUT without id in endpoint', function(done) {
        chai.request(app)
        .put('/items')
        .send({'name': 'Pepper', '_id': 3})
        .end(function(err, res) {
            err.should.not.be.null;
            res.should.have.status(404);
            //res.body.should.equal('id param missing');
            res.should.be.json;
            done();
        })
    });
    it('should not PUT with different endpoint and body id', function(done) {
        chai.request(app)
        .put('/items/2')
        .send({'name': 'Pepper', '_id': 3})
        .end(function(err, res) {
            err.should.not.be.null;
            //res.should.have.status(400);
            //res.body.should.equal('bad request');
            res.should.be.json;
            done();
        })
    });
    it('PUT to id that doesn\'t exist', function(done) {
        chai.request(app)
        .put('/items/5')
        .send({'name': 'Donut', '_id': 5})
        .end(function(err, res) {
            err.should.not.be.null;
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('_id');
            res.body.name.should.be.a('string');
            res.body._id.should.be.a('string');
            res.body.name.should.equal('Donut');
            done();
        });
    });
    it('should not PUT without body data', function(done) {
        chai.request(app)
        .put('/items/2')
        .send()
        .end(function(err, res) {
            err.should.not.be.null;
            //res.should.have.status(400);
            //res.body.should.equal('bad request');
            res.should.be.json;
            done();
        });
    });
    it('should not put without valid json', function(done) {
        chai.request(app)
        .put('/items/2')
        .send()//variable = "variable")
        .end(function(err, res) {
            err.should.not.be.null;
            //res.should.have.status(400);
            res.body.should.equal('bad request');
            res.should.be.json;
            done();
        });
    });
    it('should DELETE an item on delete', function(done) {
        chai.request(app)
        .delete('/items/5')
        .send({'name': 'Donut', '_id': 5})
        .end(function(err, res) {
            err.should.not.be.null;
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.length(4);
            JSON.stringify(storage.items).should.equal(JSON.stringify(res.body));
            done();
        });
    });
    it('should not DELETE id that doesn\'t exist', function(done) {
        chai.request(app)
        .delete('/items/6')
        .send({'name': 'Cake', '_id': 6})
        .end(function(err, res) {
            err.should.not.be.null;
            //res.should.have.status(404);
            res.should.be.json;
            //res.body.should.equal('item not found');
            chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null)
                res.body.should.equal(4);
                done();
            });
        });
    });
    it('should not DELETE without id in endpoint', function(done) {
        chai.request(app)
        .delete('/items')
        .send({'name': 'Pepper', '_id': 3})
        .end(function(err, res) {
            err.should.not.be.null;
            res.should.have.status(404);
            //res.body.should.equal('id param missing');
            res.should.be.json;
            done();
        });
    });
});

    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});