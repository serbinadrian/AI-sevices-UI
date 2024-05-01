// package: philosophic_text_generation
// file: ptg.proto

var ptg_pb = require("./ptg_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var PTG = (function () {
  function PTG() {}
  PTG.serviceName = "philosophic_text_generation.PTG";
  return PTG;
}());

PTG.generate = {
  methodName: "generate",
  service: PTG,
  requestStream: false,
  responseStream: false,
  requestType: ptg_pb.Query,
  responseType: ptg_pb.Answer
};

exports.PTG = PTG;

function PTGClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

PTGClient.prototype.generate = function generate(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(PTG.generate, {
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

exports.PTGClient = PTGClient;

