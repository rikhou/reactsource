
function ReactCompositeComponent(element) {
  //存放元素element对象
  this._currentElement = element;
  //存放唯一标识
  this._rootNodeID = null;
  //存放对应的ReactClass的实例
  this._instance = null;
}

//用于返回当前自定义元素渲染时应该返回的内容
ReactCompositeComponent.prototype.mountComponent = function (rootID) {
  this._rootNodeID = rootID;
  //拿到当前元素对应的属性值
  var publicProps = this._currentElement.props;
  //拿到对应的ReactClass
  var ReactClass = this._currentElement.type;
  // Initialize the public class
  var inst = new ReactClass(publicProps);
  this._instance = inst;
  //保留对当前comonent的引用，下面更新会用到
  inst._reactInternalInstance = this;

  if (inst.componentWillMount) {
    inst.componentWillMount();
    //这里在原始的reactjs其实还有一层处理，就是  componentWillMount调用setstate，不会触发rerender而是自动提前合并，这里为了保持简单，就略去了
  }
  //调用ReactClass的实例的render方法,返回一个element或者一个文本节点
  var renderedElement = this._instance.render();
  //得到renderedElement对应的component类实例
  var renderedComponentInstance = instantiateReactComponent(renderedElement);
  this._renderedComponent = renderedComponentInstance; //存起来留作后用

  //拿到渲染之后的字符串内容，将当前的_rootNodeID传给render出的节点
  var renderedMarkup = renderedComponentInstance.mountComponent(this._rootNodeID);

  //之前我们在React.render方法最后触发了mountReady事件，所以这里可以监听，在渲染完成后会触发。
  $(document).on('mountReady', function () {
    //调用inst.componentDidMount
    inst.componentDidMount && inst.componentDidMount();
  });

  return renderedMarkup;
}

ReactCompositeComponent.prototype.receiveComponent = function (nextElement, newState) {

  //如果接受了新的，就使用最新的element
  this._currentElement = nextElement || this._currentElement

  var inst = this._instance;
  //合并state
  var nextState = $.extend(inst.state, newState);
  var nextProps = this._currentElement.props;


  //改写state
  inst.state = nextState;


  //如果inst有shouldComponentUpdate并且返回false。说明组件本身判断不要更新，就直接返回。
  if (inst.shouldComponentUpdate && (inst.shouldComponentUpdate(nextProps, nextState) === false)) return;

  //生命周期管理，如果有componentWillUpdate，就调用，表示开始要更新了。
  if (inst.componentWillUpdate) inst.componentWillUpdate(nextProps, nextState);


  var prevComponentInstance = this._renderedComponent;
  var prevRenderedElement = prevComponentInstance._currentElement;
  //重新执行render拿到对应的新element;
  var nextRenderedElement = this._instance.render();


  //判断是需要更新还是直接就重新渲染
  //注意这里的_shouldUpdateReactComponent跟上面的不同哦 这个是全局的方法
  if (_shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
    //如果需要更新，就继续调用子节点的receiveComponent的方法，传入新的element更新子节点。
    prevComponentInstance.receiveComponent(nextRenderedElement);
    //调用componentDidUpdate表示更新完成了
    inst.componentDidUpdate && inst.componentDidUpdate();

  } else {
    //如果发现完全是不同的两种element，那就干脆重新渲染了
    var thisID = this._rootNodeID;
    //重新new一个对应的component，
    this._renderedComponent = this._instantiateReactComponent(nextRenderedElement);
    //重新生成对应的元素内容
    var nextMarkup = _renderedComponent.mountComponent(thisID);
    //替换整个节点
    $('[data-reactid=' + this._rootNodeID + ']').replaceWith(nextMarkup);

  }

}


//用来判定两个element需不需要更新
//这里的key是我们createElement的时候可以选择性的传入的。用来标识这个element，当发现key不同时，我们就可以直接重新渲染，不需要去更新了。
var _shouldUpdateReactComponent = function (prevElement, nextElement) {
  if (prevElement != null && nextElement != null) {
    var prevType = typeof prevElement;
    var nextType = typeof nextElement;
    if (prevType === 'string' || prevType === 'number') {
      return nextType === 'string' || nextType === 'number';
    } else {
      return nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key;
    }
  }
  return false;
}

