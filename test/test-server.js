global.DATABASE_URL = 'mongodb://localhost/mongo_shopping_list';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

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
                //err {}  === null  - true
                //err {message:broken due to donna,status:400} === null  - false
                function equal(a,b){
                    return (a === b)
                }
                console.log(equal(err,null),'should be true')
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
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
                console.log(res.body);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });
    
    /*it('should not add blank on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': null})
            .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(400);
        });
    });     */  

    it('should list items on PUT', function(done) {
        chai.request(app)
            .put('/items/1')
            .send({'name': 'Kale', 'id': 1})
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.should.be.an('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.id.should.be.a('number');
                res.body.name.should.be.a('string');
                res.body.name.should.equal('Kale');
                done();
            })
    });
    
    it('should delete an item on delete', function(done) {
        chai.request(app)
        .delete('/items/2')
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.be.an('array');
            res.body[0].should.be.an('object');
            res.body[0].should.have.property('name');
            res.body[0].should.have.property('id');
            res.body[0].id.should.be.a('number');
            res.body[0].name.should.be.a('string');
            expect(res.body[3]).equal(undefined);
            done();
        })
        
    });

    it('should be empty when all items deleted', function(done) {
        chai.request(app).delete('/items/1').then(function() {
            chai.request(app).delete('/items/2').then(function() {
                chai.request(app).delete('/items/3').then(function() {
                    chai.request(app).delete('/items/4')
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.be.empty;
                        done();
                    })
                })
            })
        })
        
   })


    //it('should add an item on post');
    //('should edit an item on put');
    //it('should delete an item on delete');
    //it('should be empty when all items deleted');
    it('should not add blank on POST',function(done) {
        done();
    });
});

    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});