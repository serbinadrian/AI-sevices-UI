// package: scr
// file: speech_commands_recognition.proto

var speech_commands_recognition_pb = require("./speech_commands_recognition_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var SCR = (function () {
  function SCR() {}
  SCR.serviceName = "scr.SCR";
  return SCR;
}());

SCR.sc2t = {
  methodName: "sc2t",
  service: SCR,
  requestStream: false,
  responseStream: false,
  requestType: speech_commands_recognition_pb.Audio,
  responseType: speech_commands_recognition_pb.Output_Audio
};

exports.SCR = SCR;

function SCRClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

SCRClient.prototype.sc2t = function sc2t(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SCR.sc2t, {
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

exports.SCRClient = SCRClient;

