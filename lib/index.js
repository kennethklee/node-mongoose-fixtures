var async = require('async'),
    mongoose = require('mongoose');

module.exports = function(dataset, db, callback) {
    if (typeof db === 'function') callback = db, db = mongoose;

    Object.keys(dataset).forEach(function(tableName) {
        var model = db.model(tableName);

        if (model) {
            async.map(dataset[tableName], model.create.bind(model), callback);
        } else {
            throw new Error(tableName + ' does not exist');
        }
    });
};