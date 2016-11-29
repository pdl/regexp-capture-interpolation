# regexp-capture-interpolation

Interpolate regular expression captures and match variables (i.e. `$1`, `$&`) into a replacement string.

# Usage

```js
var Interpolation = require('regexp-capture-interpolation');

Interpolation.interpolate(
  ['key\tvalue', 'key', 'value', 0, 'key\tvalue\n'],
  '$1: $2,'
); // returns "key: value,"
```

