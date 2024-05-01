// package: printedOCR
// file: ptr.proto

var ptr_pb = require("./ptr_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var printedOCR = (function () {
  function printedOCR() {}
  printedOCR.serviceName = "printedOCR.printedOCR";
  return printedOCR;
}());

printedOCR.printedOCR = {
  methodName: "printedOCR",
  service: printedOCR,
  requestStream: false,
  responseStream: false,
  requestType: ptr_pb.Image,
  responseType: ptr_pb.Text
};

exports.printedOCR = printedOCR;

function printedOCRClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

printedOCRClient.prototype.printedOCR = function printedOCR(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(printedOCR.printedOCR, {
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

exports.printedOCRClient = printedOCRClient;

