// package: vad
// file: vad.proto

var vad_pb = require("./vad_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var VAD = (function () {
  function VAD() {}
  VAD.serviceName = "vad.VAD";
  return VAD;
}());

VAD.speech_slicing = {
  methodName: "speech_slicing",
  service: VAD,
  requestStream: false,
  responseStream: false,
  requestType: vad_pb.Audio,
  responseType: vad_pb.Output_Audio
};

exports.VAD = VAD;

function VADClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

VADClient.prototype.speech_slicing = function speech_slicing(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(VAD.speech_slicing, {
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

exports.VADClient = VADClient;

