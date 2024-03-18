// package: splitter
// file: splitter.proto

var splitter_pb = require("./splitter_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var splitter = (function () {
  function splitter() {}
  splitter.serviceName = "splitter.splitter";
  return splitter;
}());

splitter.SendAudio = {
  methodName: "SendAudio",
  service: splitter,
  requestStream: false,
  responseStream: false,
  requestType: splitter_pb.AudioRequest,
  responseType: splitter_pb.AudioFile
};

exports.splitter = splitter;

function splitterClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

splitterClient.prototype.sendAudio = function sendAudio(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(splitter.SendAudio, {
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

exports.splitterClient = splitterClient;

