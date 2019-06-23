//component类，用来表示文本在渲染，更新，删除时应该做些什么事情
function ReactDOMTextComponent(text) {
  //存下当前的字符串
  this._currentElement = '' + text;
  //用来标识当前component
  this._rootNodeID = null;
}

//component渲染时生成的dom结构
ReactDOMTextComponent.prototype.mountComponent = function (rootID) {
  this._rootNodeID = rootID;
  return '<span data-reactid="' + rootID + '">' + this._currentElement + '</span>';
}

ReactDOMTextComponent.prototype.receiveComponent = function (nextText) {
  var nextStringText = '' + nextText;
  //跟以前保存的字符串比较
  if (nextStringText !== this._currentElement) {
    this._currentElement = nextStringText;
    //替换整个节点
    $('[data-reactid="' + this._rootNodeID + '"]').html(this._currentElement);

  }
}