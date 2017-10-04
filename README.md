# bunyan-nats
This is a [bunyan](https://github.com/trentm/node-bunyan) plugin for NATS
[nats](https://nats.io/). It allows you to stream your bunyan logs to
nats. You can then forward the logs on to some other distributed processing
framework, such as Elasticsearch.

## Usage
The stream needs to connect to nats, and thus we have to instantiate it
asynchronously and add the stream to the logger after the `ready` event has been
emitted. We use `bunyan`'s `addStream()` API to accomplish this.

```js
var uuid = require('uuid');
var BunyanNatsStream = require('bunyan-nats')
var TOPIC = 'nats-bunyan-test';
const servers = ["nats://localhost:4222"];
const nats = require("nats").connect({"servers": servers});
var LOGGER = bunyan.createLogger({
    name: TOPIC,
    level: bunyan.INFO,
    streams: []
});
var bns = new BunyanNatsStream({nats: nats, log : LOGGER});
```

## Tests
You'll need to have nats installed locally, port 4222

# Contributions
Contributions are welcome, please run ```make``` to ensure tests, lint, and
style run cleanly.

# LICENSE
The MIT License (MIT)

Copyright (c) 2017 Andrew Grosser
Copyright (c) 2015 Yunong J Xiao

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
