"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traverse = traverse;
exports.traverseWithHooks = traverseWithHooks;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var debug = require("debug")("wasm:traverse");

function _shift(node, delta) {
  if (node.type === "SectionMetadata") {
    node.startOffset += delta;

    if (_typeof(node.size.loc) === "object") {
      // $FlowIgnore
      node.size.loc.start.column += delta; // $FlowIgnore

      node.size.loc.end.column += delta;
    }

    if (_typeof(node.vectorOfSize.loc) === "object") {
      // $FlowIgnore
      node.vectorOfSize.loc.start.column += delta; // $FlowIgnore

      node.vectorOfSize.loc.end.column += delta;
    }

    debug("shifted %s startOffset=%d", node.type, node.startOffset);
  } else {
    // // $FlowIgnore
    // node.loc.start.column += delta;
    // // $FlowIgnore
    // node.loc.end.column += delta;
    throw new Error("Can not shift node " + JSON.stringify(node.type));
  }
}

function removeNodeInBody(node, fromNode) {
  switch (fromNode.type) {
    case "ModuleMetadata":
      fromNode.sections = fromNode.sections.filter(function (n) {
        return n !== node;
      });
      break;

    case "Module":
      fromNode.fields = fromNode.fields.filter(function (n) {
        return n !== node;
      });
      break;

    case "Program":
    case "Func":
      fromNode.body = fromNode.body.filter(function (n) {
        return n !== node;
      });
      break;

    default:
      throw new Error("Unsupported operation: removing node of type: " + String(fromNode.type));
  }
}

function createPath(node, parentPath) {
  function remove() {
    if (parentPath == null) {
      throw new Error("Can not remove root node");
    }

    var parentNode = parentPath.node;
    removeNodeInBody(node, parentNode);
    node._deleted = true;
    debug("delete path %s", node.type);
  } // TODO(sven): do it the good way, changing the node from the parent


  function replaceWith(newNode) {
    // Remove all the keys first
    // $FlowIgnore
    Object.keys(node).forEach(function (k) {
      return delete node[k];
    }); // $FlowIgnore

    Object.assign(node, newNode);
  }

  return {
    node: node,
    parentPath: parentPath,
    replaceWith: replaceWith,
    remove: remove,
    shift: function shift(delta) {
      return _shift(node, delta);
    }
  };
}

