(function() {
	function SliderQfl() {
		this.init();
	}
	SliderQfl.prototype.init = function() {
		var self = this;
		this.curIndex = 0;
		this.timer = null;
		this.lock = true;
		this.oBox = document.getElementById('box');
		this.broadcastMe = this.oBox.getElementsByTagName('div')[0];
		this.broadcastMeList = this.broadcastMe.getElementsByTagName('div')[0];
		this.broadcastMeItem = this.broadcastMeList.getElementsByTagName('div');
		this.itemLen = this.broadcastMeItem.length;
		this.moveWidth = this.broadcastMeItem[0].offsetWidth;
		this.broadcastMeList.style.width = this.moveWidth * this.itemLen + 'px';
		for (var i = 0; i < this.broadcastMeItem.length; i++) {
			this.broadcastMeItem[i].style.width = this.moveWidth + 'px';
		}
		this.broadcastMe.style.width = this.moveWidth + 'px';
		this.broadcastMeTool = document.getElementById('broadcastMe-tool');
		this.broadcastMeSpot = this.broadcastMeTool.getElementsByTagName('div');
		MeToolWidth = parseInt(getStyle(this.broadcastMeTool, 'width'));
		this.broadcastMeTool.style.marginLeft = '-75px';
		this.broadcastMeBtnLeft = document.getElementById('broadcastMe-btn-left');
		this.broadcastMeBtnRight = document.getElementById('broadcastMe-btn-right');
		this.timer = setTimeout(self.autoMove.bind(self), 3000);
		this.bindEvent();
	}
	SliderQfl.prototype.autoMove = function(direction, isCb) {
		var self = this;
		var curLeft = parseInt(getStyle(this.broadcastMeList, 'margin-left'));
		var eWidth = this.moveWidth;
		var num = this.itemLen - 2;
		clearTimeout(self.timer);
		if (self.lock) {
			self.lock = false;
			if (!direction || direction == 'toRight') {
				self.curIndex++;
				if (curLeft == -eWidth * num) self.curIndex = 0;
				self.renderSpot(self.curIndex);
				self.startMove(self.broadcastMeList, {
					'margin-left': curLeft - eWidth
				}, function() {
					if (curLeft == -eWidth * num) {
						self.broadcastMeList.style.marginLeft = '0px';
						self.curIndex = 0;
					}
					if (!isCb) {
						self.timer = setTimeout(self.autoMove.bind(self), 3000);
					}
					self.lock = true;
				})
			} else if (direction == "toLeft") {
				if (curLeft == 0) {
					self.broadcastMeList.style.marginLeft = -eWidth * (num + 1) + 'px';
					self.curIndex = num + 1;
				}
				self.curIndex--;
				self.renderSpot(self.curIndex);
				curLeft = parseInt(getStyle(this.broadcastMeList, 'margin-left'));
				self.startMove(self.broadcastMeList, {
					'margin-left': curLeft + eWidth
				}, function() {
					if (!isCb) {
						self.timer = setTimeout(self.autoMove.bind(self), 3000);
					}
					self.lock = true;
				})
			}
		}
	}
	SliderQfl.prototype.bindEvent = function() {
		var self = this;
		addEvent(self.broadcastMeBtnLeft, 'click', function() {
			self.autoMove('toLeft', true);
		});
		addEvent(self.broadcastMeBtnRight, 'click', function() {
			self.autoMove('toRight', true);
		})
		addEvent(self.broadcastMe, 'mouseenter', function() {
			clearTimeout(self.timer);
		})
		addEvent(self.broadcastMe, 'mouseleave', function() {
			self.timer = setTimeout(self.autoMove.bind(self), 3000);
		})
		for (var i = 0; i < this.broadcastMeSpot.length; i++) {
			(function(i) {
				addEvent(self.broadcastMeSpot[i], 'click', function(e) {
					self.lock = false;
					clearTimeout(self.timer);
					self.curIndex = i;
					self.renderSpot(self.curIndex);
					startMove(self.broadcastMeList, {
						'margin-left': -i * self.moveWidth
					}, function() {
						self.lock = true;
					})
				})
				addEvent(self.broadcastMeSpot[i], 'touchend', function(e) {
					self.lock = false;
					clearTimeout(self.timer);
					self.curIndex = i;
					self.renderSpot(self.curIndex);
					startMove(self.broadcastMeList, {
						'margin-left': -i * self.moveWidth
					}, function() {
						self.lock = true;
					})
				})
			}(i))
		}

		function touchstart(e) {
			var _self = self;
			e.returnValue = false;
			var startTop = _self.offsetTop;
			var touchstart = e.targetTouches[0];
			var endPos = {};
			var offsetPos = {}
			var startPos = {
				x: touchstart.pageX,
				y: touchstart.pageY
			}

			function touchmove(e) {
				var self = _self;
				e.returnValue = false;
				var touchmove = e.targetTouches[0];
				endPos = {
					x: touchmove.pageX,
					y: touchmove.pageY
				}
				offsetPos = {
					x: endPos.x - startPos.x,
					y: endPos.y - startPos.y
				}
				if (offsetPos.x < 0) {
					self.autoMove('toRight', true)
				} else {
					self.autoMove('toLeft', true);
				}
			}
			addEvent(_self.broadcastMe, 'touchmove', touchmove);

			function touchend(e) {
				var self = _self;
				e.returnValue = false;
				removeEvent(self.broadcastMe, 'touchmove', touchmove);
				removeEvent(self.broadcastMe, 'touchstart', touchstart);
			}
			addEvent(_self.broadcastMe, 'touchend', touchend);
		}
		addEvent(self.broadcastMe, 'touchstart', touchstart)
	}

	SliderQfl.prototype.renderSpot = function(index) {
		for (var i = 0; i < this.broadcastMeSpot.length; i++) {
			this.broadcastMeSpot[i].className = '';
		}
		this.broadcastMeSpot[index].className = 'active'
	}

	SliderQfl.prototype.startMove = function(dom, attrObj, callback) {
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
	aa = new SliderQfl({});
})(window)

var aa;