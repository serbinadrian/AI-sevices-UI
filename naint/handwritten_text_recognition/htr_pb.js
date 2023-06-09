// source: htr.proto
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

goog.exportSymbol('handwrittenOCR_snet_handwrittenOCR.Image', null, global);
goog.exportSymbol('handwrittenOCR_snet_handwrittenOCR.Text', null, global);
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
handwrittenOCR_snet_handwrittenOCR.Image = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(handwrittenOCR_snet_handwrittenOCR.Image, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  handwrittenOCR_snet_handwrittenOCR.Image.displayName = 'handwrittenOCR_snet_handwrittenOCR.Image';
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
handwrittenOCR_snet_handwrittenOCR.Text = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(handwrittenOCR_snet_handwrittenOCR.Text, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  handwrittenOCR_snet_handwrittenOCR.Text.displayName = 'handwrittenOCR_snet_handwrittenOCR.Text';
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
handwrittenOCR_snet_handwrittenOCR.Image.prototype.toObject = function(opt_includeInstance) {
  return handwrittenOCR_snet_handwrittenOCR.Image.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!handwrittenOCR_snet_handwrittenOCR.Image} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
handwrittenOCR_snet_handwrittenOCR.Image.toObject = function(includeInstance, msg) {
  var f, obj = {
    imgData: msg.getImgData_asB64()
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
 * @return {!handwrittenOCR_snet_handwrittenOCR.Image}
 */
handwrittenOCR_snet_handwrittenOCR.Image.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new handwrittenOCR_snet_handwrittenOCR.Image;
  return handwrittenOCR_snet_handwrittenOCR.Image.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!handwrittenOCR_snet_handwrittenOCR.Image} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!handwrittenOCR_snet_handwrittenOCR.Image}
 */
handwrittenOCR_snet_handwrittenOCR.Image.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setImgData(value);
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
handwrittenOCR_snet_handwrittenOCR.Image.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  handwrittenOCR_snet_handwrittenOCR.Image.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!handwrittenOCR_snet_handwrittenOCR.Image} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
handwrittenOCR_snet_handwrittenOCR.Image.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getImgData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes img_data = 1;
 * @return {!(string|Uint8Array)}
 */
handwrittenOCR_snet_handwrittenOCR.Image.prototype.getImgData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes img_data = 1;
 * This is a type-conversion wrapper around `getImgData()`
 * @return {string}
 */
handwrittenOCR_snet_handwrittenOCR.Image.prototype.getImgData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getImgData()));
};


/**
 * optional bytes img_data = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getImgData()`
 * @return {!Uint8Array}
 */
handwrittenOCR_snet_handwrittenOCR.Image.prototype.getImgData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getImgData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!handwrittenOCR_snet_handwrittenOCR.Image} returns this
 */
handwrittenOCR_snet_handwrittenOCR.Image.prototype.setImgData = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
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
handwrittenOCR_snet_handwrittenOCR.Text.prototype.toObject = function(opt_includeInstance) {
  return handwrittenOCR_snet_handwrittenOCR.Text.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!handwrittenOCR_snet_handwrittenOCR.Text} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
handwrittenOCR_snet_handwrittenOCR.Text.toObject = function(includeInstance, msg) {
  var f, obj = {
    sentence: jspb.Message.getFieldWithDefault(msg, 1, "")
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
 * @return {!handwrittenOCR_snet_handwrittenOCR.Text}
 */
handwrittenOCR_snet_handwrittenOCR.Text.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new handwrittenOCR_snet_handwrittenOCR.Text;
  return handwrittenOCR_snet_handwrittenOCR.Text.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!handwrittenOCR_snet_handwrittenOCR.Text} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!handwrittenOCR_snet_handwrittenOCR.Text}
 */
handwrittenOCR_snet_handwrittenOCR.Text.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setSentence(value);
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
handwrittenOCR_snet_handwrittenOCR.Text.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  handwrittenOCR_snet_handwrittenOCR.Text.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!handwrittenOCR_snet_handwrittenOCR.Text} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
handwrittenOCR_snet_handwrittenOCR.Text.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSentence();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string sentence = 1;
 * @return {string}
 */
handwrittenOCR_snet_handwrittenOCR.Text.prototype.getSentence = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!handwrittenOCR_snet_handwrittenOCR.Text} returns this
 */
handwrittenOCR_snet_handwrittenOCR.Text.prototype.setSentence = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


goog.object.extend(exports, handwrittenOCR_snet_handwrittenOCR);
