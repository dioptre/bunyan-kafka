'use strict';

var assert = require('chai').assert;
var bunyan = require('bunyan');
var Hemera = require('nats-hemera');
var uuid = require('uuid');
var BunyanNatsStream = require('../index.js')
var TOPIC = 'nats-bunyan-test';
const servers = ["nats://localhost:4222"];
const nats = require("nats").connect({"servers": servers});
const hemera = new Hemera(nats, { logLevel: 'info' });
var LOGGER = bunyan.createLogger({
    name: TOPIC,
    level: bunyan.INFO,
    streams: []
});

describe('bunyan-nats-test', function () {
    before(function (done) {
        var bns = new BunyanNatsStream({nats: nats, log : LOGGER});
        this.timeout(5000);
        done();

    });

    it('should get emitted log via nats', function (done) {
        var message = uuid.v4();
        hemera.add({
          topic: TOPIC
        }, function (req, cb) {
          assert.equal(message, JSON.parse(req.messages).msg, 'got correct log mesasge via nats');
          done();
        })
        LOGGER.info(message);
    });
});
