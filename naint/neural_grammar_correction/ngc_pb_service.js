// package: neural_grammar_correction
// file: ngc.proto

var ngc_pb = require("./ngc_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Corrector = (function () {
  function Corrector() {}
  Corrector.serviceName = "neural_grammar_correction.Corrector";
  return Corrector;
}());

Corrector.correct = {
  methodName: "correct",
  service: Corrector,
  requestStream: false,
  responseStream: false,
  requestType: ngc_pb.Input,
  responseType: ngc_pb.Output
};

exports.Corrector = Corrector;

function CorrectorClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

CorrectorClient.prototype.correct = function correct(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Corrector.correct, {
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

exports.CorrectorClient = CorrectorClient;

