"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.edit = edit;
exports.add = add;

var _wasmParser = require("@webassemblyjs/wasm-parser");

var _ast = require("@webassemblyjs/ast");

var _clone = require("@webassemblyjs/ast/lib/clone");

var _wasmOpt = require("@webassemblyjs/wasm-opt");

var _helperWasmSection = require("@webassemblyjs/helper-wasm-section");

var _helperWasmBytecode = _interopRequireDefault(require("@webassemblyjs/helper-wasm-bytecode"));

var _apply = require("./apply");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hashNode(node) {
  return JSON.stringify(node);
}

var decoderOpts = {
  // FIXME(sven): detection based on the Instr doesn't work for add()
  // ignoreCodeSection: true,
  ignoreDataSection: true
};

function preprocess(ab) {
  var optBin = (0, _wasmOpt.shrinkPaddedLEB128)(new Uint8Array(ab));
  return optBin.buffer;
}

function sortBySectionOrder(nodes) {
  nodes.sort(function (a, b) {
    var sectionA = (0, _helperWasmSection.getSectionForNode)(a);
    var sectionB = (0, _helperWasmSection.getSectionForNode)(b);
    var aId = _helperWasmBytecode.default.sections[sectionA];
    var bId = _helperWasmBytecode.default.sections[sectionB];

    if (typeof aId !== "number" || typeof bId !== "number") {
      throw new Error("Section id not found");
    } // $FlowIgnore ensured above


    return aId > bId;
  });
}

function edit(ab, visitors) {
  var operations = [];
  ab = preprocess(ab);
  var ast = (0, _wasmParser.decode)(ab, decoderOpts);
  var uint8Buffer = new Uint8Array(ab);
  var nodeBefore;

  function before(type, path) {
    nodeBefore = (0, _clone.cloneNode)(path.node);
  }

  function after(type, path) {
    if (path.node._deleted === true) {
      operations.push({
        kind: "delete",
        node: path.node
      }); // $FlowIgnore
    } else if (hashNode(nodeBefore) !== hashNode(path.node)) {
      operations.push({
        kind: "update",
        oldNode: nodeBefore,
        node: path.node
      });
    }
  }

  (0, _ast.traverseWithHooks)(ast, visitors, before, after);
  uint8Buffer = (0, _apply.applyOperations)(ast, uint8Buffer, operations);
  return uint8Buffer.buffer;
}

function add(ab, newNodes) {
  ab = preprocess(ab); // Sort nodes by insertion order

  sortBySectionOrder(newNodes);
  var ast = (0, _wasmParser.decode)(ab, decoderOpts);
  var uint8Buffer = new Uint8Array(ab); // Map node into operations

  var operations = newNodes.map(function (n) {
    return {
      kind: "add",
      node: n
    };
  });
  uint8Buffer = (0, _apply.applyOperations)(ast, uint8Buffer, operations);
  return uint8Buffer.buffer;
}