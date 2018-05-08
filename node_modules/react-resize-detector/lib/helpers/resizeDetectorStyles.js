'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var parentStyle = exports.parentStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  zIndex: -1,
  visibility: 'hidden'
};

var shrinkChildStyle = exports.shrinkChildStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '200%',
  height: '200%'
};

var expandChildStyle = exports.expandChildStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};