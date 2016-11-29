var interpolateReplacement = function (matches, replacement) {
  var interpolated = replacement;
  var max = matches.length;

  interpolated = interpolated.replace(
    /(\\)([1-9]\d*|[0nrtv\W]|([uUx])(?:\{([0-9a-fA-F]+)\}|([0-9a-fA-F]{2,4})))|(\$)([1-9]\d*|[$])/g, // todo: $&, $', $`
    function (
      wholeMatch,
      slash, slashEscapee, codePointPrefix, bracedCodePoint, unbracedCodePoint,
      dollar, dollarEscapee
    ) {
      var args = Array.prototype.slice.call(arguments);
      var escapee = dollarEscapee || slashEscapee;
      var escapables  = { '0' : '\0', n : '\n', r : '\r', t : '\t', v : '\v' };
      var codePoint = unbracedCodePoint || bracedCodePoint;

      if (escapables.hasOwnProperty(escapee)) {
        return escapables[escapee];
      } else if (escapee.match(/^\d+$/)) {
        // let both \1 and $1 mean the same thing
        return ( matches.hasOwnProperty(escapee) ? matches [escapee] : '' );
      } else if (dollar && '$' == escapee) {
        return dollar;
      } else if (codePoint) {
        if (unbracedCodePoint) {
          if ('x' == codePointPrefix && 4 == codePoint.length) {
            return String.fromCodePoint(parseInt(codePoint.substr(0,2), 16)) + codePoint.substr(2,4);
          } else if ('u' == codePointPrefix && 2 == codePoint.length) {
            return '\\u' + codePoint;
          }
        }
        return String.fromCodePoint(parseInt(codePoint, 16));
      } else {
        return escapee;
      }
    }
  );
  return interpolated;
};

module.exports = {
  interpolateReplacement: interpolateReplacement
};
