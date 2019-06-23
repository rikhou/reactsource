React = {
  createClass: function (spec) {
    //生成一个子类
    var Constructor = function (props) {
      this.props = props;
      this.state = this.getInitialState ? this.getInitialState() : null;
    }
    //原型继承，继承超级父类
    Constructor.prototype = new ReactClass();
    Constructor.prototype.constructor = Constructor;
    //混入spec到原型
    $.extend(Constructor.prototype, spec);
    return Constructor;

  },
  createElement: function (type, config, children) {
    var props = {},
      propName;
    config = config || {}
    //看有没有key，用来标识element的类型，方便以后高效的更新，这里可以先不管
    var key = config.key || null;

    //复制config里的内容到props
    for (propName in config) {
      if (config.hasOwnProperty(propName) && propName !== 'key') {
        props[propName] = config[propName];
      }
    }
    //处理children,全部挂载到props的children属性上
    //支持两种写法，如果只有一个参数，直接赋值给children，否则做合并处理
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = $.isArray(children) ? children : [children];
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      props.children = childArray;
    }
    return new ReactElement(type, key, props);
  },
}