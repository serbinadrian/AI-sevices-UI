// package: paraphrase
// file: neural_paraphrase_generation.proto

var neural_paraphrase_generation_pb = require("./neural_paraphrase_generation_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var paraphrase = (function () {
  function paraphrase() {}
  paraphrase.serviceName = "paraphrase.paraphrase";
  return paraphrase;
}());

paraphrase.paraphrase = {
  methodName: "paraphrase",
  service: paraphrase,
  requestStream: false,
  responseStream: false,
  requestType: neural_paraphrase_generation_pb.Query,
  responseType: neural_paraphrase_generation_pb.Answer
};

exports.paraphrase = paraphrase;

function paraphraseClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

paraphraseClient.prototype.paraphrase = function paraphrase(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(paraphrase.paraphrase, {
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

exports.paraphraseClient = paraphraseClient;

