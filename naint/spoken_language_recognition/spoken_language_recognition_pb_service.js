// package: slr
// file: spoken_language_recognition.proto

var spoken_language_recognition_pb = require("./spoken_language_recognition_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var SLR = (function () {
  function SLR() {}
  SLR.serviceName = "slr.SLR";
  return SLR;
}());

SLR.sl2l = {
  methodName: "sl2l",
  service: SLR,
  requestStream: false,
  responseStream: false,
  requestType: spoken_language_recognition_pb.Audio,
  responseType: spoken_language_recognition_pb.Label
};

exports.SLR = SLR;

function SLRClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

SLRClient.prototype.sl2l = function sl2l(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SLR.sl2l, {
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

exports.SLRClient = SLRClient;

