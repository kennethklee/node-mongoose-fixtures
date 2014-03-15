var assert = require('assert'),
    Mongoose = require('mongoose').Mongoose,
    mockgoose = require('mockgoose'),
    fixtures = require('..');

describe('Fixtures', function() {
    var mongoose;

    before(function(done) {
        mongoose = new Mongoose();
        mockgoose(mongoose);

        mongoose.connect('mongodb://localhost/testDb');

        mongoose.model('tests', new mongoose.Schema({
            name: String
        }));

        done();
    });

    it('should insert fixture data', function(done) {
        fixtures({
            tests: [
                {name: 'one'},
                {name: 'two'},
                {name: 'three'},
            ]
        }, mongoose, function(err, data) {
            assert.ifError(err);

            assert.equal(3, data.length);
            assert.equal('one', data[0].name);
            assert.equal('two', data[1].name);
            assert.equal('three', data[2].name);

            // Just in case, let's super make sure it's within mongoose
            var model = mongoose.model('tests');
            model.find({}).exec(function(err, docs) {
                assert.ifError(err);

                assert.equal(3, data.length);
                assert.equal('one', docs[0].name);
                assert.equal('two', docs[1].name);
                assert.equal('three', docs[2].name);

                done();
            });
        });
    });
});