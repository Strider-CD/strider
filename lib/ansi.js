var ansiparse = require('ansiparse');


function filter(data) {

    // handle the characters for "delete line" and "move to start of line"
    data = data.replace(/^[^\n]*\u001b\[2K/gm, '')
               .replace(/^[^\n]*\u001b\[0G/gm, '');

    var ansi = ansiparse(data);
    var html_output = '';

    ansi.forEach(function (part) {
      var classes = [];

      part.foreground && classes.push(part.foreground);
      part.background && classes.push('bg-' + part.background);
      part.bold       && classes.push('bold');
      part.italic     && classes.push('italic');
      if (!part.text) {
        return;
      }

      html_output += classes.length
            ? ('<span class="' + classes.join(' ') + '">' + part.text + '</span>')
            : part.text;
    });
    var res = html_output.replace(/\033/g, '');
    return res;
}

module.exports = filter;
