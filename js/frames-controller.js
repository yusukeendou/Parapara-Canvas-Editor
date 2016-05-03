import Frame from "./frame";
import eventPublisher from "./publisher";
import CanvasModel from "./canvas-model";

// frame の追加・削除、currentFrameの切り替えをModel上で行う
function FramesController(canvas) {
  this.frames = [];
  this.currentFrameId = 0;
  this.canvasModel = new CanvasModel(canvas);
  var updateImageDataToNextData = (frameId) => {
    var beforeFrame = this.getCurrentFrame();
    // beforeFrameは削除されている可能性がある
    if (typeof beforeFrame !== "undefined") {
      beforeFrame.imageData = this.canvasModel.getImageData();
    }
    this.currentFrameId = frameId;
    this.canvasModel.setImageData(this.getCurrentFrame().imageData);
  };
  eventPublisher.subscribe("currentFrameId", updateImageDataToNextData);

  var callAppendFrame = (nextFrameId) => {
    this.append(nextFrameId);
  };
  eventPublisher.subscribe("appendFrame", callAppendFrame);

  var callRemoveFrame = (frameId) => {
    this.remove(frameId);
  };
  eventPublisher.subscribe("removeFrame", callRemoveFrame);
  
}

function changeCurrentFrameIdAfter(frameId) {
  let nextImageData;

  this.currentFrameId = frameId;
  
  nextImageData = this.getCurrentFrame().imageData;
  eventPublisher.publish("imageData", nextImageData);
}

// パラメータ id : どこの後ろに追加するのか（今は実装していない）
FramesController.prototype.append = function(id) {
  const frame = new Frame();
  // 今はいいが、あとで splice に変える
  this.frames.push(frame);
  eventPublisher.publish("frames", this.frames);
};

FramesController.prototype.remove = function(id) {
  let nextCurrentFrameId = this.currentFrameId;
  if (this.currentFrameId >= this.frames.length - 1) {
    nextCurrentFrameId--;
  }
  this.frames.splice(id, 1);
  this.canvasModel.setImageData(this.getFrameById(nextCurrentFrameId).imageData);
  eventPublisher.publish("frames", this.frames);
  eventPublisher.publish("currentFrameId", nextCurrentFrameId);
};

FramesController.prototype.setCurrentFrame = function(frameId) {
  eventPublisher.publish("currentFrameId", frameId);
};

FramesController.prototype.getFrameById = function(frameId) {
  return this.frames[frameId];
};

FramesController.prototype.getCurrentFrame = function() {
  return this.frames[this.currentFrameId];
};
export default FramesController;
