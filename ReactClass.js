//定义ReactClass类,所有自定义的超级父类
var ReactClass = function () { }
//留给子类去继承覆盖
ReactClass.prototype.render = function () { }

//setState
ReactClass.prototype.setState = function (newState) {

  //还记得我们在ReactCompositeComponent里面mount的时候 做了赋值
  //所以这里可以拿到 对应的ReactCompositeComponent的实例_reactInternalInstance
  this._reactInternalInstance.receiveComponent(null, newState);
}