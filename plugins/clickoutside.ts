function validate(binding: any) {
  if (typeof binding.value !== "function") {
    console.warn(
      "[Vue-click-outside:] provided expression",
      binding.expression,
      "is not a function."
    );
    return false;
  }

  return true;
}

function isPopup(popupItem: any, elements: any) {
  if (!popupItem || !elements) return false;

  for (var i = 0, len = elements.length; i < len; i++) {
    try {
      if (popupItem.contains(elements[i])) {
        return true;
      }
      if (elements[i].contains(popupItem)) {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  return false;
}

function isServer(vNode: any) {
  return (
    typeof vNode.componentInstance !== "undefined" &&
    vNode.componentInstance.$isServer
  );
}

exports = module.exports = {
  bind: function(el: any, binding: any, vNode: any) {
    if (!validate(binding)) return;

    // Define Handler and cache it on the element
    function handler(e: any) {
      if (!vNode.context) return;
      // some components may have related popup item, on which we shall prevent the click outside event handler.
      var elements = e.path || (e.composedPath && e.composedPath());
      elements && elements.length > 0 && elements.unshift(e.target);

      if (el.contains(e.target) || isPopup(vNode.context.popupItem, elements))
        return;

      el.__vueClickOutside__.callback(e);

      // 修复点击穿透
      e.preventDefault();
    }

    // add Event Listeners
    el.__vueClickOutside__ = {
      handler: handler,
      callback: binding.value
    };
    // 修复移动端点击
    const clickHandler =
      "ontouchstart" in document.documentElement ? "touchend" : "click";
    !isServer(vNode) && document.addEventListener(clickHandler, handler);
  },

  update: function(el: any, binding: any) {
    if (validate(binding)) el.__vueClickOutside__.callback = binding.value;
  },

  unbind: function(el: any, binding: any, vNode: any) {
    // Remove Event Listeners
    const clickHandler =
      "ontouchstart" in document.documentElement ? "touchend" : "click";
    !isServer(vNode) &&
      document.removeEventListener(
        clickHandler,
        el.__vueClickOutside__.handler
      );
    delete el.__vueClickOutside__;
  }
};
