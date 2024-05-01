// package: sn_bayes
// file: bayesnet.proto

var bayesnet_pb = require("./bayesnet_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var BayesNet = (function () {
  function BayesNet() {}
  BayesNet.serviceName = "sn_bayes.BayesNet";
  return BayesNet;
}());

BayesNet.StartNet = {
  methodName: "StartNet",
  service: BayesNet,
  requestStream: false,
  responseStream: false,
  requestType: bayesnet_pb.BayesianNetwork,
  responseType: bayesnet_pb.Id
};

BayesNet.AskNet = {
  methodName: "AskNet",
  service: BayesNet,
  requestStream: false,
  responseStream: false,
  requestType: bayesnet_pb.QueryId,
  responseType: bayesnet_pb.Answer
};

BayesNet.StatelessNet = {
  methodName: "StatelessNet",
  service: BayesNet,
  requestStream: false,
  responseStream: false,
  requestType: bayesnet_pb.BayesianNetworkQuery,
  responseType: bayesnet_pb.Answer
};

BayesNet.EndNet = {
  methodName: "EndNet",
  service: BayesNet,
  requestStream: false,
  responseStream: false,
  requestType: bayesnet_pb.Id,
  responseType: bayesnet_pb.Id
};

exports.BayesNet = BayesNet;

function BayesNetClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

BayesNetClient.prototype.startNet = function startNet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(BayesNet.StartNet, {
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

BayesNetClient.prototype.askNet = function askNet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(BayesNet.AskNet, {
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

BayesNetClient.prototype.statelessNet = function statelessNet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(BayesNet.StatelessNet, {
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

BayesNetClient.prototype.endNet = function endNet(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(BayesNet.EndNet, {
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

exports.BayesNetClient = BayesNetClient;

