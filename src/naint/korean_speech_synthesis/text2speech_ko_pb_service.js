// package: text2speech_ko
// file: text2speech_ko.proto

var text2speech_ko_pb = require("./text2speech_ko_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var text2speech_ko = (function () {
  function text2speech_ko() {}
  text2speech_ko.serviceName = "text2speech_ko.text2speech_ko";
  return text2speech_ko;
}());

text2speech_ko.text2speech_ko = {
  methodName: "text2speech_ko",
  service: text2speech_ko,
  requestStream: false,
  responseStream: false,
  requestType: text2speech_ko_pb.Text,
  responseType: text2speech_ko_pb.Audio
};

exports.text2speech_ko = text2speech_ko;

function text2speech_koClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

text2speech_koClient.prototype.text2speech_ko = function text2speech_ko(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(text2speech_ko.text2speech_ko, {
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

exports.text2speech_koClient = text2speech_koClient;

