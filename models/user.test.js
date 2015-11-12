var expect = require("chai").expect;
var bcrypt = require('bcryptjs');

var Waterline = require('waterline');
var waterlineConfig = require('../config/waterline');
var userCollection = require('./user');
var contactCollection = require('./contact');

var User;

before(function (done) {
    // ORM indítása
    var orm = new Waterline();

    orm.loadCollection(Waterline.Collection.extend(userCollection));
    orm.loadCollection(Waterline.Collection.extend(contactCollection));
    waterlineConfig.connections.default.adapter = 'memory';

    orm.initialize(waterlineConfig, function(err, models) {
        if(err) throw err;
        User = models.collections.user;
        done();
    });
});

describe('UserModel', function () {

    function getUserData() {
        return {
            username: 'abcdef',
            password: 'jelszo',
            surname: 'Gipsz',
            forename: 'Jakab',
        };
    }

    beforeEach(function (done) {
        User.destroy({}, function (err) {
            done();
        });
    });
    
    it('should be able to create a user', function () {
        return User.create({
                username: 'abcdef',
                password: 'jelszo',
                surname: 'Gipsz',
                forename: 'Jakab',
        })
        .then(function (user) {
            expect(user.username).to.equal('abcdef');
            expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
            expect(user.surname).to.equal('Gipsz');
            expect(user.forename).to.equal('Jakab');
        });
    });

    it('should be able to find a user', function() {
        return User.create(getUserData())
        .then(function(user) {
            return User.findOneByUsername(user.username);
        })
        .then(function (user) {
            expect(user.username).to.equal('abcdef');
            expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
            expect(user.surname).to.equal('Gipsz');
            expect(user.forename).to.equal('Jakab');
        });
    });

    describe('#validPassword', function() {
        it('should return true with right password', function() {
             return User.create(getUserData()).then(function(user) {
                 expect(user.validPassword('jelszo')).to.be.true;
             })
        });
        it('should return false with wrong password', function() {
             return User.create(getUserData()).then(function(user) {
                 expect(user.validPassword('titkos')).to.be.false;
             })
        });
         it('should return false with empty password', function() {
             return User.create(getUserData()).then(function(user) {
                 expect(user.validPassword('')).to.be.false;
             })
        });
    });

});