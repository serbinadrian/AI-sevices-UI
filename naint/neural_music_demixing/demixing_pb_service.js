// package: demixing
// file: demixing.proto

var demixing_pb = require("./demixing_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var demixing = (function () {
  function demixing() {}
  demixing.serviceName = "demixing.demixing";
  return demixing;
}());

demixing.demixing = {
  methodName: "demixing",
  service: demixing,
  requestStream: false,
  responseStream: false,
  requestType: demixing_pb.Query,
  responseType: demixing_pb.Answer
};

exports.demixing = demixing;

function demixingClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

demixingClient.prototype.demixing = function demixing(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(demixing.demixing, {
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

exports.demixingClient = demixingClient;

