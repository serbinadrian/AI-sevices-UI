// package: textual_emotion_recognition
// file: textual_emotion_recognition.proto

var textual_emotion_recognition_pb = require("./textual_emotion_recognition_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TER = (function () {
  function TER() {}
  TER.serviceName = "textual_emotion_recognition.TER";
  return TER;
}());

TER.recognize = {
  methodName: "recognize",
  service: TER,
  requestStream: false,
  responseStream: false,
  requestType: textual_emotion_recognition_pb.Input,
  responseType: textual_emotion_recognition_pb.Output
};

exports.TER = TER;

function TERClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TERClient.prototype.recognize = function recognize(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TER.recognize, {
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

exports.TERClient = TERClient;

