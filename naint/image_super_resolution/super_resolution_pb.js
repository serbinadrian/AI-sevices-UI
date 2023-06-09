// source: super_resolution.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = (function() { return this || window || global || self || Function('return this')(); }).call(null);

goog.exportSymbol('SR_GAN_snet_SR_GAN.A', null, global);
goog.exportSymbol('SR_GAN_snet_SR_GAN.Q', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
SR_GAN_snet_SR_GAN.Q = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(SR_GAN_snet_SR_GAN.Q, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  SR_GAN_snet_SR_GAN.Q.displayName = 'SR_GAN_snet_SR_GAN.Q';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
SR_GAN_snet_SR_GAN.A = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(SR_GAN_snet_SR_GAN.A, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  SR_GAN_snet_SR_GAN.A.displayName = 'SR_GAN_snet_SR_GAN.A';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
SR_GAN_snet_SR_GAN.Q.prototype.toObject = function(opt_includeInstance) {
  return SR_GAN_snet_SR_GAN.Q.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!SR_GAN_snet_SR_GAN.Q} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
SR_GAN_snet_SR_GAN.Q.toObject = function(includeInstance, msg) {
  var f, obj = {
    image: msg.getImage_asB64(),
    type: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!SR_GAN_snet_SR_GAN.Q}
 */
SR_GAN_snet_SR_GAN.Q.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new SR_GAN_snet_SR_GAN.Q;
  return SR_GAN_snet_SR_GAN.Q.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!SR_GAN_snet_SR_GAN.Q} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!SR_GAN_snet_SR_GAN.Q}
 */
SR_GAN_snet_SR_GAN.Q.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setImage(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setType(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
SR_GAN_snet_SR_GAN.Q.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  SR_GAN_snet_SR_GAN.Q.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!SR_GAN_snet_SR_GAN.Q} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
SR_GAN_snet_SR_GAN.Q.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getImage_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getType();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * optional bytes image = 1;
 * @return {!(string|Uint8Array)}
 */
SR_GAN_snet_SR_GAN.Q.prototype.getImage = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes image = 1;
 * This is a type-conversion wrapper around `getImage()`
 * @return {string}
 */
SR_GAN_snet_SR_GAN.Q.prototype.getImage_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getImage()));
};


/**
 * optional bytes image = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getImage()`
 * @return {!Uint8Array}
 */
SR_GAN_snet_SR_GAN.Q.prototype.getImage_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getImage()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!SR_GAN_snet_SR_GAN.Q} returns this
 */
SR_GAN_snet_SR_GAN.Q.prototype.setImage = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional bool type = 2;
 * @return {boolean}
 */
SR_GAN_snet_SR_GAN.Q.prototype.getType = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!SR_GAN_snet_SR_GAN.Q} returns this
 */
SR_GAN_snet_SR_GAN.Q.prototype.setType = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
SR_GAN_snet_SR_GAN.A.prototype.toObject = function(opt_includeInstance) {
  return SR_GAN_snet_SR_GAN.A.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!SR_GAN_snet_SR_GAN.A} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
SR_GAN_snet_SR_GAN.A.toObject = function(includeInstance, msg) {
  var f, obj = {
    outputImg: msg.getOutputImg_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!SR_GAN_snet_SR_GAN.A}
 */
SR_GAN_snet_SR_GAN.A.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new SR_GAN_snet_SR_GAN.A;
  return SR_GAN_snet_SR_GAN.A.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!SR_GAN_snet_SR_GAN.A} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!SR_GAN_snet_SR_GAN.A}
 */
SR_GAN_snet_SR_GAN.A.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setOutputImg(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
SR_GAN_snet_SR_GAN.A.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  SR_GAN_snet_SR_GAN.A.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!SR_GAN_snet_SR_GAN.A} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
SR_GAN_snet_SR_GAN.A.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOutputImg_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes output_img = 1;
 * @return {!(string|Uint8Array)}
 */
SR_GAN_snet_SR_GAN.A.prototype.getOutputImg = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes output_img = 1;
 * This is a type-conversion wrapper around `getOutputImg()`
 * @return {string}
 */
SR_GAN_snet_SR_GAN.A.prototype.getOutputImg_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getOutputImg()));
};


/**
 * optional bytes output_img = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getOutputImg()`
 * @return {!Uint8Array}
 */
SR_GAN_snet_SR_GAN.A.prototype.getOutputImg_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getOutputImg()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!SR_GAN_snet_SR_GAN.A} returns this
 */
SR_GAN_snet_SR_GAN.A.prototype.setOutputImg = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


goog.object.extend(exports, SR_GAN_snet_SR_GAN);
