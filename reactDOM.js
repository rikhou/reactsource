//component工厂  用来返回一个component实例
function instantiateReactComponent(node) {
  if (typeof node === 'string' || typeof node === 'number') {
    return new ReactDOMTextComponent(node)
  }
  //浏览器默认节点的情况
  if (typeof node === 'object' && typeof node.type === 'string') {
    //注意这里，使用了一种新的component
    return new ReactDOMComponent(node);
  }

  //自定义的元素节点
  if (typeof node === 'object' && typeof node.type === 'function') {
    //注意这里，使用新的component,专门针对自定义元素
    return new ReactCompositeComponent(node);
  }
}


ReactDOM = {
  nextReactRootIndex: 0,
  render: function (element, container) {
    var componentInstance = instantiateReactComponent(element);
    var markup = componentInstance.mountComponent(React.nextReactRootIndex++);
    $(container).html(markup);
    //触发完成mount的事件
    $(document).trigger('mountReady');
  }
}
