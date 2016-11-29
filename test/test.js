var test = require ('tape');
var Interpolator = require('../lib/index.js');

var suite = [
  {
    "why"         : "Empty string replacement produces empty string",
    "matchObject" : [],
    "replacement" : "",
    "expected"    : ""
  },
  {
    "why"         : "Can interpolate $1, $2",
    "matchObject" : ["foo, bar", "foo", "bar"],
    "replacement" : "$2$1",
    "expected"    : "barfoo"
  },
  {
    "why"         : "Can interpolate \\1, \\2",
    "matchObject" : ["foo, bar", "foo", "bar"],
    "replacement" : "\\2\\1",
    "expected"    : "barfoo"
  },
  {
    "why"         : "Can escape $",
    "matchObject" : ["foo, bar", "foo", "bar"],
    "replacement" : "\\$2$1",
    "expected"    : "$2foo"
  },
  {
    "why"         : "escaped \\ before $ does not escape",
    "matchObject" : ["foo, bar", "foo", "bar"],
    "replacement" : "\\\\$2\\\\\\$1",
    "expected"    : "\\bar\\$1"
  },
  {
    "replacement" : "\\u{a0}",
    "expected"    : "\xa0"
  },
  {
    "why"         : "\\xhh only uses two characters",
    "replacement" : "\\xa0a0",
    "expected"    : "\u{a0}a0"
  },
  {
    "replacement" : "\\ua0a0",
    "expected"    : "\u{a0a0}"
  },
  {
    "why"         : "Allow \\x{hhhh} to escape any number of characters",
    "replacement" : "\\x{a0a0}",
    "expected"    : "\u{a0a0}"
  },
  {
    "why"         : "Allow \\x{hhhh} to escape any number of characters",
    "replacement" : "\\x{a0a0}",
    "expected"    : "\u{a0a0}"
  },
  {
    "why"         : "$& should return match",
    "matchObject" : ["bc", "b", 1, "abcd"],
    "replacement" : "$&",
    "expected"    : "bc"
  },
  {
    "why"         : "$` should return prematch",
    "matchObject" : ["bc", "b", 1, "abcd"],
    "replacement" : "$`",
    "expected"    : "a"
  },
  {
    "why"         : "$' should return postmatch",
    "matchObject" : ["bc", "b", 1, "abcd"],
    "replacement" : "$'",
    "expected"    : "d"
  },
  {
    "why"         : "$` and $' should return empty string when whole string is matched",
    "matchObject" : ["abcd", 0, "abcd"],
    "replacement" : "$`$'",
    "expected"    : ""
  },
  {
    "why"         : "$foo should return $foo",
    "replacement" : "$foo",
    "expected"    : "$foo"
  }
];

for (var i = 0; i < suite.length; i++) {
  var c = suite[i];
  test (c.why || c.replacement, function (t) {
    var interp = Interpolator;
    t.is(interp.interpolate(c.matchObject || [], c.replacement), c.expected);
    t.end();
  });
}
