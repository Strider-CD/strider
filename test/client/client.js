/* globals window: true */

module.exports = {
  sioWait: sioWait
}

function sioWait(event, cb) {
  function handler() {
    window.socket.off(handler);
    cb.apply(null, arguments);
  }
  window.socket.on(event, handler);
}
