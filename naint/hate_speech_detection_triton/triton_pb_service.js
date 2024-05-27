// package: inference
// file: triton.proto

var triton_pb = require("./triton_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var GRPCInferenceService = (function () {
  function GRPCInferenceService() {}
  GRPCInferenceService.serviceName = "inference.GRPCInferenceService";
  return GRPCInferenceService;
}());

GRPCInferenceService.ModelInfer = {
  methodName: "ModelInfer",
  service: GRPCInferenceService,
  requestStream: false,
  responseStream: false,
  requestType: triton_pb.ModelInferRequest,
  responseType: triton_pb.ModelInferResponse
};

exports.GRPCInferenceService = GRPCInferenceService;

function GRPCInferenceServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

GRPCInferenceServiceClient.prototype.modelInfer = function modelInfer(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(GRPCInferenceService.ModelInfer, {
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

exports.GRPCInferenceServiceClient = GRPCInferenceServiceClient;

