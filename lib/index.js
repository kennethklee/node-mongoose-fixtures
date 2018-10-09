var async = require('async'),
    mongoose = require('mongoose'),
    savedFixtures = {};

// Create documents
var fixtures = module.exports = function(dataset, db, callback) {
    if (typeof db === 'function') {
        callback = db;
        db = mongoose;
    }
    
    // Load fixture
    if (typeof dataset === 'string') {
        if (typeof savedFixtures[dataset] === 'function') {
            dataset = savedFixtures[dataset]({});
        } else {
            dataset = savedFixtures[dataset];
        }
    } else if (typeof dataset === 'object' && dataset.datasetName) {
        if (typeof savedFixtures[dataset.datasetName] === 'function') {
            dataset = savedFixtures[dataset.datasetName](dataset.datasetExtras || {});
        } else {
            dataset = Object.assign({}, savedFixtures[dataset.datasetName], dataset.datasetExtras || {});
        }
    }

    // Error handling
    if (typeof dataset !== 'object') {
        if (callback) {
            return callback.call(fixtures, new Error('Dataset not a valid object or does not exist as a named fixture.'));
        }
    }

    async.map(Object.keys(dataset), function(tableName, done) {
        var model = db.model(tableName);

        if (model) {
            model.insertMany(dataset[tableName], function(err) {
                done(err, Array.prototype.slice.call(arguments, 1));
            });
        } else {
            done(new Error(tableName + ' does not exist'));
        }
    }, function(err, documentSet) {        
        if (callback) {
            callback.call(fixtures, err, Array.prototype.concat.apply([], documentSet));
        }
    });
};

// Save named fixture (for later)
fixtures.save = function(name, data, callback) {
    var oldFixture = savedFixtures[name];

    savedFixtures[name] = data;

    if (callback) {
        callback.call(null, null, oldFixture);
    }
};

// Get a particular fixture
fixtures.get = function(name, callback) {
    if (callback) {
        return callback.call(null, null, savedFixtures[name]);
    } else {
        return savedFixtures[name];
    }
};

// Clear named fixture
fixtures.clear = function(name, callback) {
    if (typeof name === 'function') {
        callback = name;
        name = null;
    }

    if (name) {
        delete savedFixtures[name];
    } else {
        savedFixtures = {};
    }

    if (callback) {
        callback.call(null);
    }
};

// Reset collection
fixtures.reset = function(modelName, db, callback) {
    if (modelName instanceof mongoose.Mongoose) {
        callback = db;
        db = modelName;
        modelName = null;
    }
    if (typeof modelName === 'function') {
        callback = modelName;
        modelName = null;
        db = mongoose;
    }
    if (typeof db === 'function') {
        callback = db, db = mongoose;
    }
    if (typeof modelName === 'undefined') {
        db = mongoose;
        callback = function() {};   // No operation
    }

    var deleteModel = function(modelName, done) {
        db.model(modelName).remove(done);
    };

    if (modelName) {
        deleteModel(modelName, callback);
    } else {
        async.map(db.modelNames(), deleteModel, callback);
    }
};
