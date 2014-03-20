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

    it('should error when passing in a faulty dataset', function(done) {
        fixtures('faulty!', mongoose, function(err, data) {
            assert.ok(err);    // Error should exist
            assert.equal('Dataset not a valid object.', err.message);

            done();
        });
    });

    it('should delete a particular model', function(done) {
        var model = mongoose.model('tests');

        model.find().exec(function(err, initialDocuments) {
            assert.ok(initialDocuments.length);    // make sure documents exist

            fixtures.reset('tests', mongoose, function(err) {
                assert.ifError(err);

                model.find().exec(function(err, finalDocuments) {
                    assert.equal(0, finalDocuments.length);
                    done();
                });

            });
        });
    });

    it('should delete all models', function(done) {
        var model = mongoose.model('tests'),
            anotherModel = mongoose.model('another', new mongoose.Schema({
                name: String
            }));

        anotherModel.create({
            name: 'test'
        }, function(err, doc) {
            assert.ifError(err);
            assert.ok(doc);

            fixtures.reset(mongoose, function(err) {
                assert.ifError(err);

                model.count().exec(function(err, modelCount) {
                    assert.equal(0, modelCount);

                    anotherModel.count().exec(function(err, anotherModelCount) {
                        assert.equal(0, anotherModelCount);
                        done();
                    });
                });
            });
        });
    });

    it('should save a fixture and load it', function(done) {
        fixtures.save('tests:one', {
            tests: [
                {name: 'one'},
                {name: 'two'},
                {name: 'three'},
            ]
        }, function() {
            fixtures('tests:one', mongoose, function(err, data) {
                assert.ifError(err);

                assert.ok(data);
                assert.ok(data.length);
                done();
            });
        });


    });
});