function walk(n, cb, parentPath) {
  if (n._deleted === true) {
    return;
  }

  switch (n.type) {
    case "Program":
      {
        var _path = createPath(n, parentPath);

        cb(n.type, _path);
        n.body.forEach(function (x) {
          return walk(x, cb, _path);
        });
        break;
      }

    case "SectionMetadata":
    case "FunctionNameMetadata":
    case "ModuleNameMetadata":
    case "LocalNameMetadata":
    case "Data":
    case "Memory":
    case "Elem":
    case "FuncImportDescr":
    case "GlobalType":
    case "NumberLiteral":
    case "ValtypeLiteral":
    case "FloatLiteral":
    case "StringLiteral":
    case "QuoteModule":
    case "LongNumberLiteral":
    case "BinaryModule":
    case "LeadingComment":
    case "BlockComment":
    case "Identifier":
      {
        cb(n.type, createPath(n, parentPath));
        break;
      }

    case "ModuleExport":
      {
        var _path2 = createPath(n, parentPath);

        cb(n.type, _path2);
        walk(n.descr.id, cb, _path2);
        break;
      }

    case "ModuleMetadata":
      {
        var _path3 = createPath(n, parentPath);

        cb(n.type, _path3);
        n.sections.forEach(function (x) {
          return walk(x, cb, _path3);
        });

        if (typeof n.functionNames !== "undefined") {
          // $FlowIgnore
          n.functionNames.forEach(function (x) {
            return walk(x, cb, _path3);
          });
        }

        if (typeof n.localNames !== "undefined") {
          // $FlowIgnore
          n.localNames.forEach(function (x) {
            return walk(x, cb, _path3);
          });
        }

        break;
      }

    case "Module":
      {
        var _path4 = createPath(n, parentPath);

        cb(n.type, _path4);

        if (typeof n.fields !== "undefined") {
          n.fields.forEach(function (x) {
            return walk(x, cb, _path4);
          });
        }

        if (typeof n.metadata !== "undefined") {
          // $FlowIgnore
          walk(n.metadata, cb, _path4);
        }

        break;
      }

    case "Start":
    case "CallInstruction":
      {
        var _path5 = createPath(n, parentPath); // $FlowIgnore


        cb(n.type, _path5); // $FlowIgnore

        walk(n.index, cb, _path5);
        break;
      }

    case "CallIndirectInstruction":
      {
        var _path6 = createPath(n, parentPath); // $FlowIgnore


        cb(n.type, _path6);

        if (n.index != null) {
          // $FlowIgnore
          walk(n.index, cb, _path6);
        }

        break;
      }

    case "ModuleImport":
      {
        cb(n.type, createPath(n, parentPath));

        if (n.descr != null) {
          // $FlowIgnore
          walk(n.descr, cb, createPath(n, parentPath));
        }

        break;
      }

    case "Table":
    case "Global":
      {
        var _path7 = createPath(n, parentPath);

        cb(n.type, _path7);

        if (n.name != null) {
          walk(n.name, cb, _path7);
        }

        if (n.init != null) {
          // $FlowIgnore
          n.init.forEach(function (x) {
            return walk(x, cb, _path7);
          });
        }

        break;
      }

    case "TypeInstruction":
      {
        var _path8 = createPath(n, parentPath);

        cb(n.type, _path8);

        if (n.id != null) {
          walk(n.id, cb, _path8);
        }

        break;
      }

    case "IfInstruction":
      {
        var _path9 = createPath(n, parentPath); // $FlowIgnore


        cb(n.type, _path9); // $FlowIgnore

        n.test.forEach(function (x) {
          return walk(x, cb, _path9);
        }); // $FlowIgnore

        n.consequent.forEach(function (x) {
          return walk(x, cb, _path9);
        }); // $FlowIgnore

        n.alternate.forEach(function (x) {
          return walk(x, cb, _path9);
        }); // $FlowIgnore

        walk(n.testLabel, cb, _path9);
        break;
      }

    case "Instr":
      {
        var _path10 = createPath(n, parentPath); // $FlowIgnore


        cb(n.type, _path10); // $FlowIgnore

        if (_typeof(n.args) === "object") {
          n.args.forEach(function (x) {
            return walk(x, cb, _path10);
          });
        }

        break;
      }

    case "BlockInstruction":
    case "LoopInstruction":
      {
        var _path11 = createPath(n, parentPath); // $FlowIgnore


        cb(n.type, _path11);

        if (n.label != null) {
          // $FlowIgnore
          walk(n.label, cb, _path11);
        } // $FlowIgnore


        n.instr.forEach(function (x) {
          return walk(x, cb, _path11);
        });
        break;
      }

    case "Func":
      {
        var _path12 = createPath(n, parentPath);

        cb(n.type, _path12);
        n.body.forEach(function (x) {
          return walk(x, cb, _path12);
        });

        if (n.name != null) {
          walk(n.name, cb, _path12);
        }

        break;
      }

    default:
      throw new Error("Unknown node encounter of type: " + JSON.stringify(n.type));
  }
}

function traverse(n, visitors) {
  var parentPath = null;
  walk(n, function (type, path) {
    if (typeof visitors["Node"] === "function") {
      visitors["Node"](path);
    }

    if (typeof visitors[type] === "function") {
      visitors[type](path);
    }
  }, parentPath);
}

function traverseWithHooks(n, visitors, before, after) {
  var parentPath = null;
  walk(n, function (type, path) {
    if (typeof visitors[type] === "function") {
      before(type, path);
      visitors[type](path);
      after(type, path);
    }
  }, parentPath);
}