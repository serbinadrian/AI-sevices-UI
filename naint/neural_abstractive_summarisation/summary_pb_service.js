// package: neural_summarisation
// file: summary.proto

var summary_pb = require("./summary_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var neural_summarisation = (function () {
  function neural_summarisation() {}
  neural_summarisation.serviceName = "neural_summarisation.neural_summarisation";
  return neural_summarisation;
}());

neural_summarisation.neural_summarisation = {
  methodName: "neural_summarisation",
  service: neural_summarisation,
  requestStream: false,
  responseStream: false,
  requestType: summary_pb.Query,
  responseType: summary_pb.Answer
};

exports.neural_summarisation = neural_summarisation;

function neural_summarisationClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

neural_summarisationClient.prototype.neural_summarisation = function neural_summarisation(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(neural_summarisation.neural_summarisation, {
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

exports.neural_summarisationClient = neural_summarisationClient;

