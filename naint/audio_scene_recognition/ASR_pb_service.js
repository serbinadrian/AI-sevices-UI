// package: ASC
// file: ASR.proto

var ASR_pb = require("./ASR_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ASC = (function () {
  function ASC() {}
  ASC.serviceName = "ASC.ASC";
  return ASC;
}());

ASC.audio2scene = {
  methodName: "audio2scene",
  service: ASC,
  requestStream: false,
  responseStream: false,
  requestType: ASR_pb.Audio,
  responseType: ASR_pb.Output_results
};

exports.ASC = ASC;

function ASCClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ASCClient.prototype.audio2scene = function audio2scene(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ASC.audio2scene, {
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

exports.ASCClient = ASCClient;

