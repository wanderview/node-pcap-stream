// Copyright (c) 2013, Benjamin J. Kelly ("Author")
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this
//    list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
// ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

'use strict';

module.exports = PcapStream;

var pcap = require('pcap-parser');
var Readable = require('stream').Readable;
if (!Readable) {
  Readable = require('readable-stream');
}
var util = require('util');

util.inherits(PcapStream, Readable);

function PcapStream(source, opts) {
  var self = (this instanceof PcapStream)
           ? this
           : Object.create(PcapStream.prototype);

  opts = opts || {};

  if (opts.objectMode === false) {
    throw new Error('PcapStream requires stream objectMode; do not set ' +
                    'option {objectMode: false}');
  }
  opts.objectMode = true;

  Readable.call(self, opts);

  self._parser = pcap.parse(source);
  self._parser.on('packet', self._onPacket.bind(self));
  self._parser.on('end', self.push.bind(self, null));
  self._parser.on('error', self.emit.bind(self, 'error'));

  return self;
}

PcapStream.prototype._read = function(size, callback) {
  this._parser.stream.resume();
};

PcapStream.prototype._onPacket = function(packet) {
  var res = this.push( { pcap: packet.header, data: packet.data } );
  if (!res) {
    this._parser.stream.pause();
  }
};
