(function(e, t, n) {
	"use strict";
	var r = t.Modernizr;
	e.SKEWSlider = function(t, n) {
		this.$el = e(n);
		this._init(t)
	};
	e.SKEWSlider.defaults = {
		speed: 1e3,
		easing: "ease",
		skew: -25,
		width: "100%",
		height: "100%",
		slidePercent: 75,
		centered: true,
		preloadCount: 2,
		moveFx: false,
		delay: 0,
		speedDifference: 150,
		infiniteSlide: true,
		navDots: true,
		itemPadding: false,
		moveOnHover: 4,
		hoverSpeed: 600,
		clickOnSiblings: true,
		ratio: 40 / 11,
		slideshow: 8e3,
		breakpoints: false,
		showCaption: true,
		setCurrent: 0,
		NextPrevDistance: 1,
		itemsToslide: 1
	};
	e.SKEWSlider.prototype = {
		_init: function(t) {
			this.options = e.extend(true, {}, e.SKEWSlider.defaults, t);
			this.optionsBackup = e.extend(true, {}, e.SKEWSlider.defaults, t);
			this._config();
			this.options.slideshow && this._slideShow()
		},
		_config: function() {
			var t = this.options.skew,
				n = this;
			this.$el.addClass("skw-container");
			this.$list = this.$el.children("ul").addClass("skw-list");
			this.$items = this.$list.children("li");
			this.HoverSiblings = true;
			this.itemsCount = this.$items.length;
			this.updateDelay = false;
			this.breakpoint = false;
			this.updateTimeout;
			this.captionTimeout;
			this.isHovering = false;
			this.current = this.options.setCurrent;
			this.$items.each(function() {
				var n = e(this);
				n.css("transform", "skew(" + t + "deg, 0)");
				n.append('<div class="skw-loader" />')
			});
			this.support = r.csstransitions && r.csstransforms;
			this.support3d = r.csstransforms3d;
			var i = {
					WebkitTransition: "webkitTransitionEnd",
					MozTransition: "transitionend",
					OTransition: "oTransitionEnd",
					msTransition: "MSTransitionEnd",
					transition: "transitionend"
				},
				s = {
					WebkitTransform: "-webkit-transform",
					MozTransform: "-moz-transform",
					OTransform: "-o-transform",
					msTransform: "-ms-transform",
					transform: "transform"
				};
			if (this.support) {
				this.transEndEventName = i[r.prefixed("transition")] + ".skewSlider";
				this.transformName = s[r.prefixed("transform")]
			}
			if (this.support) {
				this.$items.css("transition", this.transformName + " " + this.options.speed + "ms " + this.options.easing);
				this.$list.css("transition", this.transformName + " " + this.options.speed + "ms " + this.options.easing)
			}
			this.$el.css({
				overflow: "hidden",
				position: "relative"
			});
			this.isAnimating = false;
			this.isAnimatingInf = false;
			if (this.itemsCount > 1) {
				this.$navPrev = e('<span class="skw-prev">&lt;</span>');
				this.$navNext = e('<span class="skw-next">&gt;</span>');
				!this.options.infiniteSlide && this.$navPrev.addClass("skw-trans");
				var o = "";
				for (var u = 0; u < this.itemsCount; ++u) {
					var a = u === this.current ? '<span class="skw-current"></span>' : "<span></span>";
					o += a
				}
				var f = e('<div class="skw-dots"/>').append(o),
					l = e('<nav class="skw-nav" />').append(f).prepend(this.$navPrev).append(this.$navNext).appendTo(this.$el);
				this.$navDots = l.find(".skw-dots span");
				this.$mainNav = this.$el.children(".skw-nav");
				this.$mainNav.css("marginLeft", -this.$mainNav.width() / 2)
			}
			this.$caption = e('<div class="skw-caption" />');
			this.$items.eq(this.current).addClass("skw-animate");
			this.$caption = this.$caption.appendTo(this.$el);
			this.$nav = this.$el.find(".skw-nav");
			this._update(true)
		},
		_update: function(n, r, i) {
			function b(e) {
				return e * (Math.PI / 180)
			}

			function A(e, t) {
				return e * 100 / t
			}
			var s = e(t).width(),
				o = this,
				u = this.options.moveFx,
				a = this.options.infiniteSlide ? this.$items.add(this.$infItems) : this.$item,
				f = this.options.infiniteSlide ? this.options.preloadCount : 0;
			if (!n && this.options.breakpoints) {
				for (var l in o.optionsBackup) {
					o.options[l] = o.optionsBackup[l]
				}
			}
			this.old = this.current;
			if (r) {
				for (var c in r) {
					o.options[c] = r[c]
				}
			}
			if (this.options.breakpoints) {
				o.breakpoint = false;
				for (var l in this.options.breakpoints) {
					var h = this.options.breakpoints[l];
					for (var c in h) {
						if (h.hasOwnProperty(c)) {
							if (c == "maxWidth") {
								if (s <= h[c]) {
									var p = this.options.breakpoints[l];
									for (var l in p) {
										o.options[l] = p[l]
									}
								}
							}
						}
					}
				}
			}
			if (n) {
				this.current = this.options.setCurrent
			} else if (r) {
				if (r["setCurrent"] || r["setCurrent"] == 0) {
					this.current = this.options.setCurrent
				}
			}
			if (this.options.navDots) {
				this.$nav.addClass("show")
			} else {
				this.$nav.removeClass("show")
			}
			this._loadCaption();
			var d = this.options.width;
			if (typeof d != "number") {
				var v = d.substring(0, d.length - 1);
				d = this.$el.parent().width() * (v / 100)
			}
			var m = this.options.slidePercent / 100,
				g = Math.abs(this.options.ratio ? d / this.options.ratio : this.options.height);
			this.$el.css({
				height: g,
				width: d
			});
			if (typeof g != "number") {
				var y = g.substring(0, g.length - 1);
				g = Math.abs(this.$el.parent().height() * (y / 100))
			}
			var w = g / 2 * Math.tan(b(Math.abs(this.options.skew))),
				E = d - w * 2,
				S = E / d,
				x = (1 - S) / 2,
				T = d * S,
				N = this.options.centered ? d * x + T * Math.abs(1 - m) / 2 : d * x,
				C = (this.itemsCount + this.options.preloadCount) * 2 * Math.round(T * m),
				k = Math.round(T * m),
				L = k * 100 / C;
			this._updatePos(i, k, C);
			this.$list.css({
				height: "100%",
				width: C
			});
			this.$items.css({
				width: A(k, C) + "%",
				display: "block",
				"z-index": 7
			});
			if (this.options.itemPadding) {
				this.$items.find(".skw-content").css({
					paddingLeft: w * 2,
					paddingRight: w * 2
				})
			} else {
				this.$items.find(".skw-content").css({
					paddingLeft: "",
					paddingRight: ""
				})
			}
			var O = C * (A(k, C) / 100);
			var M = Math.round(O + w * 2),
				_ = Math.round((O * (M / 100) - O) / 2 / d * 100);
			this.$items.find(".skw-content").add(this.$el.find(".skw-loader")).css({
				transform: "skew(" + this.options.skew * -1 + "deg, 0) translate(-" + Math.round(w) + "px, 0)",
				width: M
			});
			if (!n && this.options.infiniteSlide) {
				this.$infItems.css({
					width: A(k, C) + "%",
					"z-index": 7
				}).find(".skw-content").css({
					transform: "skew(" + this.options.skew * -1 + "deg, 0) translate(-" + w + "px, 0)",
					width: M
				});
				for (var D = 0; D < this.options.preloadCount; D++) {
					this.$infItems.eq(D).css({
						left: Math.round(-(O * (this.options.preloadCount - D)))
					})
				}
			}
			if (n && this.options.infiniteSlide) {
				for (var D = 1; D <= this.options.preloadCount; D++) {
					this.$items.eq(this.itemsCount - D).clone().removeClass().addClass("skw-infLeft skw-infItem").css({
						left: Math.round(-(O * D))
					}).prependTo(this.$list);
					this.$items.eq(D - 1).clone().removeClass().addClass("skw-infRight skw-infItem").appendTo(this.$list)
				}
				this.$infItems = this.$list.find(".skw-infItem")
			}
			if (n) {
				this._loadImages()
			}
			this.$list.css("marginLeft", Math.round(N));
			this._toggleNavControls();
			this._initEvents()
		},
		_updatePos: function(e, t, n) {
			var r = t,
				n = n,
				i = this,
				s = -1 * r / n * 100 * this.current,
				o = -1 * this.current * 100,
				u = this.options.infiniteSlide ? this.$items.add(this.$infItems) : this.$items,
				a = this.options.infiniteSlide ? this.options.preloadCount : 0;
			i.$list.css("transform", i.support3d ? "translate3d(" + s + "%,0,0)" : "translate(" + s + "%)");
			u.css("transform", i.support3d ? "translate3d(0,0,0) skew(" + i.options.skew + "deg, 0)" : "translate(0) skew(" + i.options.skew + "deg, 0)");
			if (i.options.moveFx) {
				setTimeout(function() {
					u.css("transform", i.support3d ? "translate3d(" + o + "%,0,0) skew(" + i.options.skew + "deg, 0)" : "translate(" + o + "%) skew(" + i.options.skew + "deg, 0)");
					i.$list.css("transform", i.support3d ? "translate3d(0,0,0)" : "translate(0)")
				}, e)
			}
			if (this.current < 0 || this.current > this.itemsCount - 1) {
				u.eq(i.current + a).addClass("skw-itemActive skw-visible");
				this.$infItems.removeClass("skw-itemActive skw-visible");
				this.isAnimatingInf = e;
				this._toggleNavControls();
				this.old = this.current;
				var f = this.current < 0 ? i.itemsCount + i.current : Math.abs(i.itemsCount - i.current);
				i.current = f;
				this._fakeStates(f, e)
			}
		},
		_initEvents: function() {
			var n = this,
				r;
			if (this.itemsCount > 1) {
				this.$navPrev.on("click.skewSlider", e.proxy(this._navigate, this, "previous"));
				this.$navNext.on("click.skewSlider", e.proxy(this._navigate, this, "next"));
				this.$navDots.on("click.skewSlider", function() {
					n._jump(e(this).index())
				})
			}
			if (this.options.moveOnHover) {
				e(this.$el).on("mouseenter.skewSlider", ".skw-itemNext, .skw-itemPrev", function() {
					n._hoverItem(true, e(this))
				});
				e(this.$el).on("mouseleave.skewSlider", ".skw-itemNext, .skw-itemPrev", function() {
					n._hoverItem(false, e(this))
				})
			}
			e(this.$el).on("click", ".skw-list > li.skw-itemNext > a, .skw-list > li.skw-itemPrev > a", function(e) {
				e.preventDefault()
			});
			if (this.options.clickOnSiblings) {
				e(this.$el).on("click.skewSlider", ".skw-itemNext", function() {
					var t = e(this);
					if (!n.options.moveFx) {
						t.css("transform", n.support3d ? "translate3d(0,0,0) skew(" + n.options.skew + "deg, 0)" : "translate(0) skew(" + n.options.skew + "deg, 0)")
					}
					n._navigate("next");
					setTimeout(function() {
						t.css("z-index", n.itemsCount + 1)
					}, n.options.speed)
				});
				e(this.$el).on("click.skewSlider", ".skw-itemPrev", function() {
					var t = e(this);
					if (!n.options.moveFx) {
						t.css("transform", n.support3d ? "translate3d(0,0,0) skew(" + n.options.skew + "deg, 0)" : "translate(0) skew(" + n.options.skew + "deg, 0)")
					}
					n._navigate("previous");
					setTimeout(function() {
						t.css("z-index", n.itemsCount + 1)
					}, n.options.speed)
				})
			}
			if (this.options.slideshow) {
				e(this.$el).on("mouseenter.skewSlider", function() {
					clearInterval(n.slideShow)
				});
				e(this.$el).on("mouseleave.skewSlider", function() {
					n._slideShow()
				})
			}
			e(t).on("resize", function() {
				r && clearTimeout(r);
				r = setTimeout(function() {
					n._update()
				}, 500)
			})
		},
		_hoverItem: function(e, t) {
			var n = t,
				r, i = this;
			if (this.isAnimating || !this.HoverSiblings) {
				return false
			}
			this.$items.eq(this.current).removeClass("skw-visible");
			if (e) {
				if (this.options.moveFx) {
					var s = n.hasClass("skw-itemNext") ? -1 * this.current * 100 - this.options.moveOnHover : -1 * this.current * 100 + this.options.moveOnHover
				} else {
					var s = n.hasClass("skw-itemNext") ? -1 * this.options.moveOnHover : this.options.moveOnHover
				}
				this.isHovering = true;
				n.css({
					transform: this.support3d ? "translate3d(" + s + "%,0,0) skew(" + this.options.skew + "deg, 0)" : "translate(" + s + "%) skew(" + this.options.skew + "deg, 0)",
					transition: this.transformName + " " + this.options.hoverSpeed + "ms " + this.options.easing,
					"z-index": 99
				})
			} else {
				if (this.options.moveFx) {
					n.css({
						transform: this.support3d ? "translate3d(" + -1 * this.current * 100 + "%,0,0) skew(" + this.options.skew + "deg, 0)" : "translate(" + -1 * this.current * 100 + "%) skew(" + this.options.skew + "deg, 0)",
						transition: this.transformName + " " + this.options.hoverSpeed + "ms " + this.options.easing
					})
				} else {
					n.css({
						transform: this.support3d ? "translate3d(0,0,0) skew(" + this.options.skew + "deg, 0)" : "translate(0) skew(" + this.options.skew + "deg, 0)",
						transition: this.transformName + " " + this.options.hoverSpeed + "ms " + this.options.easing
					})
				}
			}
		},
		_navigate: function(e) {
			if (this.isAnimating) {
				return false
			}
			this.isAnimating = true;
			this.old = this.current;
			if (e === "next") {
				this.current += this.options.itemsToslide
			} else if (e === "previous") {
				this.current -= this.options.itemsToslide
			}
			this._slide()
		},
		_slideShow: function() {
			var e = this;
			clearInterval(e.slideShow);
			this.slideShow = setInterval(function() {
				e._navigate("next")
			}, e.options.slideshow)
		},
		_jump: function(e) {
			if (e === this.current || this.isAnimating) {
				return false
			}
			this.isAnimating = true;
			this.old = this.current;
			this.current = e;
			this._slide()
		},
		_loadCaption: function() {
			var e = this.$items.eq(this.current),
				t = e.find(".skw-content").data("caption"),
				n = this;
			clearTimeout(this.captionTimeout);
			if (t && this.options.showCaption) {
				n.$caption.html(t).css({
					opacity: 1,
					pointerEvents: ""
				})
			} else {
				n.$caption.css({
					opacity: 0,
					pointerEvents: "none"
				});
				this.captionTimeout = setTimeout(function() {
					n.$caption.html("")
				}, 1e3)
			}
		},
		_slide: function(t) {
			var n = this.options.infiniteSlide ? this.$items.add(this.$infItems) : this.$item,
				r = this.options.infiniteSlide ? this.options.preloadCount : 0,
				i = this;
			if (t !== "no-trans") {
				this.$infItems.removeClass("skw-itemActive");
				this._toggleNavControls()
			}
			this.$caption.css("opacity", 0);
			var s = this.current;
			var o = e.proxy(function() {
				this.isAnimating = false;
				this.isAnimatingInf = false;
				this._loadCaption();
				this.$items.eq(this.current).addClass("skw-animate").siblings(".skw-animate").removeClass("skw-animate")
			}, this);
			var u = this;
			this._loadImages();
			if (!this.options.moveFx && this.options.moveOnHover) {
				this.$items.eq(this.current).css("transform", this.support3d ? "translate3d(0,0,0) skew(" + this.options.skew + "deg, 0)" : "translate(0) skew(" + this.options.skew + "deg, 0)");
				if (this.options.infiniteSlide) {
					var a;
					if (this.current > this.itemsCount - 1) {
						a = this.options.preloadCount
					} else if (this.current < 0) {
						a = this.options.preloadCount - 1
					}
					this.$infItems.eq(a).css("transform", this.support3d ? "translate3d(0,0,0) skew(" + this.options.skew + "deg, 0)" : "translate(0) skew(" + this.options.skew + "deg, 0)")
				}
			}
			if (!this.support || !this.options.moveFx) {
				var f = this.$items.outerWidth(true),
					l = this.$list.width(),
					c = -1 * f / l * 100 * this.current;
				if (this.support) {
					this.$list.css({
						transform: this.support3d ? "translate3d(" + c + "%,0,0)" : "translate(" + c + "%)",
						transition: this.transformName + " " + this.options.speed + "ms " + this.options.easing
					})
				} else {
					this.$list.animate("margin-left", c + "%")
				}
				this.maxTime = this.options.speed
			} else {
				var c = -1 * this.current * 100,
					h = u.old < u.current ? 1 : -1;
				this.maxTime = 0;
				n.each(function() {
					var t = e(this),
						n = u.options.infiniteSlide ? t.index() - u.options.preloadCount : t.index(),
						r = Math.abs(u.current - n);
					var s = u.options.speedDifference;
					for (var o = 1; o <= r; o++) {
						s += u.options.speedDifference / (Math.pow(1.2, o) * 2)
					}
					s -= u.options.speedDifference;
					if (s > i.maxTime) {
						i.maxTime = s
					}
					var a = n > u.current ? u.options.speed - s * h : u.options.speed + s * h;
					t.css("transition", u.transformName + " " + a + "ms " + u.options.easing);
					if (u.options.delay > 0) {
						var f = u.old;
						if (h > 0) {
							if (n <= f) {
								t.css({
									transitionDelay: u.options.delay + "ms",
									"z-index": u.itemsCount
								})
							} else {
								t.css({
									transitionDelay: 0,
									"z-index": u.itemsCount + 1
								})
							}
						} else {
							if (n >= f) {
								t.css({
									transitionDelay: u.options.delay + "ms",
									"z-index": u.itemsCount - Math.abs(n - f)
								})
							} else {
								t.css({
									transitionDelay: 0,
									"z-index": u.itemsCount + 1
								})
							}
						}
					}
					t.css("transform", this.support3d ? "translate3d(" + c + "%,0,0) skew(" + u.options.skew + "deg, 0)" : "translate(" + c + "%) skew(" + u.options.skew + "deg, 0)")
				});
				i.maxTime += u.options.speed
			}
			var p = u.options.speed;
			if (this.current < 0 || this.current > this.itemsCount - 1) {
				this.isAnimating = true;
				this.old = this.current;
				var d = this.current < 0 ? u.itemsCount + u.current : Math.abs(u.itemsCount - u.current);
				p = this.current < 0 ? this.maxTime + u.options.delay : p + u.options.delay;
				this._fakeStates(d, p)
			}
			if (t == "no-trans") {
				u.isAnimating = true;
				p = 0;
				console.log("inf");
				setTimeout(function() {
					u.$el.removeClass("skw-noTransition");
					u.HoverSiblings = true;
					u.$el.removeClass("skw-noEvents")
				}, 100)
			}
			setTimeout(function() {
				o.call()
			}, p)
		},
		_fakeStates: function(e, t) {
			var n = this;
			this.isAnimatingInf = t;
			this.current = e;
			this.$el.addClass("skw-noEvents");
			setTimeout(function() {
				n.HoverSiblings = false;
				n.$el.addClass("skw-noTransition");
				n._slide("no-trans")
			}, t)
		},
		_toggleNavControls: function() {
			if (!this.options.infiniteSlide) {
				switch (this.current) {
					case 0:
						this.$navNext.removeClass("skw-trans");
						this.$navPrev.addClass("skw-trans");
						break;
					case this.itemsCount - 1:
						this.$navNext.addClass("skw-trans");
						this.$navPrev.removeClass("skw-trans");
						break;
					default:
						this.$navNext.removeClass("skw-trans");
						this.$navPrev.removeClass("skw-trans");
						break
				}
			}
			this.$navDots.eq(this.old).removeClass("skw-current").end().eq(this.current).addClass("skw-current");
			var e = this.options.infiniteSlide ? this.$items.add(this.$infItems) : this.$items,
				t = this.options.infiniteSlide ? this.options.preloadCount : 0,
				n = this;
			e.eq(this.old + t).not(".skw-infItem").removeClass("skw-itemActive");
			var r = e.eq(n.current + t);
			e.filter(".skw-itemNext").removeClass("skw-itemNext");
			e.filter(".skw-itemPrev").removeClass("skw-itemPrev");
			r.addClass("skw-itemActive");
			if (this.current >= 0 && this.current < this.itemsCount) {
				e.eq(this.current + t + this.options.NextPrevDistance).addClass("skw-itemNext");
				e.eq(this.options.centered ? this.current + t - this.options.NextPrevDistance : this.current + t - 1).addClass("skw-itemPrev")
			}
			if (this.current < 0) {
				e.eq(this.current + this.itemsCount + t).addClass("skw-itemActive");
				e.eq(this.current + this.itemsCount + t + 1).addClass("skw-animate");
				e.eq(this.current + this.itemsCount + t + this.options.NextPrevDistance).addClass("skw-itemNext");
				e.eq(this.options.centered ? this.current + this.itemsCount + t - this.options.NextPrevDistance : this.current + this.itemsCount + t - 1).addClass("skw-itemPrev")
			}
			if (this.current >= this.itemsCount) {
				e.eq(this.current - this.itemsCount + t).addClass("skw-itemActive");
				e.eq(this.current - this.itemsCount + t - 1).addClass("skw-animate");
				e.eq(this.current - this.itemsCount + t + this.options.NextPrevDistance).addClass("skw-itemNext");
				e.eq(this.options.centered ? this.current - this.itemsCount + t - this.options.NextPrevDistance : this.current - this.itemsCount + t - 1).addClass("skw-itemPrev");
				this.$navDots.eq(this.old).removeClass("skw-current").end().eq(this.current - this.itemsCount).addClass("skw-current")
			}
		},
		_loadImages: function() {
			var e = this,
				t = this.options.infiniteSlide ? this.$items.add(this.$infItems) : this.$items,
				n = this.options.infiniteSlide ? this.options.preloadCount : 0;
			for (var r = e.current - e.options.preloadCount; r <= e.current + e.options.preloadCount; r++) {
				var i = t.eq(r + n),
					s = i.find(".skw-content"),
					o = s.data("bg");
				if (o && !s.hasClass("charged")) s.css("background-image", "url(" + o + ")").addClass("charged")
			}
		},
		update: function(e, t, n, r) {
			var i = 0,
				s = this,
				o = true;
			if (this.updateDelay) {
				o = false
			}
			if (this.isAnimatingInf) {
				if (!r) {
					if (t) {
						setTimeout(function() {
							t(false)
						}, n)
					}
					return false
				}
				i = this.isAnimatingInf + 100;
				this.updateDelay = true
			}
			this.updateTimeout = setTimeout(function() {
				var r = s.options.infiniteSlide ? s.$items.add(s.$infItems) : s.$items;
				n = n || 600;
				s.$list.parent().css("transition", "all " + n + "ms");
				s.$list.css("transition", "all " + n + "ms");
				r.css("transition", "all " + n + "ms");
				r.find(".skw-content").css("transition", "all " + n + "ms");
				if (!this.updateDelay) {
					s._update(false, e, n);
					s._toggleNavControls()
				}
				if (t) {
					setTimeout(function() {
						t(o)
					}, n)
				}
				s.updateDelay = false
			}, i)
		},
		navigate: function(e, t) {
			var n = this;
			if (e == "next" || e == "previous") {
				var r = e == "next" ? this.current + 1 : this.current - 1;
				this._jump(r)
			} else {
				this._jump(e)
			}
			console.log(n.maxTime);
			if (t) {
				setTimeout(function() {
					t()
				}, n.maxTime + 200)
			}
		}
	};
	e.fn.skewSlider = function(t) {
		if (typeof t === "string") {
			var n = Array.prototype.slice.call(arguments, 1);
			this.each(function() {
				var r = e.data(this, "skewSlider");
				if (!r) {
					logError("cannot call methods on cbpFWSlider prior to initialization; " + "attempted to call method '" + t + "'");
					return
				}
				if (!e.isFunction(r[t]) || t.charAt(0) === "_") {
					logError("no such method '" + t + "' for cbpFWSlider instance");
					return
				}
				r[t].apply(r, n)
			})
		} else {
			this.each(function() {
				var n = e.data(this, "skewSlider");
				if (n) {
					n._init()
				} else {
					n = e.data(this, "skewSlider", new e.SKEWSlider(t, this))
				}
			})
		}
		return this
	}
})(jQuery, window)