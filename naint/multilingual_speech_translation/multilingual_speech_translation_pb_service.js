// package: MST
// file: multilingual_speech_translation.proto

var multilingual_speech_translation_pb = require("./multilingual_speech_translation_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var MST = (function () {
  function MST() {}
  MST.serviceName = "MST.MST";
  return MST;
}());

MST.s2t = {
  methodName: "s2t",
  service: MST,
  requestStream: false,
  responseStream: false,
  requestType: multilingual_speech_translation_pb.Audio,
  responseType: multilingual_speech_translation_pb.Text
};

exports.MST = MST;

function MSTClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

MSTClient.prototype.s2t = function s2t(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MST.s2t, {
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

exports.MSTClient = MSTClient;

