# regexp-capture-interpolation

Interpolate regular expression captures and match variables (i.e. `$1`, `$&`) into a replacement string.

# Usage

```js
var Interpolation = require('regexp-capture-interpolation');

Interpolation.interpolate(
  ['key\tvalue', 'key', 'value', 0, 'key\tvalue\nkey2\tvalue2\n'],
  '$1: $2,'
); // returns "key: value,"
```

# Exports

```js
require('regexp-capture-interpolation')
```

Returns an object which has three functions, with the keys `interpolate`, `interpolateSlash`, and `interpolateDollar`.

These three functions each accept two arguments: a match array and a replacement string.

The match array corresponds to the arguments passed into the replacement function in  `String.prototype.replace()`, that is, it should have the following values:

- Matched substring
- First capture
- Second capture
- ...
- The offset of the matched substring within the whole string being examined.
- The whole string being examined

Thus, the array **should** have at least three arguments, as captures being optional, their number being determined by the regular expression pattern.

### `interpolateDollar`

This function is intended to correspond exactly to JavaScript's own replacement behaviour, i.e., the following should have the same result:

```js
originalString.replace( pattern, replacement );

originalString.replace( pattern, function () {
  return Interpolation.interpolateDollar(arguments, replacement);
} );
```

Thus, it perfoms the following interpolations:

```
$&  Matched text
$`  The portion of the string that precedes the matched substring. 
$'  The portion of the string that follows the matched substring.
$1  The contents of the first captured substring.
$2  The contents of the second captured substring.
    ...
$$  A literal dollar character
```

Note that `$1`, `$2`... `$n`. are only interpolated if the pattern has at least _n_ captures.

### `interpolateSlash`

This function uses backslash as an escape character, which is useful for situations where you are replacing from user input.

It perfoms the following interpolations, corresponding broadly to JavaScript's String Literal syntax:

```
\1      The contents of the first captured substring.
\2      The contents of the second captured substring.
        ...
\\      A literal backslash character.
\0      A literal NUL (0x00) character.
\n      A newline.
\r      A carriage return.
\t      A tab character.
\v      A vertical tab character.
\$      A literal dollar character (this works for any non-word character).
\xhh    The codepoint at 0xhh.
\uhhhh  The codepoint at 0xhh.
\u{h}, \u{hhhh}, \x{hhh}, etc.
```

Note that `\1`, `\2`... `\n`. are only interpolated if the pattern has at least _n_ captures.

Note also that if writing the replacement in JavaScript source, your backslashes may need escaping, i.e. the following are equivalent:

```js
Interpolation.interpolateSlash(match, "\\1");
Interpolation.interpolateDollar(match, "$1");
```

### `interpolate`

This function interpolates both slash-escaped and dollar-escaped tokens.

This function is designed to be used in a user-facing environment where DWIM (do what I mean) is an important principle, i.e. the user might expect to use dollar or slash syntax, or even both.

# Author & Contributors

Daniel Perrett <perrettdl@googlemail.com>

# Copyright & License

This package is available under a MIT License - see the included `LICENSE` file for more information.
