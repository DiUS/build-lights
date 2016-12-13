(function () {
'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  return returnValue;
}
var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var infernoDom$1 = createCommonjsModule(function (module, exports) {
/*!
 * inferno-dom v0.7.27
 * (c) 2016 Dominic Gannaway
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.InfernoDOM = factory());
}(commonjsGlobal, (function () { 'use strict';

function addChildrenToProps(children, props) {
	if (!isNullOrUndefined(children)) {
		var isChildrenArray = isArray(children);
		if (isChildrenArray && children.length > 0 || !isChildrenArray) {
			if (props) {
				props = Object.assign({}, props, { children: children });
			} else {
				props = {
					children: children
				};
			}
		}
	}
	return props;
}

var NO_RENDER = 'NO_RENDER';

// Runs only once in applications lifetime
var isBrowser = typeof window !== 'undefined' && window.document;

function isArray(obj) {
	return obj instanceof Array;
}

function isStatefulComponent(obj) {
	return obj.prototype && obj.prototype.render !== undefined;
}

function isStringOrNumber(obj) {
	return isString(obj) || isNumber(obj);
}

function isNullOrUndefined(obj) {
	return isUndefined(obj) || isNull(obj);
}

function isInvalidNode(obj) {
	return isNull(obj) || obj === false || obj === true || isUndefined(obj);
}

function isFunction(obj) {
	return typeof obj === 'function';
}

function isString(obj) {
	return typeof obj === 'string';
}

function isNumber(obj) {
	return typeof obj === 'number';
}

function isNull(obj) {
	return obj === null;
}

function isTrue(obj) {
	return obj === true;
}

function isUndefined(obj) {
	return obj === undefined;
}

function deepScanChildrenForNode(children, node) {
	if (!isInvalidNode(children)) {
		if (isArray(children)) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i];

				if (!isInvalidNode(child)) {
					if (child === node) {
						return true;
					} else if (child.children) {
						return deepScanChildrenForNode(child.children, node);
					}
				}
			}
		} else {
			if (children === node) {
				return true;
			} else if (children.children) {
				return deepScanChildrenForNode(children.children, node);
			}
		}
	}
	return false;
}

function getRefInstance$1(node, instance) {
	var children = instance.props.children;

	if (deepScanChildrenForNode(children, node)) {
		return getRefInstance$1(node, instance._parentComponent);
	}
	return instance;
}

var recyclingEnabled = true;

function recycle(node, bp, lifecycle, context, instance) {
	if (bp !== undefined) {
		var pool = bp.pool;
		var recycledNode = pool.pop();

		if (!isNullOrUndefined(recycledNode)) {
			patch(recycledNode, node, null, lifecycle, context, instance, bp.isSVG);
			return node.dom;
		}
	}
	return null;
}

function pool(node) {
	var bp = node.bp;

	if (!isNullOrUndefined(bp)) {
		bp.pool.push(node);
		return true;
	}
	return false;
}

function unmount(input, parentDom) {
	if (isVList(input)) {
		unmountVList(input, parentDom, true);
	} else if (isVNode(input)) {
		unmountVNode(input, parentDom, false);
	}
}

function unmountVList(vList, parentDom, removePointer) {
	var items = vList.items;
	var itemsLength = items.length;
	var pointer = vList.pointer;

	if (itemsLength > 0) {
		for (var i = 0; i < itemsLength; i++) {
			var item = items[i];

			if (isVList(item)) {
				unmountVList(item, parentDom, true);
			} else {
				if (parentDom) {
					removeChild(parentDom, item.dom);
				}
				unmount(item, null);
			}
		}
	}
	if (parentDom && removePointer) {
		removeChild(parentDom, pointer);
	}
}

function unmountVNode(node, parentDom, shallow) {
	var instance = node.instance;
	var instanceHooks = null;
	var instanceChildren = null;

	if (!isNullOrUndefined(instance)) {
		instanceHooks = instance.hooks;
		instanceChildren = instance.children;

		if (instance.render !== undefined) {
			instance.componentWillUnmount();
			instance._unmounted = true;
			componentToDOMNodeMap.delete(instance);
			!shallow && unmount(instance._lastNode, null);
		}
	}
	var hooks = node.hooks || instanceHooks;

	if (!isNullOrUndefined(hooks)) {
		if (!isNullOrUndefined(hooks.willDetach)) {
			hooks.willDetach(node.dom);
		}
		if (!isNullOrUndefined(hooks.componentWillUnmount)) {
			hooks.componentWillUnmount(node.dom, hooks);
		}
	}
	var children = (isNullOrUndefined(instance) ? node.children : null) || instanceChildren;

	if (!isNullOrUndefined(children)) {
		if (isArray(children)) {
			for (var i = 0; i < children.length; i++) {
				unmount(children[i], null);
			}
		} else {
			unmount(children, null);
		}
	}
}

function VText(text) {
	this.text = text;
	this.dom = null;
}

function VPlaceholder() {
	this.placeholder = true;
	this.dom = null;
}

function VList(items) {
	this.dom = null;
	this.pointer = null;
	this.items = items;
}

function createVText(text) {
	return new VText(text);
}

function createVPlaceholder() {
	return new VPlaceholder();
}

function createVList(items) {
	return new VList(items);
}

function constructDefaults(string, object, value) {
	/* eslint no-return-assign: 0 */
	string.split(',').forEach(function (i) { return object[i] = value; });
}

var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';
var strictProps = {};
var booleanProps = {};
var namespaces = {};
var isUnitlessNumber = {};

constructDefaults('xlink:href,xlink:arcrole,xlink:actuate,xlink:role,xlink:titlef,xlink:type', namespaces, xlinkNS);
constructDefaults('xml:base,xml:lang,xml:space', namespaces, xmlNS);
constructDefaults('volume,value', strictProps, true);
constructDefaults('muted,scoped,loop,open,checked,default,capture,disabled,selected,readonly,multiple,required,autoplay,controls,seamless,reversed,allowfullscreen,novalidate', booleanProps, true);
constructDefaults('animationIterationCount,borderImageOutset,borderImageSlice,borderImageWidth,boxFlex,boxFlexGroup,boxOrdinalGroup,columnCount,flex,flexGrow,flexPositive,flexShrink,flexNegative,flexOrder,gridRow,gridColumn,fontWeight,lineClamp,lineHeight,opacity,order,orphans,tabSize,widows,zIndex,zoom,fillOpacity,floodOpacity,stopOpacity,strokeDasharray,strokeDashoffset,strokeMiterlimit,strokeOpacity,strokeWidth,', isUnitlessNumber, true);

function isVText(o) {
	return o.text !== undefined;
}

function isVPlaceholder(o) {
	return o.placeholder === true;
}

function isVList(o) {
	return o.items !== undefined;
}

function isVNode(o) {
	return o.tag !== undefined || o.bp !== undefined;
}

function insertOrAppend(parentDom, newNode, nextNode) {
	if (isNullOrUndefined(nextNode)) {
		parentDom.appendChild(newNode);
	} else {
		parentDom.insertBefore(newNode, nextNode);
	}
}

function replaceVListWithNode(parentDom, vList, dom) {
	var pointer = vList.pointer;

	unmountVList(vList, parentDom, false);
	replaceNode(parentDom, dom, pointer);
}

function documentCreateElement(tag, isSVG) {
	var dom;

	if (isSVG === true) {
		dom = document.createElementNS('http://www.w3.org/2000/svg', tag);
	} else {
		dom = document.createElement(tag);
	}
	return dom;
}

function appendText(text, parentDom, singleChild) {
	if (parentDom === null) {
		return document.createTextNode(text);
	} else {
		if (singleChild) {
			if (text !== '') {
				parentDom.textContent = text;
				return parentDom.firstChild;
			} else {
				var textNode = document.createTextNode('');

				parentDom.appendChild(textNode);
				return textNode;
			}
		} else {
			var textNode$1 = document.createTextNode(text);

			parentDom.appendChild(textNode$1);
			return textNode$1;
		}
	}
}

function replaceWithNewNode(lastNode, nextNode, parentDom, lifecycle, context, instance, isSVG) {
	var lastInstance = null;
	var instanceLastNode = lastNode._lastNode;

	if (!isNullOrUndefined(instanceLastNode)) {
		lastInstance = lastNode;
		lastNode = instanceLastNode;
	}
	unmount(lastNode, false);
	var dom = mount(nextNode, null, lifecycle, context, instance, isSVG);

	nextNode.dom = dom;
	replaceNode(parentDom, dom, lastNode.dom);
	if (lastInstance !== null) {
		lastInstance._lastNode = nextNode;
	}
}

function replaceNode(parentDom, nextDom, lastDom) {
	parentDom.replaceChild(nextDom, lastDom);
}

function normalise(object) {
	if (isStringOrNumber(object)) {
		return createVText(object);
	} else if (isInvalidNode(object)) {
		return createVPlaceholder();
	} else if (isArray(object)) {
		return createVList(object);
	}
	return object;
}

function normaliseChild(children, i) {
	var child = children[i];

	return children[i] = normalise(child);
}

function remove(node, parentDom) {
	if (isVList(node)) {
		return unmount(node, parentDom);
	}
	var dom = node.dom;
	if (dom === parentDom) {
		dom.innerHTML = '';
	} else {
		removeChild(parentDom, dom);
		if (recyclingEnabled) {
			pool(node);
		}
	}
	unmount(node, false);
}

function removeChild(parentDom, dom) {
	parentDom.removeChild(dom);
}

function removeEvents(events, lastEventKeys, dom) {
	var eventKeys = lastEventKeys || Object.keys(events);

	for (var i = 0; i < eventKeys.length; i++) {
		var event = eventKeys[i];

		dom[event] = null;
	}
}

// TODO: for node we need to check if document is valid
function getActiveNode() {
	return document.activeElement;
}

function removeAllChildren(dom, children) {
	if (recyclingEnabled) {
		var childrenLength = children.length;

		if (childrenLength > 5) {
			for (var i = 0; i < childrenLength; i++) {
				var child = children[i];

				if (!isInvalidNode(child)) {
					pool(child);
				}
			}
		}
	}
	dom.textContent = '';
}

function resetActiveNode(activeNode) {
	if (activeNode !== null && activeNode !== document.body && document.activeElement !== activeNode) {
		activeNode.focus(); // TODO: verify are we doing new focus event, if user has focus listener this might trigger it
	}
}

function isKeyed(lastChildren, nextChildren) {
	if (lastChildren.complex) {
		return false;
	}
	return nextChildren.length && !isNullOrUndefined(nextChildren[0]) && !isNullOrUndefined(nextChildren[0].key)
		&& lastChildren.length && !isNullOrUndefined(lastChildren[0]) && !isNullOrUndefined(lastChildren[0].key);
}

function selectOptionValueIfNeeded(vdom, values) {
	if (vdom.tag !== 'option') {
		for (var i = 0, len = vdom.children.length; i < len; i++) {
			selectOptionValueIfNeeded(vdom.children[i], values);
		}
		// NOTE! Has to be a return here to catch optGroup elements
		return;
	}

	var value = vdom.attrs && vdom.attrs.value;

	if (values[value]) {
		vdom.attrs = vdom.attrs || {};
		vdom.attrs.selected = 'selected';
		vdom.dom.selected = true;
	} else {
		vdom.dom.selected = false;
	}
}

function selectValue(vdom) {
	var value = vdom.attrs && vdom.attrs.value;

	var values = {};
	if (isArray(value)) {
		for (var i = 0, len = value.length; i < len; i++) {
			values[value[i]] = value[i];
		}
	} else {
		values[value] = value;
	}
	for (var i$1 = 0, len$1 = vdom.children.length; i$1 < len$1; i$1++) {
		selectOptionValueIfNeeded(vdom.children[i$1], values);
	}

	if (vdom.attrs && vdom.attrs[value]) {
		delete vdom.attrs.value; // TODO! Avoid deletion here. Set to null or undef. Not sure what you want to usev
	}
}

function handleAttachedHooks(hooks, lifecycle, dom) {
	if (!isNullOrUndefined(hooks.created)) {
		hooks.created(dom);
	}
	if (!isNullOrUndefined(hooks.attached)) {
		lifecycle.addListener(function () {
			hooks.attached(dom);
		});
	}
}

function setValueProperty(nextNode) {
	var value = nextNode.attrs.value;
	if (!isNullOrUndefined(value)) {
		nextNode.dom.value = value;
	}
}

function setFormElementProperties(nextTag, nextNode) {
	if (nextTag === 'input' && nextNode.attrs) {
		var inputType = nextNode.attrs.type;
		if (inputType === 'text') {
			setValueProperty(nextNode);
		} else if (inputType === 'checkbox' || inputType === 'radio') {
			var checked = nextNode.attrs.checked;
			nextNode.dom.checked = !!checked;
		}
	} else if (nextTag === 'textarea') {
		setValueProperty(nextNode);
	}
}

function mount(input, parentDom, lifecycle, context, instance, isSVG) {
	if (isVPlaceholder(input)) {
		return mountVPlaceholder(input, parentDom);
	} else if (isVText(input)) {
		return mountVText(input, parentDom);
	} else if (isVList(input)) {
		return mountVList(input, parentDom, lifecycle, context, instance, isSVG);
	} else if (isVNode(input)) {
		return mountVNode$1(input, parentDom, lifecycle, context, instance, isSVG);
	} else {
		var normalisedInput = normalise(input);

		if (input !== normalisedInput) {
			return mount(normalisedInput, parentDom, lifecycle, context, instance, isSVG);
		} else {
			throw new Error(("Inferno Error: invalid object \"" + (typeof input) + "\" passed to mount()"));
		}
	}
}

function mountVNode$1(vNode, parentDom, lifecycle, context, instance, isSVG) {
	var bp = vNode.bp;

	if (isUndefined(bp)) {
		return mountVNodeWithoutBlueprint(vNode, parentDom, lifecycle, context, instance, isSVG);
	} else {
		if (recyclingEnabled) {
			var dom = recycle(vNode, bp, lifecycle, context, instance);

			if (!isNull(dom)) {
				if (!isNull(parentDom)) {
					parentDom.appendChild(dom);
				}
				return dom;
			}
		}
		return mountVNodeWithBlueprint(vNode, bp, parentDom, lifecycle, context, instance);
	}
}

function mountVList(vList, parentDom, lifecycle, context, instance, isSVG) {
	var items = vList.items;
	var pointer = document.createTextNode('');
	var dom = document.createDocumentFragment();

	mountArrayChildren(items, dom, lifecycle, context, instance, isSVG);
	vList.pointer = pointer;
	vList.dom = dom;
	dom.appendChild(pointer);
	if (parentDom) {
		insertOrAppend(parentDom, dom);
	}
	return dom;
}

function mountVText(vText, parentDom) {
	var dom = document.createTextNode(vText.text);

	vText.dom = dom;
	if (parentDom) {
		insertOrAppend(parentDom, dom);
	}
	return dom;
}

function mountVPlaceholder(vPlaceholder, parentDom) {
	var dom = document.createTextNode('');

	vPlaceholder.dom = dom;
	if (parentDom) {
		insertOrAppend(parentDom, dom);
	}
	return dom;
}

function handleSelects(node) {
	if (node.tag === 'select') {
		selectValue(node);
	}
}

function mountBlueprintAttrs(node, bp, dom, instance) {
	handleSelects(node);
	var attrs = node.attrs;

	if (isNull(bp.attrKeys)) {
		var newKeys = Object.keys(attrs);
		bp.attrKeys = bp.attrKeys ? bp.attrKeys.concat(newKeys) : newKeys;
	}
	var attrKeys = bp.attrKeys;

	mountAttributes(node, attrs, attrKeys, dom, instance);
}

function mountBlueprintEvents(node, bp, dom) {
	var events = node.events;

	if (isNull(bp.eventKeys)) {
		bp.eventKeys = Object.keys(events);
	}
	var eventKeys = bp.eventKeys;

	mountEvents(events, eventKeys, dom);
}

function mountVNodeWithBlueprint(node, bp, parentDom, lifecycle, context, instance) {
	var tag = node.tag;

	if (isTrue(bp.isComponent)) {
		return mountComponent(node, tag, node.attrs || {}, node.hooks, node.children, instance, parentDom, lifecycle, context);
	}
	var dom = documentCreateElement(bp.tag, bp.isSVG);

	node.dom = dom;
	if (isTrue(bp.hasHooks)) {
		handleAttachedHooks(node.hooks, lifecycle, dom);
	}
	if (isTrue(bp.lazy)) {
		handleLazyAttached(node, lifecycle, dom);
	}
	var children = node.children;
	// bp.childrenType:
	// 0: no children
	// 1: text node
	// 2: single child
	// 3: multiple children
	// 4: multiple children (keyed)
	// 5: variable children (defaults to no optimisation)

	switch (bp.childrenType) {
		case 1:
			appendText(children, dom, true);
			break;
		case 2:
			mount(node.children, dom, lifecycle, context, instance, bp.isSVG);
			break;
		case 3:
			mountArrayChildren(children, dom, lifecycle, context, instance, bp.isSVG);
			break;
		case 4:
			for (var i = 0; i < children.length; i++) {
				mount(children[i], dom, lifecycle, context, instance, bp.isSVG);
			}
			break;
		case 5:
			mountChildren(node, children, dom, lifecycle, context, instance, bp.isSVG);
			break;
		default:
			break;
	}

	if (isTrue(bp.hasAttrs)) {
		mountBlueprintAttrs(node, bp, dom, instance);
	}
	if (isTrue(bp.hasClassName)) {
		dom.className = node.className;
	}
	if (isTrue(bp.hasStyle)) {
		patchStyle(null, node.style, dom);
	}
	if (isTrue(bp.hasEvents)) {
		mountBlueprintEvents(node, bp, dom);
	}
	if (!isNull(parentDom)) {
		parentDom.appendChild(dom);
	}
	return dom;
}

function mountVNodeWithoutBlueprint(node, parentDom, lifecycle, context, instance, isSVG) {
	var tag = node.tag;

	if (isFunction(tag)) {
		return mountComponent(node, tag, node.attrs || {}, node.hooks, node.children, instance, parentDom, lifecycle, context);
	}
	if (!isString(tag) || tag === '') {
		throw Error('Inferno Error: Expected function or string for element tag type');
	}
	if (tag === 'svg') {
		isSVG = true;
	}
	var dom = documentCreateElement(tag, isSVG);
	var children = node.children;
	var attrs = node.attrs;
	var events = node.events;
	var hooks = node.hooks;
	var className = node.className;
	var style = node.style;

	node.dom = dom;
	if (!isNullOrUndefined(hooks)) {
		handleAttachedHooks(hooks, lifecycle, dom);
	}
	if (!isInvalidNode(children)) {
		mountChildren(node, children, dom, lifecycle, context, instance, isSVG);
	}
	if (!isNullOrUndefined(attrs)) {
		handleSelects(node);
		mountAttributes(node, attrs, Object.keys(attrs), dom, instance);
	}
	if (!isNullOrUndefined(className)) {
		dom.className = className;
	}
	if (!isNullOrUndefined(style)) {
		patchStyle(null, style, dom);
	}
	if (!isNullOrUndefined(events)) {
		mountEvents(events, Object.keys(events), dom);
	}
	if (!isNull(parentDom)) {
		parentDom.appendChild(dom);
	}
	return dom;
}

function mountArrayChildren(children, parentDom, lifecycle, context, instance, isSVG) {
	children.complex = false;
	for (var i = 0; i < children.length; i++) {
		var child = normaliseChild(children, i);

		if (isVText(child)) {
			mountVText(child, parentDom);
			children.complex = true;
		} else if (isVPlaceholder(child)) {
			mountVPlaceholder(child, parentDom);
			children.complex = true;
		} else if (isVList(child)) {
			mountVList(child, parentDom, lifecycle, context, instance, isSVG);
			children.complex = true;
		} else {
			mount(child, parentDom, lifecycle, context, instance, isSVG);
		}
	}
}

function mountChildren(node, children, parentDom, lifecycle, context, instance, isSVG) {
	if (isArray(children)) {
		mountArrayChildren(children, parentDom, lifecycle, context, instance, isSVG);
	} else if (isStringOrNumber(children)) {
		appendText(children, parentDom, true);
	} else if (!isInvalidNode(children)) {
		mount(children, parentDom, lifecycle, context, instance, isSVG);
	}
}

function mountRef(instance, value, refValue) {
	if (!isInvalidNode(instance) && isString(value)) {
		instance.refs[value] = refValue;
	}
}

function mountEvents(events, eventKeys, dom) {
	for (var i = 0; i < eventKeys.length; i++) {
		var event = eventKeys[i];

		dom[event] = events[event];
	}
}

function mountComponent(parentNode, Component, props, hooks, children, lastInstance, parentDom, lifecycle, context) {
	props = addChildrenToProps(children, props);

	var dom;
	if (isStatefulComponent(Component)) {
		var instance = new Component(props, context);

		instance._patch = patch;
		instance._componentToDOMNodeMap = componentToDOMNodeMap;
		if (!isNullOrUndefined(lastInstance) && props.ref) {
			mountRef(lastInstance, props.ref, instance);
		}
		var childContext = instance.getChildContext();

		if (!isNullOrUndefined(childContext)) {
			context = Object.assign({}, context, childContext);
		}
		instance.context = context;
		instance._unmounted = false;
		instance._parentNode = parentNode;
		if (lastInstance) {
			instance._parentComponent = lastInstance;
		}
		instance._pendingSetState = true;
		instance.componentWillMount();
		var node = instance.render();

		if (isInvalidNode(node)) {
			node = createVPlaceholder();
		}
		instance._pendingSetState = false;
		dom = mount(node, null, lifecycle, context, instance, false);
		instance._lastNode = node;
		instance.componentDidMount();
		if (parentDom !== null && !isInvalidNode(dom)) {
			parentDom.appendChild(dom);
		}
		componentToDOMNodeMap.set(instance, dom);
		parentNode.dom = dom;
		parentNode.instance = instance;
	} else {
		if (!isNullOrUndefined(hooks)) {
			if (!isNullOrUndefined(hooks.componentWillMount)) {
				hooks.componentWillMount(null, props);
			}
			if (!isNullOrUndefined(hooks.componentDidMount)) {
				lifecycle.addListener(function () {
					hooks.componentDidMount(dom, props);
				});
			}
		}

		/* eslint new-cap: 0 */
		var node$1 = Component(props, context);

		if (isInvalidNode(node$1)) {
			node$1 = createVPlaceholder();
		}
		dom = mount(node$1, null, lifecycle, context, null, false);

		parentNode.instance = node$1;

		if (parentDom !== null && !isInvalidNode(dom)) {
			parentDom.appendChild(dom);
		}
		parentNode.dom = dom;
	}
	return dom;
}

function mountAttributes(node, attrs, attrKeys, dom, instance) {
	for (var i = 0; i < attrKeys.length; i++) {
		var attr = attrKeys[i];

		if (attr === 'ref') {
			mountRef(getRefInstance$1(node, instance), attrs[attr], dom);
		} else {
			patchAttribute(attr, null, attrs[attr], dom);
		}
	}
}

function patch(lastInput, nextInput, parentDom, lifecycle, context, instance, isSVG) {
	if (lastInput !== nextInput) {
		if (isInvalidNode(lastInput)) {
			mount(nextInput, parentDom, lifecycle, context, instance, isSVG);
		} else if (isInvalidNode(nextInput)) {
			remove(lastInput, parentDom);
		} else if (isStringOrNumber(lastInput)) {
			if (isStringOrNumber(nextInput)) {
				parentDom.firstChild.nodeValue = nextInput;
			} else {
				var dom = mount(nextInput, null, lifecycle, context, instance, isSVG);

				nextInput.dom = dom;
				replaceNode(parentDom, dom, parentDom.firstChild);
			}
		} else if (isStringOrNumber(nextInput)) {
			replaceNode(parentDom, document.createTextNode(nextInput), lastInput.dom);
		} else {
			if (isVList(nextInput)) {
				if (isVList(lastInput)) {
					patchVList(lastInput, nextInput, parentDom, lifecycle, context, instance, isSVG);
				} else {
					replaceNode(parentDom, mountVList(nextInput, null, lifecycle, context, instance, isSVG), lastInput.dom);
					unmount(lastInput, null);
				}
			} else if (isVList(lastInput)) {
				replaceVListWithNode(parentDom, lastInput, mount(nextInput, null, lifecycle, context, instance, isSVG));
			} else if (isVPlaceholder(nextInput)) {
				if (isVPlaceholder(lastInput)) {
					patchVFragment(lastInput, nextInput);
				} else {
					replaceNode(parentDom, mountVPlaceholder(nextInput, null), lastInput.dom);
					unmount(lastInput, null);
				}
			} else if (isVPlaceholder(lastInput)) {
				replaceNode(parentDom, mount(nextInput, null, lifecycle, context, instance, isSVG), lastInput.dom);
			} else if (isVText(nextInput)) {
				if (isVText(lastInput)) {
					patchVText(lastInput, nextInput);
				} else {
					replaceNode(parentDom, mountVText(nextInput, null), lastInput.dom);
					unmount(lastInput, null);
				}
			} else if (isVText(lastInput)) {
				replaceNode(parentDom, mount(nextInput, null, lifecycle, context, instance, isSVG), lastInput.dom);
			} else if (isVNode(nextInput)) {
				if (isVNode(lastInput)) {
					patchVNode(lastInput, nextInput, parentDom, lifecycle, context, instance, isSVG, false);
				} else {
					replaceNode(parentDom, mountVNode(nextInput, null, lifecycle, context, instance, isSVG), lastInput.dom);
					unmount(lastInput, null);
				}
			} else if (isVNode(lastInput)) {
				replaceNode(parentDom, mount(nextInput, null, lifecycle, context, instance, isSVG), lastInput.dom);
				unmount(lastInput, null);
			} else {
				return patch(lastInput, normalise(nextInput), parentDom, lifecycle, context, instance, isSVG);
			}
		}
	}
	return nextInput;
}

function patchTextNode(dom, lastChildren, nextChildren) {
	if (isStringOrNumber(lastChildren) && lastChildren !== '') {
		dom.firstChild.nodeValue = nextChildren;
	} else {
		dom.textContent = nextChildren;
	}
}

function patchRef(instance, lastValue, nextValue, dom) {
	if (instance) {
		if (isString(lastValue)) {
			delete instance.refs[lastValue];
		}
		if (isString(nextValue)) {
			instance.refs[nextValue] = dom;
		}
	}
}

function patchChildren(lastNode, nextNode, dom, lifecycle, context, instance, isSVG) {
	var nextChildren = nextNode.children;
	var lastChildren = lastNode.children;

	if (lastChildren === nextChildren) {
		return;
	}
	if (isInvalidNode(lastChildren)) {
		if (isStringOrNumber(nextChildren)) {
			patchTextNode(dom, lastChildren, nextChildren);
		} else if (!isInvalidNode(nextChildren)) {
			if (isArray(nextChildren)) {
				mountArrayChildren(nextChildren, dom, lifecycle, context, instance, isSVG);
			} else {
				mount(nextChildren, dom, lifecycle, context, instance, isSVG);
			}
		}
	} else {
		if (isInvalidNode(nextChildren)) {
			removeAllChildren(dom, lastChildren);
		} else {
			if (isArray(lastChildren)) {
				if (isArray(nextChildren)) {
					nextChildren.complex = lastChildren.complex;
					if (isKeyed(lastChildren, nextChildren)) {
						patchKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, instance, isSVG, null);
					} else {
						patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, instance, isSVG, null);
					}
				} else {
					patchNonKeyedChildren(lastChildren, [nextChildren], dom, lifecycle, context, instance, isSVG, null);
				}
			} else {
				if (isArray(nextChildren)) {
					var lastChild = lastChildren;

					if (isStringOrNumber(lastChildren)) {
						lastChild = createVText(lastChild);
						lastChild.dom = dom.firstChild;
					}
					patchNonKeyedChildren([lastChild], nextChildren, dom, lifecycle, context, instance, isSVG, null);
				} else if (isStringOrNumber(nextChildren)) {
					patchTextNode(dom, lastChildren, nextChildren);
				} else if (isStringOrNumber(lastChildren)) {
					patch(lastChildren, nextChildren, dom, lifecycle, context, instance, isSVG);
				} else {
					patchVNode(lastChildren, nextChildren, dom, lifecycle, context, instance, isSVG, false);
				}
			}
		}
	}
}

