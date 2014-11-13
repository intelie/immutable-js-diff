#Immutable Diff

Create RFC 6902 style patches between Immutable.JS data structures, such as `Maps`, `Lists`, and `Sets`.

##Getting Started

Install `immutablediff` using npm.

```
npm install immutablediff
```
You can then use it to get the diff ops between you Immutable.JS data structures.

``` javascript
var Immutable = require('immutable');
var diff = require('immutablediff');

var map1 = Immutable.Map({a:1, b:2, c:3});
var map2 = Immutable.Map({a:1, b:2, c:3, d: 4});

diff(map1, map2);
// List [ Map { op: "add", path: "/d", value: 4 } ]
```

The result of `diff` is an Immutable Sequence of operations
