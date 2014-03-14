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
