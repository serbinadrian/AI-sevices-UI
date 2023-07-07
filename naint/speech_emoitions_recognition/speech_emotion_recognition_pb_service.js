// package: emotions
// file: speech_emotion_recognition.proto

var speech_emotion_recognition_pb = require("./speech_emotion_recognition_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var emotions = (function () {
  function emotions() {}
  emotions.serviceName = "emotions.emotions";
  return emotions;
}());

emotions.e2t = {
  methodName: "e2t",
  service: emotions,
  requestStream: false,
  responseStream: false,
  requestType: speech_emotion_recognition_pb.Audio,
  responseType: speech_emotion_recognition_pb.Text
};

exports.emotions = emotions;

function emotionsClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

emotionsClient.prototype.e2t = function e2t(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(emotions.e2t, {
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

exports.emotionsClient = emotionsClient;

