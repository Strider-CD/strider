var ansiparse = require('ansiparse');


function filter(data) {
    //
    // Following replaces ANSI sequences responsible for erasing lines and
    // carret returns. Lack of those causes progress bars and such to fail
    // miserably.
    //
    var stripped = data.replace(/\r\r/g, '\r')
                    .replace(/\033\[K\r/g, '\r')
                    .replace(/^.*\r(?!$)/gm, '')
                    .replace(/\[2K/g, '')
                    .replace(/\033\(B/g, "");


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
