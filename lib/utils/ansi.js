/* eslint-disable no-control-regex */

const AU = require('ansi_up');
const ansi_up = new AU.default();
const stripAnsi = require('strip-ansi');

// Copy of client/ansi/filters/ansi.js
module.exports = function(input, plaintext) {
  if (!input) return '';
  if (input.length > 100000) return input;
  // handle the characters for "delete line" and "move to start of line"
  const startswithcr = /^[^\n]*\r[^\n]/.test(input);

  input = input
    .replace(/^[^\n\r]*\u001b\[2K/gm, '')
    .replace(/\u001b\[K[^\n\r]*/g, '')
    .replace(/[^\n]*\r([^\n])/g, '$1')
    .replace(/^[^\n]*\u001b\[0G/gm, '');

  if (startswithcr) input = `\r${input}`;
  if (plaintext) return stripAnsi(input);

  return ansi_up.ansi_to_html(input);
};
