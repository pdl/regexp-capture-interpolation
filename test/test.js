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
    "expected"    : {
      interpolate       : "barfoo",
      interpolateDollar : "barfoo",
      interpolateSlash  : "$2$1"
    }
  },
  {
    "why"         : "Can interpolate \\1, \\2",
    "matchObject" : ["foo, bar", "foo", "bar"],
    "replacement" : "\\2\\1",
    "expected"    : {
      interpolate       : "barfoo",
      interpolateDollar : "\\2\\1",
      interpolateSlash  : "barfoo"
    }
  },
  {
    "why"         : "Can escape $ with \\",
    "matchObject" : ["foo, bar", "foo", "bar"],
    "replacement" : "\\$2$1",
    "expected"    : {
      interpolate       : "$2foo",
      interpolateDollar : "\\barfoo",
      interpolateSlash  : "$2$1"
    }
  },
  {
    "why"         : "Can escape $ with $",
    "matchObject" : ["foo, bar", "foo", "bar"],
    "replacement" : "$$2$1",
    "expected"    : {
      interpolate       : "$2foo",
      interpolateDollar : "$2foo",
      interpolateSlash  : "$$2$1"
    }
  },
  {
    "why"         : "escaped \\ before $ does not escape",
    "matchObject" : ["foo, bar", "foo", "bar"],
    "replacement" : "\\\\$2\\\\\\$1",
    "expected"    : {
      interpolate       : "\\bar\\$1",
      interpolateDollar : "\\\\bar\\\\\\foo",
      interpolateSlash  : "\\$2\\$1"
    }
  },
  {
    "replacement" : "\\u{a0}",
    "expected"    : {
      interpolate       : "\xa0",
      interpolateDollar : "\\u{a0}",
      interpolateSlash  : "\xa0"
    }
  },
  {
    "why"         : "\\xhh only uses two characters",
    "replacement" : "\\xa0a0",
    "expected"    : {
      interpolate       : "\u{a0}a0",
      interpolateDollar : "\\xa0a0",
      interpolateSlash  : "\u{a0}a0"
    }
  },
  {
    "replacement" : "\\ua0a0",
    "expected"    : {
      interpolate       : "\u{a0a0}",
      interpolateDollar : "\\ua0a0",
      interpolateSlash  : "\u{a0a0}"
    }
  },
  {
    "why"         : "Allow \\x{hhhh} to escape any number of characters",
    "replacement" : "\\x{a0a0}",
    "expected"    : {
      interpolate       : "\u{a0a0}",
      interpolateDollar : "\\x{a0a0}",
      interpolateSlash  : "\u{a0a0}"
    }
  },
  {
    "why"         : "$& should return match",
    "matchObject" : ["bc", "b", 1, "abcd"],
    "replacement" : "$&",
    "expected"    : {
      interpolate       : "bc",
      interpolateDollar : "bc",
      interpolateSlash  : "$&"
    }
  },
  {
    "why"         : "$` should return prematch",
    "matchObject" : ["bc", "b", 1, "abcd"],
    "replacement" : "$`",
    "expected"    : {
      interpolate       : "a",
      interpolateDollar : "a",
      interpolateSlash  : "$`"
    }
  },
  {
    "why"         : "$' should return postmatch",
    "matchObject" : ["bc", "b", 1, "abcd"],
    "replacement" : "$'",
    "expected"    : {
      interpolate       : "d",
      interpolateDollar : "d",
      interpolateSlash  : "$'"
    }
  },
  {
    "why"         : "$` and $' should return empty string when whole string is matched",
    "matchObject" : ["abcd", 0, "abcd"],
    "replacement" : "$`$'",
    "expected"    : {
      interpolate       : "",
      interpolateDollar : "",
      interpolateSlash  : "$`$'"
    }
  },
  {
    "why"         : "$foo should return $foo",
    "replacement" : "$foo",
    "expected"    : "$foo"
  }
];

for (var i = 0; i < suite.length; i++) {
  var testCase = suite[i];
  var doTest = (function (c) {
    return (
      function (t) {
        var interp = Interpolator;
        var methodTest = function (method, expected) {
          t.test(method, function (t) {
            t.is(interp[method](c.matchObject || [], c.replacement), expected);
            t.end();
          });
        };

        if (typeof({}) == typeof(c.expected)) {
          for (var method in c.expected) {
            if (c.expected.hasOwnProperty(method)) {
              methodTest(method, c.expected[method]);
            }
          }
        } else {
          ['interpolate', 'interpolateDollar', 'interpolateSlash'].map( function(method) {
            methodTest(method, c.expected);
          });
        }

        t.end();
      }
    )
  })(testCase);

  test (testCase.why || testCase.replacement, doTest)
}
