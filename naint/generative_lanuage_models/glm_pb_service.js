// package: glm
// file: glm.proto

var glm_pb = require("./glm_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var GLM = (function () {
  function GLM() {}
  GLM.serviceName = "glm.GLM";
  return GLM;
}());

GLM.generate = {
  methodName: "generate",
  service: GLM,
  requestStream: false,
  responseStream: false,
  requestType: glm_pb.Query,
  responseType: glm_pb.Answer
};

exports.GLM = GLM;

function GLMClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

GLMClient.prototype.generate = function generate(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(GLM.generate, {
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

exports.GLMClient = GLMClient;

