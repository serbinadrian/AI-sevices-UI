// package: tts
// file: tts.proto

var tts_pb = require("./tts_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var EmoTTS = (function () {
  function EmoTTS() {}
  EmoTTS.serviceName = "tts.EmoTTS";
  return EmoTTS;
}());

EmoTTS.tts = {
  methodName: "tts",
  service: EmoTTS,
  requestStream: false,
  responseStream: false,
  requestType: tts_pb.SynthesisRequest,
  responseType: tts_pb.SynthesisResponse
};

exports.EmoTTS = EmoTTS;

function EmoTTSClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

EmoTTSClient.prototype.tts = function tts(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EmoTTS.tts, {
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

exports.EmoTTSClient = EmoTTSClient;

