function getStyle(dom, attr) {
	if (window.getComputedStyle) {
		return window.getComputedStyle(dom, null)[attr];
	} else {
		return dom.currentStyle[attr];
	}
}

function addEvent(elem, event, fn) {
	if (elem.addEventListener) {
		elem.addEventListener(event, fn, false);
	} else if (elem.attachEvent) {
		elem.attachEvent('on' + event, fn);
	} else {
		elem['on' + event] = fn;
	}
}

function startMove(dom, attrObj, callback) {
	clearInterval(dom.timer);
	if (attrObj['opacity'] !== undefined) attrObj['opacity'] *= 100;
	dom.timer = setInterval(function() {
		var bStop = true;
		for (var attr in attrObj) {
			if (attr == 'opacity') {
				iCur = parseFloat(getStyle(dom, attr)) * 100;
			} else {
				iCur = parseInt(getStyle(dom, attr));
			}
			iSpeed = (attrObj[attr] - iCur) / 7;
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
			if (attr == 'opacity') {
				dom.style[attr] = (iCur + iSpeed) / 100;
			} else {
				dom.style[attr] = iCur + iSpeed + 'px';
			}
			if (iCur != attrObj[attr]) {
				bStop = false;
			}
		}
		if (bStop) {
			clearInterval(dom.timer);
			typeof callback == 'function' && callback();
		}
	}, 30)
}

if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== "function") {
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}
		var aArgs = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP = function() {},
			fBound = function() {
				return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
					aArgs.concat(Array.prototype.slice.call(arguments)));
			};
		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();
		return fBound;
	};
}

if (document.all && !window.setTimeout.isPolyfill) {
	var __nativeST__ = window.setTimeout;
	window.setTimeout = function(vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */ ) {
		var aArgs = Array.prototype.slice.call(arguments, 2);
		return __nativeST__(vCallback instanceof Function ? function() {
			vCallback.apply(null, aArgs);
		} : vCallback, nDelay);
	};
	window.setTimeout.isPolyfill = true;
}

if (document.all && !window.setInterval.isPolyfill) {
	var __nativeSI__ = window.setInterval;
	window.setInterval = function(vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */ ) {
		var aArgs = Array.prototype.slice.call(arguments, 2);
		return __nativeSI__(vCallback instanceof Function ? function() {
			vCallback.apply(null, aArgs);
		} : vCallback, nDelay);
	};
	window.setInterval.isPolyfill = true;
}