"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;

function _bluebirdLst() {
  const data = require("bluebird-lst");

  _bluebirdLst = function () {
    return data;
  };

  return data;
}

function _blockMapApi() {
  const data = require("builder-util-runtime/out/blockMapApi");

  _blockMapApi = function () {
    return data;
  };

  return data;
}

function _DifferentialDownloader() {
  const data = require("./DifferentialDownloader");

  _DifferentialDownloader = function () {
    return data;
  };

  return data;
}

class FileWithEmbeddedBlockMapDifferentialDownloader extends _DifferentialDownloader().DifferentialDownloader {
  download() {
    var _this = this;

    return (0, _bluebirdLst().coroutine)(function* () {
      const packageInfo = _this.blockAwareFileInfo;
      const fileSize = packageInfo.size;
      const offset = fileSize - (packageInfo.blockMapSize + 4);
      _this.fileMetadataBuffer = yield _this.readRemoteBytes(offset, fileSize - 1);
      const newBlockMap = yield (0, _DifferentialDownloader().readBlockMap)(_this.fileMetadataBuffer.slice(0, _this.fileMetadataBuffer.length - 4));
      yield _this.doDownload(JSON.parse((yield (0, _blockMapApi().readEmbeddedBlockMapData)(_this.options.oldFile))), newBlockMap);
    })();
  }

} exports.FileWithEmbeddedBlockMapDifferentialDownloader = FileWithEmbeddedBlockMapDifferentialDownloader;
//# sourceMappingURL=FileWithEmbeddedBlockMapDifferentialDownloader.js.map