function patchVNode(lastVNode, nextVNode, parentDom, lifecycle, context, instance, isSVG, skipLazyCheck) {
	var lastBp = lastVNode.bp;
	var nextBp = nextVNode.bp;

	if (lastBp === undefined || nextBp === undefined) {
		patchVNodeWithoutBlueprint(lastVNode, nextVNode, parentDom, lifecycle, context, instance, isSVG);
	} else {
		patchVNodeWithBlueprint(lastVNode, nextVNode, lastBp, nextBp, parentDom, lifecycle, context, instance, skipLazyCheck);
	}
}

function patchVNodeWithBlueprint(lastVNode, nextVNode, lastBp, nextBp, parentDom, lifecycle, context, instance, skipLazyCheck) {
	var nextHooks;

	if (nextBp.hasHooks === true) {
		nextHooks = nextVNode.hooks;
		if (nextHooks && !isNullOrUndefined(nextHooks.willUpdate)) {
			nextHooks.willUpdate(lastVNode.dom);
		}
	}
	var nextTag = nextVNode.tag || nextBp.tag;
	var lastTag = lastVNode.tag || lastBp.tag;

	if (lastTag !== nextTag) {
		if (lastBp && lastBp.isComponent === true) {
			var lastNodeInstance = lastVNode.instance;

			if (nextBp.isComponent === true) {
				replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, instance, false);
			} else if (isStatefulComponent(lastTag)) {
				unmountVNode(lastVNode, null, true);
				var lastNode = lastNodeInstance._lastNode;
				patchVNodeWithBlueprint(lastNode, nextVNode, lastNode.bp, nextBp, parentDom, lifecycle, context, instance, nextBp.isSVG);
			} else {
				unmountVNode(lastVNode, null, true);
				patchVNodeWithBlueprint(lastNodeInstance, nextVNode, lastNodeInstance.bp, nextBp, parentDom, lifecycle, context, instance, nextBp.isSVG);
			}
		} else {
			replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, instance, nextBp.isSVG);
		}
	} else if (isNullOrUndefined(lastTag)) {
		nextVNode.dom = lastVNode.dom;
	} else {
		if (lastBp && lastBp.isComponent === true) {
			if (nextBp.isComponent === true) {
				var instance$1 = lastVNode.instance;

				if (!isNullOrUndefined(instance$1) && instance$1._unmounted) {
					var newDom = mountComponent(nextVNode, lastTag, nextVNode.attrs || {}, nextVNode.hooks, nextVNode.children, instance$1, parentDom, lifecycle, context);
					if (parentDom !== null) {
						replaceNode(parentDom, newDom, lastVNode.dom);
					}
				} else {
					nextVNode.instance = instance$1;
					nextVNode.dom = lastVNode.dom;
					patchComponent(true, nextVNode, nextVNode.tag, lastBp, nextBp, instance$1, lastVNode.attrs || {}, nextVNode.attrs || {}, nextVNode.hooks, lastVNode.children, nextVNode.children, parentDom, lifecycle, context);
				}
			}
		} else {
			var dom = lastVNode.dom;
			var lastChildrenType = lastBp.childrenType;
			var nextChildrenType = nextBp.childrenType;
			nextVNode.dom = dom;

			if (nextBp.lazy === true && skipLazyCheck === false) {
				var clipData = lastVNode.clipData;

				if (lifecycle.scrollY === null) {
					lifecycle.refresh();
				}

				nextVNode.clipData = clipData;
				if (clipData.pending === true || clipData.top - lifecycle.scrollY > lifecycle.screenHeight) {
					if (setClipNode(clipData, dom, lastVNode, nextVNode, parentDom, lifecycle, context, instance, lastBp.isSVG)) {
						return;
					}
				}
				if (clipData.bottom < lifecycle.scrollY) {
					if (setClipNode(clipData, dom, lastVNode, nextVNode, parentDom, lifecycle, context, instance, lastBp.isSVG)) {
						return;
					}
				}
			}

			if (lastChildrenType > 0 || nextChildrenType > 0) {
				if (nextChildrenType === 5 || lastChildrenType === 5) {
					patchChildren(lastVNode, nextVNode, dom, lifecycle, context, instance);
				} else {
					var lastChildren = lastVNode.children;
					var nextChildren = nextVNode.children;

					if (lastChildrenType === 0 || isInvalidNode(lastChildren)) {
						if (nextChildrenType > 2) {
							mountArrayChildren(nextChildren, dom, lifecycle, context, instance);
						} else {
							mount(nextChildren, dom, lifecycle, context, instance);
						}
					} else if (nextChildrenType === 0 || isInvalidNode(nextChildren)) {
						if (lastChildrenType > 2) {
							removeAllChildren(dom, lastChildren);
						} else {
							remove(lastChildren, dom);
						}
					} else {
						if (lastChildren !== nextChildren) {
							if (lastChildrenType === 4 && nextChildrenType === 4) {
								patchKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, instance, nextBp.isSVG, null);
							} else if (lastChildrenType === 2 && nextChildrenType === 2) {
								patch(lastChildren, nextChildren, dom, lifecycle, context, instance, true, nextBp.isSVG);
							} else if (lastChildrenType === 1 && nextChildrenType === 1) {
								patchTextNode(dom, lastChildren, nextChildren);
							} else {
								patchChildren(lastVNode, nextVNode, dom, lifecycle, context, instance, nextBp.isSVG);
							}
						}
					}
				}
			}
			if (lastBp.hasAttrs === true || nextBp.hasAttrs === true) {
				patchAttributes(lastVNode, nextVNode, lastBp.attrKeys, nextBp.attrKeys, dom, instance);
			}
			if (lastBp.hasEvents === true || nextBp.hasEvents === true) {
				patchEvents(lastVNode.events, nextVNode.events, lastBp.eventKeys, nextBp.eventKeys, dom);
			}
			if (lastBp.hasClassName === true || nextBp.hasClassName === true) {
				var nextClassName = nextVNode.className;

				if (lastVNode.className !== nextClassName) {
					if (isNullOrUndefined(nextClassName)) {
						dom.removeAttribute('class');
					} else {
						dom.className = nextClassName;
					}
				}
			}
			if (lastBp.hasStyle === true || nextBp.hasStyle === true) {
				var nextStyle = nextVNode.style;
				var lastStyle = lastVNode.style;

				if (lastStyle !== nextStyle) {
					patchStyle(lastStyle, nextStyle, dom);
				}
			}
			if (nextBp.hasHooks === true && !isNullOrUndefined(nextHooks.didUpdate)) {
				nextHooks.didUpdate(dom);
			}
			setFormElementProperties(nextTag, nextVNode);
		}
	}
}

