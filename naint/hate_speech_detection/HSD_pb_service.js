// package: hsd
// file: HSD.proto

var HSD_pb = require("./HSD_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var HSD = (function () {
  function HSD() {}
  HSD.serviceName = "hsd.HSD";
  return HSD;
}());

HSD.detection = {
  methodName: "detection",
  service: HSD,
  requestStream: false,
  responseStream: false,
  requestType: HSD_pb.Input,
  responseType: HSD_pb.Output
};

exports.HSD = HSD;

function HSDClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

HSDClient.prototype.detection = function detection(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(HSD.detection, {
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

exports.HSDClient = HSDClient;

