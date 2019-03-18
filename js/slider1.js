(function(w) {
	var curIndex = 0;
	var timer = null;
	var lock = true;
	var oBox = document.getElementById('box');
	var broadcastMe = oBox.getElementsByTagName('div')[0];
	var broadcastMeList = broadcastMe.getElementsByTagName('div')[0];
	var broadcastMeItem = broadcastMeList.getElementsByTagName('div');
	var itemLen = broadcastMeItem.length;
	var moveWidth = broadcastMeItem[0].offsetWidth;
	broadcastMeList.style.width = moveWidth * itemLen + 'px';
	for (var i = 0; i < broadcastMeItem.length; i++) {
		broadcastMeItem[i].style.width = moveWidth + 'px';
	}

	var broadcastMeTool = document.getElementById('broadcastMe-tool');
	var broadcastMeSpot = broadcastMeTool.getElementsByTagName('div');
	var MeToolWidth = 115;
	// console.log(moveWidth, broadcastMeSpot);
	// console.log(mLeft);
	broadcastMeTool.style.marginLeft = '-75px';
	var broadcastMeBtnLeft = document.getElementById('broadcastMe-btn-left');
	var broadcastMeBtnRight = document.getElementById('broadcastMe-btn-right');

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
})(window)