function patchVNodeWithoutBlueprint(lastNode, nextNode, parentDom, lifecycle, context, instance, isSVG) {
	var nextHooks = nextNode.hooks;
	var nextHooksDefined = !isNullOrUndefined(nextHooks);

	if (nextHooksDefined && !isNullOrUndefined(nextHooks.willUpdate)) {
		nextHooks.willUpdate(lastNode.dom);
	}
	var nextTag = nextNode.tag || ((isNullOrUndefined(nextNode.bp)) ? null : nextNode.bp.tag);
	var lastTag = lastNode.tag || ((isNullOrUndefined(lastNode.bp)) ? null : lastNode.bp.tag);

	if (nextTag === 'svg') {
		isSVG = true;
	}
	if (lastTag !== nextTag) {
		var lastNodeInstance = lastNode.instance;

		if (isFunction(lastTag)) {
			if (isFunction(nextTag)) {
				replaceWithNewNode(lastNode, nextNode, parentDom, lifecycle, context, instance, isSVG);
			} else if (isStatefulComponent(lastTag)) {
				unmountVNode(lastNode, null, true);
				patchVNodeWithoutBlueprint(lastNodeInstance._lastNode, nextNode, parentDom, lifecycle, context, instance, isSVG);
			} else {
				unmountVNode(lastNode, null, true);
				patchVNodeWithoutBlueprint(lastNodeInstance, nextNode, parentDom, lifecycle, context, instance, isSVG);
			}
		} else {
			replaceWithNewNode(lastNodeInstance || lastNode, nextNode, parentDom, lifecycle, context, instance, isSVG);
		}
	} else if (isNullOrUndefined(lastTag)) {
		nextNode.dom = lastNode.dom;
	} else {
		if (isFunction(lastTag)) {
			if (isFunction(nextTag)) {
				var instance$1 = lastNode._instance;

				if (!isNullOrUndefined(instance$1) && instance$1._unmounted) {
					var newDom = mountComponent(nextNode, lastTag, nextNode.attrs || {}, nextNode.hooks, nextNode.children, instance$1, parentDom, lifecycle, context);
					if (parentDom !== null) {
						replaceNode(parentDom, newDom, lastNode.dom);
					}
				} else {
					nextNode.instance = lastNode.instance;
					nextNode.dom = lastNode.dom;
					patchComponent(false, nextNode, nextNode.tag, null, null, nextNode.instance, lastNode.attrs || {}, nextNode.attrs || {}, nextNode.hooks, lastNode.children, nextNode.children, parentDom, lifecycle, context);
				}
			}
		} else {
			var dom = lastNode.dom;
			var nextClassName = nextNode.className;
			var nextStyle = nextNode.style;

			nextNode.dom = dom;

			patchChildren(lastNode, nextNode, dom, lifecycle, context, instance, isSVG);
			patchAttributes(lastNode, nextNode, null, null, dom, instance);
			patchEvents(lastNode.events, nextNode.events, null, null, dom);

			if (lastNode.className !== nextClassName) {
				if (isNullOrUndefined(nextClassName)) {
					dom.removeAttribute('class');
				} else {
					dom.className = nextClassName;
				}
			}
			if (lastNode.style !== nextStyle) {
				patchStyle(lastNode.style, nextStyle, dom);
			}
			if (nextHooksDefined && !isNullOrUndefined(nextHooks.didUpdate)) {
				nextHooks.didUpdate(dom);
			}
			setFormElementProperties(nextTag, nextNode);
		}
	}
}

function patchAttributes(lastNode, nextNode, lastAttrKeys, nextAttrKeys, dom, instance) {
	if (lastNode.tag === 'select') {
		selectValue(nextNode);
	}
	var nextAttrs = nextNode.attrs;
	var lastAttrs = lastNode.attrs;
	var nextAttrsIsUndef = isNullOrUndefined(nextAttrs);
	var lastAttrsIsNotUndef = !isNullOrUndefined(lastAttrs);

	if (!nextAttrsIsUndef) {
		var nextAttrsKeys = nextAttrKeys || Object.keys(nextAttrs);
		var attrKeysLength = nextAttrsKeys.length;

		for (var i = 0; i < attrKeysLength; i++) {
			var attr = nextAttrsKeys[i];
			var lastAttrVal = lastAttrsIsNotUndef && lastAttrs[attr];
			var nextAttrVal = nextAttrs[attr];

			if (lastAttrVal !== nextAttrVal) {
				if (attr === 'ref') {
					patchRef(instance, lastAttrVal, nextAttrVal, dom);
				} else {
					patchAttribute(attr, lastAttrVal, nextAttrVal, dom);
				}
			}
		}
	}
	if (lastAttrsIsNotUndef) {
		var lastAttrsKeys = lastAttrKeys || Object.keys(lastAttrs);
		var attrKeysLength$1 = lastAttrsKeys.length;

		for (var i$1 = 0; i$1 < attrKeysLength$1; i$1++) {
			var attr$1 = lastAttrsKeys[i$1];

			if (nextAttrsIsUndef || isNullOrUndefined(nextAttrs[attr$1])) {
				if (attr$1 === 'ref') {
					patchRef(getRefInstance(node, instance), lastAttrs[attr$1], null, dom);
				} else {
					dom.removeAttribute(attr$1);
				}
			}
		}
	}
}


function patchStyle(lastAttrValue, nextAttrValue, dom) {
	if (isString(nextAttrValue)) {
		dom.style.cssText = nextAttrValue;
	} else if (isNullOrUndefined(lastAttrValue)) {
		if (!isNullOrUndefined(nextAttrValue)) {
			var styleKeys = Object.keys(nextAttrValue);

			for (var i = 0; i < styleKeys.length; i++) {
				var style = styleKeys[i];
				var value = nextAttrValue[style];

				if (isNumber(value) && !isUnitlessNumber[style]) {
					dom.style[style] = value + 'px';
				} else {
					dom.style[style] = value;
				}
			}
		}
	} else if (isNullOrUndefined(nextAttrValue)) {
		dom.removeAttribute('style');
	} else {
		var styleKeys$1 = Object.keys(nextAttrValue);

		for (var i$1 = 0; i$1 < styleKeys$1.length; i$1++) {
			var style$1 = styleKeys$1[i$1];
			var value$1 = nextAttrValue[style$1];

			if (isNumber(value$1) && !isUnitlessNumber[style$1]) {
				dom.style[style$1] = value$1 + 'px';
			} else {
				dom.style[style$1] = value$1;
			}
		}
		var lastStyleKeys = Object.keys(lastAttrValue);

		for (var i$2 = 0; i$2 < lastStyleKeys.length; i$2++) {
			var style$2 = lastStyleKeys[i$2];
			if (isNullOrUndefined(nextAttrValue[style$2])) {
				dom.style[style$2] = '';
			}
		}
	}
}

function patchEvents(lastEvents, nextEvents, _lastEventKeys, _nextEventKeys, dom) {
	var nextEventsDefined = !isNullOrUndefined(nextEvents);
	var lastEventsDefined = !isNullOrUndefined(lastEvents);
	var lastEventKeys;

	if (lastEventsDefined) {
		lastEventKeys = _lastEventKeys || Object.keys(lastEvents);
	}
	if (nextEventsDefined) {
		var nextEventKeys = _nextEventKeys || Object.keys(nextEvents);

		if (lastEventsDefined) {
			for (var i = 0; i < nextEventKeys.length; i++) {
				var event = nextEventKeys[i];
				var lastEvent = lastEvents[event];
				var nextEvent = nextEvents[event];

				if (lastEvent !== nextEvent) {
					dom[event] = nextEvent;
				}
			}
			for (var i$1 = 0; i$1 < lastEventKeys.length; i$1++) {
				var event$1 = lastEventKeys[i$1];

				if (isNullOrUndefined(nextEvents[event$1])) {
					dom[event$1] = null;
				}
			}
		} else {
			mountEvents(nextEvents, nextEventKeys, dom);
		}
	} else if (lastEventsDefined) {
		removeEvents(lastEvents, lastEventKeys, dom);
	}
}

