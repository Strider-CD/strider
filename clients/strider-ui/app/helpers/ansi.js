import { helper } from '@ember/component/helper';
import stripAnsi from 'strip-ansi';
import AU from 'ansi_up';

const ansiUp = new AU();

export default helper(function ansi([input], { plaintext } = {}) {
  if (!input) return '';
  if (input.length > 100000) return input;
  // handle the characters for "delete line" and "move to start of line"
  let startswithcr = /^[^\n]*\r[^\n]/.test(input);

  /* eslint-disable no-control-regex */
  input = input
    .replace(/^[^\n\r]*\u001b\[2K/gm, '')
    .replace(/\u001b\[K[^\n\r]*/g, '')
    .replace(/[^\n]*\r([^\n])/g, '$1')
    .replace(/^[^\n]*\u001b\[0G/gm, '');

  if (startswithcr) input = `\r${input}`;
  if (plaintext) return stripAnsi(input);

  return ansiUp.ansi_to_html(input);
});
