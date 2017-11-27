'use strict';

const events = require('events');
const util = require('util');
const Nats = require('nats');
const assert = require('assert-plus');
const bunyan = require('bunyan');

/**
 * natsStream. This is a bunyan plugin that will write your bunyan records to
 * a nats stream.
 *
 * @param {Object} opts options object.
 * @param {Object} opts.nats nats object.
 * @param {Object} opts.log bunyan logger.
 *
 * @fires error if there's an error with the stream.
 * @fires ready when the stream is ready to be used.
 * @returns {undefined}
 */
function BunyanNatsStream(opts) {
    assert.object(opts, 'opts');
    assert.object(opts.nats, 'opts.nats');
    assert.object(opts.log, 'opts.log');

    events.EventEmitter.call(this);

    var self = this;

    this._log = opts.log;
    this._nats = opts.nats;
    this._added = false;

  	this._nats.on('connect', function(nc) {
      if (!this._added) {
        this._added = true;
        self._log.addStream({
            level: opts.level || bunyan.INFO,
            stream: self
        });
        self.emit('ready');
      }
  	});
}

util.inherits(BunyanNatsStream, events.EventEmitter);

module.exports = BunyanNatsStream;

BunyanNatsStream.prototype.write = function write(record) {
    var self = this;
    self._log.trace({topic: self._log.fields.name, data: record}, 'sending payload to nats');
    self._nats.publish(self._log.fields.name, record);
};