function patchAttribute(attrName, lastAttrValue, nextAttrValue, dom) {
	if (attrName === 'dangerouslySetInnerHTML') {
		var lastHtml = lastAttrValue && lastAttrValue.__html;
		var nextHtml = nextAttrValue && nextAttrValue.__html;

		if (isNullOrUndefined(nextHtml)) {
			throw new Error('Inferno Error: dangerouslySetInnerHTML requires an object with a __html propety containing the innerHTML content');
		}
		if (lastHtml !== nextHtml) {
			dom.innerHTML = nextHtml;
		}
	} else if (attrName === 'eventData') {
		dom.eventData = nextAttrValue;
	} else if (strictProps[attrName]) {
		dom[attrName] = nextAttrValue === null ? '' : nextAttrValue;
	} else {
		if (booleanProps[attrName]) {
			dom[attrName] = nextAttrValue ? true : false;
		} else {
			var ns = namespaces[attrName];

			if (nextAttrValue === false || isNullOrUndefined(nextAttrValue)) {
				if (ns !== undefined) {
					dom.removeAttributeNS(ns, attrName);
				} else {
					dom.removeAttribute(attrName);
				}
			} else {
				if (ns !== undefined) {
					dom.setAttributeNS(ns, attrName, nextAttrValue === true ? attrName : nextAttrValue);
				} else {
					dom.setAttribute(attrName, nextAttrValue === true ? attrName : nextAttrValue);
				}
			}
		}
	}
}

function patchComponent(hasBlueprint, lastNode, Component, lastBp, nextBp, instance, lastProps, nextProps, nextHooks, lastChildren, nextChildren, parentDom, lifecycle, context) {
	nextProps = addChildrenToProps(nextChildren, nextProps);

	if (isStatefulComponent(Component)) {
		var prevProps = instance.props;
		var prevState = instance.state;
		var nextState = instance.state;

		var childContext = instance.getChildContext();
		if (!isNullOrUndefined(childContext)) {
			context = Object.assign({}, context, childContext);
		}
		instance.context = context;
		var nextNode = instance._updateComponent(prevState, nextState, prevProps, nextProps);

		if (nextNode === NO_RENDER) {
			nextNode = instance._lastNode;
		} else if (isNullOrUndefined(nextNode)) {
			nextNode = createVPlaceholder();
		}
		patch(instance._lastNode, nextNode, parentDom, lifecycle, context, instance, null, false);
		lastNode.dom = nextNode.dom;
		instance._lastNode = nextNode;
		instance.componentDidUpdate(prevProps, prevState);
		componentToDOMNodeMap.set(instance, nextNode.dom);
	} else {
		var shouldUpdate = true;
		var nextHooksDefined = (hasBlueprint && nextBp.hasHooks === true) || !isNullOrUndefined(nextHooks);

		lastProps = addChildrenToProps(lastChildren, lastProps);
		if (nextHooksDefined && !isNullOrUndefined(nextHooks.componentShouldUpdate)) {
			shouldUpdate = nextHooks.componentShouldUpdate(lastNode.dom, lastProps, nextProps);
		}
		if (shouldUpdate !== false) {
			if (nextHooksDefined && !isNullOrUndefined(nextHooks.componentWillUpdate)) {
				nextHooks.componentWillUpdate(lastNode.dom, lastProps, nextProps);
			}
			var nextNode$1 = Component(nextProps, context);

			if (isInvalidNode(nextNode$1)) {
				nextNode$1 = createVPlaceholder();
			}
			nextNode$1.dom = lastNode.dom;
			patch(instance, nextNode$1, parentDom, lifecycle, context, null, null, false);
			lastNode.instance = nextNode$1;
			if (nextHooksDefined && !isNullOrUndefined(nextHooks.componentDidUpdate)) {
				nextHooks.componentDidUpdate(lastNode.dom, lastProps, nextProps);
			}
		}
	}
}

function patchVList(lastVList, nextVList, parentDom, lifecycle, context, instance, isSVG) {
	var lastItems = lastVList.items;
	var nextItems = nextVList.items;
	var pointer = lastVList.pointer;

	nextVList.dom = lastVList.dom;
	nextVList.pointer = pointer;
	if (!lastItems !== nextItems) {
		if (isKeyed(lastItems, nextItems)) {
			patchKeyedChildren(lastItems, nextItems, parentDom, lifecycle, context, instance, isSVG, nextVList);
		} else {
			patchNonKeyedChildren(lastItems, nextItems, parentDom, lifecycle, context, instance, isSVG, nextVList);
		}
	}
}

function patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, instance, isSVG, parentVList) {
	var lastChildrenLength = lastChildren.length;
	var nextChildrenLength = nextChildren.length;
	var commonLength = lastChildrenLength > nextChildrenLength ? nextChildrenLength : lastChildrenLength;
	var i = 0;

	for (; i < commonLength; i++) {
		var lastChild = lastChildren[i];
		var nextChild = normaliseChild(nextChildren, i);

		patch(lastChild, nextChild, dom, lifecycle, context, instance, isSVG);
	}
	if (lastChildrenLength < nextChildrenLength) {
		for (i = commonLength; i < nextChildrenLength; i++) {
			var child = normaliseChild(nextChildren, i);

			insertOrAppend(dom, mount(child, null, lifecycle, context, instance, isSVG), parentVList && parentVList.pointer);
		}
	} else if (lastChildrenLength > nextChildrenLength) {
		for (i = commonLength; i < lastChildrenLength; i++) {
			remove(lastChildren[i], dom);
		}
	}
}

function patchVFragment(lastVFragment, nextVFragment) {
	nextVFragment.dom = lastVFragment.dom;
}

function patchVText(lastVText, nextVText) {
	var nextText = nextVText.text;
	var dom = lastVText.dom;

	nextVText.dom = dom;
	if (lastVText.text !== nextText) {
		dom.nodeValue = nextText;
	}
}

function patchKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, instance, isSVG, parentVList) {
	var lastChildrenLength = lastChildren.length;
	var nextChildrenLength = nextChildren.length;
	var lastEndIndex = lastChildrenLength - 1;
	var nextEndIndex = nextChildrenLength - 1;
	var lastStartIndex = 0;
	var nextStartIndex = 0;
	var lastStartNode = null;
	var nextStartNode = null;
	var nextEndNode = null;
	var lastEndNode = null;
	var nextNode;

	while (lastStartIndex <= lastEndIndex && nextStartIndex <= nextEndIndex) {
		nextStartNode = nextChildren[nextStartIndex];
		lastStartNode = lastChildren[lastStartIndex];

		if (nextStartNode.key !== lastStartNode.key) {
			break;
		}
		patchVNode(lastStartNode, nextStartNode, dom, lifecycle, context, instance, isSVG, false);
		nextStartIndex++;
		lastStartIndex++;
	}
	while (lastStartIndex <= lastEndIndex && nextStartIndex <= nextEndIndex) {
		nextEndNode = nextChildren[nextEndIndex];
		lastEndNode = lastChildren[lastEndIndex];

		if (nextEndNode.key !== lastEndNode.key) {
			break;
		}
		patchVNode(lastEndNode, nextEndNode, dom, lifecycle, context, instance, isSVG, false);
		nextEndIndex--;
		lastEndIndex--;
	}
	while (lastStartIndex <= lastEndIndex && nextStartIndex <= nextEndIndex) {
		nextEndNode = nextChildren[nextEndIndex];
		lastStartNode = lastChildren[lastStartIndex];

		if (nextEndNode.key !== lastStartNode.key) {
			break;
		}
		nextNode = (nextEndIndex + 1 < nextChildrenLength) ? nextChildren[nextEndIndex + 1].dom : null;
		patchVNode(lastStartNode, nextEndNode, dom, lifecycle, context, instance, isSVG, false);
		insertOrAppend(dom, nextEndNode.dom, nextNode);
		nextEndIndex--;
		lastStartIndex++;
	}
	while (lastStartIndex <= lastEndIndex && nextStartIndex <= nextEndIndex) {
		nextStartNode = nextChildren[nextStartIndex];
		lastEndNode = lastChildren[lastEndIndex];

		if (nextStartNode.key !== lastEndNode.key) {
			break;
		}
		nextNode = lastChildren[lastStartIndex].dom;
		patchVNode(lastEndNode, nextStartNode, dom, lifecycle, context, instance, isSVG, false);
		insertOrAppend(dom, nextStartNode.dom, nextNode);
		nextStartIndex++;
		lastEndIndex--;
	}

	if (lastStartIndex > lastEndIndex) {
		if (nextStartIndex <= nextEndIndex) {
			nextNode = (nextEndIndex + 1 < nextChildrenLength) ? nextChildren[nextEndIndex + 1].dom : parentVList && parentVList.pointer;
			for (; nextStartIndex <= nextEndIndex; nextStartIndex++) {
				insertOrAppend(dom, mount(nextChildren[nextStartIndex], null, lifecycle, context, instance, isSVG), nextNode);
			}
		}
	} else if (nextStartIndex > nextEndIndex) {
		while (lastStartIndex <= lastEndIndex) {
			remove(lastChildren[lastStartIndex++], dom);
		}
	} else {
		var aLength = lastEndIndex - lastStartIndex + 1;
		var bLength = nextEndIndex - nextStartIndex + 1;
		var sources = new Array(bLength);

		// Mark all nodes as inserted.
		var i;
		for (i = 0; i < bLength; i++) {
			sources[i] = -1;
		}
		var moved = false;
		var removeOffset = 0;
		var lastTarget = 0;
		var index;
		var removed = true;
		var k = 0;

		if ((bLength <= 4) || (aLength * bLength <= 16)) {
			for (i = lastStartIndex; i <= lastEndIndex; i++) {
				removed = true;
				lastEndNode = lastChildren[i];
				if (k < bLength) {
					for (index = nextStartIndex; index <= nextEndIndex; index++) {
						nextEndNode = nextChildren[index];
						if (lastEndNode.key === nextEndNode.key) {
							sources[index - nextStartIndex] = i;

							if (lastTarget > index) {
								moved = true;
							} else {
								lastTarget = index;
							}
							patchVNode(lastEndNode, nextEndNode, dom, lifecycle, context, instance, isSVG, false);
							k++;
							removed = false;
							break;
						}
					}
				}
				if (removed) {
					remove(lastEndNode, dom);
					removeOffset++;
				}
			}
		} else {
			var prevItemsMap = new Map();

			for (i = nextStartIndex; i <= nextEndIndex; i++) {
				prevItemsMap.set(nextChildren[i].key, i);
			}
			for (i = lastStartIndex; i <= lastEndIndex; i++) {
				removed = true;
				lastEndNode = lastChildren[i];

				if (k < nextChildrenLength) {
					index = prevItemsMap.get(lastEndNode.key);

					if (index !== undefined) {
						nextEndNode = nextChildren[index];
						sources[index - nextStartIndex] = i;
						if (lastTarget > index) {
							moved = true;
						} else {
							lastTarget = index;
						}
						patchVNode(lastEndNode, nextEndNode, dom, lifecycle, context, instance, isSVG, false);
						k++;
						removed = false;
					}
				}
				if (removed) {
					remove(lastEndNode, dom);
					removeOffset++;
				}
			}
		}

		var pos;
		if (moved) {
			var seq = lis_algorithm(sources);
			index = seq.length - 1;
			for (i = bLength - 1; i >= 0; i--) {
				if (sources[i] === -1) {
					pos = i + nextStartIndex;
					nextNode = (pos + 1 < nextChildrenLength) ? nextChildren[pos + 1].dom : parentVList && parentVList.pointer;
					insertOrAppend(dom, mount(nextChildren[pos], null, lifecycle, context, instance, isSVG), nextNode);
				} else {
					if (index < 0 || i !== seq[index]) {
						pos = i + nextStartIndex;
						nextNode = (pos + 1 < nextChildrenLength) ? nextChildren[pos + 1].dom : parentVList && parentVList.pointer;
						insertOrAppend(dom, nextChildren[pos].dom, nextNode);
					} else {
						index--;
					}
				}
			}
		} else if (aLength - removeOffset !== bLength) {
			for (i = bLength - 1; i >= 0; i--) {
				if (sources[i] === -1) {
					pos = i + nextStartIndex;
					nextNode = (pos + 1 < nextChildrenLength) ? nextChildren[pos + 1].dom : parentVList && parentVList.pointer;
					insertOrAppend(dom, mount(nextChildren[pos], null, lifecycle, context, instance, isSVG), nextNode);
				}
			}
		}
	}
}

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function lis_algorithm(a) {
	var p = a.slice(0);
	var result = [];
	result.push(0);
	var i;
	var j;
	var u;
	var v;
	var c;

	for (i = 0; i < a.length; i++) {
		if (a[i] === -1) {
			continue;
		}

		j = result[result.length - 1];
		if (a[j] < a[i]) {
			p[i] = j;
			result.push(i);
			continue;
		}

		u = 0;
		v = result.length - 1;

		while (u < v) {
			c = ((u + v) / 2) | 0;
			if (a[result[c]] < a[i]) {
				u = c + 1;
			} else {
				v = c;
			}
		}

		if (a[i] < a[result[u]]) {
			if (u > 0) {
				p[i] = result[u - 1];
			}
			result[u] = i;
		}
	}

	u = result.length;
	v = result[u - 1];

	while (u-- > 0) {
		result[u] = v;
		v = p[v];
	}

	return result;
}

var screenWidth = isBrowser && window.screen.width;
var screenHeight = isBrowser && window.screen.height;
var scrollX = 0;
var scrollY = 0;
var lastScrollTime = 0;

if (isBrowser) {
	window.onscroll = function () {
		scrollX = window.scrollX;
		scrollY = window.scrollY;
		lastScrollTime = performance.now();
	};

	window.resize = function () {
		scrollX = window.scrollX;
		scrollY = window.scrollY;
		screenWidth = window.screen.width;
		screenHeight = window.screen.height;
		lastScrollTime = performance.now();
	};
}

