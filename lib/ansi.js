var ansiparse = require('ansiparse');


function filter(data, plaintext) {

    // handle the characters for "delete line" and "move to start of line"
    data = data.replace(/^[^\n]*\u001b\[2K/gm, '')
               .replace(/^[^\n]*\u001b\[0G/gm, '');

    var ansi = ansiparse(data);
    var output = '';

    ansi.forEach(function (part) {
      var classes = [];

      part.foreground && classes.push(part.foreground);
      part.background && classes.push('bg-' + part.background);
      part.bold       && classes.push('bold');
      part.italic     && classes.push('italic');
      if (!part.text) {
        return;
      }

      output += (!plaintext && classes.length) ?
                ('<span class="' + classes.join(' ') + '">' + part.text + '</span>') : part.text;
    });
    var res = output.replace(/\033/g, '');
    return res;
}

module.exports = filter;
