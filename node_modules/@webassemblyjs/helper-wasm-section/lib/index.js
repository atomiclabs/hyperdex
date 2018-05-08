"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSectionForNode = getSectionForNode;
Object.defineProperty(exports, "resizeSectionByteSize", {
  enumerable: true,
  get: function get() {
    return _resize.resizeSectionByteSize;
  }
});
Object.defineProperty(exports, "resizeSectionVecSize", {
  enumerable: true,
  get: function get() {
    return _resize.resizeSectionVecSize;
  }
});
Object.defineProperty(exports, "createEmptySection", {
  enumerable: true,
  get: function get() {
    return _create.createEmptySection;
  }
});
Object.defineProperty(exports, "removeSection", {
  enumerable: true,
  get: function get() {
    return _remove.removeSection;
  }
});

var _resize = require("./resize");

var _create = require("./create");

var _remove = require("./remove");

function getSectionForNode(n) {
  switch (n.type) {
    case "ModuleImport":
      return "import";

    case "CallInstruction":
    case "CallIndirectInstruction":
    case "Func":
    case "Instr":
      return "code";

    case "ModuleExport":
      return "export";

    case "Start":
      return "start";

    case "TypeInstruction":
      return "type";

    case "IndexInFuncSection":
      return "func";

    case "Global":
      return "global";

    default:
      throw new Error("Unsupported input in getSectionForNode: " + JSON.stringify(n.type));
  }
}