function Lifecycle() {
	this._listeners = [];
	this.scrollX = null;
	this.scrollY = null;
	this.screenHeight = screenHeight;
	this.screenWidth = screenWidth;
}

Lifecycle.prototype = {
	refresh: function refresh() {
		this.scrollX = isBrowser && window.scrollX;
		this.scrollY = isBrowser && window.scrollY;
	},
	addListener: function addListener(callback) {
		this._listeners.push(callback);
	},
	trigger: function trigger() {
		var this$1 = this;

		for (var i = 0; i < this._listeners.length; i++) {
			this$1._listeners[i]();
		}
	}
};

function handleLazyAttached(node, lifecycle, dom) {
	lifecycle.addListener(function () {
		var rect = dom.getBoundingClientRect();

		if (lifecycle.scrollY === null) {
			lifecycle.refresh();
		}
		node.clipData = {
			top: rect.top + lifecycle.scrollY,
			left: rect.left + lifecycle.scrollX,
			bottom: rect.bottom + lifecycle.scrollY,
			right: rect.right + lifecycle.scrollX,
			pending: false
		};
	});
}

function hydrateChild(child, childNodes, counter, parentDom, lifecycle, context, instance) {
	var domNode = childNodes[counter.i];

	if (isVText(child)) {
		var text = child.text;

		child.dom = domNode;
		if (domNode.nodeType === 3 && text !== '') {
			domNode.nodeValue = text;
		} else {
			var newDomNode = mountVText(text);

			replaceNode(parentDom, newDomNode, domNode);
			childNodes.splice(childNodes.indexOf(domNode), 1, newDomNode);
			child.dom = newDomNode;
		}
	} else if (isVPlaceholder(child)) {
		child.dom = domNode;
	} else if (isVList(child)) {
		var items = child.items;

		// this doesn't really matter, as it won't be used again, but it's what it should be given the purpose of VList
		child.dom = document.createDocumentFragment();
		for (var i = 0; i < items.length; i++) {
			var rebuild = hydrateChild(normaliseChild(items, i), childNodes, counter, parentDom, lifecycle, context, instance);

			if (rebuild) {
				return true;
			}
		}
		// at the end of every VList, there should be a "pointer". It's an empty TextNode used for tracking the VList
		var pointer = childNodes[counter.i++];

		if (pointer && pointer.nodeType === 3) {
			child.pointer = pointer;
		} else {
			// there is a problem, we need to rebuild this tree
			return true;
		}
	} else {
		var rebuild$1 = hydrateNode(child, domNode, parentDom, lifecycle, context, instance, false);

		if (rebuild$1) {
			return true;
		}
	}
	counter.i++;
}

function getChildNodesWithoutComments(domNode) {
	var childNodes = [];
	var rawChildNodes = domNode.childNodes;
	var length = rawChildNodes.length;
	var i = 0;

	while (i < length) {
		var rawChild = rawChildNodes[i];

		if (rawChild.nodeType === 8) {
			if (rawChild.data === '!') {
				var placeholder = document.createTextNode('');

				domNode.replaceChild(placeholder, rawChild);
				childNodes.push(placeholder);
				i++;
			} else {
				domNode.removeChild(rawChild);
				length--;
			}
		} else {
			childNodes.push(rawChild);
			i++;
		}
	}
	return childNodes;
}

function hydrateComponent(node, Component, props, hooks, children, domNode, parentDom, lifecycle, context, lastInstance, isRoot) {
	props = addChildrenToProps(children, props);

	if (isStatefulComponent(Component)) {
		var instance = node.instance = new Component(props);

		instance._patch = patch;
		if (!isNullOrUndefined(lastInstance) && props.ref) {
			mountRef(lastInstance, props.ref, instance);
		}
		var childContext = instance.getChildContext();

		if (!isNullOrUndefined(childContext)) {
			context = Object.assign({}, context, childContext);
		}
		instance.context = context;
		instance._unmounted = false;
		instance._parentNode = node;
		if (lastInstance) {
			instance._parentComponent = lastInstance;
		}
		instance._pendingSetState = true;
		instance.componentWillMount();
		var nextNode = instance.render();

		instance._pendingSetState = false;
		if (isInvalidNode(nextNode)) {
			nextNode = createVPlaceholder();
		}
		hydrateNode(nextNode, domNode, parentDom, lifecycle, context, instance, isRoot);
		instance._lastNode = nextNode;
		instance.componentDidMount();

	} else {
		var instance$1 = node.instance = Component(props);

		if (!isNullOrUndefined(hooks)) {
			if (!isNullOrUndefined(hooks.componentWillMount)) {
				hooks.componentWillMount(null, props);
			}
			if (!isNullOrUndefined(hooks.componentDidMount)) {
				lifecycle.addListener(function () {
					hooks.componentDidMount(domNode, props);
				});
			}
		}
		return hydrateNode(instance$1, domNode, parentDom, lifecycle, context, instance$1, isRoot);
	}
}

function hydrateNode(node, domNode, parentDom, lifecycle, context, instance, isRoot) {
	var bp = node.bp;
	var tag = node.tag || bp.tag;

	if (isFunction(tag)) {
		node.dom = domNode;
		hydrateComponent(node, tag, node.attrs || {}, node.hooks, node.children, domNode, parentDom, lifecycle, context, instance, isRoot);
	} else {
		if (
			domNode.nodeType !== 1 ||
			tag !== domNode.tagName.toLowerCase()
		) {
			// TODO remake node
		} else {
			node.dom = domNode;
			var hooks = node.hooks;

			if ((bp && bp.hasHooks === true) || !isNullOrUndefined(hooks)) {
				handleAttachedHooks(hooks, lifecycle, domNode);
			}
			var children = node.children;

			if (!isNullOrUndefined(children)) {
				if (isStringOrNumber(children)) {
					if (domNode.textContent !== children) {
						domNode.textContent = children;
					}
				} else {
					var childNodes = getChildNodesWithoutComments(domNode);
					var counter = { i: 0 };
					var rebuild = false;

					if (isArray(children)) {
						for (var i = 0; i < children.length; i++) {
							rebuild = hydrateChild(normaliseChild(children, i), childNodes, counter, domNode, lifecycle, context, instance);

							if (rebuild) {
								break;
							}
						}
					} else {
						if (childNodes.length === 1) {
							rebuild = hydrateChild(children, childNodes, counter, domNode, lifecycle, context, instance);
						} else {
							rebuild = true;
						}
					}

					if (rebuild) {
						// TODO scrap children and rebuild again
					}
				}
			}
			var className = node.className;
			var style = node.style;

			if (!isNullOrUndefined(className)) {
				domNode.className = className;
			}
			if (!isNullOrUndefined(style)) {
				patchStyle(null, style, domNode);
			}
			if (bp && bp.hasAttrs === true) {
				mountBlueprintAttrs(node, bp, domNode, instance);
			} else {
				var attrs = node.attrs;

				if (!isNullOrUndefined(attrs)) {
					handleSelects(node);
					mountAttributes(node, attrs, Object.keys(attrs), domNode, instance);
				}
			}
			if (bp && bp.hasEvents === true) {
				mountBlueprintEvents(node, bp, domNode);
			} else {
				var events = node.events;

				if (!isNullOrUndefined(events)) {
					mountEvents(events, Object.keys(events), domNode);
				}
			}
		}
	}
}
var documetBody = isBrowser ? document.body : null;

function hydrate(node, parentDom, lifecycle) {
	if (parentDom && parentDom.nodeType === 1) {
		var rootNode = parentDom.querySelector('[data-infernoroot]');

		if (rootNode && rootNode.parentNode === parentDom) {
			hydrateNode(node, rootNode, parentDom, lifecycle, {}, true);
			return true;
		}
	}
	// clear parentDom, unless it's document.body
	if (parentDom !== documetBody) {
		parentDom.textContent = '';
	} else {
		console.warn('Inferno Warning: rendering to the "document.body" is dangerous! Use a dedicated container element instead.');
	}
	return false;
}

var roots = new Map();
var componentToDOMNodeMap = new Map();

function findDOMNode(domNode) {
	return componentToDOMNodeMap.get(domNode) || null;
}

function render(input, parentDom) {
	var root = roots.get(parentDom);
	var lifecycle = new Lifecycle();

	if (isUndefined(root)) {
		if (!isInvalidNode(input)) {
			if (!hydrate(input, parentDom, lifecycle)) {
				mount(input, parentDom, lifecycle, {}, null, false);
			}
			lifecycle.trigger();
			roots.set(parentDom, { input: input });
		}
	} else {
		var activeNode = getActiveNode();
		var nextInput = patch(root.input, input, parentDom, lifecycle, {}, null, false);

		lifecycle.trigger();
		if (isNull(input)) {
			roots.delete(parentDom);
		}
		root.input = nextInput;
		resetActiveNode(activeNode);
	}
}

var index = {
	render: render,
	findDOMNode: findDOMNode,
	mount: mount,
	patch: patch,
	unmount: unmount
};

return index;

})));
});

var infernoDom = infernoDom$1;

__$styleInject("html, body {\n    margin: 0;\n    padding: 0;\n    height: 100%;\n}\nbody {\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    -ms-flex-direction: column;\n            -webkit-box-orient: vertical;\n            -webkit-box-direction: normal;\n        flex-direction: column;\n    min-width: 30em;\n}\n.container {\n    margin: 0 auto;\n    max-width: 60em;\n    width: 100%;\n}\n.representation {\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n}\n.representation.waiting {\n    background-color: #00B6F0;\n    background-image: url('/static/img/loader.gif');\n    background-position: 50% 40%;\n    background-size: auto;\n    background-repeat: no-repeat;\n    position: relative;\n}\n.representation.waiting.error {\n    background-image: url('/static/img/warning.png');\n}\n.representation.waiting .message {\n    position: absolute;\n    top: 60%;\n    width: 100%;\n}\n.representation.waiting .message p {\n    color: #fff;\n    font-family: 'Roboto';\n    font-size: 1.8em;\n    letter-spacing: 1px;\n    line-height: 1.4;\n    text-align: center;\n}\n.representation.waiting .message p a {\n    text-decoration: underline;\n}\nheader {\n    background-color: #192854;\n}\nheader .container {\n    background-image: url('/static/img/dius_logo.png');\n    background-position: 0 50%;\n    background-size: 180px;\n    background-repeat: no-repeat;\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    height: 5em;\n    margin: .5em auto;\n}\nheader span {\n    -ms-flex-item-align: center;\n        -ms-grid-row-align: center;\n        align-self: center;\n    color: #ffffff;\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n    font-family: 'Roboto';\n    font-size: 1.5em;\n    letter-spacing: 1px;\n    margin-left: 8em;\n    text-transform: uppercase;\n}\nheader .device-actions {\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    position: relative;\n}\nheader .device-actions button {\n    -ms-flex-item-align: center;\n        -ms-grid-row-align: center;\n        align-self: center;\n    background-color: #21366C;\n    background-image: url('/static/img/power.png');\n    background-position: 1em 50%;\n    background-repeat: no-repeat;\n    background-size: 28px;\n    border: 1px solid #A3A9AC;\n    border-radius: 0.25em;\n    color: #ffffff;\n    font-size: 1.125em;\n    padding: 0.875em 3.5em;\n    position: relative;\n}\nheader .device-actions button:after {\n    border-color: #ffffff transparent transparent transparent;\n    border-style: solid;\n    border-width: 5px 5px 0 5px;\n    content: '\\A';\n    height: 0;\n    position: absolute;\n    right: 10%;\n    top: 50%;\n    width: 0;\n}\nheader .device-actions .dropdown-device-actions {\n    background-color: #ffffff;\n    border-radius: 0.25em;\n    box-shadow: 0px 0px 5px 1px #192854;\n    display: none;\n    position: absolute;\n    right: 0;\n    top: 85%;\n    z-index: 100;\n}\nheader .device-actions .dropdown-device-actions li a {\n    border-radius: 0.25em;\n    display: block;\n    padding: 0.75em 1.5em;\n}\nheader .device-actions .dropdown-device-actions li a:hover {\n    background-color: #CBCFD1;\n}\nheader .device-actions .dropdown-device-actions li.separator div {\n    border: 0.03125em solid #CBCFD1;\n    margin: 0.75em 1.5em;\n}\nheader .device-actions:hover button {\n    background-color: #314B84;\n}\nheader .device-actions:hover button:after {\n    border-color: transparent transparent #ffffff transparent;\n    border-width: 0 5px 5px 5px;\n}\nheader .device-actions:hover .dropdown-device-actions {\n    display: block;\n}\nfooter {\n    background: #A3A9AC;\n    font-size: 0.75em;\n    padding: 0.625em;\n    text-align: center;\n}\nfooter div {\n    padding: .5em 0;\n}\nfooter div a {\n    text-decoration: underline;\n}\n", undefined);

__$styleInject(".tab {\n    min-width: 100%;\n}\n.tab .tab-nav-container {\n    border-bottom: 1px solid #A3A9AC;\n}\n.tab .tab-nav-container ul {\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    list-style: none;\n}\n.tab .tab-nav-container ul li {\n    -ms-flex-item-align: center;\n        -ms-grid-row-align: center;\n        align-self: center;\n    border-bottom-style: solid;\n    border-bottom-width: 4px;\n    border-bottom-color: transparent;\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n    margin-top: 4px;\n}\n.tab .tab-nav-container ul li a {\n    color: #666;\n    display: block;\n    font-family: 'Roboto', sans-serif;\n    letter-spacing: 2px;\n    padding: 1em 0;\n    text-align: center;\n    text-transform: uppercase;\n}\n.tab .tab-nav-container ul li.selected, .tab .tab-nav-container ul li:hover {\n    border-bottom-color: #192854;\n}\n.tab .tab-nav-container ul li.selected a, .tab .tab-nav-container ul li:hover a {\n    color: #192854;\n}\n.tab .tab-nav-container ul li.selected a {\n    font-weight: bold;\n}\n.tab .tab-content {\n    padding: 1.5em 0;\n}\n.tab .tab-content .tab-content-container {\n    display: block;\n}\n.tab .tab-content .tab-content-container.hidden {\n    display: none;\n}\n", undefined);

