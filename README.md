node-mongoose-fixtures
======================

[![Build Status](https://travis-ci.org/kennethklee/node-mongoose-fixtures.svg?branch=master)](https://travis-ci.org/kennethklee/node-mongoose-fixtures)

Create mongoose fixtures from a dataset.

This will iteratively insert records through mongoose.

install
-------

`npm install node-mongoose-fixtures`

usage
-----

```javascript
var fixtures = require('node-mongoose-fixtures');

fixtures({
    <table name>: [
        <record>,
        <record>
    ],
    <table name>: [
        <record>,
        <record>
    ]
});


```

example
-------

```javascript
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    fixtures = require('node-mongoose-fixtures');

// User
var userSchema = new Schema({
    username: String,
    password: String
});
mongoose.model('users', userSchema);

// Book
var bookSchema = new Schema({
    title: String
});
mongoose.model('books', bookSchema);


// Create dataset immediately
fixtures({
    users: [
        {username: 'one', password: 'pass'},
        {username: 'two', password: 'pass'}
    ],
    books: [
        {title: 'Enders Game'},
        {title: 'Speaker of the Dead'}
    ]
}, function(err, data) {
    // data is an array of all the documents created
});

// Pre-setup a dataset as a named fixture
fixtures.save('users', {
    users: [
        {username: 'one', password: 'pass'},
        {username: 'two', password: 'pass'}
    ]
});

// Create a set of named fixtures
fixtures('users', function(err, data) {
    // Again, data is an array of all documents created
});
```

api
---

### Create Dataset

`fixtures(dataset, <mongoose instance>, <callback>);`

Immediately creates the documents from the dataset through the mongoose connection.

* `dataset` can be a hash or a name of a named fixture.
* `mongoose instance` is optional and is a singular instance of mongoose.
* `callback` is an optional function when the action is complete. It's parameters are callback(error, data documents). Both arguments are arrays. The data documents are mongoose documents from the fixture data.


### Save a Named Fixture

`fixtures.save(name, dataset, <callback>);`

Save a fixture to be used for later.

* `name` is the name of your new named fixture.
* `dataset` is the hash of the dataset you want to save.
* `callback` is an optional function when the action is complete. It's parameters are callback(err, old fixtures). The old fixtures are what you've overwritten.


### Retrieve a Named Fixture's Dataset

`fixtures.get(name, <callback);`

Retrieves a named fixture's dataset. If callback is omitted, this will simply return the named fixture's dataset.

* `name` is the name of the named fixture you wish to retrieve.
* `callback` is an optional function when the action is complete. It's parameters are callback(err, dataset).


### Clear Named Fixture

`fixtures.clear(<name>, <callback>);`

Clears named fixtures.

* `name` is optional. It's the name of the named fixture. If omitted, all named fixtures will be cleared.
* `callback` is an optional function when the action is complete. It has no parameters.


### Reset Database Collection(s)

`fixtures.reset(<model name>, <mongoose instance>, <callback>);`

Deletes all documents within a collection.

* `model name` is optional. It's the name of the collection. If omitted, all collections will be purged.
* `mongoose instance` is optional and is a singular instance of mongoose.
* `callback` is an optional function when the action is complete. It's parameters are the same as the callback from `mongoose.Model.remove()`
