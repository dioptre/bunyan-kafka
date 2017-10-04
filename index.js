'use strict';

var events = require('events');
var util = require('util');
var Hemera = require('nats-hemera');
var assert = require('assert-plus');
var bunyan = require('bunyan');

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

    this._hemera = new Hemera(opts.nats, { logLevel: 'info' });

    self._hemera.ready(function () {
        self._log.info('nats ready');
        self.emit('ready');
        self._log.addStream({
            level: bunyan.INFO,
            stream: self
        });
    });
}

util.inherits(BunyanNatsStream, events.EventEmitter);

module.exports = BunyanNatsStream;

BunyanNatsStream.prototype.write = function write(record) {
    var self = this;
    var payload = {
        topic: self._log.fields.name,
        messages: record
    };

    self._log.trace({payload: payload}, 'sending payload to nats');
    self._hemera.act(payload, function (err, resp) {
      if (err) {
          self._log.warn({err: err, data: data},
                         'unable to send log to nats');

          if (self.listeners('error').length !== 0) {
              self.emit('error', err, data);
          }
      }
      //console.log("Result", resp)
    });

};