var inferno$1 = createCommonjsModule(function (module, exports) {
/*!
 * inferno v0.7.27
 * (c) 2016 Dominic Gannaway
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Inferno = factory());
}(commonjsGlobal, (function () { 'use strict';

// Runs only once in applications lifetime
var isBrowser = typeof window !== 'undefined' && window.document;

function isNullOrUndefined(obj) {
	return isUndefined(obj) || isNull(obj);
}

function isAttrAnEvent$1(attr) {
	return attr[0] === 'o' && attr[1] === 'n' && attr.length > 3;
}

function isNull(obj) {
	return obj === null;
}

function isUndefined(obj) {
	return obj === undefined;
}

function VNode(blueprint) {
	this.bp = blueprint;
	this.dom = null;
	this.instance = null;
	this.tag = null;
	this.children = null;
	this.style = null;
	this.className = null;
	this.attrs = null;
	this.events = null;
	this.hooks = null;
	this.key = null;
	this.clipData = null;
}

VNode.prototype = {
	setAttrs: function setAttrs(attrs) {
		this.attrs = attrs;
		return this;
	},
	setTag: function setTag(tag) {
		this.tag = tag;
		return this;
	},
	setStyle: function setStyle(style) {
		this.style = style;
		return this;
	},
	setClassName: function setClassName(className) {
		this.className = className;
		return this;
	},
	setChildren: function setChildren(children) {
		this.children = children;
		return this;
	},
	setHooks: function setHooks(hooks) {
		this.hooks = hooks;
		return this;
	},
	setEvents: function setEvents(events) {
		this.events = events;
		return this;
	},
	setKey: function setKey(key) {
		this.key = key;
		return this;
	}
};

function createVNode(bp) {
	return new VNode(bp);
}

function isAttrAnEvent(attr) {
	return attr[0] === 'o' && attr[1] === 'n' && attr.length > 3;
}

function isAttrAHook(hook) {
	return hook === 'onCreated'
		|| hook === 'onAttached'
		|| hook === 'onWillDetach'
		|| hook === 'onWillUpdate'
		|| hook === 'onDidUpdate';
}

function isAttrAComponentHook(hook) {
	return hook === 'onComponentWillMount'
		|| hook === 'onComponentDidMount'
		|| hook === 'onComponentWillUnmount'
		|| hook === 'onComponentShouldUpdate'
		|| hook === 'onComponentWillUpdate'
		|| hook === 'onComponentDidUpdate';
}


function createBlueprint(shape, childrenType) {
	var tag = shape.tag || null;
	var tagIsDynamic = tag && tag.arg !== undefined ? true : false;

	var children = isNullOrUndefined(shape.children) ? null : shape.children;
	var childrenIsDynamic = children && children.arg !== undefined ? true : false;

	var attrs = shape.attrs || null;
	var attrsIsDynamic = attrs && attrs.arg !== undefined ? true : false;

	var hooks = shape.hooks || null;
	var hooksIsDynamic = hooks && hooks.arg !== undefined ? true : false;

	var events = shape.events || null;
	var eventsIsDynamic = events && events.arg !== undefined ? true : false;

	var key = shape.key === undefined ? null : shape.key;
	var keyIsDynamic = !isNullOrUndefined(key) && !isNullOrUndefined(key.arg);

	var style = shape.style || null;
	var styleIsDynamic = style && style.arg !== undefined ? true : false;

	var className = shape.className === undefined ? null : shape.className;
	var classNameIsDynamic = className && className.arg !== undefined ? true : false;

	var spread = shape.spread === undefined ? null : shape.spread;
	var hasSpread = shape.spread !== undefined;

	var blueprint = {
		lazy: shape.lazy || false,
		dom: null,
		pool: [],
		tag: tagIsDynamic ? null : tag,
		className: className !== '' && className ? className : null,
		style: style !== '' && style ? style : null,
		isComponent: tagIsDynamic,
		hasAttrs: attrsIsDynamic || (attrs ? true : false),
		hasHooks: hooksIsDynamic,
		hasEvents: eventsIsDynamic,
		hasStyle: styleIsDynamic || (style !== '' && style ? true : false),
		hasClassName: classNameIsDynamic || (className !== '' && className ? true : false),
		childrenType: childrenType === undefined ? (children ? 5 : 0) : childrenType,
		attrKeys: null,
		eventKeys: null,
		isSVG: shape.isSVG || false
	};

	return function () {
		var vNode = new VNode(blueprint);

		if (tagIsDynamic === true) {
			vNode.tag = arguments[tag.arg];
		}
		if (childrenIsDynamic === true) {
			vNode.children = arguments[children.arg];
		}
		if (hasSpread) {
			var _spread = arguments[spread.arg];
			var attrs$1;
			var events$1;
			var hooks$1;
			var attrKeys = [];
			var eventKeys = [];

			for (var prop in _spread) {
				var value = _spread[prop];

				if (prop === 'className' || (prop === 'class' && !blueprint.isSVG)) {
					vNode.className = value;
					blueprint.hasClassName = true;
				} else if (prop === 'style') {
					vNode.style = value;
					blueprint.hasStyle = true;
				} else if (prop === 'key') {
					vNode.key = value;
				} else if (isAttrAHook(prop) || isAttrAComponentHook(prop)) {
					if (!hooks$1) {
						hooks$1 = {};
					}
					hooks$1[prop[2].toLowerCase() + prop.substring(3)] = value;
				} else if (isAttrAnEvent(prop)) {
					if (!events$1) {
						events$1 = {};
					}
					eventKeys.push(prop.toLowerCase());
					events$1[prop.toLowerCase()] = value;
				} else if (prop === 'children') {
					vNode.children = value;
					blueprint.childrenType = blueprint.childrenType || 5;
				} else {
					if (!attrs$1) {
						attrs$1 = {};
					}
					attrKeys.push(prop);
					attrs$1[prop] = value;
				}
			}
			if (attrs$1) {
				vNode.attrs = attrs$1;
				blueprint.attrKeys = attrKeys;
				blueprint.hasAttrs = true;
			}
			if (events$1) {
				vNode.events = events$1;
				blueprint.eventKeys = eventKeys;
				blueprint.hasEvents = true;
			}
			if (hooks$1) {
				vNode.hooks = hooks$1;
				blueprint.hasHooks = true;
			}
		} else {
			if (attrsIsDynamic === true) {
				vNode.attrs = arguments[attrs.arg];
			} else {
				vNode.attrs = attrs;
			}
			if (hooksIsDynamic === true) {
				vNode.hooks = arguments[hooks.arg];
			}
			if (eventsIsDynamic === true) {
				vNode.events = arguments[events.arg];
			}
			if (keyIsDynamic === true) {
				vNode.key = arguments[key.arg];
			} else {
				vNode.key = key;
			}
			if (styleIsDynamic === true) {
				vNode.style = arguments[style.arg];
			} else {
				vNode.style = blueprint.style;
			}
			if (classNameIsDynamic === true) {
				vNode.className = arguments[className.arg];
			} else {
				vNode.className = blueprint.className;
			}
		}
		return vNode;
	};
}

function VText(text) {
	this.text = text;
	this.dom = null;
}

function createVText(text) {
	return new VText(text);
}

// Copy of the util from dom/util, otherwise it makes massive bundles
function documentCreateElement(tag, isSVG) {
	var dom;

	if (isSVG === true) {
		dom = document.createElementNS('http://www.w3.org/2000/svg', tag);
	} else {
		dom = document.createElement(tag);
	}
	return dom;
}

function createUniversalElement(tag, attrs, isSVG) {
	if (isBrowser) {
		var dom = documentCreateElement(tag, isSVG);
		if (attrs) {
			createStaticAttributes(attrs, dom);
		}
		return dom;
	}
	return null;
}

function createStaticAttributes(attrs, dom) {
	var attrKeys = Object.keys(attrs);

	for (var i = 0; i < attrKeys.length; i++) {
		var attr = attrKeys[i];
		var value = attrs[attr];

		if (attr === 'className') {
			dom.className = value;
		} else {
			if (value === true) {
				dom.setAttribute(attr, attr);
			} else if (!isNullOrUndefined(value) && value !== false && !isAttrAnEvent$1(attr)) {
				dom.setAttribute(attr, value);
			}
		}
	}
}

var index = {
	createBlueprint: createBlueprint,
	createVNode: createVNode,
	createVText: createVText,
	universal: {
		createElement: createUniversalElement
	}
};

return index;

})));
});

var inferno = inferno$1;

__$styleInject(".alert {\n    border-radius: 0.1875em;\n    color: #f5f5f5;\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    margin-bottom: 1.5em;\n    padding: 1em;\n    -webkit-transition: .3s;\n    transition: .3s;\n}\n.alert.collapse {\n    padding: 0;\n    margin: 0;\n    visibility: collapse;\n}\n.alert.collapse span, .alert.collapse a {\n    display: none;\n}\n.alert.success {\n    background-color: #8A9939;\n}\n.alert.error {\n    background-color: #C12834;\n}\n.alert span {\n    -ms-flex: 0.9;\n            -webkit-box-flex: 0.9;\n        flex: 0.9;\n}\n.alert span a {\n    font-size: 1em;\n    font-weight: normal;\n    text-decoration: underline;\n}\n.alert a {\n    -ms-flex-item-align: end;\n        align-self: flex-end;\n    color: #f5f5f5;\n    -ms-flex: 0.1;\n            -webkit-box-flex: 0.1;\n        flex: 0.1;\n    font-size: 1.2em;\n    font-weight: bold;\n    right: 1em;\n    text-align: right;\n    -webkit-transition: none;\n    transition: none;\n}\n", undefined);

var bp0$1 = inferno.createBlueprint({
  tag: 'div'
});
var bp3$1 = inferno.createBlueprint({
  tag: 'a',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var bp2$1 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp1$1 = inferno.createBlueprint({
  tag: 'div',
  className: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var Alert = function Alert(model) {
  var content = bp0$1();

  var className = model.success ? 'alert success' : 'alert error';

  content = bp1$1(className, [bp2$1(model.message), bp3$1({
    href: '#'
  }, {
    onclick: model.dismissHandler
  }, '\xD7')]);

  return content;
};

function persistState(payload) {
  var requestOpts = {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  };

  fetch('/model', requestOpts).then(function (res) {
    return res.json();
  }).then(function (json) {
    render(represent(json));
  }).catch(function (err) {
    render(represent(err));
  });

  return false;
}

function addNewJob(present) {
  return persistState({ newJob: true });
}

function switchToTab(tabName, present) {
  return persistState({ tabChange: tabName });
}

function dismissAlert(model) {
  render(model);
  return false;
}

function save(data, present) {
  return persistState(data);
}

var bp1$2 = inferno.createBlueprint({
  tag: 'a',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var bp0$2 = inferno.createBlueprint({
  tag: 'li',
  className: {
    arg: 0
  },
  attrs: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var TabItem = function TabItem(tabInfo) {
  var selectedClass = tabInfo.active ? 'selected' : '';

  return bp0$2(selectedClass, {
    role: 'presentation'
  }, bp1$2({
    href: '#',
    'aria-controls': tabInfo.name,
    role: 'tab',
    'data-toggle': 'tab'
  }, {
    onclick: function onclick() {
      return switchToTab(tabInfo.name);
    }
  }, tabInfo.name));
};

__$styleInject("form {\n    letter-spacing: .03125em;\n}\nform h2 {\n    border-bottom: 1px solid #CBCFD1;\n    font-size: 1.25em;\n    margin: 0.4375em 0;\n    padding: 0.4375em 0;\n}\nform .form-container {\n    background-color: #EEEFF0;\n    border-radius: 0.1875em;\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    margin-bottom: 0.25em;\n    padding: 2em 4em;\n}\nform .form-container.vertical {\n    -ms-flex-direction: column;\n            -webkit-box-orient: vertical;\n            -webkit-box-direction: normal;\n        flex-direction: column;\n}\nform .form-container.vertical label {\n    margin: 0.5em 0;\n}\nform .form-container.jenkins [for=\"ciUsername\"], form .form-container.jenkins [name=\"ciUsername\"], form .form-container.jenkins [for=\"ciApiToken\"], form .form-container.jenkins [name=\"ciApiToken\"] {\n    display: none;\n    visibility: hidden;\n}\nform .form-container.circleci [for=\"ciAddress\"], form .form-container.circleci [name=\"ciAddress\"], form .form-container.buildkite [for=\"ciAddress\"], form .form-container.buildkite [name=\"ciAddress\"] {\n    display: none;\n    visibility: hidden;\n}\nform .form-container.buildkite [name=\"ciUsernameCircleCi\"], form .form-container.buildkite [name=\"ciUsernameTravis\"] {\n    display: none;\n    visibility: hidden;\n}\nform .form-container.circleci [name=\"ciUsernameBuildkite\"], form .form-container.circleci [name=\"ciUsernameTravis\"] {\n    display: none;\n    visibility: hidden;\n}\nform .form-container.travisci [name=\"ciUsernameCircleCi\"], form .form-container.travisci [name=\"ciUsernameBuildkite\"], form .form-container.travisci [for=\"ciAddress\"], form .form-container.travisci [name=\"ciAddress\"], form .form-container.travisci [for=\"ciApiToken\"], form .form-container.travisci [name=\"ciApiToken\"] {\n    display: none;\n    visibility: hidden;\n}\nform .form-container .fieldset {\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n}\nform .form-container .fieldset label {\n    -ms-flex-item-align: center;\n        -ms-grid-row-align: center;\n        align-self: center;\n    margin: 0;\n}\nform .form-container .fieldset.hidden {\n    height: 0;\n    opacity: 0;\n    overflow: hidden;\n    width: 0;\n}\nform .form-container label {\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n}\nform .form-container label span {\n    font-weight: bold;\n}\nform .form-container input, form .form-container select {\n    border: 1px solid #ccc;\n    box-sizing: border-box;\n    color: #333;\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n    padding: 0.625em;\n    margin: 0.3125em 0;\n}\nform .form-container input:focus, form .form-container select:focus {\n    border-color: #00B6F0;\n}\nform .form-container .full-length {\n    min-width: 100%;\n}\nform .form-container input[type=\"checkbox\"], form .form-container input[type=\"radio\"] {\n    -ms-flex-item-align: start;\n        align-self: flex-start;\n    border: none;\n    cursor: pointer;\n    -ms-flex-positive: 0.1;\n            -webkit-box-flex: 0.1;\n        flex-grow: 0.1;\n    padding: 0;\n}\nform .form-container input[type=\"checkbox\"] + label, form .form-container input[type=\"radio\"] + label {\n    cursor: pointer;\n}\nform .form-container input[type=\"checkbox\"]:not(old), form .form-container input[type=\"radio\"]:not(old) {\n    font-size: 1em;\n    margin: 0;\n    opacity: 0;\n    width: 2em;\n}\nform .form-container input[type=\"checkbox\"]:not(old) + label, form .form-container input[type=\"radio\"]:not(old) + label {\n    display: inline-block;\n    margin-left: -2em;\n    line-height: 1.5em;\n}\nform .form-container input[type=\"checkbox\"]:not(old) + label > span, form .form-container input[type=\"radio\"]:not(old) + label > span {\n    background: transparent;\n    border: 0.125em solid #838688;\n    border-radius: 0.25em;\n    display: inline-block;\n    height: 0.875em;\n    margin: 0.25em 0.5em 0.25em 0.25em;\n    vertical-align: bottom;\n    width: 0.875em;\n}\nform .form-container input[type=\"checkbox\"]:not(old):checked + label > span, form .form-container input[type=\"radio\"]:not(old):checked + label > span {\n    border-color: #00B6F0;\n}\nform .form-container input[type=\"checkbox\"]:not(old):checked + label > span:before, form .form-container input[type=\"radio\"]:not(old):checked + label > span:before {\n    color: #00B6F0;\n    display: block;\n    font-size: 0.875em;\n    font-weight: bold;\n    line-height: 1em;\n    text-align: center;\n    width: 1em;\n}\nform .form-container input[type=\"checkbox\"]:not(old):checked + label > span > span, form .form-container input[type=\"radio\"]:not(old):checked + label > span > span {\n    background-color: #00B6F0;\n    border: 0.0625em solid #00B6F0;\n    display: block;\n    height: 0.5em;\n    margin: 0.125em;\n    width: 0.5em;\n}\nform .form-container input[type=\"radio\"]:not(old) + label > span {\n    border-radius: 1em;\n}\nform .form-container input[type=\"radio\"]:not(old):checked + label > span > span {\n    border-radius: 1em;\n}\nform .form-container .controls {\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n}\nform .wireless-connection, form .static-configuration {\n    -webkit-transition: .2s;\n    transition: .2s;\n}\nform .wireless-connection .fieldset, form .static-configuration .fieldset {\n    margin: 0.5em 0;\n}\nform .wireless-connection label, form .static-configuration label {\n    text-align: right;\n}\nform .wireless-connection label.checkbox, form .static-configuration label.checkbox {\n    cursor: pointer;\n    margin-left: 50%;\n}\nform .wireless-connection input[type=\"text\"],form .wireless-connection input[type=\"password\"],form .static-configuration input[type=\"text\"],form .static-configuration input[type=\"password\"] {\n    margin-left: 1em;\n}\nform .wireless-connection.shown, form .static-configuration.shown {\n    height: auto;\n    opacity: 1;\n    overflow: auto;\n    width: auto;\n}\nform .wireless-connection.hidden, form .static-configuration.hidden {\n    height: 0;\n    opacity: 0;\n    overflow: hidden;\n    width: 0;\n}\nform .actions {\n    display: -ms-flexbox;\n    display: -webkit-box;\n    display: flex;\n    -ms-flex-align: center;\n            -webkit-box-align: center;\n        align-items: center;\n    margin-top: 1em;\n}\nform .actions button {\n    -ms-flex: 0.1;\n            -webkit-box-flex: 0.1;\n        flex: 0.1;\n}\nform .actions small {\n    color: #838688;\n    -ms-flex: 0.9;\n            -webkit-box-flex: 0.9;\n        flex: 0.9;\n    text-align: right;\n}\nform button {\n    background-color: #00B6F0;\n    border-radius: 0.1875em;\n    color: #fff;\n    font-size: 1.285em;\n    font-weight: bold;\n    line-height: 1;\n    padding: 1em 3em;\n    text-transform: capitalize;\n}\nform button:hover {\n    background-color: #5894CE;\n}\nform button.small {\n    font-size: 80%;\n    margin: 0.5em 0;\n}\nform button.secondary {\n    background-color: #A2B842;\n}\nform button.secondary:hover {\n    background-color: #8A9939;\n}\nform button.danger {\n    background-color: #A41E22;\n}\nform button.danger:hover {\n    background-color: #76141B;\n}\n", undefined);

var transformFormIntoPayload = function transformFormIntoPayload(formElements, payload) {
  for (var i = 0; i < formElements.length; i++) {
    var formEl = formElements[i];
    var alreadyContainsEl = false;

    if (formEl.type === 'radio' && formEl.checked) {
      payload[formEl.name] = formElements[formEl.name].value;
    }

    if (formEl.type !== 'radio') {
      if (typeof payload[formEl.name] !== 'undefined' && !Array.isArray(payload[formEl.name])) {
        alreadyContainsEl = true;

        var originalValue = payload[formEl.name];
        delete payload[formEl.name];

        payload[formEl.name] = [];
        payload[formEl.name].push(originalValue);
      }

      if (Array.isArray(payload[formEl.name])) {
        alreadyContainsEl = true;
      }

      var value = formEl.type === 'checkbox' ? formEl.checked : formEl.value;
      if (alreadyContainsEl) {
        payload[formEl.name].push(value);
      } else {
        payload[formEl.name] = value;
      }
    }
  }
};

var bp23 = inferno.createBlueprint({
  tag: 'small',
  children: {
    arg: 0
  }
});
var bp22 = inferno.createBlueprint({
  tag: 'button',
  attrs: {
    type: 'submit'
  },
  children: {
    arg: 0
  }
});
var bp21 = inferno.createBlueprint({
  tag: 'div',
  className: 'actions',
  children: {
    arg: 0
  }
});
var bp20 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp19 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ciApiToken'
  },
  children: {
    arg: 0
  }
});
var bp18 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp17 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp16 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ciUsername',
    name: 'ciUsernameTravis'
  },
  children: {
    arg: 0
  }
});
var bp15 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ciUsername',
    name: 'ciUsernameCircleCi'
  },
  children: {
    arg: 0
  }
});
var bp14 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ciUsername',
    name: 'ciUsernameBuildkite'
  },
  children: {
    arg: 0
  }
});
var bp13 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp12 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp11 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp10 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ciAddress'
  },
  children: {
    arg: 0
  }
});
var bp9 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp8 = inferno.createBlueprint({
  tag: 'option',
  attrs: {
    value: 'travisci'
  },
  children: {
    arg: 0
  }
});
var bp7 = inferno.createBlueprint({
  tag: 'option',
  attrs: {
    value: 'buildkite'
  },
  children: {
    arg: 0
  }
});
var bp6 = inferno.createBlueprint({
  tag: 'option',
  attrs: {
    value: 'circleci'
  },
  children: {
    arg: 0
  }
});
var bp5 = inferno.createBlueprint({
  tag: 'option',
  attrs: {
    value: 'jenkins'
  },
  children: {
    arg: 0
  }
});
var bp4$1 = inferno.createBlueprint({
  tag: 'select',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var bp3$2 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp2$2 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ciTool'
  },
  children: {
    arg: 0
  }
});
var bp1$3 = inferno.createBlueprint({
  tag: 'div',
  className: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var bp0$4 = inferno.createBlueprint({
  tag: 'form',
  events: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var CiTabContent = function CiTabContent(model) {
  var handleCiToolChange = function handleCiToolChange(event) {
    var el = event.currentTarget;
    el.parentElement.classList.remove(el.parentElement.classList.item(2));
    el.parentElement.classList.add(el.value);

    var inputEls = el.parentElement.getElementsByTagName('input');
    for (var i = 0; i < inputEls.length; i++) {
      inputEls[i].required = inputEls[i].offsetParent !== null;
    }
  };

  var handleFormSubmit = function handleFormSubmit(event) {
    var postData = { save: 'ci', payload: {} };
    transformFormIntoPayload(event.currentTarget.elements, postData.payload);
    return save(postData);
  };

  return bp0$4({
    onsubmit: handleFormSubmit
  }, [bp1$3('form-container vertical ' + model.configuration.tool, [bp2$2([bp3$2('CI tool'), ' you are using']), bp4$1({
    required: true,
    id: 'ciTool',
    name: 'ciTool',
    value: model.configuration.tool
  }, {
    onchange: handleCiToolChange
  }, [bp5('Jenkins'), bp6('Circle CI'), bp7('Buildkite'), bp8('Travis CI')]), bp9([bp10(['Address of the ', bp11('CI server you want to connect to')]), bp12({
    type: 'text',
    id: 'ciAddress',
    placeholder: 'http://myci.mycompany',
    name: 'ciAddress',
    value: model.configuration.address
  })]), bp13([bp14('Organization Slug'), bp15('Team Name'), bp16('Account'), bp17({
    type: 'text',
    id: 'ciUsername',
    name: 'ciUsername',
    value: model.configuration.username
  })]), bp18([bp19('API token'), bp20({
    type: 'text',
    id: 'ciApiToken',
    placeholder: '',
    name: 'ciApiToken',
    value: model.configuration.apiToken
  })])]), bp21([bp22('Save'), bp23(['Last updated: ', model.lastUpdated])])]);
};

__$styleInject("form .jobs-container > button {\n    -ms-flex-item-align: end;\n        align-self: flex-end;\n    background-color: #A2B842;\n    margin-right: 0.5em;\n}\nform .jobs-container .fieldset {\n    padding: 0.25em 0.5em;\n}\nform .jobs-container .fieldset:hover {\n    background-color: #fff;\n}\nform .jobs-container .fieldset:hover label {\n    font-weight: bold;\n}\nform .jobs-container .fieldset input, form .jobs-container .fieldset label {\n    -ms-flex: initial;\n            -webkit-box-flex: initial;\n        flex: initial;\n    -ms-flex-positive: initial;\n        flex-grow: initial;\n}\nform .jobs-container .fieldset input[type=\"text\"], form .jobs-container .fieldset label[type=\"text\"] {\n    -ms-flex: 1;\n            -webkit-box-flex: 1;\n        flex: 1;\n    margin-right: 1em;\n}\n", undefined);

var bp6$2 = inferno.createBlueprint({
  tag: 'button',
  className: 'small danger',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var bp5$2 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp4$3 = inferno.createBlueprint({
  tag: 'span'
});
var bp3$4 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp2$4 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var bp1$5 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp0$6 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var Job = function Job(props) {
  var handleRemoveJob = function handleRemoveJob(e) {
    e.currentTarget.parentElement.remove();
  };

  return bp0$6([bp1$5({
    type: 'checkbox',
    name: 'jobActive',
    id: 'jobActive_' + props.index,
    checked: props.active,
    value: 'jobActive_' + props.index
  }), bp2$4({
    for: 'jobActive_' + props.index
  }, [bp3$4(bp4$3()), '\xA0']), bp5$2({
    type: 'text',
    name: 'jobName',
    id: 'jobName_' + props.index,
    value: props.name
  }), bp6$2({
    type: 'button'
  }, {
    onclick: handleRemoveJob
  }, 'Remove')]);
};

var bp0$5 = inferno.createBlueprint({
  tag: {
    arg: 0
  },
  attrs: {
    arg: 1
  }
});
var bp12$1 = inferno.createBlueprint({
  tag: 'small',
  children: {
    arg: 0
  }
});
var bp11$1 = inferno.createBlueprint({
  tag: 'button',
  attrs: {
    type: 'submit'
  },
  children: {
    arg: 0
  }
});
var bp10$1 = inferno.createBlueprint({
  tag: 'div',
  className: 'actions',
  children: {
    arg: 0
  }
});
var bp9$1 = inferno.createBlueprint({
  tag: 'button',
  className: 'small secondary',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var bp8$1 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp7$1 = inferno.createBlueprint({
  tag: 'label',
  children: {
    arg: 0
  }
});
var bp6$1 = inferno.createBlueprint({
  tag: 'div',
  className: 'jobs-container form-container vertical',
  children: {
    arg: 0
  }
});
var bp5$1 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp4$2 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp3$3 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'pollRate'
  },
  children: {
    arg: 0
  }
});
var bp2$3 = inferno.createBlueprint({
  tag: 'div',
  className: 'form-container vertical',
  children: {
    arg: 0
  }
});
var bp1$4 = inferno.createBlueprint({
  tag: 'form',
  events: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var JobsTabContent = function JobsTabContent(model) {
  var handleFormSubmit = function handleFormSubmit(event) {
    var postData = { save: 'jobs', payload: {} };
    transformFormIntoPayload(event.currentTarget.elements, postData.payload);
    return save(postData);
  };

  var handleAddNewJob = function handleAddNewJob(event) {
    addNewJob();
  };

  var jobs = model.configuration.items.map(function (i, idx) {
    return bp0$5(Job, {
      name: i.name,
      active: i.active,
      index: idx
    });
  });

  return bp1$4({
    onsubmit: handleFormSubmit
  }, [bp2$3([bp3$3(['Rate to ', bp4$2('poll your CI server'), ' (in seconds)']), bp5$1({
    type: 'number',
    name: 'pollRate',
    id: 'pollRate',
    value: model.configuration.pollrate
  })]), bp6$1([bp7$1(bp8$1('Jobs to monitor')), jobs, bp9$1({
    type: 'button'
  }, {
    onclick: handleAddNewJob
  }, 'Add new job')]), bp10$1([bp11$1('Save'), bp12$1(['Last updated: ', model.lastUpdated])])]);
};

var bp52 = inferno.createBlueprint({
  tag: 'small',
  children: {
    arg: 0
  }
});
var bp51 = inferno.createBlueprint({
  tag: 'button',
  attrs: {
    type: 'submit'
  },
  children: {
    arg: 0
  }
});
var bp50 = inferno.createBlueprint({
  tag: 'div',
  className: 'actions',
  children: {
    arg: 0
  }
});
var bp49 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp48 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'gateway'
  },
  children: {
    arg: 0
  }
});
var bp47 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp46 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp45 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'address'
  },
  children: {
    arg: 0
  }
});
var bp44 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp43 = inferno.createBlueprint({
  tag: 'div',
  className: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var bp42 = inferno.createBlueprint({
  tag: 'span'
});
var bp41 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp40 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'no'
  },
  children: {
    arg: 0
  }
});
var bp39 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  }
});
var bp38 = inferno.createBlueprint({
  tag: 'span'
});
var bp37 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp36 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'yes'
  },
  children: {
    arg: 0
  }
});
var bp35 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  }
});
var bp34 = inferno.createBlueprint({
  tag: 'div',
  className: 'controls',
  children: {
    arg: 0
  }
});
var bp33 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp32 = inferno.createBlueprint({
  tag: 'label',
  children: {
    arg: 0
  }
});
var bp31 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp30 = inferno.createBlueprint({
  tag: 'div',
  className: 'form-container vertical',
  children: {
    arg: 0
  }
});
var bp29 = inferno.createBlueprint({
  tag: 'span'
});
var bp28 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp27 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'hidden'
  },
  children: {
    arg: 0
  }
});
var bp26 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp25 = inferno.createBlueprint({
  tag: 'label',
  className: 'checkbox',
  children: {
    arg: 0
  }
});
var bp24 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp23$1 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'key'
  },
  children: {
    arg: 0
  }
});
var bp22$1 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp21$1 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp20$1 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ssid'
  },
  children: {
    arg: 0
  }
});
var bp19$1 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp18$1 = inferno.createBlueprint({
  tag: 'div',
  className: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var bp17$1 = inferno.createBlueprint({
  tag: 'span'
});
var bp16$1 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp15$1 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ethernet'
  },
  children: {
    arg: 0
  }
});
var bp14$1 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  }
});
var bp13$1 = inferno.createBlueprint({
  tag: 'span'
});
var bp12$2 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp11$2 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'wireless'
  },
  children: {
    arg: 0
  }
});
var bp10$2 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  }
});
var bp9$2 = inferno.createBlueprint({
  tag: 'div',
  className: 'controls',
  children: {
    arg: 0
  }
});
var bp8$2 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp7$2 = inferno.createBlueprint({
  tag: 'label',
  children: {
    arg: 0
  }
});
var bp6$3 = inferno.createBlueprint({
  tag: 'div',
  className: 'fieldset',
  children: {
    arg: 0
  }
});
var bp5$3 = inferno.createBlueprint({
  tag: 'div',
  className: 'form-container vertical',
  children: {
    arg: 0
  }
});
var bp4$4 = inferno.createBlueprint({
  tag: 'input',
  className: 'full-length',
  attrs: {
    arg: 0
  }
});
var bp3$5 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp2$5 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'hostname'
  },
  children: {
    arg: 0
  }
});
var bp1$6 = inferno.createBlueprint({
  tag: 'div',
  className: 'form-container vertical',
  children: {
    arg: 0
  }
});
var bp0$7 = inferno.createBlueprint({
  tag: 'form',
  attrs: {
    arg: 0
  },
  events: {
    arg: 1
  },
  children: {
    arg: 2
  }
});
var NetworkTabContent = function NetworkTabContent(model) {
  var handleConnectionTypeChange = function handleConnectionTypeChange(event) {
    var formEl = event.currentTarget.parentNode.parentNode.parentNode;
    var wifiConfEl = formEl.getElementsByClassName('wireless-connection')[0];

    if (event.currentTarget.value === 'wireless') {
      wifiConfEl.classList.remove('hidden');
      wifiConfEl.classList.add('shown');
    } else {
      wifiConfEl.classList.remove('shown');
      wifiConfEl.classList.add('hidden');
    }
  };

  var handleDhcpChange = function handleDhcpChange(event) {
    var formEl = event.currentTarget.parentNode.parentNode.parentNode;
    var staticEl = formEl.getElementsByClassName('static-configuration')[0];

    if (event.currentTarget.value === 'false') {
      staticEl.classList.remove('hidden');
      staticEl.classList.add('shown');
    } else {
      staticEl.classList.remove('shown');
      staticEl.classList.add('hidden');
    }
  };

  var handleFormSubmit = function handleFormSubmit(event) {
    var postData = { save: 'network', payload: {} };
    transformFormIntoPayload(event.currentTarget.elements, postData.payload);
    return save(postData);
  };

  var wirelessContainerHidden = model.configuration.connectionType !== 'wireless' ? 'hidden' : 'shown';
  var staticContainerHidden = model.configuration.dhcp === true ? 'hidden' : 'shown';

  return bp0$7({
    name: 'networkForm'
  }, {
    onsubmit: handleFormSubmit
  }, [bp1$6([bp2$5(['Name of ', bp3$5('this device'), ' on the network']), bp4$4({
    required: true,
    type: 'text',
    id: 'hostname',
    name: 'hostname',
    placeholder: 'e.g. mycompany-build-lights',
    value: model.configuration.hostname
  })]), bp5$3([bp6$3([bp7$2(['Select your ', bp8$2('preferred connection type')]), bp9$2([bp10$2({
    type: 'radio',
    name: 'connectionType',
    checked: model.configuration.connectionType === 'wireless' ? 'checked' : '',
    value: 'wireless',
    id: 'wireless'
  }, {
    onchange: handleConnectionTypeChange
  }), bp11$2([bp12$2(bp13$1()), 'Wireless']), bp14$1({
    type: 'radio',
    name: 'connectionType',
    checked: model.configuration.connectionType === 'ethernet' ? 'checked' : '',
    value: 'ethernet',
    id: 'ethernet'
  }, {
    onchange: handleConnectionTypeChange
  }), bp15$1([bp16$1(bp17$1()), 'Ethernet'])])]), bp18$1('wireless-connection ' + wirelessContainerHidden, [bp19$1([bp20$1('SSID'), bp21$1({
    type: 'text',
    id: 'ssid',
    name: 'ssid',
    value: model.configuration.wireless.ssid
  })]), bp22$1([bp23$1('Password'), bp24({
    type: 'password',
    id: 'key',
    name: 'key',
    value: model.configuration.wireless.key
  })]), bp25([bp26({
    type: 'checkbox',
    id: 'hidden',
    name: 'hidden',
    value: model.configuration.wireless.hidden,
    checked: model.configuration.wireless.hidden ? 'checked' : ''
  }), bp27([bp28(bp29()), 'Hidden network?'])])])]), bp30([bp31([bp32(['Assign network ', bp33('IP address')]), bp34([bp35({
    type: 'radio',
    name: 'useDhcp',
    checked: !model.configuration.dhcp ? 'checked' : '',
    value: 'false',
    id: 'yes'
  }, {
    onchange: handleDhcpChange
  }), bp36([bp37(bp38()), 'Yes']), bp39({
    type: 'radio',
    name: 'useDhcp',
    checked: model.configuration.dhcp ? 'checked' : '',
    value: 'true',
    id: 'no'
  }, {
    onchange: handleDhcpChange
  }), bp40([bp41(bp42()), 'No'])])]), bp43('static-configuration ' + staticContainerHidden, [bp44([bp45('Address'), bp46({
    type: 'text',
    name: 'address',
    id: 'address',
    value: model.configuration.address,
    placeholder: '192.168.0.10/24'
  })]), bp47([bp48('Gateway'), bp49({
    type: 'text',
    name: 'gateway',
    id: 'gateway',
    value: model.configuration.gateway,
    placeholder: '192.168.0.1'
  })])])]), bp50([bp51('Save'), bp52(['Last updated: ', model.lastUpdated])])]);
};

var bp11$3 = inferno.createBlueprint({
  tag: 'small',
  children: {
    arg: 0
  }
});
var bp10$3 = inferno.createBlueprint({
  tag: 'button',
  attrs: {
    type: 'submit'
  },
  children: {
    arg: 0
  }
});
var bp9$3 = inferno.createBlueprint({
  tag: 'div',
  className: 'actions',
  children: {
    arg: 0
  }
});
var bp8$3 = inferno.createBlueprint({
  tag: 'input',
  attrs: {
    arg: 0
  }
});
var bp7$3 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'numLeds'
  },
  children: {
    arg: 0
  }
});
var bp6$4 = inferno.createBlueprint({
  tag: 'option',
  attrs: {
    value: 'adafruit_lpd8806'
  },
  children: {
    arg: 0
  }
});
var bp5$4 = inferno.createBlueprint({
  tag: 'option',
  attrs: {
    value: 'epistar_lpd8806'
  },
  children: {
    arg: 0
  }
});
var bp4$5 = inferno.createBlueprint({
  tag: 'select',
  attrs: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var bp3$6 = inferno.createBlueprint({
  tag: 'span',
  children: {
    arg: 0
  }
});
var bp2$6 = inferno.createBlueprint({
  tag: 'label',
  attrs: {
    for: 'ledType'
  },
  children: {
    arg: 0
  }
});
var bp1$7 = inferno.createBlueprint({
  tag: 'div',
  className: 'form-container vertical',
  children: {
    arg: 0
  }
});
var bp0$8 = inferno.createBlueprint({
  tag: 'form',
  events: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var LedHardwareTabContent = function LedHardwareTabContent(model) {
  var handleFormSubmit = function handleFormSubmit(event) {
    var postData = { save: 'led', payload: {} };
    transformFormIntoPayload(event.currentTarget.elements, postData.payload);
    return save(postData);
  };

  return bp0$8({
    onsubmit: handleFormSubmit
  }, [bp1$7([bp2$6(['Which ', bp3$6('LED strip'), ' you are using']), bp4$5({
    required: true,
    id: 'ledType',
    name: 'ledType',
    value: model.configuration.ledType
  }, [bp5$4('Epistar LPD8806'), bp6$4('Adafruit LPD8806')]), bp7$3('Number of LEDs on your strip'), bp8$3({
    type: 'number',
    required: true,
    id: 'numLeds',
    name: 'numLeds',
    value: model.configuration.numLeds
  })]), bp9$3([bp10$3('Save'), bp11$3(['Last updated: ', model.lastUpdated])])]);
};

var bp0$3 = inferno.createBlueprint({
  tag: 'div',
  className: {
    arg: 0
  },
  children: {
    arg: 1
  }
});
var TabContent = function TabContent(tabInfo) {
  var displayClass = !tabInfo.active ? 'hidden tab-content-container' : 'tab-content-container';
  var content = void 0;

  switch (tabInfo.name) {
    case 'network':
      content = NetworkTabContent(tabInfo);
      break;
    case 'ci server':
      content = CiTabContent(tabInfo);
      break;
    case 'led hardware':
      content = LedHardwareTabContent(tabInfo);
      break;
    case 'jobs to monitor':
      content = JobsTabContent(tabInfo);
      break;
    default:
      content = 'Nothing to see here.';
  }

  return bp0$3(displayClass, content);
};

var bp0 = inferno.createBlueprint({
  tag: {
    arg: 0
  },
  attrs: {
    arg: 1
  }
});
var bp4 = inferno.createBlueprint({
  tag: 'div',
  className: 'tab-content container',
  children: {
    arg: 0
  }
});
var bp3 = inferno.createBlueprint({
  tag: 'ul',
  className: 'container',
  children: {
    arg: 0
  }
});
var bp2 = inferno.createBlueprint({
  tag: 'div',
  className: 'tab-nav-container',
  children: {
    arg: 0
  }
});
var bp1 = inferno.createBlueprint({
  tag: 'div',
  className: 'tab',
  children: {
    arg: 0
  }
});
var Tab = function Tab(model) {
  var tabs = model.map(TabItem);
  var tabContent = model.map(TabContent);

  var dismissHandler = function dismissHandler(e) {
    delete model.alert;
    return dismissAlert(model);
  };

  var alert = '';
  if (model.alert) {
    alert = bp0(Alert, {
      success: model.alert.success,
      message: model.alert.message,
      dismissHandler: dismissHandler
    });
  }

  return bp1([bp2(bp3(tabs)), bp4([alert, tabContent])]);
};

function tabComponent(model) {
  return Tab(model);
}

function display(representation) {
  var reprEl = document.getElementById('representation');
  if (reprEl) {
    infernoDom.render(representation, reprEl);
  }
}

function represent(model) {
  var currentState = model.tools.filter(function (t) {
    return t.active;
  }).map(function (t) {
    return {
      name: t.name,
      active: t.name === model.selectedTool,
      configuration: t.configuration,
      lastUpdated: new Date(model.lastUpdated).toString()
    };
  });

  currentState.alert = model.result;
  return currentState;
}

function nextAction(stateModel) {
  // nothing to do here for now
}

function render(stateModel) {
  display(tabComponent(stateModel));
  nextAction(stateModel);
}

var cb = function cb(event) {
  document.getElementById('supervisor').href = 'http://' + location.hostname + ':9001';

  fetch('/model').then(function (res) {
    return res.json();
  }).then(function (json) {
    render(represent(json));
  });
};

if (document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll) {
  cb();
} else {
  document.addEventListener('DOMContentLoaded', cb);
}

var mutateScreen = function mutateScreen(e) {
  var endpoint = e.currentTarget.href;
  var isShutdown = endpoint.endsWith('shutdown');
  var countdown = Number(e.currentTarget.dataset.countdown);

  var representation = document.getElementById('representation');
  representation.classList.add('waiting');
  representation.innerHTML = '<div class="message"><p>Please wait...</p></div>';

  fetch(endpoint).then(function (res) {
    if (!res.ok) {
      representation.classList.add('error');
      representation.innerHTML = '<div class="message"><p>Could not execute.<br/>Please restart manually.<br/><br/><a href="#" onclick="location.reload()">Reload</a></p></div>';
      return;
    }

    var intervalId = setInterval(function () {
      var message = 'Reboot underway. Will refresh in ' + countdown + ' seconds.';
      if (isShutdown) {
        message = 'Shutdown underway. You can unplug your Raspberry Pi in ' + countdown + ' seconds.';
      }

      representation.innerHTML = '<div class="message"><p>' + message + '</p></div>';
      countdown -= 1;

      if (countdown === 0) {
        clearInterval(intervalId);

        if (isShutdown) {
          representation.innerHTML = '<div class="message"><p>You can now unplug your Raspberry Pi.</p></div>';
        } else {
          location.reload();
        }
      }
    }, 1000);
  });

  return false;
};

var deviceActionEls = document.getElementsByClassName('deviceAction');
for (var i = 0; i < deviceActionEls.length; i++) {
  if (!deviceActionEls[i].onclick) {
    deviceActionEls[i].onclick = mutateScreen;
  }
}

}());
//# sourceMappingURL=bundle.js.map
