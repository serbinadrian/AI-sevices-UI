// package: singingZH
// file: singing.proto

var singing_pb = require("./singing_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var singingZH = (function () {
  function singingZH() {}
  singingZH.serviceName = "singingZH.singingZH";
  return singingZH;
}());

singingZH.singingZH = {
  methodName: "singingZH",
  service: singingZH,
  requestStream: false,
  responseStream: false,
  requestType: singing_pb.Query,
  responseType: singing_pb.Answer
};

exports.singingZH = singingZH;

function singingZHClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

singingZHClient.prototype.singingZH = function singingZH(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(singingZH.singingZH, {
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

exports.singingZHClient = singingZHClient;

