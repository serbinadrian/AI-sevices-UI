// package: ofa_caption
// file: image_caption.proto

var image_caption_pb = require("./image_caption_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ofa_caption = (function () {
  function ofa_caption() {}
  ofa_caption.serviceName = "ofa_caption.ofa_caption";
  return ofa_caption;
}());

ofa_caption.Caption = {
  methodName: "Caption",
  service: ofa_caption,
  requestStream: false,
  responseStream: false,
  requestType: image_caption_pb.Image,
  responseType: image_caption_pb.Text
};

exports.ofa_caption = ofa_caption;

function ofa_captionClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ofa_captionClient.prototype.caption = function caption(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ofa_caption.Caption, {
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

exports.ofa_captionClient = ofa_captionClient;

