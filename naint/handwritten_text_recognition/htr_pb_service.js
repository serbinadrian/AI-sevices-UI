// package: handwrittenOCR
// file: htr.proto

var htr_pb = require("./htr_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var handwrittenOCR = (function () {
  function handwrittenOCR() {}
  handwrittenOCR.serviceName = "handwrittenOCR.handwrittenOCR";
  return handwrittenOCR;
}());

handwrittenOCR.handwrittenOCR = {
  methodName: "handwrittenOCR",
  service: handwrittenOCR,
  requestStream: false,
  responseStream: false,
  requestType: htr_pb.Image,
  responseType: htr_pb.Text
};

exports.handwrittenOCR = handwrittenOCR;

function handwrittenOCRClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

handwrittenOCRClient.prototype.handwrittenOCR = function handwrittenOCR(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(handwrittenOCR.handwrittenOCR, {
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

exports.handwrittenOCRClient = handwrittenOCRClient;

