node-mongoose-fixtures
======================

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
var fixtures = require('node-mongoose-fixtures');

fixtures({
    users: [
        {username: 'one', password: 'pass'},
        {username: 'two', password: 'pass'}
    ],
    books: [
        {title: 'Enders Game'},
        {title: 'Speaker of the Dead'}
    ]
});
```

api
---

`fixtures(dataset, <mongoose instance>, <callback>);`

`mongoose instance` is a singular instance of mongoose. This is typically initialized with the following:
```
var Mongoose = require('mongoose').Mongoose;

var mongooseInstance = new Mongoose('mongodb://localhost/dbname');
```

`callback` is the callback function. It's parameters are callback(errors, data documents). Both arguments are arrays. The data documents are mongoose documents from the fixture data.
