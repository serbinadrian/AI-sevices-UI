// package: SR_GAN
// file: image_super_resolution.proto

var image_super_resolution_pb = require("./image_super_resolution_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var SR_GAN = (function () {
  function SR_GAN() {}
  SR_GAN.serviceName = "SR_GAN.SR_GAN";
  return SR_GAN;
}());

SR_GAN.SR = {
  methodName: "SR",
  service: SR_GAN,
  requestStream: false,
  responseStream: false,
  requestType: image_super_resolution_pb.Q,
  responseType: image_super_resolution_pb.A
};

exports.SR_GAN = SR_GAN;

function SR_GANClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

SR_GANClient.prototype.sR = function sR(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SR_GAN.SR, {
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

exports.SR_GANClient = SR_GANClient;

