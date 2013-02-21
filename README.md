# pcap-stream

Streams2 wrapper for [pcap-parser][].

[![Build Status](https://travis-ci.org/wanderview/node-pcap-stream.png)](https://travis-ci.org/wanderview/node-pcap-stream)

[pcap-parser]: https://github.com/nearinfinity/node-pcap-parser#readme

## Example

```javascript
var FILE = path.join(__dirname, 'data', 'netbios-ns-b-register-winxp.pcap');

var PcapStream = require('pcap-stream');

var pstream = new PcapStream(FILE);

// read packets off manually one-by-one
pstream.on('readable', function() {
  var msg = pstream.read();
  if (msg) {
    msg.pcap.timestampSeconds === 123456;
    msg.pcap.timestampMicroseconds === 123456;
    msg.pcap.capturedLength === 76;
    msg.pcap.originalLength === 76;

    doStuff(msg.data);
  }
});
pstream.read(0);

// or pipe to another object stream for parsing, etc
var EtherStream = require('ether-stream');
var estream = new EtherStream();
pstream.pipe(estream);
```
