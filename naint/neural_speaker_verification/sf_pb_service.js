// package: sf
// file: sf.proto

var sf_pb = require("./sf_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var sf = (function () {
  function sf() {}
  sf.serviceName = "sf.sf";
  return sf;
}());

sf.sf = {
  methodName: "sf",
  service: sf,
  requestStream: false,
  responseStream: false,
  requestType: sf_pb.Audio,
  responseType: sf_pb.Output
};

exports.sf = sf;

function sfClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

sfClient.prototype.sf = function sf(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(sf.sf, {
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

exports.sfClient = sfClient;

