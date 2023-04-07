// package: poetic
// file: poetic.proto

var poetic_pb = require("./poetic_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Poetic = (function () {
  function Poetic() {}
  Poetic.serviceName = "poetic.Poetic";
  return Poetic;
}());

Poetic.generate = {
  methodName: "generate",
  service: Poetic,
  requestStream: false,
  responseStream: false,
  requestType: poetic_pb.Query,
  responseType: poetic_pb.Answer
};

exports.Poetic = Poetic;

function PoeticClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

PoeticClient.prototype.generate = function generate(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Poetic.generate, {
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

exports.PoeticClient = PoeticClient;

