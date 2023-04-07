// package: lyrics
// file: lyrics.proto

var lyrics_pb = require("./lyrics_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Lyrics = (function () {
  function Lyrics() {}
  Lyrics.serviceName = "lyrics.Lyrics";
  return Lyrics;
}());

Lyrics.generate = {
  methodName: "generate",
  service: Lyrics,
  requestStream: false,
  responseStream: false,
  requestType: lyrics_pb.Query,
  responseType: lyrics_pb.Answer
};

exports.Lyrics = Lyrics;

function LyricsClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

LyricsClient.prototype.generate = function generate(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Lyrics.generate, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.LyricsClient = LyricsClient;

