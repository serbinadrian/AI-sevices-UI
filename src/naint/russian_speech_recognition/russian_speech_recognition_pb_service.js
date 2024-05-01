// package: ru_asr
// file: russian_speech_recognition.proto

var russian_speech_recognition_pb = require("./russian_speech_recognition_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ru_asr = (function () {
  function ru_asr() {}
  ru_asr.serviceName = "ru_asr.ru_asr";
  return ru_asr;
}());

ru_asr.s2t = {
  methodName: "s2t",
  service: ru_asr,
  requestStream: false,
  responseStream: false,
  requestType: russian_speech_recognition_pb.Audio,
  responseType: russian_speech_recognition_pb.Text
};

exports.ru_asr = ru_asr;

function ru_asrClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ru_asrClient.prototype.s2t = function s2t(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ru_asr.s2t, {
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

exports.ru_asrClient = ru_asrClient;

