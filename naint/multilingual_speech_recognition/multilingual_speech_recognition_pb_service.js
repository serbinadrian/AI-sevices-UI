// package: m_asr
// file: multilingual_speech_recognition.proto

var multilingual_speech_recognition_pb = require("./multilingual_speech_recognition_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var M_ASR = (function () {
  function M_ASR() {}
  M_ASR.serviceName = "m_asr.M_ASR";
  return M_ASR;
}());

M_ASR.s2t = {
  methodName: "s2t",
  service: M_ASR,
  requestStream: false,
  responseStream: false,
  requestType: multilingual_speech_recognition_pb.Audio,
  responseType: multilingual_speech_recognition_pb.Text
};

exports.M_ASR = M_ASR;

function M_ASRClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

M_ASRClient.prototype.s2t = function s2t(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(M_ASR.s2t, {
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

exports.M_ASRClient = M_ASRClient;

