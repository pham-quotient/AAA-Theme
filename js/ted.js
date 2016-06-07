!function() {
    define("deferLink", ["jquery"], function(t) {
        "use strict";
        function e(t) {
            return function(e) {
                return i.call(this, e, t)
            }
        }
        function i(e, i) {
            function n() {
                var t =+ s.data(a) - 1;
                s.data(a, t), 0 >= t&&!s.data(h) && (u.location.href = c)
            }
            var s = "A" === this.nodeName ? t(this): t(e.target).closest("a"), c = s.attr("href"), p = s.attr("target"), d = s.length && c && 1 === e.which&&!e.metaKey&&!e.shiftKey, f = i;
            if (t.isFunction(i) && (f = i.call(this, e), f===!1))
                return !1;
            d && e.isDefaultPrevented()&&!s.data(a) && (d=!1), d && p && "_self" !== p && (d=!1), d && o && s.is("[download]") && (d=!1), d && s.hasClass(r) && (d=!1);
            var g =+ (s.data(a) || 0);
            d && (s.data(a, g + 1), f.when ? ("resolved" === f.state() && n(), f.done(n)) : t.isNumeric(f) ? u.setTimeout(n, f) : (d=!1, s.data(a, g))), d&&!g && (e.preventDefault(), s.data(l, !0))
        }
        function n(n) {
            return n.when || t.isNumeric(n) || t.isFunction(n) ? e(n) : void i.call(this, n, s)
        }
        var s = 50, r = "no-defer", o = "download"in document.createElement("a"), a = "defer-link-pends", l = "defer-link-preventable", h = "defer-link-prevented", u = window, c = t.Event.prototype.preventDefault;
        return t.Event.prototype.preventDefault = function() {
            var e = t(this.target);
            return e.data(l) && e.data(h, !0), c.apply(this, Array.prototype.slice.call(arguments))
        }, n
    }), define("utils/applyAll", ["jquery"], function(t) {
        "use strict";
        function e(i, n, s) {
            var r, o;
            for (r = 0, o = n.length; o > r; r++)
                t.isArray(n[r]) ? e(i, n[r], s) : n[r].apply(i, s)
        }
        return e
    }), define("utils/throwError", [], function() {
        "use strict";
        return function(t) {
            throw new Error("Error in TED: " + t)
        }
    }), define("lib/pubSub", ["jquery", "utils/applyAll", "utils/throwError"], function(t, e, i) {
        "use strict";
        function n(t) {
            var n = {
                publish: t.fire,
                subscribe: t.add,
                unsubscribe: t.remove
            }, s = null;
            t.add(function(t) {
                s = t
            }), n.read = function() {
                return s
            };
            var r;
            return n.publishUnique = function() {
                if (!window.JSON)
                    return i("JSON object not available. You may need to shim it on this client."), !1;
                var e = Array.prototype.slice.call(arguments, 0), n = JSON.stringify(e);
                n !== r && (t.fire.apply(t, e), r = n)
            }, n.once = function() {
                function i() {
                    e(t, n, arguments), t.remove(i)
                }
                var n = arguments;
                return t.add(i)
            }, n.future = function() {
                function i() {
                    r && e(t, s, arguments)
                }
                var n, s = arguments, r=!1;
                return n = t.add(i), r=!0, n
            }, n
        }
        function s(e) {
            var i, s = e && r[e];
            return s || (i = t.Callbacks("memory"), s = n(i), e && (r[e] = s)), s
        }
        var r = {};
        return s._reset = function() {
            r = {}
        }, s
    }), define("lib/resize", ["jquery", "lodash", "lib/pubSub"], function(t, e, i) {
        "use strict";
        function n(t) {
            for (var e, n = p; n--;)
                !e && t >= c[n].at && (e = c[n].its);
            i("sizeGroup").publishUnique(e)
        }
        function s() {
            var t = 0, e = u;
            if (r = window.innerHeight, o = window.innerWidth || document.documentElement.clientWidth, h)
                t = l;
            else
                for (; e--;)
                    !t && o >= a[e] && (t = a[e]);
            i("breakpoint").publishUnique(t), i("height").publishUnique(r), i("width").publishUnique(o)
        }
        var r, o, a = [320, 480, 600, 768, 1024, 1200], l = 1024, h = t("html").is(".oldie"), u = a.length, c = [{
            at: 0,
            its: "oh"
        }, {
            at: 480,
            its: "xs"
        }, {
            at: 768,
            its: "sm"
        }, {
            at: 1024,
            its: "lg"
        }
        ], p = c.length;
        return t(window).on("resize", e.throttle(s, 100)), s(), i("breakpoint").subscribe(n), i
    }), define("lib/ga", ["jquery", "lodash", "deferLink", "lib/pubSub", "lib/resize"], function(t, e, i, n) {
        "use strict";
        function s() {
            var t = a.slice.call(arguments), n = this;
            return function(s) {
                return n.apply(h, t), e.has(s, "originalEvent") && e.has(this, "nodeName") && "click" === s.type ? i.call(this, s) : void 0
            }
        }
        function r() {
            var t, e = 0;
            n("breakpoint").subscribe(function(i) {
                h("set", "dimension1", i), e++&&h.sendEvent("breakpoint", "change", t + "|" + i, e), t = i
            })
        }
        function o(e) {
            var i = t(this), n = "ga-";
            e = t.extend(e || {}, {
                category: i.data(n + "category"),
                action: i.data(n + "action"),
                label: i.data(n + "label")
            }), h.sendEvent(e.category, e.action, e.label)
        }
        var a = [], l = window, h = l[l.GoogleAnalyticsObject] || t.noop;
        return e.assign(h, {
            send: e.partial(h, "send"),
            set: e.partial(h, "set"),
            sendEvent: e.partial(h, "send", "event"),
            sendSocial: e.partial(h, "send", "social")
        }, function(t, e) {
            return e.recall = s, e
        }), r(), h.send("pageview"), t(function() {
            t(document).on("click", "a.ga-link", i(function() {
                return o.call(this, {
                    action: "click",
                    category: "site.link",
                    label: this.href
                }), 50
            }))
        }), h
    }), define("Mailcheck", ["exports"], function() {
        var t = {
            mailcheck: {
                threshold: 3,
                defaultDomains: ["yahoo.com", "google.com", "hotmail.com", "gmail.com", "me.com", "aol.com", "mac.com", "live.com", "comcast.net", "googlemail.com", "msn.com", "hotmail.co.uk", "yahoo.co.uk", "facebook.com", "verizon.net", "sbcglobal.net", "att.net", "gmx.com", "mail.com"],
                defaultTopLevelDomains: ["co.uk", "com", "net", "org", "info", "edu", "gov", "mil"],
                run: function(e) {
                    e.domains = e.domains || t.mailcheck.defaultDomains, e.topLevelDomains = e.topLevelDomains || t.mailcheck.defaultTopLevelDomains, e.distanceFunction = e.distanceFunction || t.sift3Distance;
                    var i = t.mailcheck.suggest(encodeURI(e.email), e.domains, e.topLevelDomains, e.distanceFunction);
                    i ? e.suggested && e.suggested(i) : e.empty && e.empty()
                },
                suggest: function(t, e, i, n) {
                    t = t.toLowerCase();
                    var s = this.splitEmail(t), r = this.findClosestDomain(s.domain, e, n);
                    if (r) {
                        if (r != s.domain)
                            return {
                                address: s.address,
                                domain: r,
                                full: s.address + "@" + r
                            }
                    } else {
                        var o = this.findClosestDomain(s.topLevelDomain, i);
                        if (s.domain && o && o != s.topLevelDomain) {
                            var a = s.domain;
                            return r = a.substring(0, a.lastIndexOf(s.topLevelDomain)) + o, {
                                address: s.address,
                                domain: r,
                                full: s.address + "@" + r
                            }
                        }
                    }
                    return !1
                },
                findClosestDomain: function(t, e, i) {
                    var n, s = 99, r = null;
                    if (!t ||!e)
                        return !1;
                    i || (i = this.sift3Distance);
                    for (var o = 0; o < e.length; o++) {
                        if (t === e[o])
                            return t;
                        n = i(t, e[o]), s > n && (s = n, r = e[o])
                    }
                    return s <= this.threshold && null !== r ? r : !1
                },
                sift3Distance: function(t, e) {
                    if (null == t || 0 === t.length)
                        return null == e || 0 === e.length ? 0 : e.length;
                    if (null == e || 0 === e.length)
                        return t.length;
                    for (var i = 0, n = 0, s = 0, r = 0, o = 5; i + n < t.length && i + s < e.length;) {
                        if (t.charAt(i + n) == e.charAt(i + s))
                            r++;
                        else {
                            n = 0, s = 0;
                            for (var a = 0; o > a; a++) {
                                if (i + a < t.length && t.charAt(i + a) == e.charAt(i)) {
                                    n = a;
                                    break
                                }
                                if (i + a < e.length && t.charAt(i) == e.charAt(i + a)) {
                                    s = a;
                                    break
                                }
                            }
                        }
                        i++
                    }
                    return (t.length + e.length) / 2 - r
                },
                splitEmail: function(t) {
                    var e = t.split("@");
                    if (e.length < 2)
                        return !1;
                    for (var i = 0; i < e.length; i++)
                        if ("" === e[i])
                            return !1;
                    var n = e.pop(), s = n.split("."), r = "";
                    if (0 == s.length)
                        return !1;
                    if (1 == s.length)
                        r = s[0];
                    else {
                        for (var i = 1; i < s.length; i++)
                            r += s[i] + ".";
                        s.length >= 2 && (r = r.substring(0, r.length - 1))
                    }
                    return {
                        topLevelDomain: r,
                        domain: n,
                        address: e.join("@")
                    }
                }
            }
        };
        return window.jQuery&&!function(e) {
            e.fn.mailcheck = function(e) {
                var i = this;
                if (e.suggested) {
                    var n = e.suggested;
                    e.suggested = function(t) {
                        n(i, t)
                    }
                }
                if (e.empty) {
                    var s = e.empty;
                    e.empty = function() {
                        s.call(null, i)
                    }
                }
                e.email = this.val(), t.mailcheck.run(e)
            }
        }(jQuery), t
    }), define("lib/newsletter", ["jquery", "Mailcheck"], function(t, e) {
        "use strict";
        function i(e) {
            var i = [];
            return e.isDaily && i.push("daily"), e.isWeekly && i.push("weekly"), e.isFellows && i.push("fellows"), t.getJSON("//www.ted.com/newsletter/signup.json?callback=?", {
                newsletterSignup: {
                    email_address: e.email,
                    subscription_list: i
                }
            })
        }
        function n(e) {
            function n(t) {
                "error" === t.status ? l.rejectWith(e, [["uncaught"]]) : l.resolveWith(e)
            }
            function r() {
                l.rejectWith(e, [["server"]])
            }
            function o() {
                i(e).then(n, r)
            }
            function a(t) {
                l.rejectWith(this, [t])
            }
            var l = new t.Deferred;
            return s(e).then(o, a), l
        }
        function s(i) {
            var n = [], s = new t.Deferred;
            return "" === i.email && n.push("blankemail"), ("" + i.email).match(/.+@.+/) || n.push("email"), i.isDaily || i.isWeekly || i.isFellows || n.push("subscription"), e.mailcheck.run({
                email: i.email,
                suggested: function(t) {
                    if (n.push({
                        type: "suggestion",
                        data: t.full
                    }), 1 === n.length) {
                        var i = this.email.match(/@(.+$)/)[1];
                        e.mailcheck.defaultDomains.push(i)
                    }
                }
            }), n.length ? s.rejectWith(i, [n]) : s.resolveWith(i), s.promise()
        }
        return e.mailcheck.defaultDomains.push("ted.com"), {
            ajax: i,
            subscribe: n,
            validate: s
        }
    }), define("jqueryui/widget", ["jquery"], function(t) {
        return function(t, e) {
            var i = 0, n = Array.prototype.slice, s = t.cleanData;
            t.cleanData = function(e) {
                for (var i, n = 0; null != (i = e[n]); n++)
                    try {
                        t(i).triggerHandler("remove")
                } catch (r) {}
                s(e)
            }, t.widget = function(e, i, n) {
                var s, r, o, a, l = {}, h = e.split(".")[0];
                e = e.split(".")[1], s = h + "-" + e, n || (n = i, i = t.Widget), t.expr[":"][s.toLowerCase()] = function(e) {
                    return !!t.data(e, s)
                }, t[h] = t[h] || {}, r = t[h][e], o = t[h][e] = function(t, e) {
                    return this._createWidget ? void(arguments.length && this._createWidget(t, e)) : new o(t, e)
                }, t.extend(o, r, {
                    version: n.version,
                    _proto: t.extend({}, n),
                    _childConstructors: []
                }), a = new i, a.options = t.widget.extend({}, a.options), t.each(n, function(e, n) {
                    return t.isFunction(n) ? void(l[e] = function() {
                        var t = function() {
                            return i.prototype[e].apply(this, arguments)
                        }, s = function(t) {
                            return i.prototype[e].apply(this, t)
                        };
                        return function() {
                            var e, i = this._super, r = this._superApply;
                            return this._super = t, this._superApply = s, e = n.apply(this, arguments), this._super = i, this._superApply = r, e
                        }
                    }()) : void(l[e] = n)
                }), o.prototype = t.widget.extend(a, {
                    widgetEventPrefix: r ? a.widgetEventPrefix || e: e
                }, l, {
                    constructor: o,
                    namespace: h,
                    widgetName: e,
                    widgetFullName: s
                }), r ? (t.each(r._childConstructors, function(e, i) {
                    var n = i.prototype;
                    t.widget(n.namespace + "." + n.widgetName, o, i._proto)
                }), delete r._childConstructors) : i._childConstructors.push(o), t.widget.bridge(e, o)
            }, t.widget.extend = function(i) {
                for (var s, r, o = n.call(arguments, 1), a = 0, l = o.length; l > a; a++)
                    for (s in o[a])
                        r = o[a][s], o[a].hasOwnProperty(s) && r !== e && (i[s] = t.isPlainObject(r) ? t.isPlainObject(i[s]) ? t.widget.extend({}, i[s], r) : t.widget.extend({}, r) : r);
                return i
            }, t.widget.bridge = function(i, s) {
                var r = s.prototype.widgetFullName || i;
                t.fn[i] = function(o) {
                    var a = "string" == typeof o, l = n.call(arguments, 1), h = this;
                    return o=!a && l.length ? t.widget.extend.apply(null, [o].concat(l)) : o, this.each(a ? function() {
                        var n, s = t.data(this, r);
                        return s ? t.isFunction(s[o]) && "_" !== o.charAt(0) ? (n = s[o].apply(s, l), n !== s && n !== e ? (h = n && n.jquery ? h.pushStack(n.get()) : n, !1) : void 0) : t.error("no such method '" + o + "' for " + i + " widget instance") : t.error("cannot call methods on " + i + " prior to initialization; attempted to call method '" + o + "'")
                    } : function() {
                        var e = t.data(this, r);
                        e ? e.option(o || {})._init() : t.data(this, r, new s(o, this))
                    }), h
                }
            }, t.Widget = function() {}, t.Widget._childConstructors = [], t.Widget.prototype = {
                widgetName: "widget",
                widgetEventPrefix: "",
                defaultElement: "<div>",
                options: {
                    disabled: !1,
                    create: null
                },
                _createWidget: function(e, n) {
                    n = t(n || this.defaultElement || this)[0], this.element = t(n), this.uuid = i++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = t.widget.extend({}, this.options, this._getCreateOptions(), e), this.bindings = t(), this.hoverable = t(), this.focusable = t(), n !== this && (t.data(n, this.widgetFullName, this), this._on(!0, this.element, {
                        remove: function(t) {
                            t.target === n && this.destroy()
                        }
                    }), this.document = t(n.style ? n.ownerDocument : n.document || n), this.window = t(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
                },
                _getCreateOptions: t.noop,
                _getCreateEventData: t.noop,
                _create: t.noop,
                _init: t.noop,
                destroy: function() {
                    this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
                },
                _destroy: t.noop,
                widget: function() {
                    return this.element
                },
                option: function(i, n) {
                    var s, r, o, a = i;
                    if (0 === arguments.length)
                        return t.widget.extend({}, this.options);
                    if ("string" == typeof i)
                        if (a = {}, s = i.split("."), i = s.shift(), s.length) {
                            for (r = a[i] = t.widget.extend({}, this.options[i]), o = 0; o < s.length - 1; o++)
                                r[s[o]] = r[s[o]] || {}, r = r[s[o]];
                                if (i = s.pop(), 1 === arguments.length)
                                    return r[i] === e ? null : r[i];
                                    r[i] = n
                        } else {
                            if (1 === arguments.length)
                                return this.options[i] === e ? null : this.options[i];
                                a[i] = n
                        }
                    return this._setOptions(a), this
                },
                _setOptions: function(t) {
                    var e;
                    for (e in t)
                        this._setOption(e, t[e]);
                    return this
                },
                _setOption: function(t, e) {
                    return this.options[t] = e, "disabled" === t && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!e).attr("aria-disabled", e), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this
                },
                enable: function() {
                    return this._setOption("disabled", !1)
                },
                disable: function() {
                    return this._setOption("disabled", !0)
                },
                _on: function(e, i, n) {
                    var s, r = this;
                    "boolean" != typeof e && (n = i, i = e, e=!1), n ? (i = s = t(i), this.bindings = this.bindings.add(i)) : (n = i, i = this.element, s = this.widget()), t.each(n, function(n, o) {
                        function a() {
                            return e || r.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled") ? ("string" == typeof o ? r[o] : o).apply(r, arguments) : void 0
                        }
                        "string" != typeof o && (a.guid = o.guid = o.guid || a.guid || t.guid++);
                        var l = n.match(/^(\w+)\s*(.*)$/), h = l[1] + r.eventNamespace, u = l[2];
                        u ? s.delegate(u, h, a) : i.bind(h, a)
                    })
                },
                _off: function(t, e) {
                    e = (e || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, t.unbind(e).undelegate(e)
                },
                _delay: function(t, e) {
                    function i() {
                        return ("string" == typeof t ? n[t] : t).apply(n, arguments)
                    }
                    var n = this;
                    return setTimeout(i, e || 0)
                },
                _hoverable: function(e) {
                    this.hoverable = this.hoverable.add(e), this._on(e, {
                        mouseenter: function(e) {
                            t(e.currentTarget).addClass("ui-state-hover")
                        },
                        mouseleave: function(e) {
                            t(e.currentTarget).removeClass("ui-state-hover")
                        }
                    })
                },
                _focusable: function(e) {
                    this.focusable = this.focusable.add(e), this._on(e, {
                        focusin: function(e) {
                            t(e.currentTarget).addClass("ui-state-focus")
                        },
                        focusout: function(e) {
                            t(e.currentTarget).removeClass("ui-state-focus")
                        }
                    })
                },
                _trigger: function(e, i, n) {
                    var s, r, o = this.options[e];
                    if (n = n || {}, i = t.Event(i), i.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), i.target = this.element[0], r = i.originalEvent)
                        for (s in r)
                            s in i || (i[s] = r[s]);
                    return this.element.trigger(i, n), !(t.isFunction(o) && o.apply(this.element[0], [i].concat(n))===!1 || i.isDefaultPrevented())
                }
            }, t.each({
                show: "fadeIn",
                hide: "fadeOut"
            }, function(e, i) {
                t.Widget.prototype["_" + e] = function(n, s, r) {
                    "string" == typeof s && (s = {
                        effect: s
                    });
                    var o, a = s ? s===!0 || "number" == typeof s ? i: s.effect || i: e;
                    s = s || {}, "number" == typeof s && (s = {
                        duration: s
                    }), o=!t.isEmptyObject(s), s.complete = r, s.delay && n.delay(s.delay), o && t.effects && t.effects.effect[a] ? n[e](s) : a !== e && n[a] ? n[a](s.duration, s.easing, r) : n.queue(function(i) {
                        t(this)[e](), r && r.call(n[0]), i()
                    })
                }
            })
        }(t), t
    }), define("widgets/customSpotlightNewsletter", ["jquery", "lodash", "lib/newsletter", "jqueryui/widget"], function(t, e, i) {
        "use strict";
        var n = "spotlight-custom__newsletter", s = "input." + n, r = "div." + n, o = "fast";
        t.widget("ted.customSpotlightNewsletter", {
            _create: function() {
                this._init = e.bind(this._init, this), this._win = e.bind(this._win, this), this._fail = e.bind(this._fail, this), this._on({
                    submit: this._submit,
                    "click a.spotlight-custom__newsletter__error__data": this._acceptSuggestion
                })
            },
            _init: function() {
                var t = this.element;
                this.$daily = t.find(s + "__daily"), this.$weekly = t.find(s + "__weekly"), this.$email = t.find(s + "__form__email"), this.$errors = t.find(r + "__error")
            },
            _submit: function(t) {
                this._init(), this.newsletterData = {
                    email: this.$email.val(),
                    isDaily: this.$daily.is(":checked"),
                    isWeekly: this.$weekly.is(":checked")
                }, this._trigger("submit", t, this.newsletterData), i.subscribe(this.newsletterData).then(this._win, this._fail), t.preventDefault()
            },
            _acceptSuggestion: function(t) {
                this.$errors.slideUp(o), this.$email.val(this.suggestion), this._submit(t)
            },
            _win: function() {
                this._trigger("success", null, this.newsletterData), this.element.find(r + "__details").slideUp(o), this.element.find(r + "__success").slideDown(o)
            },
            _fail: function(t) {
                var e = t[0], i = e.type || e, n = this.element.find(r + "__error--" + i);
                "suggestion" === i && (this.suggestion = e.data, n.find("a.spotlight-custom__newsletter__error__data").text(e.data)), this.$errors.slideUp(o), n.slideDown(o), this.newsletterData.errors = t, this._trigger("error", null, this.newsletterData)
            }
        })
    }), define("home/spotlightCustom", ["jquery", "lodash", "lib/ga", "exports", "widgets/customSpotlightNewsletter"], function(t, e, i, n) {
        "use strict";
        function s() {
            r = t("form.spotlight-custom__newsletter").customSpotlightNewsletter().on(o + "success", function(t, n) {
                i.sendEvent("newsletter", "success", e.filter([n.isDaily ? "daily": !1, n.isWeekly ? "weekly": !1]).join(","))
            })
        }
        var r, o = "customspotlightnewsletter";
        n.conf = function() {
            s(), r.on("submit", function() {
                i.sendEvent(o + "newsletter", "submit", "TED Global 2014: during conference")
            })
        }, n.postconf = function() {
            s(), r.on("submit", function() {
                i.sendEvent(o + "newsletter", "submit", "TED Global 2014: post-conference")
            })
        }, n.preconf = function() {
            s(), r.on("submit", function() {
                i.sendEvent(o + "newsletter", "submit", "TED Global 2014: pre-conference")
            })
        }, n.impress = e.once(function() {
            t("div.spotlight-custom a.ga-link").each(function() {
                i.sendEvent("homepage.spotlight", "impression", t(this).data("ga-label"), {
                    nonInteraction: 1
                })
            })
        })
    }), function(t, e) {
        "undefined" != typeof exports ? e(t, exports, require("underscore")) : "function" == typeof define && define.amd ? define("Backbone", ["underscore", "jquery", "exports"], function(i, n, s) {
            t.Backbone = e(t, s, i, n)
        }) : t.Backbone = e(t, {}, t._, t.jQuery || t.Zepto || t.ender || t.$)
    }(this, function(t, e, i, n) {
        var s = t.Backbone, r = [], o = r.push, a = r.slice, l = r.splice;
        e.VERSION = "1.0.0", e.$ = n, e.noConflict = function() {
            return t.Backbone = s, this
        }, e.emulateHTTP=!1, e.emulateJSON=!1;
        var h = e.Events = {
            on: function(t, e, i) {
                if (!c(this, "on", t, [e, i]) ||!e)
                    return this;
                this._events || (this._events = {});
                var n = this._events[t] || (this._events[t] = []);
                return n.push({
                    callback: e,
                    context: i,
                    ctx: i || this
                }), this
            },
            once: function(t, e, n) {
                if (!c(this, "once", t, [e, n]) ||!e)
                    return this;
                var s = this, r = i.once(function() {
                    s.off(t, r), e.apply(this, arguments)
                });
                return r._callback = e, this.on(t, r, n)
            },
            off: function(t, e, n) {
                var s, r, o, a, l, h, u, p;
                if (!this._events ||!c(this, "off", t, [e, n]))
                    return this;
                if (!t&&!e&&!n)
                    return this._events = {}, this;
                for (a = t ? [t] : i.keys(this._events), l = 0, h = a.length; h > l; l++)
                    if (t = a[l], o = this._events[t]) {
                        if (this._events[t] = s = [], e || n)
                            for (u = 0, p = o.length; p > u; u++)
                                r = o[u], (e && e !== r.callback && e !== r.callback._callback || n && n !== r.context) && s.push(r);
                                s.length || delete this._events[t]
                    }
                return this
            },
            trigger: function(t) {
                if (!this._events)
                    return this;
                var e = a.call(arguments, 1);
                if (!c(this, "trigger", t, e))
                    return this;
                var i = this._events[t], n = this._events.all;
                return i && p(i, e), n && p(n, arguments), this
            },
            stopListening: function(t, e, i) {
                var n = this._listeners;
                if (!n)
                    return this;
                var s=!e&&!i;
                "object" == typeof e && (i = this), t && ((n = {})[t._listenerId] = t);
                for (var r in n)
                    n[r].off(e, i, this), s && delete this._listeners[r];
                return this
            }
        }, u = /\s+/, c = function(t, e, i, n) {
            if (!i)
                return !0;
            if ("object" == typeof i) {
                for (var s in i)
                    t[e].apply(t, [s, i[s]].concat(n));
                return !1
            }
            if (u.test(i)) {
                for (var r = i.split(u), o = 0, a = r.length; a > o; o++)
                    t[e].apply(t, [r[o]].concat(n));
                return !1
            }
            return !0
        }, p = function(t, e) {
            var i, n =- 1, s = t.length, r = e[0], o = e[1], a = e[2];
            switch (e.length) {
            case 0:
                for (; ++n < s;)(i = t[n])
                    .callback.call(i.ctx);
                return;
            case 1:
                for (; ++n < s;)(i = t[n])
                    .callback.call(i.ctx, r);
                return;
            case 2:
                for (; ++n < s;)(i = t[n])
                    .callback.call(i.ctx, r, o);
                return;
            case 3:
                for (; ++n < s;)(i = t[n])
                    .callback.call(i.ctx, r, o, a);
                return;
            default:
                for (; ++n < s;)(i = t[n])
                    .callback.apply(i.ctx, e)
            }
        }, d = {
            listenTo: "on",
            listenToOnce: "once"
        };
        i.each(d, function(t, e) {
            h[e] = function(e, n, s) {
                var r = this._listeners || (this._listeners = {}), o = e._listenerId || (e._listenerId = i.uniqueId("l"));
                return r[o] = e, "object" == typeof n && (s = this), e[t](n, s, this), this
            }
        }), h.bind = h.on, h.unbind = h.off, i.extend(e, h);
        var f = e.Model = function(t, e) {
            var n, s = t || {};
            e || (e = {}), this.cid = i.uniqueId("c"), this.attributes = {}, i.extend(this, i.pick(e, g)), e.parse && (s = this.parse(s, e) || {}), (n = i.result(this, "defaults")) && (s = i.defaults({}, s, n)), this.set(s, e), this.changed = {}, this.initialize.apply(this, arguments)
        }, g = ["url", "urlRoot", "collection"];
        i.extend(f.prototype, h, {
            changed: null,
            validationError: null,
            idAttribute: "id",
            initialize: function() {},
            toJSON: function() {
                return i.clone(this.attributes)
            },
            sync: function() {
                return e.sync.apply(this, arguments)
            },
            get: function(t) {
                return this.attributes[t]
            },
            escape: function(t) {
                return i.escape(this.get(t))
            },
            has: function(t) {
                return null != this.get(t)
            },
            set: function(t, e, n) {
                var s, r, o, a, l, h, u, c;
                if (null == t)
                    return this;
                if ("object" == typeof t ? (r = t, n = e) : (r = {})[t] = e, n || (n = {}), !this._validate(r, n))
                    return !1;
                o = n.unset, l = n.silent, a = [], h = this._changing, this._changing=!0, h || (this._previousAttributes = i.clone(this.attributes), this.changed = {}), c = this.attributes, u = this._previousAttributes, this.idAttribute in r && (this.id = r[this.idAttribute]);
                for (s in r)
                    e = r[s], i.isEqual(c[s], e) || a.push(s), i.isEqual(u[s], e) ? delete this.changed[s] : this.changed[s] = e, o ? delete c[s] : c[s] = e;
                if (!l) {
                    a.length && (this._pending=!0);
                    for (var p = 0, d = a.length; d > p; p++)
                        this.trigger("change:" + a[p], this, c[a[p]], n)
                }
                if (h)
                    return this;
                if (!l)
                    for (; this._pending;)
                        this._pending=!1, this.trigger("change", this, n);
                return this._pending=!1, this._changing=!1, this
            },
            unset: function(t, e) {
                return this.set(t, void 0, i.extend({}, e, {
                    unset : !0
                }))
            },
            clear: function(t) {
                var e = {};
                for (var n in this.attributes)
                    e[n] = void 0;
                return this.set(e, i.extend({}, t, {
                    unset: !0
                }))
            },
            hasChanged: function(t) {
                return null == t?!i.isEmpty(this.changed) : i.has(this.changed, t)
            },
            changedAttributes: function(t) {
                if (!t)
                    return this.hasChanged() ? i.clone(this.changed) : !1;
                var e, n=!1, s = this._changing ? this._previousAttributes : this.attributes;
                for (var r in t)
                    i.isEqual(s[r], e = t[r]) || ((n || (n = {}))[r] = e);
                return n
            },
            previous: function(t) {
                return null != t && this._previousAttributes ? this._previousAttributes[t] : null
            },
            previousAttributes: function() {
                return i.clone(this._previousAttributes)
            },
            fetch: function(t) {
                t = t ? i.clone(t) : {}, void 0 === t.parse && (t.parse=!0);
                var e = this, n = t.success;
                return t.success = function(i) {
                    return e.set(e.parse(i, t), t) ? (n && n(e, i, t), void e.trigger("sync", e, i, t)) : !1
                }, L(this, t), this.sync("read", this, t)
            },
            save: function(t, e, n) {
                var s, r, o, a = this.attributes;
                if (null == t || "object" == typeof t ? (s = t, n = e) : (s = {})[t] = e, !(!s || n && n.wait || this.set(s, n)))
                    return !1;
                if (n = i.extend({
                    validate: !0
                }, n), !this._validate(s, n))
                    return !1;
                s && n.wait && (this.attributes = i.extend({}, a, s)), void 0 === n.parse && (n.parse=!0);
                var l = this, h = n.success;
                return n.success = function(t) {
                    l.attributes = a;
                    var e = l.parse(t, n);
                    return n.wait && (e = i.extend(s || {}, e)), i.isObject(e)&&!l.set(e, n)?!1 : (h && h(l, t, n), void l.trigger("sync", l, t, n))
                }, L(this, n), r = this.isNew() ? "create" : n.patch ? "patch" : "update", "patch" === r && (n.attrs = s), o = this.sync(r, this, n), s && n.wait && (this.attributes = a), o
            },
            destroy: function(t) {
                t = t ? i.clone(t) : {};
                var e = this, n = t.success, s = function() {
                    e.trigger("destroy", e, e.collection, t)
                };
                if (t.success = function(i) {
                    (t.wait || e.isNew()) && s(), n && n(e, i, t), e.isNew() || e.trigger("sync", e, i, t)
                }, this.isNew())
                    return t.success(), !1;
                L(this, t);
                var r = this.sync("delete", this, t);
                return t.wait || s(), r
            },
            url: function() {
                var t = i.result(this, "urlRoot") || i.result(this.collection, "url") || H();
                return this.isNew() ? t : t + ("/" === t.charAt(t.length - 1) ? "" : "/") + encodeURIComponent(this.id)
            },
            parse: function(t) {
                return t
            },
            clone: function() {
                return new this.constructor(this.attributes)
            },
            isNew: function() {
                return null == this.id
            },
            isValid: function(t) {
                return this._validate({}, i.extend(t || {}, {
                    validate: !0
                }))
            },
            _validate: function(t, e) {
                if (!e.validate ||!this.validate)
                    return !0;
                t = i.extend({}, this.attributes, t);
                var n = this.validationError = this.validate(t, e) || null;
                return n ? (this.trigger("invalid", this, n, i.extend(e || {}, {
                    validationError: n
                })), !1) : !0
            }
        });
        var m = ["keys", "values", "pairs", "invert", "pick", "omit"];
        i.each(m, function(t) {
            f.prototype[t] = function() {
                var e = a.call(arguments);
                return e.unshift(this.attributes), i[t].apply(i, e)
            }
        });
        var v = e.Collection = function(t, e) {
            e || (e = {}), e.url && (this.url = e.url), e.model && (this.model = e.model), void 0 !== e.comparator && (this.comparator = e.comparator), this._reset(), this.initialize.apply(this, arguments), t && this.reset(t, i.extend({
                silent: !0
            }, e))
        }, _ = {
            add: !0,
            remove: !0,
            merge: !0
        }, y = {
            add: !0,
            merge: !1,
            remove: !1
        };
        i.extend(v.prototype, h, {
            model: f,
            initialize: function() {},
            toJSON: function(t) {
                return this.map(function(e) {
                    return e.toJSON(t)
                })
            },
            sync: function() {
                return e.sync.apply(this, arguments)
            },
            add: function(t, e) {
                return this.set(t, i.defaults(e || {}, y))
            },
            remove: function(t, e) {
                t = i.isArray(t) ? t.slice() : [t], e || (e = {});
                var n, s, r, o;
                for (n = 0, s = t.length; s > n; n++)
                    o = this.get(t[n]), o && (delete this._byId[o.id], delete this._byId[o.cid], r = this.indexOf(o), this.models.splice(r, 1), this.length--, e.silent || (e.index = r, o.trigger("remove", o, this, e)), this._removeReference(o));
                return this
            },
            set: function(t, e) {
                e = i.defaults(e || {}, _), e.parse && (t = this.parse(t, e)), i.isArray(t) || (t = t ? [t] : []);
                var n, s, r, a, h, u = e.at, c = this.comparator && null == u && e.sort!==!1, p = i.isString(this.comparator) ? this.comparator: null, d = [], f = [], g = {};
                for (n = 0, s = t.length; s > n; n++)(r = this._prepareModel(t[n], e)
                    ) && ((a = this.get(r)) ? (e.remove && (g[a.cid]=!0), e.merge && (a.set(r.attributes, e), c&&!h && a.hasChanged(p) && (h=!0))) : e.add && (d.push(r), r.on("all", this._onModelEvent, this), this._byId[r.cid] = r, null != r.id && (this._byId[r.id] = r)));
                if (e.remove) {
                    for (n = 0, s = this.length; s > n; ++n)
                        g[(r = this.models[n]).cid] || f.push(r);
                    f.length && this.remove(f, e)
                }
                if (d.length && (c && (h=!0), this.length += d.length, null != u ? l.apply(this.models, [u, 0].concat(d)) : o.apply(this.models, d)), h && this.sort({
                    silent: !0
                }), e.silent)
                    return this;
                for (n = 0, s = d.length; s > n; n++)(r = d[n])
                    .trigger("add", r, this, e);
                return h && this.trigger("sort", this, e), this
            },
            reset: function(t, e) {
                e || (e = {});
                for (var n = 0, s = this.models.length; s > n; n++)
                    this._removeReference(this.models[n]);
                return e.previousModels = this.models, this._reset(), this.add(t, i.extend({
                    silent: !0
                }, e)), e.silent || this.trigger("reset", this, e), this
            },
            push: function(t, e) {
                return t = this._prepareModel(t, e), this.add(t, i.extend({
                    at: this.length
                }, e)), t
            },
            pop: function(t) {
                var e = this.at(this.length - 1);
                return this.remove(e, t), e
            },
            unshift: function(t, e) {
                return t = this._prepareModel(t, e), this.add(t, i.extend({
                    at: 0
                }, e)), t
            },
            shift: function(t) {
                var e = this.at(0);
                return this.remove(e, t), e
            },
            slice: function(t, e) {
                return this.models.slice(t, e)
            },
            get: function(t) {
                return null == t ? void 0 : this._byId[null != t.id ? t.id: t.cid || t]
            },
            at: function(t) {
                return this.models[t]
            },
            where: function(t, e) {
                return i.isEmpty(t) ? e ? void 0 : [] : this[e ? "find": "filter"](function(e) {
                    for (var i in t)
                        if (t[i] !== e.get(i))
                            return !1;
                    return !0
                })
            },
            findWhere: function(t) {
                return this.where(t, !0)
            },
            sort: function(t) {
                if (!this.comparator)
                    throw new Error("Cannot sort a set without a comparator");
                return t || (t = {}), i.isString(this.comparator) || 1 === this.comparator.length ? this.models = this.sortBy(this.comparator, this) : this.models.sort(i.bind(this.comparator, this)), t.silent || this.trigger("sort", this, t), this
            },
            sortedIndex: function(t, e, n) {
                e || (e = this.comparator);
                var s = i.isFunction(e) ? e: function(t) {
                    return t.get(e)
                };
                return i.sortedIndex(this.models, t, s, n)
            },
            pluck: function(t) {
                return i.invoke(this.models, "get", t)
            },
            fetch: function(t) {
                t = t ? i.clone(t) : {}, void 0 === t.parse && (t.parse=!0);
                var e = t.success, n = this;
                return t.success = function(i) {
                    var s = t.reset ? "reset": "set";
                    n[s](i, t), e && e(n, i, t), n.trigger("sync", n, i, t)
                }, L(this, t), this.sync("read", this, t)
            },
            create: function(t, e) {
                if (e = e ? i.clone(e) : {}, !(t = this._prepareModel(t, e)))
                    return !1;
                e.wait || this.add(t, e);
                var n = this, s = e.success;
                return e.success = function(i) {
                    e.wait && n.add(t, e), s && s(t, i, e)
                }, t.save(null, e), t
            },
            parse: function(t) {
                return t
            },
            clone: function() {
                return new this.constructor(this.models)
            },
            _reset: function() {
                this.length = 0, this.models = [], this._byId = {}
            },
            _prepareModel: function(t, e) {
                if (t instanceof f)
                    return t.collection || (t.collection = this), t;
                e || (e = {}), e.collection = this;
                var i = new this.model(t, e);
                return i._validate(t, e) ? i : (this.trigger("invalid", this, t, e), !1)
            },
            _removeReference: function(t) {
                this === t.collection && delete t.collection, t.off("all", this._onModelEvent, this)
            },
            _onModelEvent: function(t, e, i, n) {
                ("add" !== t && "remove" !== t || i === this) && ("destroy" === t && this.remove(e, n), e && t === "change:" + e.idAttribute && (delete this._byId[e.previous(e.idAttribute)], null != e.id && (this._byId[e.id] = e)), this.trigger.apply(this, arguments))
            }
        });
        var b = ["forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain"];
        i.each(b, function(t) {
            v.prototype[t] = function() {
                var e = a.call(arguments);
                return e.unshift(this.models), i[t].apply(i, e)
            }
        });
        var w = ["groupBy", "countBy", "sortBy"];
        i.each(w, function(t) {
            v.prototype[t] = function(e, n) {
                var s = i.isFunction(e) ? e: function(t) {
                    return t.get(e)
                };
                return i[t](this.models, s, n)
            }
        });
        var k = e.View = function(t) {
            this.cid = i.uniqueId("view"), this._configure(t || {}), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents()
        }, x = /^(\S+)\s*(.*)$/, S = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
        i.extend(k.prototype, h, {
            tagName: "div",
            $: function(t) {
                return this.$el.find(t)
            },
            initialize: function() {},
            render: function() {
                return this
            },
            remove: function() {
                return this.$el.remove(), this.stopListening(), this
            },
            setElement: function(t, i) {
                return this.$el && this.undelegateEvents(), this.$el = t instanceof e.$ ? t : e.$(t), this.el = this.$el[0], i!==!1 && this.delegateEvents(), this
            },
            delegateEvents: function(t) {
                if (!t&&!(t = i.result(this, "events")))
                    return this;
                this.undelegateEvents();
                for (var e in t) {
                    var n = t[e];
                    if (i.isFunction(n) || (n = this[t[e]]), n) {
                        var s = e.match(x), r = s[1], o = s[2];
                        n = i.bind(n, this), r += ".delegateEvents" + this.cid, "" === o ? this.$el.on(r, n) : this.$el.on(r, o, n)
                    }
                }
                return this
            },
            undelegateEvents: function() {
                return this.$el.off(".delegateEvents" + this.cid), this
            },
            _configure: function(t) {
                this.options && (t = i.extend({}, i.result(this, "options"), t)), i.extend(this, i.pick(t, S)), this.options = t
            },
            _ensureElement: function() {
                if (this.el)
                    this.setElement(i.result(this, "el"), !1);
                else {
                    var t = i.extend({}, i.result(this, "attributes"));
                    this.id && (t.id = i.result(this, "id")), this.className && (t["class"] = i.result(this, "className"));
                    var n = e.$("<" + i.result(this, "tagName") + ">").attr(t);
                    this.setElement(n, !1)
                }
            }
        }), e.sync = function(t, n, s) {
            var r = T[t];
            i.defaults(s || (s = {}), {
                emulateHTTP: e.emulateHTTP,
                emulateJSON: e.emulateJSON
            });
            var o = {
                type: r,
                dataType: "json"
            };
            if (s.url || (o.url = i.result(n, "url") || H()), null != s.data ||!n || "create" !== t && "update" !== t && "patch" !== t || (o.contentType = "application/json", o.data = JSON.stringify(s.attrs || n.toJSON(s))), s.emulateJSON && (o.contentType = "application/x-www-form-urlencoded", o.data = o.data ? {
                model: o.data
            } : {}), s.emulateHTTP && ("PUT" === r || "DELETE" === r || "PATCH" === r)) {
                o.type = "POST", s.emulateJSON && (o.data._method = r);
                var a = s.beforeSend;
                s.beforeSend = function(t) {
                    return t.setRequestHeader("X-HTTP-Method-Override", r), a ? a.apply(this, arguments) : void 0
                }
            }
            "GET" === o.type || s.emulateJSON || (o.processData=!1), "PATCH" !== o.type ||!window.ActiveXObject || window.external && window.external.msActiveXFilteringEnabled || (o.xhr = function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            });
            var l = s.xhr = e.ajax(i.extend(o, s));
            return n.trigger("request", n, l, s), l
        };
        var T = {
            create: "POST",
            update: "PUT",
            patch: "PATCH",
            "delete": "DELETE",
            read: "GET"
        };
        e.ajax = function() {
            return e.$.ajax.apply(e.$, arguments)
        };
        var C = e.Router = function(t) {
            t || (t = {}), t.routes && (this.routes = t.routes), this._bindRoutes(), this.initialize.apply(this, arguments)
        }, E = /\((.*?)\)/g, P = /(\(\?)?:\w+/g, D = /\*\w+/g, M = /[\-{}\[\]+?.,\\\^$|#\s]/g;
        i.extend(C.prototype, h, {
            initialize: function() {},
            route: function(t, n, s) {
                i.isRegExp(t) || (t = this._routeToRegExp(t)), i.isFunction(n) && (s = n, n = ""), s || (s = this[n]);
                var r = this;
                return e.history.route(t, function(i) {
                    var o = r._extractParameters(t, i);
                    s && s.apply(r, o), r.trigger.apply(r, ["route:" + n].concat(o)), r.trigger("route", n, o), e.history.trigger("route", r, n, o)
                }), this
            },
            navigate: function(t, i) {
                return e.history.navigate(t, i), this
            },
            _bindRoutes: function() {
                if (this.routes) {
                    this.routes = i.result(this, "routes");
                    for (var t, e = i.keys(this.routes); null != (t = e.pop());)
                        this.route(t, this.routes[t])
                }
            },
            _routeToRegExp: function(t) {
                return t = t.replace(M, "\\$&").replace(E, "(?:$1)?").replace(P, function(t, e) {
                    return e ? t : "([^/]+)"
                }).replace(D, "(.*?)"), new RegExp("^" + t + "$")
            },
            _extractParameters: function(t, e) {
                var n = t.exec(e).slice(1);
                return i.map(n, function(t) {
                    return t ? decodeURIComponent(t) : null
                })
            }
        });
        var N = e.History = function() {
            this.handlers = [], i.bindAll(this, "checkUrl"), "undefined" != typeof window && (this.location = window.location, this.history = window.history)
        }, O = /^[#\/]|\s+$/g, I = /^\/+|\/+$/g, A = /msie [\w.]+/, $ = /\/$/;
        N.started=!1, i.extend(N.prototype, h, {
            interval: 50,
            getHash: function(t) {
                var e = (t || this).location.href.match(/#(.*)$/);
                return e ? e[1] : ""
            },
            getFragment: function(t, e) {
                if (null == t)
                    if (this._hasPushState ||!this._wantsHashChange || e) {
                        t = this.location.pathname;
                        var i = this.root.replace($, "");
                        t.indexOf(i) || (t = t.substr(i.length))
                    } else
                        t = this.getHash();
                return t.replace(O, "")
            },
            start: function(t) {
                if (N.started)
                    throw new Error("Backbone.history has already been started");
                N.started=!0, this.options = i.extend({}, {
                    root: "/"
                }, this.options, t), this.root = this.options.root, this._wantsHashChange = this.options.hashChange!==!1, this._wantsPushState=!!this.options.pushState, this._hasPushState=!!(this.options.pushState && this.history && this.history.pushState);
                var n = this.getFragment(), s = document.documentMode, r = A.exec(navigator.userAgent.toLowerCase()) && (!s || 7 >= s);
                this.root = ("/" + this.root + "/").replace(I, "/"), r && this._wantsHashChange && (this.iframe = e.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(n)), this._hasPushState ? e.$(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange"in window&&!r ? e.$(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = n;
                var o = this.location, a = o.pathname.replace(/[^\/]$/, "$&/") === this.root;
                return this._wantsHashChange && this._wantsPushState&&!this._hasPushState&&!a ? (this.fragment = this.getFragment(null, !0), this.location.replace(this.root + this.location.search + "#" + this.fragment), !0) : (this._wantsPushState && this._hasPushState && a && o.hash && (this.fragment = this.getHash().replace(O, ""), this.history.replaceState({}, document.title, this.root + this.fragment + o.search)), this.options.silent ? void 0 : this.loadUrl())
            },
            stop: function() {
                e.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl), clearInterval(this._checkUrlInterval), N.started=!1
            },
            route: function(t, e) {
                this.handlers.unshift({
                    route: t,
                    callback: e
                })
            },
            checkUrl: function() {
                var t = this.getFragment();
                return t === this.fragment && this.iframe && (t = this.getFragment(this.getHash(this.iframe))), t === this.fragment?!1 : (this.iframe && this.navigate(t), void(this.loadUrl() || this.loadUrl(this.getHash())))
            },
            loadUrl: function(t) {
                var e = this.fragment = this.getFragment(t), n = i.any(this.handlers, function(t) {
                    return t.route.test(e) ? (t.callback(e), !0) : void 0
                });
                return n
            },
            navigate: function(t, e) {
                if (!N.started)
                    return !1;
                if (e && e!==!0 || (e = {
                    trigger: e
                }), t = this.getFragment(t || ""), this.fragment !== t) {
                    this.fragment = t;
                    var i = this.root + t;
                    if (this._hasPushState)
                        this.history[e.replace ? "replaceState": "pushState"]({}, document.title, i);
                    else {
                        if (!this._wantsHashChange)
                            return this.location.assign(i);
                        this._updateHash(this.location, t, e.replace), this.iframe && t !== this.getFragment(this.getHash(this.iframe)) && (e.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, t, e.replace))
                    }
                    e.trigger && this.loadUrl(t)
                }
            },
            _updateHash: function(t, e, i) {
                if (i) {
                    var n = t.href.replace(/(javascript:|#).*$/, "");
                    t.replace(n + "#" + e)
                } else
                    t.hash = "#" + e
            }
        }), e.history = new N;
        var j = function(t, e) {
            var n, s = this;
            n = t && i.has(t, "constructor") ? t.constructor : function() {
                return s.apply(this, arguments)
            }, i.extend(n, s, e);
            var r = function() {
                this.constructor = n
            };
            return r.prototype = s.prototype, n.prototype = new r, t && i.extend(n.prototype, t), n.__super__ = s.prototype, n
        };
        f.extend = v.extend = C.extend = k.extend = N.extend = j;
        var H = function() {
            throw new Error('A "url" property or function must be specified')
        }, L = function(t, e) {
            var i = e.error;
            e.error = function(n) {
                i && i(t, n, e), t.trigger("error", t, n, e)
            }
        };
        return e
    }), define("models/TalkGridTalk", ["Backbone"], function(t) {
        "use strict";
        var e = Math.floor((new Date).getTime() / 1e3 - 64800), i = 21600, n = t.Model.extend({
            isFirstTalk: function() {
                return this.collection && 0 === this.collection.indexOf(this)
            },
            isTodaysTalk: function() {
                var t =+ this.get("published"), n = t > e;
                return n && this.collection && this.collection.latestPublished && (n = this.collection.latestPublished - t < i), n
            }
        });
        return n
    }), define("collections/TalkGridTalks", ["lodash", "Backbone", "models/TalkGridTalk"], function(t, e, i) {
        "use strict";
        var n = e.Collection.extend({
            constructor: function() {
                this.model || (this.model = require("models/TalkGridTalk")), e.Collection.apply(this, arguments)
            },
            initialize: function() {
                this.on("add", this.addPublished, this), this.on("change:published", this.changePublished, this)
            },
            latestPublished: null,
            addPublished: function(t) {
                this.changePublished(t, t.get("published"))
            },
            changePublished: function(t, e) {
                var i =+ e;
                (!this.latestPublished || i > this.latestPublished) && (this.latestPublished = i)
            },
            model: i
        });
        return n
    }), define("hbs/handlebars", [], function() {
        var t = function() {
            var t = function() {
                "use strict";
                function t(t) {
                    this.string = t
                }
                var e;
                return t.prototype.toString = function() {
                    return "" + this.string
                }, e = t
            }(), e = function(t) {
                "use strict";
                function e(t) {
                    return a[t] || "&amp;"
                }
                function i(t, e) {
                    for (var i in e)
                        Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i])
                }
                function n(t) {
                    return t instanceof o ? t.toString() : t || 0 === t ? (t = "" + t, h.test(t) ? t.replace(l, e) : t) : ""
                }
                function s(t) {
                    return t || 0 === t ? p(t) && 0 === t.length?!0 : !1 : !0
                }
                var r = {}, o = t, a = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#x27;",
                    "`": "&#x60;"
                }, l = /[&<>"'`]/g, h = /[&<>"'`]/;
                r.extend = i;
                var u = Object.prototype.toString;
                r.toString = u;
                var c = function(t) {
                    return "function" == typeof t
                };
                c(/x/) && (c = function(t) {
                    return "function" == typeof t && "[object Function]" === u.call(t)
                });
                var c;
                r.isFunction = c;
                var p = Array.isArray || function(t) {
                    return t && "object" == typeof t ? "[object Array]" === u.call(t) : !1
                };
                return r.isArray = p, r.escapeExpression = n, r.isEmpty = s, r
            }(t), i = function() {
                "use strict";
                function t(t, e) {
                    var n;
                    e && e.firstLine && (n = e.firstLine, t += " - " + n + ":" + e.firstColumn);
                    for (var s = Error.prototype.constructor.call(this, t), r = 0; r < i.length; r++)
                        this[i[r]] = s[i[r]];
                    n && (this.lineNumber = n, this.column = e.firstColumn)
                }
                var e, i = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"];
                return t.prototype = new Error, e = t
            }(), n = function(t, e) {
                "use strict";
                function i(t, e) {
                    this.helpers = t || {}, this.partials = e || {}, n(this)
                }
                function n(t) {
                    t.registerHelper("helperMissing", function(t) {
                        if (2 === arguments.length)
                            return void 0;
                        throw new a("Missing helper: '" + t + "'")
                    }), t.registerHelper("blockHelperMissing", function(e, i) {
                        var n = i.inverse || function() {}, s = i.fn;
                        return p(e) && (e = e.call(this)), e===!0 ? s(this) : e===!1 || null == e ? n(this) : c(e) ? e.length > 0 ? t.helpers.each(e, i) : n(this) : s(e)
                    }), t.registerHelper("each", function(t, e) {
                        var i, n = e.fn, s = e.inverse, r = 0, o = "";
                        if (p(t) && (t = t.call(this)), e.data && (i = m(e.data)), t && "object" == typeof t)
                            if (c(t))
                                for (var a = t.length; a > r; r++)
                                    i && (i.index = r, i.first = 0 === r, i.last = r === t.length - 1), o += n(t[r], {
                                        data: i
                                    });
                            else
                                for (var l in t)
                                    t.hasOwnProperty(l) && (i && (i.key = l, i.index = r, i.first = 0 === r), o += n(t[l], {
                                        data: i
                                    }), r++);
                        return 0 === r && (o = s(this)), o
                    }), t.registerHelper("if", function(t, e) {
                        return p(t) && (t = t.call(this)), !e.hash.includeZero&&!t || o.isEmpty(t) ? e.inverse(this) : e.fn(this)
                    }), t.registerHelper("unless", function(e, i) {
                        return t.helpers["if"].call(this, e, {
                            fn: i.inverse,
                            inverse: i.fn,
                            hash: i.hash
                        })
                    }), t.registerHelper("with", function(t, e) {
                        return p(t) && (t = t.call(this)), o.isEmpty(t) ? void 0 : e.fn(t)
                    }), t.registerHelper("log", function(e, i) {
                        var n = i.data && null != i.data.level ? parseInt(i.data.level, 10): 1;
                        t.log(n, e)
                    })
                }
                function s(t, e) {
                    g.log(t, e)
                }
                var r = {}, o = t, a = e, l = "1.3.0";
                r.VERSION = l;
                var h = 4;
                r.COMPILER_REVISION = h;
                var u = {
                    1: "<= 1.0.rc.2",
                    2: "== 1.0.0-rc.3",
                    3: "== 1.0.0-rc.4",
                    4: ">= 1.0.0"
                };
                r.REVISION_CHANGES = u;
                var c = o.isArray, p = o.isFunction, d = o.toString, f = "[object Object]";
                r.HandlebarsEnvironment = i, i.prototype = {
                    constructor: i,
                    logger: g,
                    log: s,
                    registerHelper: function(t, e, i) {
                        if (d.call(t) === f) {
                            if (i || e)
                                throw new a("Arg not supported with multiple helpers");
                            o.extend(this.helpers, t)
                        } else
                            i && (e.not = i), this.helpers[t] = e
                    },
                    registerPartial: function(t, e) {
                        d.call(t) === f ? o.extend(this.partials, t) : this.partials[t] = e
                    }
                };
                var g = {
                    methodMap: {
                        0: "debug",
                        1: "info",
                        2: "warn",
                        3: "error"
                    },
                    DEBUG: 0,
                    INFO: 1,
                    WARN: 2,
                    ERROR: 3,
                    level: 3,
                    log: function(t, e) {
                        if (g.level <= t) {
                            var i = g.methodMap[t];
                            "undefined" != typeof console && console[i] && console[i].call(console, e)
                        }
                    }
                };
                r.logger = g, r.log = s;
                var m = function(t) {
                    var e = {};
                    return o.extend(e, t), e
                };
                return r.createFrame = m, r
            }(e, i), s = function(t, e, i) {
                "use strict";
                function n(t) {
                    var e = t && t[0] || 1, i = p;
                    if (e !== i) {
                        if (i > e) {
                            var n = d[i], s = d[e];
                            throw new c("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + n + ") or downgrade your runtime to an older version (" + s + ").")
                        }
                        throw new c("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + t[1] + ").")
                    }
                }
                function s(t, e) {
                    if (!e)
                        throw new c("No environment passed to template");
                    var i = function(t, i, n, s, r, o) {
                        var a = e.VM.invokePartial.apply(this, arguments);
                        if (null != a)
                            return a;
                        if (e.compile) {
                            var l = {
                                helpers: s,
                                partials: r,
                                data: o
                            };
                            return r[i] = e.compile(t, {
                                data: void 0 !== o
                            }, e), r[i](n, l)
                        }
                        throw new c("The partial " + i + " could not be compiled when running in runtime-only mode")
                    }, n = {
                        escapeExpression: u.escapeExpression,
                        invokePartial: i,
                        programs: [],
                        program: function(t, e, i) {
                            var n = this.programs[t];
                            return i ? n = o(t, e, i) : n || (n = this.programs[t] = o(t, e)), n
                        },
                        merge: function(t, e) {
                            var i = t || e;
                            return t && e && t !== e && (i = {}, u.extend(i, e), u.extend(i, t)), i
                        },
                        programWithDepth: e.VM.programWithDepth,
                        noop: e.VM.noop,
                        compilerInfo: null
                    };
                    return function(i, s) {
                        s = s || {};
                        var r, o, a = s.partial ? s: e;
                        s.partial || (r = s.helpers, o = s.partials);
                        var l = t.call(n, a, i, r, o, s.data);
                        return s.partial || e.VM.checkRevision(n.compilerInfo), l
                    }
                }
                function r(t, e, i) {
                    var n = Array.prototype.slice.call(arguments, 3), s = function(t, s) {
                        return s = s || {}, e.apply(this, [t, s.data || i].concat(n))
                    };
                    return s.program = t, s.depth = n.length, s
                }
                function o(t, e, i) {
                    var n = function(t, n) {
                        return n = n || {}, e(t, n.data || i)
                    };
                    return n.program = t, n.depth = 0, n
                }
                function a(t, e, i, n, s, r) {
                    var o = {
                        partial: !0,
                        helpers: n,
                        partials: s,
                        data: r
                    };
                    if (void 0 === t)
                        throw new c("The partial " + e + " could not be found");
                    return t instanceof Function ? t(i, o) : void 0
                }
                function l() {
                    return ""
                }
                var h = {}, u = t, c = e, p = i.COMPILER_REVISION, d = i.REVISION_CHANGES;
                return h.checkRevision = n, h.template = s, h.programWithDepth = r, h.program = o, h.invokePartial = a, h.noop = l, h
            }(e, i, n), r = function(t, e, i, n, s) {
                "use strict";
                var r, o = t, a = e, l = i, h = n, u = s, c = function() {
                    var t = new o.HandlebarsEnvironment;
                    return h.extend(t, o), t.SafeString = a, t.Exception = l, t.Utils = h, t.VM = u, t.template = function(e) {
                        return u.template(e, t)
                    }, t
                }, p = c();
                return p.create = c, r = p
            }(n, t, i, e, s), o = function(t) {
                "use strict";
                function e(t) {
                    t = t || {}, this.firstLine = t.first_line, this.firstColumn = t.first_column, this.lastColumn = t.last_column, this.lastLine = t.last_line
                }
                var i, n = t, s = {
                    ProgramNode: function(t, i, n, r) {
                        var o, a;
                        3 === arguments.length ? (r = n, n = null) : 2 === arguments.length && (r = i, i = null), e.call(this, r), this.type = "program", this.statements = t, this.strip = {}, n ? (a = n[0], a ? (o = {
                            first_line: a.firstLine,
                            last_line: a.lastLine,
                            last_column: a.lastColumn,
                            first_column: a.firstColumn
                        }, this.inverse = new s.ProgramNode(n, i, o)) : this.inverse = new s.ProgramNode(n, i), this.strip.right = i.left) : i && (this.strip.left = i.right)
                    },
                    MustacheNode: function(t, i, n, r, o) {
                        if (e.call(this, o), this.type = "mustache", this.strip = r, null != n && n.charAt) {
                            var a = n.charAt(3) || n.charAt(2);
                            this.escaped = "{" !== a && "&" !== a
                        } else
                            this.escaped=!!n;
                        this.sexpr = t instanceof s.SexprNode ? t : new s.SexprNode(t, i), this.sexpr.isRoot=!0, this.id = this.sexpr.id, this.params = this.sexpr.params, this.hash = this.sexpr.hash, this.eligibleHelper = this.sexpr.eligibleHelper, this.isHelper = this.sexpr.isHelper
                    },
                    SexprNode: function(t, i, n) {
                        e.call(this, n), this.type = "sexpr", this.hash = i;
                        var s = this.id = t[0], r = this.params = t.slice(1), o = this.eligibleHelper = s.isSimple;
                        this.isHelper = o && (r.length || i)
                    },
                    PartialNode: function(t, i, n, s) {
                        e.call(this, s), this.type = "partial", this.partialName = t, this.context = i, this.strip = n
                    },
                    BlockNode: function(t, i, s, r, o) {
                        if (e.call(this, o), t.sexpr.id.original !== r.path.original)
                            throw new n(t.sexpr.id.original + " doesn't match " + r.path.original, this);
                        this.type = "block", this.mustache = t, this.program = i, this.inverse = s, this.strip = {
                            left: t.strip.left,
                            right: r.strip.right
                        }, (i || s).strip.left = t.strip.right, (s || i).strip.right = r.strip.left, s&&!i && (this.isInverse=!0)
                    },
                    ContentNode: function(t, i) {
                        e.call(this, i), this.type = "content", this.string = t
                    },
                    HashNode: function(t, i) {
                        e.call(this, i), this.type = "hash", this.pairs = t
                    },
                    IdNode: function(t, i) {
                        e.call(this, i), this.type = "ID";
                        for (var s = "", r = [], o = 0, a = 0, l = t.length; l > a; a++) {
                            var h = t[a].part;
                            if (s += (t[a].separator || "") + h, ".." === h || "." === h || "this" === h) {
                                if (r.length > 0)
                                    throw new n("Invalid path: " + s, this);
                                ".." === h ? o++ : this.isScoped=!0
                            } else
                                r.push(h)
                        }
                        this.original = s, this.parts = r, this.string = r.join("."), this.depth = o, this.isSimple = 1 === t.length&&!this.isScoped && 0 === o, this.stringModeValue = this.string
                    },
                    PartialNameNode: function(t, i) {
                        e.call(this, i), this.type = "PARTIAL_NAME", this.name = t.original
                    },
                    DataNode: function(t, i) {
                        e.call(this, i), this.type = "DATA", this.id = t
                    },
                    StringNode: function(t, i) {
                        e.call(this, i), this.type = "STRING", this.original = this.string = this.stringModeValue = t
                    },
                    IntegerNode: function(t, i) {
                        e.call(this, i), this.type = "INTEGER", this.original = this.integer = t, this.stringModeValue = Number(t)
                    },
                    BooleanNode: function(t, i) {
                        e.call(this, i), this.type = "BOOLEAN", this.bool = t, this.stringModeValue = "true" === t
                    },
                    CommentNode: function(t, i) {
                        e.call(this, i), this.type = "comment", this.comment = t
                    }
                };
                return i = s
            }(i), a = function() {
                "use strict";
                var t, e = function() {
                    function t(t, e) {
                        return {
                            left: "~" === t.charAt(2),
                            right: "~" === e.charAt(0) || "~" === e.charAt(1)
                        }
                    }
                    function e() {
                        this.yy = {}
                    }
                    var i = {
                        trace: function() {},
                        yy: {},
                        symbols_: {
                            error: 2,
                            root: 3,
                            statements: 4,
                            EOF: 5,
                            program: 6,
                            simpleInverse: 7,
                            statement: 8,
                            openInverse: 9,
                            closeBlock: 10,
                            openBlock: 11,
                            mustache: 12,
                            partial: 13,
                            CONTENT: 14,
                            COMMENT: 15,
                            OPEN_BLOCK: 16,
                            sexpr: 17,
                            CLOSE: 18,
                            OPEN_INVERSE: 19,
                            OPEN_ENDBLOCK: 20,
                            path: 21,
                            OPEN: 22,
                            OPEN_UNESCAPED: 23,
                            CLOSE_UNESCAPED: 24,
                            OPEN_PARTIAL: 25,
                            partialName: 26,
                            partial_option0: 27,
                            sexpr_repetition0: 28,
                            sexpr_option0: 29,
                            dataName: 30,
                            param: 31,
                            STRING: 32,
                            INTEGER: 33,
                            BOOLEAN: 34,
                            OPEN_SEXPR: 35,
                            CLOSE_SEXPR: 36,
                            hash: 37,
                            hash_repetition_plus0: 38,
                            hashSegment: 39,
                            ID: 40,
                            EQUALS: 41,
                            DATA: 42,
                            pathSegments: 43,
                            SEP: 44,
                            $accept: 0,
                            $end: 1
                        },
                        terminals_: {
                            2: "error",
                            5: "EOF",
                            14: "CONTENT",
                            15: "COMMENT",
                            16: "OPEN_BLOCK",
                            18: "CLOSE",
                            19: "OPEN_INVERSE",
                            20: "OPEN_ENDBLOCK",
                            22: "OPEN",
                            23: "OPEN_UNESCAPED",
                            24: "CLOSE_UNESCAPED",
                            25: "OPEN_PARTIAL",
                            32: "STRING",
                            33: "INTEGER",
                            34: "BOOLEAN",
                            35: "OPEN_SEXPR",
                            36: "CLOSE_SEXPR",
                            40: "ID",
                            41: "EQUALS",
                            42: "DATA",
                            44: "SEP"
                        },
                        productions_: [0, [3, 2], [3, 1], [6, 2], [6, 3], [6, 2], [6, 1], [6, 1], [6, 0], [4, 1], [4, 2], [8, 3], [8, 3], [8, 1], [8, 1], [8, 1], [8, 1], [11, 3], [9, 3], [10, 3], [12, 3], [12, 3], [13, 4], [7, 2], [17, 3], [17, 1], [31, 1], [31, 1], [31, 1], [31, 1], [31, 1], [31, 3], [37, 1], [39, 3], [26, 1], [26, 1], [26, 1], [30, 2], [21, 1], [43, 3], [43, 1], [27, 0], [27, 1], [28, 0], [28, 2], [29, 0], [29, 1], [38, 1], [38, 2]],
                        performAction: function(e, i, n, s, r, o) {
                            var a = o.length - 1;
                            switch (r) {
                            case 1:
                                return new s.ProgramNode(o[a - 1], this._$);
                            case 2:
                                return new s.ProgramNode([], this._$);
                            case 3:
                                this.$ = new s.ProgramNode([], o[a - 1], o[a], this._$);
                                break;
                            case 4:
                                this.$ = new s.ProgramNode(o[a - 2], o[a - 1], o[a], this._$);
                                break;
                            case 5:
                                this.$ = new s.ProgramNode(o[a - 1], o[a], [], this._$);
                                break;
                            case 6:
                                this.$ = new s.ProgramNode(o[a], this._$);
                                break;
                            case 7:
                                this.$ = new s.ProgramNode([], this._$);
                                break;
                            case 8:
                                this.$ = new s.ProgramNode([], this._$);
                                break;
                            case 9:
                                this.$ = [o[a]];
                                break;
                            case 10:
                                o[a - 1].push(o[a]), this.$ = o[a - 1];
                                break;
                            case 11:
                                this.$ = new s.BlockNode(o[a - 2], o[a - 1].inverse, o[a - 1], o[a], this._$);
                                break;
                            case 12:
                                this.$ = new s.BlockNode(o[a - 2], o[a - 1], o[a - 1].inverse, o[a], this._$);
                                break;
                            case 13:
                                this.$ = o[a];
                                break;
                            case 14:
                                this.$ = o[a];
                                break;
                            case 15:
                                this.$ = new s.ContentNode(o[a], this._$);
                                break;
                            case 16:
                                this.$ = new s.CommentNode(o[a], this._$);
                                break;
                            case 17:
                                this.$ = new s.MustacheNode(o[a - 1], null, o[a - 2], t(o[a - 2], o[a]), this._$);
                                break;
                            case 18:
                                this.$ = new s.MustacheNode(o[a - 1], null, o[a - 2], t(o[a - 2], o[a]), this._$);
                                break;
                            case 19:
                                this.$ = {
                                    path: o[a - 1],
                                    strip: t(o[a - 2], o[a])
                                };
                                break;
                            case 20:
                                this.$ = new s.MustacheNode(o[a - 1], null, o[a - 2], t(o[a - 2], o[a]), this._$);
                                break;
                            case 21:
                                this.$ = new s.MustacheNode(o[a - 1], null, o[a - 2], t(o[a - 2], o[a]), this._$);
                                break;
                            case 22:
                                this.$ = new s.PartialNode(o[a - 2], o[a - 1], t(o[a - 3], o[a]), this._$);
                                break;
                            case 23:
                                this.$ = t(o[a - 1], o[a]);
                                break;
                            case 24:
                                this.$ = new s.SexprNode([o[a - 2]].concat(o[a - 1]), o[a], this._$);
                                break;
                            case 25:
                                this.$ = new s.SexprNode([o[a]], null, this._$);
                                break;
                            case 26:
                                this.$ = o[a];
                                break;
                            case 27:
                                this.$ = new s.StringNode(o[a], this._$);
                                break;
                            case 28:
                                this.$ = new s.IntegerNode(o[a], this._$);
                                break;
                            case 29:
                                this.$ = new s.BooleanNode(o[a], this._$);
                                break;
                            case 30:
                                this.$ = o[a];
                                break;
                            case 31:
                                o[a - 1].isHelper=!0, this.$ = o[a - 1];
                                break;
                            case 32:
                                this.$ = new s.HashNode(o[a], this._$);
                                break;
                            case 33:
                                this.$ = [o[a - 2], o[a]];
                                break;
                            case 34:
                                this.$ = new s.PartialNameNode(o[a], this._$);
                                break;
                            case 35:
                                this.$ = new s.PartialNameNode(new s.StringNode(o[a], this._$), this._$);
                                break;
                            case 36:
                                this.$ = new s.PartialNameNode(new s.IntegerNode(o[a], this._$));
                                break;
                            case 37:
                                this.$ = new s.DataNode(o[a], this._$);
                                break;
                            case 38:
                                this.$ = new s.IdNode(o[a], this._$);
                                break;
                            case 39:
                                o[a - 2].push({
                                    part: o[a],
                                    separator: o[a - 1]
                                }), this.$ = o[a - 2];
                                break;
                            case 40:
                                this.$ = [{
                                    part: o[a]
                                }
                                ];
                                break;
                            case 43:
                                this.$ = [];
                                break;
                            case 44:
                                o[a - 1].push(o[a]);
                                break;
                            case 47:
                                this.$ = [o[a]];
                                break;
                            case 48:
                                o[a - 1].push(o[a])
                            }
                        },
                        table: [{
                            3: 1,
                            4: 2,
                            5: [1, 3],
                            8: 4,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 11],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            1: [3]
                        }, {
                            5: [1, 16],
                            8: 17,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 11],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            1: [2, 2]
                        }, {
                            5: [2, 9],
                            14: [2, 9],
                            15: [2, 9],
                            16: [2, 9],
                            19: [2, 9],
                            20: [2, 9],
                            22: [2, 9],
                            23: [2, 9],
                            25: [2, 9]
                        }, {
                            4: 20,
                            6: 18,
                            7: 19,
                            8: 4,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 21],
                            20: [2, 8],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            4: 20,
                            6: 22,
                            7: 19,
                            8: 4,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 21],
                            20: [2, 8],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            5: [2, 13],
                            14: [2, 13],
                            15: [2, 13],
                            16: [2, 13],
                            19: [2, 13],
                            20: [2, 13],
                            22: [2, 13],
                            23: [2, 13],
                            25: [2, 13]
                        }, {
                            5: [2, 14],
                            14: [2, 14],
                            15: [2, 14],
                            16: [2, 14],
                            19: [2, 14],
                            20: [2, 14],
                            22: [2, 14],
                            23: [2, 14],
                            25: [2, 14]
                        }, {
                            5: [2, 15],
                            14: [2, 15],
                            15: [2, 15],
                            16: [2, 15],
                            19: [2, 15],
                            20: [2, 15],
                            22: [2, 15],
                            23: [2, 15],
                            25: [2, 15]
                        }, {
                            5: [2, 16],
                            14: [2, 16],
                            15: [2, 16],
                            16: [2, 16],
                            19: [2, 16],
                            20: [2, 16],
                            22: [2, 16],
                            23: [2, 16],
                            25: [2, 16]
                        }, {
                            17: 23,
                            21: 24,
                            30: 25,
                            40: [1, 28],
                            42: [1, 27],
                            43: 26
                        }, {
                            17: 29,
                            21: 24,
                            30: 25,
                            40: [1, 28],
                            42: [1, 27],
                            43: 26
                        }, {
                            17: 30,
                            21: 24,
                            30: 25,
                            40: [1, 28],
                            42: [1, 27],
                            43: 26
                        }, {
                            17: 31,
                            21: 24,
                            30: 25,
                            40: [1, 28],
                            42: [1, 27],
                            43: 26
                        }, {
                            21: 33,
                            26: 32,
                            32: [1, 34],
                            33: [1, 35],
                            40: [1, 28],
                            43: 26
                        }, {
                            1: [2, 1]
                        }, {
                            5: [2, 10],
                            14: [2, 10],
                            15: [2, 10],
                            16: [2, 10],
                            19: [2, 10],
                            20: [2, 10],
                            22: [2, 10],
                            23: [2, 10],
                            25: [2, 10]
                        }, {
                            10: 36,
                            20: [1, 37]
                        }, {
                            4: 38,
                            8: 4,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 11],
                            20: [2, 7],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            7: 39,
                            8: 17,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 21],
                            20: [2, 6],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            17: 23,
                            18: [1, 40],
                            21: 24,
                            30: 25,
                            40: [1, 28],
                            42: [1, 27],
                            43: 26
                        }, {
                            10: 41,
                            20: [1, 37]
                        }, {
                            18: [1, 42]
                        }, {
                            18: [2, 43],
                            24: [2, 43],
                            28: 43,
                            32: [2, 43],
                            33: [2, 43],
                            34: [2, 43],
                            35: [2, 43],
                            36: [2, 43],
                            40: [2, 43],
                            42: [2, 43]
                        }, {
                            18: [2, 25],
                            24: [2, 25],
                            36: [2, 25]
                        }, {
                            18: [2, 38],
                            24: [2, 38],
                            32: [2, 38],
                            33: [2, 38],
                            34: [2, 38],
                            35: [2, 38],
                            36: [2, 38],
                            40: [2, 38],
                            42: [2, 38],
                            44: [1, 44]
                        }, {
                            21: 45,
                            40: [1, 28],
                            43: 26
                        }, {
                            18: [2, 40],
                            24: [2, 40],
                            32: [2, 40],
                            33: [2, 40],
                            34: [2, 40],
                            35: [2, 40],
                            36: [2, 40],
                            40: [2, 40],
                            42: [2, 40],
                            44: [2, 40]
                        }, {
                            18: [1, 46]
                        }, {
                            18: [1, 47]
                        }, {
                            24: [1, 48]
                        }, {
                            18: [2, 41],
                            21: 50,
                            27: 49,
                            40: [1, 28],
                            43: 26
                        }, {
                            18: [2, 34],
                            40: [2, 34]
                        }, {
                            18: [2, 35],
                            40: [2, 35]
                        }, {
                            18: [2, 36],
                            40: [2, 36]
                        }, {
                            5: [2, 11],
                            14: [2, 11],
                            15: [2, 11],
                            16: [2, 11],
                            19: [2, 11],
                            20: [2, 11],
                            22: [2, 11],
                            23: [2, 11],
                            25: [2, 11]
                        }, {
                            21: 51,
                            40: [1, 28],
                            43: 26
                        }, {
                            8: 17,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 11],
                            20: [2, 3],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            4: 52,
                            8: 4,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 11],
                            20: [2, 5],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            14: [2, 23],
                            15: [2, 23],
                            16: [2, 23],
                            19: [2, 23],
                            20: [2, 23],
                            22: [2, 23],
                            23: [2, 23],
                            25: [2, 23]
                        }, {
                            5: [2, 12],
                            14: [2, 12],
                            15: [2, 12],
                            16: [2, 12],
                            19: [2, 12],
                            20: [2, 12],
                            22: [2, 12],
                            23: [2, 12],
                            25: [2, 12]
                        }, {
                            14: [2, 18],
                            15: [2, 18],
                            16: [2, 18],
                            19: [2, 18],
                            20: [2, 18],
                            22: [2, 18],
                            23: [2, 18],
                            25: [2, 18]
                        }, {
                            18: [2, 45],
                            21: 56,
                            24: [2, 45],
                            29: 53,
                            30: 60,
                            31: 54,
                            32: [1, 57],
                            33: [1, 58],
                            34: [1, 59],
                            35: [1, 61],
                            36: [2, 45],
                            37: 55,
                            38: 62,
                            39: 63,
                            40: [1, 64],
                            42: [1, 27],
                            43: 26
                        }, {
                            40: [1, 65]
                        }, {
                            18: [2, 37],
                            24: [2, 37],
                            32: [2, 37],
                            33: [2, 37],
                            34: [2, 37],
                            35: [2, 37],
                            36: [2, 37],
                            40: [2, 37],
                            42: [2, 37]
                        }, {
                            14: [2, 17],
                            15: [2, 17],
                            16: [2, 17],
                            19: [2, 17],
                            20: [2, 17],
                            22: [2, 17],
                            23: [2, 17],
                            25: [2, 17]
                        }, {
                            5: [2, 20],
                            14: [2, 20],
                            15: [2, 20],
                            16: [2, 20],
                            19: [2, 20],
                            20: [2, 20],
                            22: [2, 20],
                            23: [2, 20],
                            25: [2, 20]
                        }, {
                            5: [2, 21],
                            14: [2, 21],
                            15: [2, 21],
                            16: [2, 21],
                            19: [2, 21],
                            20: [2, 21],
                            22: [2, 21],
                            23: [2, 21],
                            25: [2, 21]
                        }, {
                            18: [1, 66]
                        }, {
                            18: [2, 42]
                        }, {
                            18: [1, 67]
                        }, {
                            8: 17,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 11],
                            20: [2, 4],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            18: [2, 24],
                            24: [2, 24],
                            36: [2, 24]
                        }, {
                            18: [2, 44],
                            24: [2, 44],
                            32: [2, 44],
                            33: [2, 44],
                            34: [2, 44],
                            35: [2, 44],
                            36: [2, 44],
                            40: [2, 44],
                            42: [2, 44]
                        }, {
                            18: [2, 46],
                            24: [2, 46],
                            36: [2, 46]
                        }, {
                            18: [2, 26],
                            24: [2, 26],
                            32: [2, 26],
                            33: [2, 26],
                            34: [2, 26],
                            35: [2, 26],
                            36: [2, 26],
                            40: [2, 26],
                            42: [2, 26]
                        }, {
                            18: [2, 27],
                            24: [2, 27],
                            32: [2, 27],
                            33: [2, 27],
                            34: [2, 27],
                            35: [2, 27],
                            36: [2, 27],
                            40: [2, 27],
                            42: [2, 27]
                        }, {
                            18: [2, 28],
                            24: [2, 28],
                            32: [2, 28],
                            33: [2, 28],
                            34: [2, 28],
                            35: [2, 28],
                            36: [2, 28],
                            40: [2, 28],
                            42: [2, 28]
                        }, {
                            18: [2, 29],
                            24: [2, 29],
                            32: [2, 29],
                            33: [2, 29],
                            34: [2, 29],
                            35: [2, 29],
                            36: [2, 29],
                            40: [2, 29],
                            42: [2, 29]
                        }, {
                            18: [2, 30],
                            24: [2, 30],
                            32: [2, 30],
                            33: [2, 30],
                            34: [2, 30],
                            35: [2, 30],
                            36: [2, 30],
                            40: [2, 30],
                            42: [2, 30]
                        }, {
                            17: 68,
                            21: 24,
                            30: 25,
                            40: [1, 28],
                            42: [1, 27],
                            43: 26
                        }, {
                            18: [2, 32],
                            24: [2, 32],
                            36: [2, 32],
                            39: 69,
                            40: [1, 70]
                        }, {
                            18: [2, 47],
                            24: [2, 47],
                            36: [2, 47],
                            40: [2, 47]
                        }, {
                            18: [2, 40],
                            24: [2, 40],
                            32: [2, 40],
                            33: [2, 40],
                            34: [2, 40],
                            35: [2, 40],
                            36: [2, 40],
                            40: [2, 40],
                            41: [1, 71],
                            42: [2, 40],
                            44: [2, 40]
                        }, {
                            18: [2, 39],
                            24: [2, 39],
                            32: [2, 39],
                            33: [2, 39],
                            34: [2, 39],
                            35: [2, 39],
                            36: [2, 39],
                            40: [2, 39],
                            42: [2, 39],
                            44: [2, 39]
                        }, {
                            5: [2, 22],
                            14: [2, 22],
                            15: [2, 22],
                            16: [2, 22],
                            19: [2, 22],
                            20: [2, 22],
                            22: [2, 22],
                            23: [2, 22],
                            25: [2, 22]
                        }, {
                            5: [2, 19],
                            14: [2, 19],
                            15: [2, 19],
                            16: [2, 19],
                            19: [2, 19],
                            20: [2, 19],
                            22: [2, 19],
                            23: [2, 19],
                            25: [2, 19]
                        }, {
                            36: [1, 72]
                        }, {
                            18: [2, 48],
                            24: [2, 48],
                            36: [2, 48],
                            40: [2, 48]
                        }, {
                            41: [1, 71]
                        }, {
                            21: 56,
                            30: 60,
                            31: 73,
                            32: [1, 57],
                            33: [1, 58],
                            34: [1, 59],
                            35: [1, 61],
                            40: [1, 28],
                            42: [1, 27],
                            43: 26
                        }, {
                            18: [2, 31],
                            24: [2, 31],
                            32: [2, 31],
                            33: [2, 31],
                            34: [2, 31],
                            35: [2, 31],
                            36: [2, 31],
                            40: [2, 31],
                            42: [2, 31]
                        }, {
                            18: [2, 33],
                            24: [2, 33],
                            36: [2, 33],
                            40: [2, 33]
                        }
                        ],
                        defaultActions: {
                            3: [2, 2],
                            16: [2, 1],
                            50: [2, 42]
                        },
                        parseError: function(t) {
                            throw new Error(t)
                        },
                        parse: function(t) {
                            function e() {
                                var t;
                                return t = i.lexer.lex() || 1, "number" != typeof t && (t = i.symbols_[t] || t), t
                            }
                            var i = this, n = [0], s = [null], r = [], o = this.table, a = "", l = 0, h = 0, u = 0;
                            this.lexer.setInput(t), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, this.yy.parser = this, "undefined" == typeof this.lexer.yylloc && (this.lexer.yylloc = {});
                            var c = this.lexer.yylloc;
                            r.push(c);
                            var p = this.lexer.options && this.lexer.options.ranges;
                            "function" == typeof this.yy.parseError && (this.parseError = this.yy.parseError);
                            for (var d, f, g, m, v, _, y, b, w, k = {}; ;) {
                                if (g = n[n.length - 1], this.defaultActions[g] ? m = this.defaultActions[g] : ((null === d || "undefined" == typeof d) && (d = e()), m = o[g] && o[g][d]), "undefined" == typeof m ||!m.length ||!m[0]) {
                                    var x = "";
                                    if (!u) {
                                        w = [];
                                        for (_ in o[g])
                                            this.terminals_[_] && _ > 2 && w.push("'" + this.terminals_[_] + "'");
                                        x = this.lexer.showPosition ? "Parse error on line " + (l + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + w.join(", ") + ", got '" + (this.terminals_[d] || d) + "'" : "Parse error on line " + (l + 1) + ": Unexpected " + (1 == d ? "end of input" : "'" + (this.terminals_[d] || d) + "'"), this.parseError(x, {
                                            text: this.lexer.match,
                                            token: this.terminals_[d] || d,
                                            line: this.lexer.yylineno,
                                            loc: c,
                                            expected: w
                                        })
                                    }
                                }
                                if (m[0]instanceof Array && m.length > 1)
                                    throw new Error("Parse Error: multiple actions possible at state: " + g + ", token: " + d);
                                switch (m[0]) {
                                case 1:
                                    n.push(d), s.push(this.lexer.yytext), r.push(this.lexer.yylloc), n.push(m[1]), d = null, f ? (d = f, f = null) : (h = this.lexer.yyleng, a = this.lexer.yytext, l = this.lexer.yylineno, c = this.lexer.yylloc, u > 0 && u--);
                                    break;
                                case 2:
                                    if (y = this.productions_[m[1]][1], k.$ = s[s.length - y], k._$ = {
                                        first_line: r[r.length - (y || 1)].first_line,
                                        last_line: r[r.length - 1].last_line,
                                        first_column: r[r.length - (y || 1)].first_column,
                                        last_column: r[r.length - 1].last_column
                                    }, p && (k._$.range = [r[r.length - (y || 1)].range[0], r[r.length - 1].range[1]]), v = this.performAction.call(k, a, h, l, this.yy, m[1], s, r), "undefined" != typeof v)
                                        return v;
                                    y && (n = n.slice(0, - 1 * y * 2), s = s.slice(0, - 1 * y), r = r.slice(0, - 1 * y)), n.push(this.productions_[m[1]][0]), s.push(k.$), r.push(k._$), b = o[n[n.length - 2]][n[n.length - 1]], n.push(b);
                                    break;
                                case 3:
                                    return !0
                                }
                            }
                            return !0
                        }
                    }, n = function() {
                        var t = {
                            EOF: 1,
                            parseError: function(t, e) {
                                if (!this.yy.parser)
                                    throw new Error(t);
                                this.yy.parser.parseError(t, e)
                            },
                            setInput: function(t) {
                                return this._input = t, this._more = this._less = this.done=!1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = "", this.conditionStack = ["INITIAL"], this.yylloc = {
                                    first_line: 1,
                                    first_column: 0,
                                    last_line: 1,
                                    last_column: 0
                                }, this.options.ranges && (this.yylloc.range = [0, 0]), this.offset = 0, this
                            },
                            input: function() {
                                var t = this._input[0];
                                this.yytext += t, this.yyleng++, this.offset++, this.match += t, this.matched += t;
                                var e = t.match(/(?:\r\n?|\n).*/g);
                                return e ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++, this.options.ranges && this.yylloc.range[1]++, this._input = this._input.slice(1), t
                            },
                            unput: function(t) {
                                var e = t.length, i = t.split(/(?:\r\n?|\n)/g);
                                this._input = t + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - e - 1), this.offset -= e;
                                var n = this.match.split(/(?:\r\n?|\n)/g);
                                this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), i.length - 1 && (this.yylineno -= i.length - 1);
                                var s = this.yylloc.range;
                                return this.yylloc = {
                                    first_line: this.yylloc.first_line,
                                    last_line: this.yylineno + 1,
                                    first_column: this.yylloc.first_column,
                                    last_column: i ? (i.length === n.length ? this.yylloc.first_column : 0) + n[n.length - i.length].length - i[0].length: this.yylloc.first_column - e
                                }, this.options.ranges && (this.yylloc.range = [s[0], s[0] + this.yyleng - e]), this
                            },
                            more: function() {
                                return this._more=!0, this
                            },
                            less: function(t) {
                                this.unput(this.match.slice(t))
                            },
                            pastInput: function() {
                                var t = this.matched.substr(0, this.matched.length - this.match.length);
                                return (t.length > 20 ? "..." : "") + t.substr( - 20).replace(/\n/g, "")
                            },
                            upcomingInput: function() {
                                var t = this.match;
                                return t.length < 20 && (t += this._input.substr(0, 20 - t.length)), (t.substr(0, 20) + (t.length > 20 ? "..." : "")).replace(/\n/g, "")
                            },
                            showPosition: function() {
                                var t = this.pastInput(), e = new Array(t.length + 1).join("-");
                                return t + this.upcomingInput() + "\n" + e + "^"
                            },
                            next: function() {
                                if (this.done)
                                    return this.EOF;
                                this._input || (this.done=!0);
                                var t, e, i, n, s;
                                this._more || (this.yytext = "", this.match = "");
                                for (var r = this._currentRules(), o = 0; o < r.length && (i = this._input.match(this.rules[r[o]]), !i || e&&!(i[0].length > e[0].length) || (e = i, n = o, this.options.flex)); o++);
                                return e ? (s = e[0].match(/(?:\r\n?|\n).*/g), s && (this.yylineno += s.length), this.yylloc = {
                                    first_line: this.yylloc.last_line,
                                    last_line: this.yylineno + 1,
                                    first_column: this.yylloc.last_column,
                                    last_column: s ? s[s.length - 1].length - s[s.length - 1].match(/\r?\n?/)[0].length: this.yylloc.last_column + e[0].length
                                }, this.yytext += e[0], this.match += e[0], this.matches = e, this.yyleng = this.yytext.length, this.options.ranges && (this.yylloc.range = [this.offset, this.offset += this.yyleng]), this._more=!1, this._input = this._input.slice(e[0].length), this.matched += e[0], t = this.performAction.call(this, this.yy, this, r[n], this.conditionStack[this.conditionStack.length - 1]), this.done && this._input && (this.done=!1), t ? t : void 0) : "" === this._input ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                                    text: "",
                                    token: null,
                                    line: this.yylineno
                                })
                            },
                            lex: function() {
                                var t = this.next();
                                return "undefined" != typeof t ? t : this.lex()
                            },
                            begin: function(t) {
                                this.conditionStack.push(t)
                            },
                            popState: function() {
                                return this.conditionStack.pop()
                            },
                            _currentRules: function() {
                                return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
                            },
                            topState: function() {
                                return this.conditionStack[this.conditionStack.length - 2]
                            },
                            pushState: function(t) {
                                this.begin(t)
                            }
                        };
                        return t.options = {}, t.performAction = function(t, e, i, n) {
                            function s(t, i) {
                                return e.yytext = e.yytext.substr(t, e.yyleng - i)
                            }
                            switch (i) {
                            case 0:
                                if ("\\\\" === e.yytext.slice( - 2) ? (s(0, 1), this.begin("mu")) : "\\" === e.yytext.slice( - 1) ? (s(0, 1), this.begin("emu")) : this.begin("mu"), e.yytext)
                                    return 14;
                                break;
                            case 1:
                                return 14;
                            case 2:
                                return this.popState(), 14;
                            case 3:
                                return s(0, 4), this.popState(), 15;
                            case 4:
                                return 35;
                            case 5:
                                return 36;
                            case 6:
                                return 25;
                            case 7:
                                return 16;
                            case 8:
                                return 20;
                            case 9:
                                return 19;
                            case 10:
                                return 19;
                            case 11:
                                return 23;
                            case 12:
                                return 22;
                            case 13:
                                this.popState(), this.begin("com");
                                break;
                            case 14:
                                return s(3, 5), this.popState(), 15;
                            case 15:
                                return 22;
                            case 16:
                                return 41;
                            case 17:
                                return 40;
                            case 18:
                                return 40;
                            case 19:
                                return 44;
                            case 20:
                                break;
                            case 21:
                                return this.popState(), 24;
                            case 22:
                                return this.popState(), 18;
                            case 23:
                                return e.yytext = s(1, 2).replace(/\\"/g, '"'), 32;
                            case 24:
                                return e.yytext = s(1, 2).replace(/\\'/g, "'"), 32;
                            case 25:
                                return 42;
                            case 26:
                                return 34;
                            case 27:
                                return 34;
                            case 28:
                                return 33;
                            case 29:
                                return 40;
                            case 30:
                                return e.yytext = s(1, 2), 40;
                            case 31:
                                return "INVALID";
                            case 32:
                                return 5
                            }
                        }, t.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:[\s\S]*?--\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{!--)/, /^(?:\{\{![\s\S]*?\}\})/, /^(?:\{\{(~)?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:-?[0-9]+(?=([~}\s)])))/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)]))))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/], t.conditions = {
                            mu: {
                                rules: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
                                inclusive: !1
                            },
                            emu: {
                                rules: [2],
                                inclusive: !1
                            },
                            com: {
                                rules: [3],
                                inclusive: !1
                            },
                            INITIAL: {
                                rules: [0, 1, 32],
                                inclusive: !0
                            }
                        }, t
                    }();
                    return i.lexer = n, e.prototype = i, i.Parser = e, new e
                }();
                return t = e
            }(), l = function(t, e) {
                "use strict";
                function i(t) {
                    return t.constructor === r.ProgramNode ? t : (s.yy = r, s.parse(t))
                }
                var n = {}, s = t, r = e;
                return n.parser = s, n.parse = i, n
            }(a, o), h = function(t) {
                "use strict";
                function e() {}
                function i(t, e, i) {
                    if (null == t || "string" != typeof t && t.constructor !== i.AST.ProgramNode)
                        throw new r("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + t);
                    e = e || {}, "data"in e || (e.data=!0);
                    var n = i.parse(t), s = (new i.Compiler).compile(n, e);
                    return (new i.JavaScriptCompiler).compile(s, e)
                }
                function n(t, e, i) {
                    function n() {
                        var n = i.parse(t), s = (new i.Compiler).compile(n, e), r = (new i.JavaScriptCompiler).compile(s, e, void 0, !0);
                        return i.template(r)
                    }
                    if (null == t || "string" != typeof t && t.constructor !== i.AST.ProgramNode)
                        throw new r("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + t);
                    e = e || {}, "data"in e || (e.data=!0);
                    var s;
                    return function(t, e) {
                        return s || (s = n()), s.call(this, t, e)
                    }
                }
                var s = {}, r = t;
                return s.Compiler = e, e.prototype = {
                    compiler: e,
                    disassemble: function() {
                        for (var t, e, i, n = this.opcodes, s = [], r = 0, o = n.length; o > r; r++)
                            if (t = n[r], "DECLARE" === t.opcode)
                                s.push("DECLARE " + t.name + "=" + t.value);
                            else {
                                e = [];
                                for (var a = 0; a < t.args.length; a++)
                                    i = t.args[a], "string" == typeof i && (i = '"' + i.replace("\n", "\\n") + '"'), e.push(i);
                                    s.push(t.opcode + " " + e.join(" "))
                            }
                        return s.join("\n")
                    },
                    equals: function(t) {
                        var e = this.opcodes.length;
                        if (t.opcodes.length !== e)
                            return !1;
                        for (var i = 0; e > i; i++) {
                            var n = this.opcodes[i], s = t.opcodes[i];
                            if (n.opcode !== s.opcode || n.args.length !== s.args.length)
                                return !1;
                            for (var r = 0; r < n.args.length; r++)
                                if (n.args[r] !== s.args[r])
                                    return !1
                        }
                        if (e = this.children.length, t.children.length !== e)
                            return !1;
                        for (i = 0; e > i; i++)
                            if (!this.children[i].equals(t.children[i]))
                                return !1;
                        return !0
                    },
                    guid: 0,
                    compile: function(t, e) {
                        this.opcodes = [], this.children = [], this.depths = {
                            list: []
                        }, this.options = e;
                        var i = this.options.knownHelpers;
                        if (this.options.knownHelpers = {
                            helperMissing: !0,
                            blockHelperMissing: !0,
                            each: !0,
                            "if": !0,
                            unless: !0,
                            "with": !0,
                            log: !0
                        }, i)
                            for (var n in i)
                                this.options.knownHelpers[n] = i[n];
                        return this.accept(t)
                    },
                    accept: function(t) {
                        var e, i = t.strip || {};
                        return i.left && this.opcode("strip"), e = this[t.type](t), i.right && this.opcode("strip"), e
                    },
                    program: function(t) {
                        for (var e = t.statements, i = 0, n = e.length; n > i; i++)
                            this.accept(e[i]);
                        return this.isSimple = 1 === n, this.depths.list = this.depths.list.sort(function(t, e) {
                            return t - e
                        }), this
                    },
                    compileProgram: function(t) {
                        var e, i = (new this.compiler).compile(t, this.options), n = this.guid++;
                        this.usePartial = this.usePartial || i.usePartial, this.children[n] = i;
                        for (var s = 0, r = i.depths.list.length; r > s; s++)
                            e = i.depths.list[s], 2 > e || this.addDepth(e - 1);
                        return n
                    },
                    block: function(t) {
                        var e = t.mustache, i = t.program, n = t.inverse;
                        i && (i = this.compileProgram(i)), n && (n = this.compileProgram(n));
                        var s = e.sexpr, r = this.classifySexpr(s);
                        "helper" === r ? this.helperSexpr(s, i, n) : "simple" === r ? (this.simpleSexpr(s), this.opcode("pushProgram", i), this.opcode("pushProgram", n), this.opcode("emptyHash"), this.opcode("blockValue")) : (this.ambiguousSexpr(s, i, n), this.opcode("pushProgram", i), this.opcode("pushProgram", n), this.opcode("emptyHash"), this.opcode("ambiguousBlockValue")), this.opcode("append")
                    },
                    hash: function(t) {
                        var e, i, n = t.pairs;
                        this.opcode("pushHash");
                        for (var s = 0, r = n.length; r > s; s++)
                            e = n[s], i = e[1], this.options.stringParams ? (i.depth && this.addDepth(i.depth), this.opcode("getContext", i.depth || 0), this.opcode("pushStringParam", i.stringModeValue, i.type), "sexpr" === i.type && this.sexpr(i)) : this.accept(i), this.opcode("assignToHash", e[0]);
                        this.opcode("popHash")
                    },
                    partial: function(t) {
                        var e = t.partialName;
                        this.usePartial=!0, t.context ? this.ID(t.context) : this.opcode("push", "depth0"), this.opcode("invokePartial", e.name), this.opcode("append")
                    },
                    content: function(t) {
                        this.opcode("appendContent", t.string)
                    },
                    mustache: function(t) {
                        this.sexpr(t.sexpr), this.opcode(t.escaped&&!this.options.noEscape ? "appendEscaped" : "append")
                    },
                    ambiguousSexpr: function(t, e, i) {
                        var n = t.id, s = n.parts[0], r = null != e || null != i;
                        this.opcode("getContext", n.depth), this.opcode("pushProgram", e), this.opcode("pushProgram", i), this.opcode("invokeAmbiguous", s, r)
                    },
                    simpleSexpr: function(t) {
                        var e = t.id;
                        "DATA" === e.type ? this.DATA(e) : e.parts.length ? this.ID(e) : (this.addDepth(e.depth), this.opcode("getContext", e.depth), this.opcode("pushContext")), this.opcode("resolvePossibleLambda")
                    },
                    helperSexpr: function(t, e, i) {
                        var n = this.setupFullMustacheParams(t, e, i), s = t.id.parts[0];
                        if (this.options.knownHelpers[s])
                            this.opcode("invokeKnownHelper", n.length, s);
                        else {
                            if (this.options.knownHelpersOnly)
                                throw new r("You specified knownHelpersOnly, but used the unknown helper " + s, t);
                            this.opcode("invokeHelper", n.length, s, t.isRoot)
                        }
                    },
                    sexpr: function(t) {
                        var e = this.classifySexpr(t);
                        "simple" === e ? this.simpleSexpr(t) : "helper" === e ? this.helperSexpr(t) : this.ambiguousSexpr(t)
                    },
                    ID: function(t) {
                        this.addDepth(t.depth), this.opcode("getContext", t.depth);
                        var e = t.parts[0];
                        e ? this.opcode("lookupOnContext", t.parts[0]) : this.opcode("pushContext");
                        for (var i = 1, n = t.parts.length; n > i; i++)
                            this.opcode("lookup", t.parts[i])
                    },
                    DATA: function(t) {
                        if (this.options.data=!0, t.id.isScoped || t.id.depth)
                            throw new r("Scoped data references are not supported: " + t.original, t);
                        this.opcode("lookupData");
                        for (var e = t.id.parts, i = 0, n = e.length; n > i; i++)
                            this.opcode("lookup", e[i])
                    },
                    STRING: function(t) {
                        this.opcode("pushString", t.string)
                    },
                    INTEGER: function(t) {
                        this.opcode("pushLiteral", t.integer)
                    },
                    BOOLEAN: function(t) {
                        this.opcode("pushLiteral", t.bool)
                    },
                    comment: function() {},
                    opcode: function(t) {
                        this.opcodes.push({
                            opcode: t,
                            args: [].slice.call(arguments, 1)
                        })
                    },
                    declare: function(t, e) {
                        this.opcodes.push({
                            opcode: "DECLARE",
                            name: t,
                            value: e
                        })
                    },
                    addDepth: function(t) {
                        0 !== t && (this.depths[t] || (this.depths[t]=!0, this.depths.list.push(t)))
                    },
                    classifySexpr: function(t) {
                        var e = t.isHelper, i = t.eligibleHelper, n = this.options;
                        if (i&&!e) {
                            var s = t.id.parts[0];
                            n.knownHelpers[s] ? e=!0 : n.knownHelpersOnly && (i=!1)
                        }
                        return e ? "helper" : i ? "ambiguous" : "simple"
                    },
                    pushParams: function(t) {
                        for (var e, i = t.length; i--;)
                            e = t[i], this.options.stringParams ? (e.depth && this.addDepth(e.depth), this.opcode("getContext", e.depth || 0), this.opcode("pushStringParam", e.stringModeValue, e.type), "sexpr" === e.type && this.sexpr(e)) : this[e.type](e)
                    },
                    setupFullMustacheParams: function(t, e, i) {
                        var n = t.params;
                        return this.pushParams(n), this.opcode("pushProgram", e), this.opcode("pushProgram", i), t.hash ? this.hash(t.hash) : this.opcode("emptyHash"), n
                    }
                }, s.precompile = i, s.compile = n, s
            }(i), u = function(t, e) {
                "use strict";
                function i(t) {
                    this.value = t
                }
                function n() {}
                var s, r = t.COMPILER_REVISION, o = t.REVISION_CHANGES, a = t.log, l = e;
                n.prototype = {
                    nameLookup: function(t, e) {
                        var i, s;
                        return 0 === t.indexOf("depth") && (i=!0), s = /^[0-9]+$/.test(e) ? t + "[" + e + "]" : n.isValidJavaScriptVariableName(e) ? t + "." + e : t + "['" + e + "']", i ? "(" + t + " && " + s + ")" : s
                    },
                    compilerInfo: function() {
                        var t = r, e = o[t];
                        return "this.compilerInfo = [" + t + ",'" + e + "'];\n"
                    },
                    appendToBuffer: function(t) {
                        return this.environment.isSimple ? "return " + t + ";" : {
                            appendToBuffer: !0,
                            content: t,
                            toString: function() {
                                return "buffer += " + t + ";"
                            }
                        }
                    },
                    initializeBuffer: function() {
                        return this.quotedString("")
                    },
                    namespace: "Handlebars",
                    compile: function(t, e, i, n) {
                        this.environment = t, this.options = e || {}, a("debug", this.environment.disassemble() + "\n\n"), this.name = this.environment.name, this.isChild=!!i, this.context = i || {
                            programs: [],
                            environments: [],
                            aliases: {}
                        }, this.preamble(), this.stackSlot = 0, this.stackVars = [], this.registers = {
                            list: []
                        }, this.hashes = [], this.compileStack = [], this.inlineStack = [], this.compileChildren(t, e);
                        var s, r = t.opcodes;
                        this.i = 0;
                        for (var o = r.length; this.i < o; this.i++)
                            s = r[this.i], "DECLARE" === s.opcode ? this[s.name] = s.value : this[s.opcode].apply(this, s.args), s.opcode !== this.stripNext && (this.stripNext=!1);
                        if (this.pushSource(""), this.stackSlot || this.inlineStack.length || this.compileStack.length)
                            throw new l("Compile completed with content left on stack");
                        return this.createFunctionContext(n)
                    },
                    preamble: function() {
                        var t = [];
                        if (this.isChild)
                            t.push("");
                        else {
                            var e = this.namespace, i = "helpers = this.merge(helpers, " + e + ".helpers);";
                            this.environment.usePartial && (i = i + " partials = this.merge(partials, " + e + ".partials);"), this.options.data && (i += " data = data || {};"), t.push(i)
                        }
                        t.push(this.environment.isSimple ? "" : ", buffer = " + this.initializeBuffer()), this.lastContext = 0, this.source = t
                    },
                    createFunctionContext: function(t) {
                        var e = this.stackVars.concat(this.registers.list);
                        if (e.length > 0 && (this.source[1] = this.source[1] + ", " + e.join(", ")), !this.isChild)
                            for (var i in this.context.aliases)
                                this.context.aliases.hasOwnProperty(i) && (this.source[1] = this.source[1] + ", " + i + "=" + this.context.aliases[i]);
                        this.source[1] && (this.source[1] = "var " + this.source[1].substring(2) + ";"), this.isChild || (this.source[1] += "\n" + this.context.programs.join("\n") + "\n"), this.environment.isSimple || this.pushSource("return buffer;");
                        for (var n = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"], s = 0, r = this.environment.depths.list.length; r > s; s++)
                            n.push("depth" + this.environment.depths.list[s]);
                        var o = this.mergeSource();
                        if (this.isChild || (o = this.compilerInfo() + o), t)
                            return n.push(o), Function.apply(this, n);
                        var l = "function " + (this.name || "") + "(" + n.join(",") + ") {\n  " + o + "}";
                        return a("debug", l + "\n\n"), l
                    },
                    mergeSource: function() {
                        for (var t, e = "", i = 0, n = this.source.length; n > i; i++) {
                            var s = this.source[i];
                            s.appendToBuffer ? t = t ? t + "\n    + " + s.content : s.content : (t && (e += "buffer += " + t + ";\n  ", t = void 0), e += s + "\n  ")
                        }
                        return e
                    },
                    blockValue: function() {
                        this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
                        var t = ["depth0"];
                        this.setupParams(0, t), this.replaceStack(function(e) {
                            return t.splice(1, 0, e), "blockHelperMissing.call(" + t.join(", ") + ")"
                        })
                    },
                    ambiguousBlockValue: function() {
                        this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
                        var t = ["depth0"];
                        this.setupParams(0, t);
                        var e = this.topStack();
                        t.splice(1, 0, e), this.pushSource("if (!" + this.lastHelper + ") { " + e + " = blockHelperMissing.call(" + t.join(", ") + "); }")
                    },
                    appendContent: function(t) {
                        this.pendingContent && (t = this.pendingContent + t), this.stripNext && (t = t.replace(/^\s+/, "")), this.pendingContent = t
                    },
                    strip: function() {
                        this.pendingContent && (this.pendingContent = this.pendingContent.replace(/\s+$/, "")), this.stripNext = "strip"
                    },
                    append: function() {
                        this.flushInline();
                        var t = this.popStack();
                        this.pushSource("if(" + t + " || " + t + " === 0) { " + this.appendToBuffer(t) + " }"), this.environment.isSimple && this.pushSource("else { " + this.appendToBuffer("''") + " }")
                    },
                    appendEscaped: function() {
                        this.context.aliases.escapeExpression = "this.escapeExpression", this.pushSource(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"))
                    },
                    getContext: function(t) {
                        this.lastContext !== t && (this.lastContext = t)
                    },
                    lookupOnContext: function(t) {
                        this.push(this.nameLookup("depth" + this.lastContext, t, "context"))
                    },
                    pushContext: function() {
                        this.pushStackLiteral("depth" + this.lastContext)
                    },
                    resolvePossibleLambda: function() {
                        this.context.aliases.functionType = '"function"', this.replaceStack(function(t) {
                            return "typeof " + t + " === functionType ? " + t + ".apply(depth0) : " + t
                        })
                    },
                    lookup: function(t) {
                        this.replaceStack(function(e) {
                            return e + " == null || " + e + " === false ? " + e + " : " + this.nameLookup(e, t, "context")
                        })
                    },
                    lookupData: function() {
                        this.pushStackLiteral("data")
                    },
                    pushStringParam: function(t, e) {
                        this.pushStackLiteral("depth" + this.lastContext), this.pushString(e), "sexpr" !== e && ("string" == typeof t ? this.pushString(t) : this.pushStackLiteral(t))
                    },
                    emptyHash: function() {
                        this.pushStackLiteral("{}"), this.options.stringParams && (this.push("{}"), this.push("{}"))
                    },
                    pushHash: function() {
                        this.hash && this.hashes.push(this.hash), this.hash = {
                            values: [],
                            types: [],
                            contexts: []
                        }
                    },
                    popHash: function() {
                        var t = this.hash;
                        this.hash = this.hashes.pop(), this.options.stringParams && (this.push("{" + t.contexts.join(",") + "}"), this.push("{" + t.types.join(",") + "}")), this.push("{\n    " + t.values.join(",\n    ") + "\n  }")
                    },
                    pushString: function(t) {
                        this.pushStackLiteral(this.quotedString(t))
                    },
                    push: function(t) {
                        return this.inlineStack.push(t), t
                    },
                    pushLiteral: function(t) {
                        this.pushStackLiteral(t)
                    },
                    pushProgram: function(t) {
                        this.pushStackLiteral(null != t ? this.programExpression(t) : null)
                    },
                    invokeHelper: function(t, e, i) {
                        this.context.aliases.helperMissing = "helpers.helperMissing", this.useRegister("helper");
                        var n = this.lastHelper = this.setupHelper(t, e, !0), s = this.nameLookup("depth" + this.lastContext, e, "context"), r = "helper = " + n.name + " || " + s;
                        n.paramsInit && (r += "," + n.paramsInit), this.push("(" + r + ",helper ? helper.call(" + n.callParams + ") : helperMissing.call(" + n.helperMissingParams + "))"), i || this.flushInline()
                    },
                    invokeKnownHelper: function(t, e) {
                        var i = this.setupHelper(t, e);
                        this.push(i.name + ".call(" + i.callParams + ")")
                    },
                    invokeAmbiguous: function(t, e) {
                        this.context.aliases.functionType = '"function"', this.useRegister("helper"), this.emptyHash();
                        var i = this.setupHelper(0, t, e), n = this.lastHelper = this.nameLookup("helpers", t, "helper"), s = this.nameLookup("depth" + this.lastContext, t, "context"), r = this.nextStack();
                        i.paramsInit && this.pushSource(i.paramsInit), this.pushSource("if (helper = " + n + ") { " + r + " = helper.call(" + i.callParams + "); }"), this.pushSource("else { helper = " + s + "; " + r + " = typeof helper === functionType ? helper.call(" + i.callParams + ") : helper; }")
                    },
                    invokePartial: function(t) {
                        var e = [this.nameLookup("partials", t, "partial"), "'" + t + "'", this.popStack(), "helpers", "partials"];
                        this.options.data && e.push("data"), this.context.aliases.self = "this", this.push("self.invokePartial(" + e.join(", ") + ")")
                    },
                    assignToHash: function(t) {
                        var e, i, n = this.popStack();
                        this.options.stringParams && (i = this.popStack(), e = this.popStack());
                        var s = this.hash;
                        e && s.contexts.push("'" + t + "': " + e), i && s.types.push("'" + t + "': " + i), s.values.push("'" + t + "': (" + n + ")")
                    },
                    compiler: n,
                    compileChildren: function(t, e) {
                        for (var i, n, s = t.children, r = 0, o = s.length; o > r; r++) {
                            i = s[r], n = new this.compiler;
                            var a = this.matchExistingProgram(i);
                            null == a ? (this.context.programs.push(""), a = this.context.programs.length, i.index = a, i.name = "program" + a, this.context.programs[a] = n.compile(i, e, this.context), this.context.environments[a] = i) : (i.index = a, i.name = "program" + a)
                        }
                    },
                    matchExistingProgram: function(t) {
                        for (var e = 0, i = this.context.environments.length; i > e; e++) {
                            var n = this.context.environments[e];
                            if (n && n.equals(t))
                                return e
                        }
                    },
                    programExpression: function(t) {
                        if (this.context.aliases.self = "this", null == t)
                            return "self.noop";
                        for (var e, i = this.environment.children[t], n = i.depths.list, s = [i.index, i.name, "data"], r = 0, o = n.length; o > r; r++)
                            e = n[r], s.push(1 === e ? "depth0" : "depth" + (e - 1));
                        return (0 === n.length ? "self.program(" : "self.programWithDepth(") + s.join(", ") + ")"
                    },
                    register: function(t, e) {
                        this.useRegister(t), this.pushSource(t + " = " + e + ";")
                    },
                    useRegister: function(t) {
                        this.registers[t] || (this.registers[t]=!0, this.registers.list.push(t))
                    },
                    pushStackLiteral: function(t) {
                        return this.push(new i(t))
                    },
                    pushSource: function(t) {
                        this.pendingContent && (this.source.push(this.appendToBuffer(this.quotedString(this.pendingContent))), this.pendingContent = void 0), t && this.source.push(t)
                    },
                    pushStack: function(t) {
                        this.flushInline();
                        var e = this.incrStack();
                        return t && this.pushSource(e + " = " + t + ";"), this.compileStack.push(e), e
                    },
                    replaceStack: function(t) {
                        var e, n, s, r = "", o = this.isInline();
                        if (o) {
                            var a = this.popStack(!0);
                            if (a instanceof i)
                                e = a.value, s=!0;
                            else {
                                n=!this.stackSlot;
                                var l = n ? this.incrStack(): this.topStackName();
                                r = "(" + this.push(l) + " = " + a + "),", e = this.topStack()
                            }
                        } else
                            e = this.topStack();
                        var h = t.call(this, e);
                        return o ? (s || this.popStack(), n && this.stackSlot--, this.push("(" + r + h + ")")) : (/^stack/.test(e) || (e = this.nextStack()), this.pushSource(e + " = (" + r + h + ");")), e
                    },
                    nextStack: function() {
                        return this.pushStack()
                    },
                    incrStack: function() {
                        return this.stackSlot++, this.stackSlot > this.stackVars.length && this.stackVars.push("stack" + this.stackSlot), this.topStackName()
                    },
                    topStackName: function() {
                        return "stack" + this.stackSlot
                    },
                    flushInline: function() {
                        var t = this.inlineStack;
                        if (t.length) {
                            this.inlineStack = [];
                            for (var e = 0, n = t.length; n > e; e++) {
                                var s = t[e];
                                s instanceof i ? this.compileStack.push(s) : this.pushStack(s)
                            }
                        }
                    },
                    isInline: function() {
                        return this.inlineStack.length
                    },
                    popStack: function(t) {
                        var e = this.isInline(), n = (e ? this.inlineStack : this.compileStack).pop();
                        if (!t && n instanceof i)
                            return n.value;
                        if (!e) {
                            if (!this.stackSlot)
                                throw new l("Invalid stack pop");
                            this.stackSlot--
                        }
                        return n
                    },
                    topStack: function(t) {
                        var e = this.isInline() ? this.inlineStack: this.compileStack, n = e[e.length - 1];
                        return !t && n instanceof i ? n.value : n
                    },
                    quotedString: function(t) {
                        return '"' + t.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") + '"'
                    },
                    setupHelper: function(t, e, i) {
                        var n = [], s = this.setupParams(t, n, i), r = this.nameLookup("helpers", e, "helper");
                        return {
                            params: n,
                            paramsInit: s,
                            name: r,
                            callParams: ["depth0"].concat(n).join(", "),
                            helperMissingParams: i && ["depth0", this.quotedString(e)].concat(n).join(", ")
                        }
                    },
                    setupOptions: function(t, e) {
                        var i, n, s, r = [], o = [], a = [];
                        r.push("hash:" + this.popStack()), this.options.stringParams && (r.push("hashTypes:" + this.popStack()), r.push("hashContexts:" + this.popStack())), n = this.popStack(), s = this.popStack(), (s || n) && (s || (this.context.aliases.self = "this", s = "self.noop"), n || (this.context.aliases.self = "this", n = "self.noop"), r.push("inverse:" + n), r.push("fn:" + s));
                        for (var l = 0; t > l; l++)
                            i = this.popStack(), e.push(i), this.options.stringParams && (a.push(this.popStack()), o.push(this.popStack()));
                        return this.options.stringParams && (r.push("contexts:[" + o.join(",") + "]"), r.push("types:[" + a.join(",") + "]")), this.options.data && r.push("data:data"), r
                    },
                    setupParams: function(t, e, i) {
                        var n = "{" + this.setupOptions(t, e).join(",") + "}";
                        return i ? (this.useRegister("options"), e.push("options"), "options=" + n) : (e.push(n), "")
                    }
                };
                for (var h = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "), u = n.RESERVED_WORDS = {}, c = 0, p = h.length; p > c; c++)
                    u[h[c]]=!0;
                return n.isValidJavaScriptVariableName = function(t) {
                    return !n.RESERVED_WORDS[t] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(t)?!0 : !1
                }, s = n
            }(n, i), c = function(t, e, i, n, s) {
                "use strict";
                var r, o = t, a = e, l = i.parser, h = i.parse, u = n.Compiler, c = n.compile, p = n.precompile, d = s, f = o.create, g = function() {
                    var t = f();
                    return t.compile = function(e, i) {
                        return c(e, i, t)
                    }, t.precompile = function(e, i) {
                        return p(e, i, t)
                    }, t.AST = a, t.Compiler = u, t.JavaScriptCompiler = d, t.Parser = l, t.parse = h, t
                };
                return o = g(), o.create = g, r = o
            }(r, o, l, h, u);
            return c
        }();
        return t
    }), define("hbs/underscore", {}), define("hbs/i18nprecompile", ["hbs/handlebars", "hbs/underscore"], function(t, e) {
        function i(n, s, r) {
            return r = r || {}, s = s || {}, n && "program" === n.type && n.statements && (e(n.statements).forEach(function(e, o) {
                var a = "<!-- i18n error -->";
                if ("mustache" === e.type && e.id && "$" === e.id.original) {
                    if (e.params.length && e.params[0].string) {
                        var l = e.params[0].string;
                        a = s[l] || (r.originalKeyFallback ? l : a)
                    }
                    n.statements[o] = new t.AST.ContentNode(a)
                } else
                    e.program && (e.program = i(e.program, s, r))
            }), n.inverse && i(n.inverse, s, r)), n
        }
        return function(e, n, s) {
            s = s || {};
            var r, o;
            return r = t.parse(e), n!==!1 && (r = i(r, n, s)), o = (new t.Compiler).compile(r, s), (new t.JavaScriptCompiler).compile(o, s)
        }
    }), function(window) {
        var JSON = window.JSON || {};
        !function() {
            "use strict";
            function f(t) {
                return 10 > t ? "0" + t : t
            }
            function quote(t) {
                return escapable.lastIndex = 0, escapable.test(t) ? '"' + t.replace(escapable, function(t) {
                    var e = meta[t];
                    return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice( - 4)
                }) + '"' : '"' + t + '"'
            }
            function str(t, e) {
                var i, n, s, r, o, a = gap, l = e[t];
                switch (l && "object" == typeof l && "function" == typeof l.toJSON && (l = l.toJSON(t)), "function" == typeof rep && (l = rep.call(e, t, l)), typeof l) {
                case"string":
                    return quote(l);
                case"number":
                    return isFinite(l) ? String(l) : "null";
                case"boolean":
                case"null":
                    return String(l);
                case"object":
                    if (!l)
                        return "null";
                    if (gap += indent, o = [], "[object Array]" === Object.prototype.toString.apply(l)) {
                        for (r = l.length, i = 0; r > i; i += 1)
                            o[i] = str(i, l) || "null";
                        return s = 0 === o.length ? "[]" : gap ? "[\n" + gap + o.join(",\n" + gap) + "\n" + a + "]" : "[" + o.join(",") + "]", gap = a, s
                    }
                    if (rep && "object" == typeof rep)
                        for (r = rep.length, i = 0; r > i; i += 1)
                            "string" == typeof rep[i] && (n = rep[i], s = str(n, l), s && o.push(quote(n) + (gap ? ": " : ":") + s));
                    else
                        for (n in l)
                            Object.prototype.hasOwnProperty.call(l, n) && (s = str(n, l), s && o.push(quote(n) + (gap ? ": " : ":") + s));
                    return s = 0 === o.length ? "{}" : gap ? "{\n" + gap + o.join(",\n" + gap) + "\n" + a + "}" : "{" + o.join(",") + "}", gap = a, s
                }
            }
            "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
            }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
                return this.valueOf()
            });
            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
                "\b": "\\b",
                " ": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            }, rep;
            "function" != typeof JSON.stringify && (JSON.stringify = function(t, e, i) {
                var n;
                if (gap = "", indent = "", "number" == typeof i)
                    for (n = 0; i > n; n += 1)
                        indent += " ";
                else
                    "string" == typeof i && (indent = i);
                if (rep = e, e && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length))
                    throw new Error("JSON.stringify");
                return str("", {
                    "": t
                })
            }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
                function walk(t, e) {
                    var i, n, s = t[e];
                    if (s && "object" == typeof s)
                        for (i in s)
                            Object.prototype.hasOwnProperty.call(s, i) && (n = walk(s, i), void 0 !== n ? s[i] = n : delete s[i]);
                    return reviver.call(t, e, s)
                }
                var j;
                if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(t) {
                    return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice( - 4)
                })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
                    return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                        "": j
                    }, "") : j;
                throw new SyntaxError("JSON.parse")
            })
        }(), define("hbs/json2", [], function() {
            return JSON
        })
    }.call(this, this), define("hbs", {
        load: function(t) {
            throw new Error("Dynamic load not allowed: " + t)
        }
    }), define("templates/helpers/icon", ["Handlebars"], function(t) {
        "use strict";
        function e(t, e, n) {
            return t = i(t), e = i(e), n = i(n), '<i class="icon icon_' + t + " " + (n || "") + '">' + (e ? "<span class=screen-reader-text>" + e + "</span>" : "") + "</i>"
        }
        var i = t.Utils.escapeExpression;
        return t.registerHelper("icon", function(i, n, s) {
            return new t.SafeString(e(i, n, s))
        }), e
    }), define("templates/helpers/pageNav", ["Handlebars", "templates/helpers/icon"], function(t, e) {
        "use strict";
        function i(t, i) {
            var n = "";
            i!==!1 && (i=!0);
            var s = '<a href="#prev" class=page-nav__prev>' + e("arrow-alt-left", "Prev", "page-nav__prev__icon") + "</a>", r = '<a href="#next" class=page-nav__next>' + e("arrow-alt-right", "Next", "page-nav__next__icon") + "</a>";
            n += "<div class=page-nav>" + (i ? s : "") + '<ul class="sl page-nav__dots">';
            for (var o =- 1; ++o < t;)
                n += '<li data-pageno="' + o + '" class="page-nav__dot"><a href="#" class="page-nav__dot__link">' + e("page-dot-off", "Page " + (o + 1), "page-nav__dot__icon") + "</a></li>";
            return n += "</ul>" + (i ? r : "") + "</div>"
        }
        return t.registerHelper("pageNav", function(e, n) {
            return new t.SafeString(i(e, n))
        }), i
    }), define("hbs!templates/talkGrid", ["hbs", "hbs/handlebars", "templates/helpers/icon", "templates/helpers/pageNav"], function(t, e) {
        var i = e.template(function(t, e, i) {
            this.compilerInfo = [4, ">= 1.0.0"], i = this.merge(i, t.helpers);
            var n, s, r = "", o = i.helperMissing, a = this.escapeExpression;
            return r += '\n\n\n<div class="talk-grid__container">\n\n  \n  <div class="talk-grid__expander">\n    <div class="talk-grid__inner">\n      \n      <a class="talk-grid__flipper talk-grid__prev" href="#">\n        ' + a((n = i.icon || e && e.icon, s = {
                hash: {}
            }, n ? n.call(e, "arrow-alt-left", "Prev", s) : o.call(e, "icon", "arrow-alt-left", "Prev", s))) + '\n      </a>\n\n      \n      <a class="talk-grid__flipper talk-grid__next" href="#">\n        ' + a((n = i.icon || e && e.icon, s = {
                hash: {}
            }, n ? n.call(e, "arrow-alt-right", "Next", s) : o.call(e, "icon", "arrow-alt-right", "Next", s))) + '\n      </a>\n\n      <div class="talk-grid__content"></div>\n    </div>\n  </div>\n\n  <div class="talk-grid__footer container">\n    ' + a((n = i.pageNav || e && e.pageNav, s = {
                hash: {}
            }, n ? n.call(e, e && e.pages, s) : o.call(e, "pageNav", e && e.pages, s))) + "\n  </div>\n\n</div>\n"
        });
        return i
    }), define("SwipeView", ["exports"], function() {
        var t = function(t, e) {
            function i(t, e) {
                var i;
                for (i = t.length - 1; i>-1 && t[i] !== e; --i);
                return i
            }
            function n(t) {
                return "" === o ? t : (t = t.charAt(0).toUpperCase() + t.substr(1), o + t)
            }
            var s = function() {};
            s.prototype = {
                bind: function(t, e) {
                    this._events = this._events || {}, this._events[t] = this._events[t] || [], this._events[t].push(e)
                },
                unbind: function(t, e) {
                    this._events = this._events || {}, t in this._events!=!1 && this._events[t].splice(i(this._events[t], e), 1)
                },
                trigger: function(t) {
                    if (this._events = this._events || {}, t in this._events!=!1)
                        for (var e = 0; e < this._events[t].length; e++)
                            this._events[t][e].apply(this, Array.prototype.slice.call(arguments, 1))
                }
            };
            var r = e.createElement("div").style, o = function() {
                for (var t, e = "t,webkitT,MozT,msT,OT".split(","), i = 0, n = e.length; n > i; i++)
                    if (t = e[i] + "ransform", t in r)
                        return e[i].substr(0, e[i].length - 1);
                return !1
            }(), a = o ? "-" + o.toLowerCase() + "-": "", l = n("transform"), h = n("transitionDuration"), u = n("perspective")in r, c = "ontouchstart"in t, p=!!o, d = n("transition")in r, f = u ? " translateZ(0)" : "", g = "onorientationchange"in t ? "orientationchange" : "resize", m = c ? "touchstart" : "mousedown", v = c ? "touchmove" : "mousemove", _ = c ? "touchend" : "mouseup", y = c ? "touchcancel" : "mouseup", b = function() {
                if (o===!1)
                    return !1;
                var t = {
                    "": "transitionend",
                    webkit: "webkitTransitionEnd",
                    Moz: "transitionend",
                    O: "oTransitionEnd",
                    ms: "MSTransitionEnd"
                };
                return t[o]
            }(), w = function(t, e, i, n) {
                "addEventListener"in t ? t.addEventListener(e, i, n) : "attachEvent"in t && t.attachEvent("on" + e, i)
            }, k = function(t, e, i) {
                "removeEventListener"in t ? t.removeEventListener(e, i) : "detachEvent"in t && t.detachEvent("on" + e, i)
            }, x = function(t) {
                t.preventDefault ? t.preventDefault() : t.returnValue=!1
            }, S = function(t) {
                return "pageX"in t ? t.pageX : t.clientX + e.body.scrollLeft + e.documentElement.scrollLeft
            }, T = function(t) {
                return "pageY"in t ? t.pageY : t.clientY + e.body.scrollTop + e.documentElement.scrollTop
            }, C = 0, E = function(i, n) {
                var r, l, h, u;
                this.wrapper = "string" == typeof i ? e.querySelector(i) : i, this.id = this.wrapper.id || "sw-id" + ++C, this.options = {
                    text: null,
                    numberOfPages: 3,
                    snapThreshold: null,
                    hastyPageFlip: !1,
                    vertical: !1,
                    loop: !0,
                    transitionDuration: 250,
                    clientWidth: 1024,
                    clientHeight: 145
                };
                for (r in n)
                    this.options[r] = n[r];
                for (this.currentMasterPage = 1, this.k = 0, this.maxK = 0, this.page = 0, this.pageIndex = 0, this.E = new s, this.customEvents = [], this.wrapperWidth = 0, this.wrapperHeight = 0, this.pageSize = 0, this.initiated=!1, this.identifier = null, this.moved=!1, this.thresholdExceeded=!1, this.startX = 0, this.startX = 0, this.pointX = 0, this.pointY = 0, this.stepsX = 0, this.stepsY = 0, this.direction = 0, this.directionLocked=!1, this.cssPosition = this.options.vertical ? "top" : "left", this.wrapper.style.overflow = "hidden", this.wrapper.style.position = "relative", this.masterPages = [], l = e.createElement("div"), l.className = "swipeview-slider", l.style.cssText = "position:relative;top:0;left:0;height:100%;width:100%;" + a + "transition-duration:0;" + a + "transform:translateZ(0);" + a + "transition-timing-function:ease-out", this.wrapper.appendChild(l), this.slider = l, this.refreshSize(), r =- 1; 2 > r; r++)
                    l = e.createElement("div"), l.style.cssText = a + "transform:translateZ(0);position:absolute;top:0;height:100%;width:100%;" + this.cssPosition + ":" + 100 * r + "%", l.dataset || (l.dataset = {}), u =- 1 == r ? this.options.numberOfPages - 1 : r, l.dataset.pageIndex = u, l.dataset.upcomingPageIndex = u, this.options.loop||-1 != r || (l.style.visibility = "hidden"), this.slider.appendChild(l), this.masterPages.push(l);
                h = this.masterPages[1].className, this.masterPages[1].className = h ? h + " swipeview-active" : "swipeview-active";
                var p = this;
                this.handleEventF = function(t) {
                    p.handleEvent(t)
                }, w(t, g, this.handleEventF, !1), w(this.wrapper, m, this.handleEventF, !1), w(this.wrapper, v, this.handleEventF, !1), w(this.wrapper, _, this.handleEventF, !1), w(this.slider, b, this.handleEventF, !1), "O" == o && w(this.slider, b.toLowerCase(), this.handleEventF, !1), c || w(this.wrapper, "mouseout", this.handleEventF, !1)
            };
            return E.prototype = {
                reset: function(t) {
                    this.goToPage(0), this.updatePageCount(t), this.refreshSize()
                },
                onFlip: function(t) {
                    this.E.bind("flip", t), this.customEvents.push(["flip", t])
                },
                onMoveOut: function(t) {
                    this.E.bind("moveout", t), this.customEvents.push(["moveout", t])
                },
                onMoveIn: function(t) {
                    this.E.bind("movein", t), this.customEvents.push(["movein", t])
                },
                onTouchStart: function(t) {
                    this.E.bind("touchstart", t), this.customEvents.push(["touchstart", t])
                },
                unbind: function() {
                    for (; this.customEvents.length;)
                        this.E.unbind(this.customEvents[0][0], this.customEvents[0][1]), this.customEvents.shift()
                },
                destroy: function() {
                    this.unbind(), k(t, g, this.handleEventF), k(this.wrapper, m, this.handleEventF), k(this.wrapper, v, this.handleEventF), k(this.wrapper, _, this.handleEventF), k(this.slider, b, this.handleEventF), c || k(this.wrapper, "mouseout", this.handleEventF)
                },
                refreshSize: function() {
                    this.wrapperWidth = 0 === this.wrapper.clientWidth ? this.options.clientWidth : this.wrapper.clientWidth, this.wrapperHeight = 0 === this.wrapper.clientHeight ? this.options.clientHeight : this.wrapper.clientHeight, this.wrapperSize = this.options.vertical ? this.wrapperHeight : this.wrapperWidth, this.pageSize = this.options.vertical ? this.wrapperHeight : this.wrapperWidth, this.maxK =- this.options.numberOfPages * this.pageSize + this.wrapperSize, this.snapThreshold = null === this.options.snapThreshold ? Math.round(.15 * this.pageSize) : /%/.test(this.options.snapThreshold) ? Math.round(this.pageSize * this.options.snapThreshold.replace("%", "") / 100) : this.options.snapThreshold
                },
                updatePageCount: function(t) {
                    this.options.numberOfPages = t, this.maxK =- this.options.numberOfPages * this.pageSize + this.wrapperSize
                },
                goToPage: function(t) {
                    var e;
                    for (this.masterPages[this.currentMasterPage].className = this.masterPages[this.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, ""), e = 0; 3 > e; e++)
                        className = this.masterPages[e].className, /(^|\s)swipeview-loading(\s|$)/.test(className) || (this.masterPages[e].className = className ? className + " swipeview-loading" : "swipeview-loading");
                    t = 0 > t ? 0 : t > this.options.numberOfPages - 1 ? this.options.numberOfPages - 1 : t, this.page = t, this.pageIndex = t, this.slider.style[h] = "0s", this.__pos( - t * this.pageSize), this.currentMasterPage = this.page + 1 - 3 * Math.floor((this.page + 1) / 3), this.masterPages[this.currentMasterPage].className = this.masterPages[this.currentMasterPage].className + " swipeview-active";
                    var i = function(t) {
                        return 0 === t ? [2, 0, 1] : 1 === t ? [0, 1, 2] : [1, 2, 0]
                    }(this.currentMasterPage);
                    this.masterPages[i[0]].style[this.cssPosition] = 100 * this.page - 100 + "%", this.masterPages[i[1]].style[this.cssPosition] = 100 * this.page + "%", this.masterPages[i[2]].style[this.cssPosition] = 100 * this.page + 100 + "%", this.masterPages[i[0]].dataset.upcomingPageIndex = 0 === this.page ? this.options.loop ? this.options.numberOfPages - 1 : void 0 : this.page - 1, this.masterPages[i[1]].dataset.upcomingPageIndex = this.page, this.masterPages[i[2]].dataset.upcomingPageIndex = this.page == this.options.numberOfPages - 1 ? this.options.loop ? 0 : void 0 : this.page + 1, this.options.loop || (this.masterPages[i[0]].style.visibility = 0 === this.page ? "hidden" : "", this.masterPages[i[1]].style.visibility = "", this.masterPages[i[2]].style.visibility = this.page === this.options.numberOfPages - 1 ? "hidden" : ""), this.__flip(!0)
                },
                next: function() {
                    (this.options.loop || this.k != this.maxK) && (this.direction =- 1, this.k -= 1, this.__checkPosition())
                },
                prev: function() {
                    (this.options.loop || 0 !== this.k) && (this.direction = 1, this.k += 1, this.__checkPosition())
                },
                handleEvent: function(t) {
                    switch (t.type) {
                    case m:
                        this.__start(t);
                        break;
                    case v:
                        this.__move(t);
                        break;
                    case"mouseout":
                        if (this.initiated) {
                            for (var e = this.wrapper.getElementsByTagName("*"), i = 0; i < e.length; i++)
                                if (t.toElement == e[i])
                                    return;
                            this.__end(t)
                        }
                        break;
                    case y:
                    case _:
                        this.__end(t);
                        break;
                    case g:
                        this.__resize();
                        break;
                    case b:
                    case"otransitionend":
                        t.target != this.slider || this.options.hastyPageFlip || this.__flip()
                    }
                },
                __pos: function(t) {
                    this.k = t, p ? this.slider.style[l] = (this.options.vertical ? "translate(0," + t + "px)" : "translate(" + t + "px,0)") + f : this.options.vertical ? this.slider.style.top = t + "px" : this.slider.style.left = t + "px", d || this.__flip()
                },
                __resize: function() {
                    this.refreshSize(), this.slider.style[h] = "0s", this.__pos( - this.page * this.pageSize)
                },
                __start: function(t) {
                    if (!this.initiated) {
                        var e = c ? t.targetTouches[0]: t;
                        this.initiated=!0, this.identifier = e.identifier, this.moved=!1, this.thresholdExceeded=!1, this.startX = S(e), this.startY = T(e), this.pointX = S(e), this.pointY = T(e), this.stepsX = 0, this.stepsY = 0, this.direction = 0, this.directionLocked=!1, this.slider.style[h] = "0s", this.E.trigger("touchstart")
                    }
                },
                __move: function(t) {
                    if (this.initiated) {
                        var e, i, n;
                        if (c) {
                            for (e = 0, i = t.changedTouches.length; i > e; e++)
                                t.changedTouches.item(e).identifier === this.identifier && (n = t.changedTouches.item(e));
                            if (!n)
                                return
                        } else
                            n = t;
                        var s = S(n) - this.pointX, r = T(n) - this.pointY, o = this.options.vertical ? this.k + r: this.k + s, a = Math.abs(this.options.vertical ? T(n) - this.startY : S(n) - this.startX);
                        if (!(Math.abs(a) >= this.pageSize || (this.moved=!0, this.pointX = S(n), this.pointY = T(n), this.direction = this.options.vertical ? r > 0 ? 1 : 0 > r?-1 : 0 : s > 0 ? 1 : 0 > s?-1 : 0, this.stepsX += Math.abs(s), this.stepsY += Math.abs(r), this.stepsX < 10 && this.stepsY < 10))
                            ) {
                            if (!this.directionLocked && (this.options.vertical ? this.stepsX > this.stepsY : this.stepsY > this.stepsX))
                                return void(this.initiated=!1);
                            x(t), this.directionLocked=!0, !this.options.loop && (o > 0 || o < this.maxC) && (o = this.k + (this.options.vertical ? r : s) / 2), !this.thresholdExceeded && a >= this.snapThreshold ? (this.thresholdExceeded=!0, this.E.trigger("moveout")) : this.thresholdExceeded && a < this.snapThreshold && (this.thresholdExceeded=!1, this.E.trigger("movein")), this.__pos(o)
                        }
                    }
                },
                __end: function(t) {
                    if (this.initiated) {
                        var e;
                        if (c) {
                            for (var i = 0, n = t.touches.length; n > i; i++)
                                if (t.touches.item(i).identifier === this.identifier)
                                    return;
                            for (i = 0, n = t.changedTouches.length; n > i; i++)
                                t.changedTouches.item(i).identifier === this.identifier && (e = t.changedTouches.item(i));
                            if (!e)
                                return this.__pos( - this.page * this.pageSize), void(this.initiated=!1)
                            } else
                                e = t;
                        var s = Math.abs(this.options.vertical ? T(e) - this.startY : S(e) - this.startX);
                        if (this.initiated=!1, this.moved)
                            return !this.options.loop && (this.k > 0 || this.k < this.maxK) && (s = 0, this.E.trigger("movein")), s < this.snapThreshold ? (this.slider.style[h] = Math.floor(300 * s / this.snapThreshold) + "ms", void this.__pos( - this.page * this.pageSize)) : void this.__checkPosition()
                    }
                },
                abort: function() {
                    this.initiated && (this.__pos( - this.page * this.pageSize), this.initiated=!1)
                },
                __checkPosition: function() {
                    var t, e, i;
                    this.masterPages[this.currentMasterPage].className = this.masterPages[this.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, ""), this.direction > 0 ? (this.page =- Math.ceil(this.k / this.pageSize), this.currentMasterPage = this.page + 1 - 3 * Math.floor((this.page + 1) / 3), this.pageIndex = 0 === this.pageIndex ? this.options.numberOfPages - 1 : this.pageIndex - 1, t = this.currentMasterPage - 1, t = 0 > t ? 2 : t, this.masterPages[t].style[this.cssPosition] = 100 * this.page - 100 + "%", e = this.page - 1, e -= Math.floor(e / this.options.numberOfPages) * this.options.numberOfPages, e = e !== this.options.numberOfPages || this.options.loop ? e : void 0) : (this.page =- Math.floor(this.k / this.pageSize), this.currentMasterPage = this.page + 1 - 3 * Math.floor((this.page + 1) / 3), this.pageIndex = this.pageIndex == this.options.numberOfPages - 1 ? 0 : this.pageIndex + 1, t = this.currentMasterPage + 1, t = t > 2 ? 0 : t, this.masterPages[t].style[this.cssPosition] = 100 * this.page + 100 + "%", e = this.page + 1, e -= Math.floor(e / this.options.numberOfPages) * this.options.numberOfPages, e = 0 !== e || this.options.loop ? e : void 0), i = this.masterPages[this.currentMasterPage].className, /(^|\s)swipeview-active(\s|$)/.test(i) || (this.masterPages[this.currentMasterPage].className = i ? i + " swipeview-active" : "swipeview-active"), i = this.masterPages[t].className, /(^|\s)swipeview-loading(\s|$)/.test(i) || (this.masterPages[t].className = i ? i + " swipeview-loading" : "swipeview-loading"), this.masterPages[t].dataset.upcomingPageIndex = e, newC =- this.page * this.pageSize, this.slider.style[h] = Math.floor(this.options.transitionDuration * Math.abs(this.k - newC) / this.pageSize) + "ms", this.options.loop || (this.masterPages[t].style.visibility = 0 === newC || newC == this.maxK ? "hidden" : ""), this.k == newC ? this.__flip() : (this.__pos(newC), this.options.hastyPageFlip && this.__flip())
                },
                __flip: function(t) {
                    this.E.trigger("flip", {
                        triggeredByGoto: !!t
                    });
                    for (var e = 0; 3 > e; e++)
                        this.masterPages[e].className = this.masterPages[e].className.replace(/(^|\s)swipeview-loading(\s|$)/, ""), this.masterPages[e].dataset.pageIndex = this.masterPages[e].dataset.upcomingPageIndex
                }
            }, E
        }(window, document);
        return t
    }), define("hbs!templates/talkGridPage", ["hbs", "hbs/handlebars"], function(t, e) {
        var i = e.template(function(t, e, i) {
            this.compilerInfo = [4, ">= 1.0.0"], i = this.merge(i, t.helpers);
            var n = "";
            return n += '\n\n<div class="talk-grid__page__inner">\n  <div class="talk-grid__page__content">\n  </div>\n</div>\n'
        });
        return i
    }), define("templates/helpers/c", ["Handlebars", "jquery"], function(t, e) {
        "use strict";
        function i(t) {
            return t = e("<div></div>").html(t).text(), t.replace(/--/g, "—")
        }
        return t.registerHelper("c", i), i
    }), define("utils/formatDuration", [], function() {
        "use strict";
        function t(t) {
            return (t > 9 ? "" : "0") + t
        }
        return function(e) {
            var i = e%60 | 0, n = e / 3600 | 0, s = e%3600 / 60 | 0;
            return (n ? n + ":" + t(s) : s) + ":" + t(i)
        }
    }), define("templates/helpers/formatDuration", ["Handlebars", "utils/formatDuration"], function(t, e) {
        "use strict";
        t.registerHelper("formatDuration", e)
    }), define("templates/helpers/compactNumber", ["Handlebars"], function(t) {
        "use strict";
        function e(t) {
            var e = Math.floor(t) + "";
            if (10 > t) {
                var i = Math.floor(t%1 * 10);
                e += i > 0 ? "." + i : ""
            }
            return e
        }
        function i(t) {
            return t = 0 + t, Math.floor(t / n) > 0 ? e(t / n) + "M" : Math.floor(t / s) > 0 ? e(t / s) + "K" : Math.floor(t) + ""
        }
        var n = 1e6, s = 1e3;
        return t.registerHelper("compactNumber", i), i
    }), function(t) {
        function e(t, e) {
            return function(i) {
                return l(t.call(this, i), e)
            }
        }
        function i(t, e) {
            return function(i) {
                return this.lang().ordinal(t.call(this, i), e)
            }
        }
        function n() {}
        function s(t) {
            o(this, t)
        }
        function r(t) {
            var e = t.years || t.year || t.y || 0, i = t.months || t.month || t.M || 0, n = t.weeks || t.week || t.w || 0, s = t.days || t.day || t.d || 0, r = t.hours || t.hour || t.h || 0, o = t.minutes || t.minute || t.m || 0, a = t.seconds || t.second || t.s || 0, l = t.milliseconds || t.millisecond || t.ms || 0;
            this._input = t, this._milliseconds = l + 1e3 * a + 6e4 * o + 36e5 * r, this._days = s + 7 * n, this._months = i + 12 * e, this._data = {}, this._bubble()
        }
        function o(t, e) {
            for (var i in e)
                e.hasOwnProperty(i) && (t[i] = e[i]);
            return t
        }
        function a(t) {
            return 0 > t ? Math.ceil(t) : Math.floor(t)
        }
        function l(t, e) {
            for (var i = t + ""; i.length < e;)
                i = "0" + i;
            return i
        }
        function h(t, e, i, n) {
            var s, r, o = e._milliseconds, a = e._days, l = e._months;
            o && t._d.setTime( + t._d + o * i), (a || l) && (s = t.minute(), r = t.hour()), a && t.date(t.date() + a * i), l && t.month(t.month() + l * i), o&&!n && I.updateOffset(t), (a || l) && (t.minute(s), t.hour(r))
        }
        function u(t) {
            return "[object Array]" === Object.prototype.toString.call(t)
        }
        function c(t, e) {
            var i, n = Math.min(t.length, e.length), s = Math.abs(t.length - e.length), r = 0;
            for (i = 0; n > i; i++)
                ~~t[i]!==~~e[i] && r++;
            return r + s
        }
        function p(t) {
            return t ? se[t] || t.toLowerCase().replace(/(.)s$/, "$1") : t
        }
        function d(t, e) {
            return e.abbr = t, H[t] || (H[t] = new n), H[t].set(e), H[t]
        }
        function f(t) {
            if (!t)
                return I.fn._lang;
            if (!H[t] && L)
                try {
                    require("./lang/" + t)
            } catch (e) {
                return I.fn._lang
            }
            return H[t]
        }
        function g(t) {
            return t.match(/\[.*\]/) ? t.replace(/^\[|\]$/g, "") : t.replace(/\\/g, "")
        }
        function m(t) {
            var e, i, n = t.match(Y);
            for (e = 0, i = n.length; i > e; e++)
                n[e] = le[n[e]] ? le[n[e]] : g(n[e]);
            return function(s) {
                var r = "";
                for (e = 0; i > e; e++)
                    r += n[e]instanceof Function ? n[e].call(s, t) : n[e];
                return r
            }
        }
        function v(t, e) {
            function i(e) {
                return t.lang().longDateFormat(e) || e
            }
            for (var n = 5; n--&&U.test(e);)
                e = e.replace(U, i);
            return re[e] || (re[e] = m(e)), re[e](t)
        }
        function _(t, e) {
            switch (t) {
            case"DDDD":
                return R;
            case"YYYY":
                return V;
            case"YYYYY":
                return B;
            case"S":
            case"SS":
            case"SSS":
            case"DDD":
                return q;
            case"MMM":
            case"MMMM":
            case"dd":
            case"ddd":
            case"dddd":
                return G;
            case"a":
            case"A":
                return f(e._l)._meridiemParse;
            case"X":
                return Z;
            case"Z":
            case"ZZ":
                return J;
            case"T":
                return X;
            case"MM":
            case"DD":
            case"YY":
            case"HH":
            case"hh":
            case"mm":
            case"ss":
            case"M":
            case"D":
            case"d":
            case"H":
            case"h":
            case"m":
            case"s":
                return W;
            default:
                return new RegExp(t.replace("\\", ""))
            }
        }
        function y(t) {
            var e = (J.exec(t) || [])[0], i = (e + "").match(ee) || ["-", 0, 0], n =+ (60 * i[1])+~~i[2];
            return "+" === i[0]?-n : n
        }
        function b(t, e, i) {
            var n, s = i._a;
            switch (t) {
            case"M":
            case"MM":
                s[1] = null == e ? 0 : ~~e - 1;
                break;
            case"MMM":
            case"MMMM":
                n = f(i._l).monthsParse(e), null != n ? s[1] = n : i._isValid=!1;
                break;
            case"D":
            case"DD":
            case"DDD":
            case"DDDD":
                null != e && (s[2]=~~e);
                break;
            case"YY":
                s[0]=~~e + (~~e > 68 ? 1900 : 2e3);
                break;
            case"YYYY":
            case"YYYYY":
                s[0]=~~e;
                break;
            case"a":
            case"A":
                i._isPm = f(i._l).isPM(e);
                break;
            case"H":
            case"HH":
            case"h":
            case"hh":
                s[3]=~~e;
                break;
            case"m":
            case"mm":
                s[4]=~~e;
                break;
            case"s":
            case"ss":
                s[5]=~~e;
                break;
            case"S":
            case"SS":
            case"SSS":
                s[6]=~~(1e3 * ("0." + e));
                break;
            case"X":
                i._d = new Date(1e3 * parseFloat(e));
                break;
            case"Z":
            case"ZZ":
                i._useUTC=!0, i._tzm = y(e)
            }
            null == e && (i._isValid=!1)
        }
        function w(t) {
            var e, i, n = [];
            if (!t._d) {
                for (e = 0; 7 > e; e++)
                    t._a[e] = n[e] = null == t._a[e] ? 2 === e ? 1 : 0 : t._a[e];
                n[3]+=~~((t._tzm || 0) / 60), n[4]+=~~((t._tzm || 0)%60), i = new Date(0), t._useUTC ? (i.setUTCFullYear(n[0], n[1], n[2]), i.setUTCHours(n[3], n[4], n[5], n[6])) : (i.setFullYear(n[0], n[1], n[2]), i.setHours(n[3], n[4], n[5], n[6])), t._d = i
            }
        }
        function k(t) {
            var e, i, n = t._f.match(Y), s = t._i;
            for (t._a = [], e = 0; e < n.length; e++)
                i = (_(n[e], t).exec(s) || [])[0], i && (s = s.slice(s.indexOf(i) + i.length)), le[n[e]] && b(n[e], i, t);
            s && (t._il = s), t._isPm && t._a[3] < 12 && (t._a[3] += 12), t._isPm===!1 && 12 === t._a[3] && (t._a[3] = 0), w(t)
        }
        function x(t) {
            var e, i, n, r, a, l = 99;
            for (r = 0; r < t._f.length; r++)
                e = o({}, t), e._f = t._f[r], k(e), i = new s(e), a = c(e._a, i.toArray()), i._il && (a += i._il.length), l > a && (l = a, n = i);
            o(t, n)
        }
        function S(t) {
            var e, i = t._i, n = K.exec(i);
            if (n) {
                for (t._f = "YYYY-MM-DD" + (n[2] || " "), e = 0; 4 > e; e++)
                    if (te[e][1].exec(i)) {
                        t._f += te[e][0];
                        break
                    }
                J.exec(i) && (t._f += " Z"), k(t)
            } else
                t._d = new Date(i)
        }
        function T(e) {
            var i = e._i, n = F.exec(i);
            i === t ? e._d = new Date : n ? e._d = new Date( + n[1]) : "string" == typeof i ? S(e) : u(i) ? (e._a = i.slice(0), w(e)) : e._d = new Date(i instanceof Date?+i : i)
        }
        function C(t, e, i, n, s) {
            return s.relativeTime(e || 1, !!i, t, n)
        }
        function E(t, e, i) {
            var n = j(Math.abs(t) / 1e3), s = j(n / 60), r = j(s / 60), o = j(r / 24), a = j(o / 365), l = 45 > n && ["s", n] || 1 === s && ["m"] || 45 > s && ["mm", s] || 1 === r && ["h"] || 22 > r && ["hh", r] || 1 === o && ["d"] || 25 >= o && ["dd", o] || 45 >= o && ["M"] || 345 > o && ["MM", j(o / 30)] || 1 === a && ["y"] || ["yy", a];
            return l[2] = e, l[3] = t > 0, l[4] = i, C.apply({}, l)
        }
        function P(t, e, i) {
            var n, s = i - e, r = i - t.day();
            return r > s && (r -= 7), s - 7 > r && (r += 7), n = I(t).add("d", r), {
                week: Math.ceil(n.dayOfYear() / 7),
                year: n.year()
            }
        }
        function D(t) {
            var e = t._i, i = t._f;
            return null === e || "" === e ? null : ("string" == typeof e && (t._i = e = f().preparse(e)), I.isMoment(e) ? (t = o({}, e), t._d = new Date( + e._d)) : i ? u(i) ? x(t) : k(t) : T(t), new s(t))
        }
        function M(t, e) {
            I.fn[t] = I.fn[t + "s"] = function(t) {
                var i = this._isUTC ? "UTC": "";
                return null != t ? (this._d["set" + i + e](t), I.updateOffset(this), this) : this._d["get" + i + e]()
            }
        }
        function N(t) {
            I.duration.fn[t] = function() {
                return this._data[t]
            }
        }
        function O(t, e) {
            I.duration.fn["as" + t] = function() {
                return + this / e
            }
        }
        for (var I, A, $ = "2.1.0", j = Math.round, H = {}, L = "undefined" != typeof module && module.exports, F = /^\/?Date\((\-?\d+)/i, z = /(\-)?(\d*)?\.?(\d+)\:(\d+)\:(\d+)\.?(\d{3})?/, Y = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g, U = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, W = /\d\d?/, q = /\d{1,3}/, R = /\d{3}/, V = /\d{1,4}/, B = /[+\-]?\d{1,6}/, G = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, J = /Z|[\+\-]\d\d:?\d\d/i, X = /T/i, Z = /[\+\-]?\d+(\.\d{1,3})?/, K = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/, Q = "YYYY-MM-DDTHH:mm:ssZ", te = [["HH:mm:ss.S", /(T| )\d\d:\d\d:\d\d\.\d{1,3}/], ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/], ["HH:mm", /(T| )\d\d:\d\d/], ["HH", /(T| )\d\d/]], ee = /([\+\-]|\d\d)/gi, ie = "Date|Hours|Minutes|Seconds|Milliseconds".split("|")
            , ne = {
            Milliseconds: 1,
            Seconds: 1e3,
            Minutes: 6e4,
            Hours: 36e5,
            Days: 864e5,
            Months: 2592e6,
            Years: 31536e6
        }, se = {
            ms: "millisecond",
            s: "second",
            m: "minute",
            h: "hour",
            d: "day",
            w: "week",
            M: "month",
            y: "year"
        }, re = {}, oe = "DDD w W M D d".split(" "), ae = "M D H h m s w W".split(" "), le = {
            M: function() {
                return this.month() + 1
            },
            MMM: function(t) {
                return this.lang().monthsShort(this, t)
            },
            MMMM: function(t) {
                return this.lang().months(this, t)
            },
            D: function() {
                return this.date()
            },
            DDD: function() {
                return this.dayOfYear()
            },
            d: function() {
                return this.day()
            },
            dd: function(t) {
                return this.lang().weekdaysMin(this, t)
            },
            ddd: function(t) {
                return this.lang().weekdaysShort(this, t)
            },
            dddd: function(t) {
                return this.lang().weekdays(this, t)
            },
            w: function() {
                return this.week()
            },
            W: function() {
                return this.isoWeek()
            },
            YY: function() {
                return l(this.year()%100, 2)
            },
            YYYY: function() {
                return l(this.year(), 4)
            },
            YYYYY: function() {
                return l(this.year(), 5)
            },
            gg: function() {
                return l(this.weekYear()%100, 2)
            },
            gggg: function() {
                return this.weekYear()
            },
            ggggg: function() {
                return l(this.weekYear(), 5)
            },
            GG: function() {
                return l(this.isoWeekYear()%100, 2)
            },
            GGGG: function() {
                return this.isoWeekYear()
            },
            GGGGG: function() {
                return l(this.isoWeekYear(), 5)
            },
            e: function() {
                return this.weekday()
            },
            E: function() {
                return this.isoWeekday()
            },
            a: function() {
                return this.lang().meridiem(this.hours(), this.minutes(), !0)
            },
            A: function() {
                return this.lang().meridiem(this.hours(), this.minutes(), !1)
            },
            H: function() {
                return this.hours()
            },
            h: function() {
                return this.hours()%12 || 12
            },
            m: function() {
                return this.minutes()
            },
            s: function() {
                return this.seconds()
            },
            S: function() {
                return ~~(this.milliseconds() / 100)
            },
            SS: function() {
                return l(~~(this.milliseconds() / 10), 2)
            },
            SSS: function() {
                return l(this.milliseconds(), 3)
            },
            Z: function() {
                var t =- this.zone(), e = "+";
                return 0 > t && (t =- t, e = "-"), e + l(~~(t / 60), 2) + ":" + l(~~t%60, 2)
            },
            ZZ: function() {
                var t =- this.zone(), e = "+";
                return 0 > t && (t =- t, e = "-"), e + l(~~(10 * t / 6), 4)
            },
            z: function() {
                return this.zoneAbbr()
            },
            zz: function() {
                return this.zoneName()
            },
            X: function() {
                return this.unix()
            }
        };
        oe.length;
        )A = oe.pop(), le[A + "o"] = i(le[A], A);
        for (; ae.length;)
            A = ae.pop(), le[A + A] = e(le[A], 2);
        for (le.DDDD = e(le.DDD, 3), n.prototype = {
            set: function(t) {
                var e, i;
                for (i in t)
                    e = t[i], "function" == typeof e ? this[i] = e : this["_" + i] = e
            },
            _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            months: function(t) {
                return this._months[t.month()]
            },
            _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            monthsShort: function(t) {
                return this._monthsShort[t.month()]
            },
            monthsParse: function(t) {
                var e, i, n;
                for (this._monthsParse || (this._monthsParse = []), e = 0; 12 > e; e++)
                    if (this._monthsParse[e] || (i = I([2e3, e]), n = "^" + this.months(i, "") + "|^" + this.monthsShort(i, ""), this._monthsParse[e] = new RegExp(n.replace(".", ""), "i")), this._monthsParse[e].test(t))
                        return e
            },
            _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdays: function(t) {
                return this._weekdays[t.day()]
            },
            _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysShort: function(t) {
                return this._weekdaysShort[t.day()]
            },
            _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            weekdaysMin: function(t) {
                return this._weekdaysMin[t.day()]
            },
            weekdaysParse: function(t) {
                var e, i, n;
                for (this._weekdaysParse || (this._weekdaysParse = []), e = 0; 7 > e; e++)
                    if (this._weekdaysParse[e] || (i = I([2e3, 1]).day(e), n = "^" + this.weekdays(i, "") + "|^" + this.weekdaysShort(i, "") + "|^" + this.weekdaysMin(i, ""), this._weekdaysParse[e] = new RegExp(n.replace(".", ""), "i")), this._weekdaysParse[e].test(t))
                        return e
            },
            _longDateFormat: {
                LT: "h:mm A",
                L: "MM/DD/YYYY",
                LL: "MMMM D YYYY",
                LLL: "MMMM D YYYY LT",
                LLLL: "dddd, MMMM D YYYY LT"
            },
            longDateFormat: function(t) {
                var e = this._longDateFormat[t];
                return !e && this._longDateFormat[t.toUpperCase()] && (e = this._longDateFormat[t.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(t) {
                    return t.slice(1)
                }), this._longDateFormat[t] = e), e
            },
            isPM: function(t) {
                return "p" === (t + "").toLowerCase()[0]
            },
            _meridiemParse: /[ap]\.?m?\.?/i,
            meridiem: function(t, e, i) {
                return t > 11 ? i ? "pm" : "PM" : i ? "am" : "AM"
            },
            _calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            calendar: function(t, e) {
                var i = this._calendar[t];
                return "function" == typeof i ? i.apply(e) : i
            },
            _relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            relativeTime: function(t, e, i, n) {
                var s = this._relativeTime[i];
                return "function" == typeof s ? s(t, e, i, n) : s.replace(/%d/i, t)
            },
            pastFuture: function(t, e) {
                var i = this._relativeTime[t > 0 ? "future": "past"];
                return "function" == typeof i ? i(e) : i.replace(/%s/i, e)
            },
            ordinal: function(t) {
                return this._ordinal.replace("%d", t)
            },
            _ordinal: "%d",
            preparse: function(t) {
                return t
            },
            postformat: function(t) {
                return t
            },
            week: function(t) {
                return P(t, this._week.dow, this._week.doy).week
            },
            _week: {
                dow: 0,
                doy: 6
            }
        }, I = function(t, e, i) {
            return D({
                _i: t,
                _f: e,
                _l: i,
                _isUTC: !1
            })
        }, I.utc = function(t, e, i) {
            return D({
                _useUTC: !0,
                _isUTC: !0,
                _l: i,
                _i: t,
                _f: e
            })
        }, I.unix = function(t) {
            return I(1e3 * t)
        }, I.duration = function(t, e) {
            var i, n, s = I.isDuration(t), o = "number" == typeof t, a = s ? t._input: o ? {}
            : t, l = z.exec(t);
            return o ? e ? a[e] = t : a.milliseconds = t : l && (i = "-" === l[1]?-1 : 1, a = {
                y : 0, d : ~~l[2] * i, h : ~~l[3] * i, m : ~~l[4] * i, s : ~~l[5] * i, ms : ~~l[6] * i
            }), n = new r(a), s && t.hasOwnProperty("_lang") && (n._lang = t._lang), n
        }, I.version = $, I.defaultFormat = Q, I.updateOffset = function() {}, I.lang = function(t, e) {
            return t ? (e ? d(t, e) : H[t] || f(t), void(I.duration.fn._lang = I.fn._lang = f(t))) : I.fn._lang._abbr
        }, I.langData = function(t) {
            return t && t._lang && t._lang._abbr && (t = t._lang._abbr), f(t)
        }, I.isMoment = function(t) {
            return t instanceof s
        }, I.isDuration = function(t) {
            return t instanceof r
        }, I.fn = s.prototype = {
            clone: function() {
                return I(this)
            },
            valueOf: function() {
                return + this._d + 6e4 * (this._offset || 0)
            },
            unix: function() {
                return Math.floor( + this / 1e3)
            },
            toString: function() {
                return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
            },
            toDate: function() {
                return this._offset ? new Date( + this) : this._d
            },
            toISOString: function() {
                return v(I(this).utc(), "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
            },
            toArray: function() {
                var t = this;
                return [t.year(), t.month(), t.date(), t.hours(), t.minutes(), t.seconds(), t.milliseconds()]
            },
            isValid: function() {
                return null == this._isValid && (this._isValid = this._a?!c(this._a, (this._isUTC ? I.utc(this._a) : I(this._a)).toArray()) : !isNaN(this._d.getTime())), !!this._isValid
            },
            utc: function() {
                return this.zone(0)
            },
            local: function() {
                return this.zone(0), this._isUTC=!1, this
            },
            format: function(t) {
                var e = v(this, t || I.defaultFormat);
                return this.lang().postformat(e)
            },
            add: function(t, e) {
                var i;
                return i = "string" == typeof t ? I.duration( + e, t) : I.duration(t, e), h(this, i, 1), this
            },
            subtract: function(t, e) {
                var i;
                return i = "string" == typeof t ? I.duration( + e, t) : I.duration(t, e), h(this, i, - 1), this
            },
            diff: function(t, e, i) {
                var n, s, r = this._isUTC ? I(t).zone(this._offset || 0): I(t).local(), o = 6e4 * (this.zone() - r.zone());
                return e = p(e), "year" === e || "month" === e ? (n = 432e5 * (this.daysInMonth() + r.daysInMonth()), s = 12 * (this.year() - r.year()) + (this.month() - r.month()), s += (this - I(this).startOf("month") - (r - I(r).startOf("month"))) / n, s -= 6e4 * (this.zone() - I(this).startOf("month").zone() - (r.zone() - I(r).startOf("month").zone())) / n, "year" === e && (s/=12)) : (n = this - r, s = "second" === e ? n / 1e3 : "minute" === e ? n / 6e4 : "hour" === e ? n / 36e5 : "day" === e ? (n - o) / 864e5 : "week" === e ? (n - o) / 6048e5 : n), i ? s : a(s)
            },
            from: function(t, e) {
                return I.duration(this.diff(t)).lang(this.lang()._abbr).humanize(!e)
            },
            fromNow: function(t) {
                return this.from(I(), t)
            },
            calendar: function() {
                var t = this.diff(I().startOf("day"), "days", !0), e =- 6 > t ? "sameElse" : - 1 > t ? "lastWeek" : 0 > t ? "lastDay" : 1 > t ? "sameDay" : 2 > t ? "nextDay" : 7 > t ? "nextWeek" : "sameElse";
                return this.format(this.lang().calendar(e, this))
            },
            isLeapYear: function() {
                var t = this.year();
                return t%4 === 0 && t%100 !== 0 || t%400 === 0
            },
            isDST: function() {
                return this.zone() < this.clone().month(0).zone() || this.zone() < this.clone().month(5).zone()
            },
            day: function(t) {
                var e = this._isUTC ? this._d.getUTCDay(): this._d.getDay();
                return null != t ? "string" == typeof t && (t = this.lang().weekdaysParse(t), "number" != typeof t) ? this : this.add({
                    d: t - e
                }) : e
            },
            month: function(t) {
                var e, i = this._isUTC ? "UTC": "";
                return null != t ? "string" == typeof t && (t = this.lang().monthsParse(t), "number" != typeof t) ? this : (e = this.date(), this.date(1), this._d["set" + i + "Month"](t), this.date(Math.min(e, this.daysInMonth())), I.updateOffset(this), this) : this._d["get" + i + "Month"]()
            },
            startOf: function(t) {
                switch (t = p(t)) {
                case"year":
                    this.month(0);
                case"month":
                    this.date(1);
                case"week":
                case"day":
                    this.hours(0);
                case"hour":
                    this.minutes(0);
                case"minute":
                    this.seconds(0);
                case"second":
                    this.milliseconds(0)
                }
                return "week" === t && this.weekday(0), this
            },
            endOf: function(t) {
                return this.startOf(t).add(t, 1).subtract("ms", 1)
            },
            isAfter: function(t, e) {
                return e = "undefined" != typeof e ? e : "millisecond", + this.clone().startOf(e)>+I(t).startOf(e)
            },
            isBefore: function(t, e) {
                return e = "undefined" != typeof e ? e : "millisecond", + this.clone().startOf(e)<+I(t).startOf(e)
            },
            isSame: function(t, e) {
                return e = "undefined" != typeof e ? e : "millisecond", + this.clone().startOf(e) ===+ I(t).startOf(e)
            },
            min: function(t) {
                return t = I.apply(null, arguments), this > t ? this : t
            },
            max: function(t) {
                return t = I.apply(null, arguments), t > this ? this : t
            },
            zone: function(t) {
                var e = this._offset || 0;
                return null == t ? this._isUTC ? e : this._d.getTimezoneOffset() : ("string" == typeof t && (t = y(t)), Math.abs(t) < 16 && (t = 60 * t), this._offset = t, this._isUTC=!0, e !== t && h(this, I.duration(e - t, "m"), 1, !0), this)
            },
            zoneAbbr: function() {
                return this._isUTC ? "UTC" : ""
            },
            zoneName: function() {
                return this._isUTC ? "Coordinated Universal Time" : ""
            },
            daysInMonth: function() {
                return I.utc([this.year(), this.month() + 1, 0]).date()
            },
            dayOfYear: function(t) {
                var e = j((I(this).startOf("day") - I(this).startOf("year")) / 864e5) + 1;
                return null == t ? e : this.add("d", t - e)
            },
            weekYear: function(t) {
                var e = P(this, this.lang()._week.dow, this.lang()._week.doy).year;
                return null == t ? e : this.add("y", t - e)
            },
            isoWeekYear: function(t) {
                var e = P(this, 1, 4).year;
                return null == t ? e : this.add("y", t - e)
            },
            week: function(t) {
                var e = this.lang().week(this);
                return null == t ? e : this.add("d", 7 * (t - e))
            },
            isoWeek: function(t) {
                var e = P(this, 1, 4).week;
                return null == t ? e : this.add("d", 7 * (t - e))
            },
            weekday: function(t) {
                var e = (this._d.getDay() + 7 - this.lang()._week.dow)%7;
                return null == t ? e : this.add("d", t - e)
            },
            isoWeekday: function(t) {
                return null == t ? this.day() || 7 : this.day(this.day()%7 ? t : t - 7)
            },
            lang: function(e) {
                return e === t ? this._lang : (this._lang = f(e), this)
            }
        }, A = 0; A < ie.length; A++)
            M(ie[A].toLowerCase().replace(/s$/, ""), ie[A]);
        M("year", "FullYear"), I.fn.days = I.fn.day, I.fn.months = I.fn.month, I.fn.weeks = I.fn.week, I.fn.isoWeeks = I.fn.isoWeek, I.fn.toJSON = I.fn.toISOString, I.duration.fn = r.prototype = {
            _bubble: function() {
                var t, e, i, n, s = this._milliseconds, r = this._days, o = this._months, l = this._data;
                l.milliseconds = s%1e3, t = a(s / 1e3), l.seconds = t%60, e = a(t / 60), l.minutes = e%60, i = a(e / 60), l.hours = i%24, r += a(i / 24), l.days = r%30, o += a(r / 30), l.months = o%12, n = a(o / 12), l.years = n
            },
            weeks: function() {
                return a(this.days() / 7)
            },
            valueOf: function() {
                return this._milliseconds + 864e5 * this._days + this._months%12 * 2592e6 + 31536e6*~~(this._months / 12)
            },
            humanize: function(t) {
                var e =+ this, i = E(e, !t, this.lang());
                return t && (i = this.lang().pastFuture(e, i)), this.lang().postformat(i)
            },
            add: function(t, e) {
                var i = I.duration(t, e);
                return this._milliseconds += i._milliseconds, this._days += i._days, this._months += i._months, this._bubble(), this
            },
            subtract: function(t, e) {
                var i = I.duration(t, e);
                return this._milliseconds -= i._milliseconds, this._days -= i._days, this._months -= i._months, this._bubble(), this
            },
            get: function(t) {
                return t = p(t), this[t.toLowerCase() + "s"]()
            },
            as: function(t) {
                return t = p(t), this["as" + t.charAt(0).toUpperCase() + t.slice(1) + "s"]()
            },
            lang: I.fn.lang
        };
        for (A in ne)
            ne.hasOwnProperty(A) && (O(A, ne[A]), N(A.toLowerCase()));
        O("Weeks", 6048e5), I.duration.fn.asMonths = function() {
            return ( + this - 31536e6 * this.years()) / 2592e6 + 12 * this.years()
        }, I.lang("en", {
            ordinal: function(t) {
                var e = t%10, i = 1===~~(t%100 / 10) ? "th": 1 === e ? "st": 2 === e ? "nd": 3 === e ? "rd": "th";
                return t + i
            }
        }), L && (module.exports = I), "undefined" == typeof ender && (this.moment = I), "function" == typeof define && define.amd && define("moment", [], function() {
            return I
        })
    }.call(this), define("templates/helpers/formatDate", ["Handlebars", "moment"], function(t, e) {
        "use strict";
        t.registerHelper("formatDate", function(t, i) {
            return e(i || void 0).format(t)
        })
    }), define("hbs!templates/talkGridTile", ["hbs", "hbs/handlebars", "templates/helpers/c", "templates/helpers/formatDuration", "templates/helpers/compactNumber", "templates/helpers/formatDate"], function(t, e) {
        var i = e.template(function(t, e, i, n, s) {
            function r() {
                return '\n        <div class="talk-grid__tile__marker">\n          Today\'s Talk\n        </div>\n      '
            }
            function o(t) {
                var e, n, s = "";
                return s += '\n              &bull;\n              <span class="meta__val">' + d((e = i.compactNumber || t && t.compactNumber, n = {
                    hash: {}
                }, e ? e.call(t, t && t.views, n) : p.call(t, "compactNumber", t && t.views, n))) + " views</span>\n            "
            }
            function a(t) {
                var e, n, s = "";
                return s += '\n              &bull;\n              <span class="meta__val">' + d((e = i.formatDate || t && t.formatDate, n = {
                    hash: {}
                }, e ? e.call(t, "MMM YYYY", t && t.posted, n) : p.call(t, "formatDate", "MMM YYYY", t && t.posted, n))) + "</span>\n            "
            }
            this.compilerInfo = [4, ">= 1.0.0"], i = this.merge(i, t.helpers);
            var l, h, u, c = "", p = i.helperMissing, d = this.escapeExpression, f = "function", g = this;
            return c += '\n\n<div class="talk-grid__tile__inner">\n  <div class="talk-grid__tile__frame">\n    <div class="talk-grid__tile__content">\n      <img class="talk-grid__tile__thumb" src="', (h = i.thumb) ? l = h.call(e, {
                hash: {}
            }) : (h = e && e.thumb, l = typeof h === f ? h.call(e, {
                hash: {}
            }) : h), c += d(l) + '">\n\n      <div class="talk-grid__tile__overlay"></div>\n\n      ', l = i["if"].call(e, e && e.isTodaysTalk, {
                hash: {},
                inverse: g.noop,
                fn: g.program(1, r, s)
            }), (l || 0 === l) && (c += l), c += '\n\n      <div class="talk-grid__tile__details">\n        <div class="talk-grid__tile__details__speaker">' + d((h = i.c || e && e.c, u = {
                hash: {}
            }, h ? h.call(e, e && e.speaker, u) : p.call(e, "c", e && e.speaker, u))) + '</div>\n        <h3 class="talk-grid__tile__details__title">' + d((h = i.c || e && e.c, u = {
                hash: {}
            }, h ? h.call(e, e && e.title, u) : p.call(e, "c", e && e.title, u))) + '</h3>\n\n        <div class="talk-grid__tile__supplementary">\n          <div class="meta talk-grid__tile__meta">\n            <span class="meta__val">' + d((h = i.formatDuration || e && e.formatDuration, u = {
                hash: {}
            }, h ? h.call(e, e && e.duration, u) : p.call(e, "formatDuration", e && e.duration, u))) + "</span>\n            ", l = i["if"].call(e, e && e.views, {
                hash: {},
                inverse: g.noop,
                fn: g.program(3, o, s)
            }), (l || 0 === l) && (c += l), c += "\n            ", l = i["if"].call(e, e && e.posted, {
                hash: {},
                inverse: g.noop,
                fn: g.program(5, a, s)
            }), (l || 0 === l) && (c += l), c += '\n          </div>\n\n          <div class="talk-grid__tile__description">', h = i.c || e && e.c, u = {
                hash: {}
            }, l = h ? h.call(e, e && e.description, u) : p.call(e, "c", e && e.description, u), (l || 0 === l) && (c += l), c += "</div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n"
        });
        return i
    }), define("crushinator", ["exports"], function(t) {
        "use strict";
        function e(t, e) {
            return t = i(t), n(t) ? "https://tedcdnpi-a.akamaihd.net/r/" + t.replace(/.*\/\//, "") + "?" + (e || "") : t
        }
        function i(t) {
            for (var e=!0; e;) {
                i = void 0, e=!1;
                var i, n = t;
                if (i = n.match(/(.+)?\/\/(?:img(?:-ssl)?\.tedcdn\.com|tedcdnpi-a\.akamaihd\.net)\/r\/([^?]+)/), !i)
                    return n;
                t = i[1] + "//" + i[2], e=!0
            }
        }
        function n(t) {
            return !!t.match(/(tedcdn|(images|storage)\.ted|s3.amazonaws)\.com/)
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.crush = e, t.uncrush = i, t.crushable = n, t["default"] = e
    }), define("templates/helpers/crushinator", ["Handlebars", "crushinator"], function(t, e) {
        "use strict";
        return t.registerHelper("crushinator", e.crush), e.crush
    }), define("Modernizr", [], function() {
        "use strict";
        return window.Modernizr
    }), define("transit", ["jquery"], function(t) {
        return function(t) {
            function e(t) {
                if (t in c.style)
                    return t;
                var e = ["Moz", "Webkit", "O", "ms"], i = t.charAt(0).toUpperCase() + t.substr(1);
                if (t in c.style)
                    return t;
                for (var n = 0; n < e.length; ++n) {
                    var s = e[n] + i;
                    if (s in c.style)
                        return s
                }
            }
            function i() {
                return c.style[p.transform] = "", c.style[p.transform] = "rotateY(90deg)", "" !== c.style[p.transform]
            }
            function n(t) {
                return "string" == typeof t && this.parse(t), this
            }
            function s(t, e, i) {
                e===!0 ? t.queue(i) : e ? t.queue(e, i) : i()
            }
            function r(e) {
                var i = [];
                return t.each(e, function(e) {
                    e = t.camelCase(e), e = t.transit.propertyMap[e] || t.cssProps[e] || e, e = l(e), - 1 === t.inArray(e, i) && i.push(e)
                }), i
            }
            function o(e, i, n, s) {
                var o = r(e);
                t.cssEase[n] && (n = t.cssEase[n]);
                var a = "" + u(i) + " " + n;
                parseInt(s, 10) > 0 && (a += " " + u(s));
                var l = [];
                return t.each(o, function(t, e) {
                    l.push(e + " " + a)
                }), l.join(", ")
            }
            function a(e, i) {
                i || (t.cssNumber[e]=!0), t.transit.propertyMap[e] = p.transform, t.cssHooks[e] = {
                    get: function(i) {
                        var n = t(i).css("transit:transform");
                        return n.get(e)
                    },
                    set: function(i, n) {
                        var s = t(i).css("transit:transform");
                        s.setFromString(e, n), t(i).css({
                            "transit:transform": s
                        })
                    }
                }
            }
            function l(t) {
                return t.replace(/([A-Z])/g, function(t) {
                    return "-" + t.toLowerCase()
                })
            }
            function h(t, e) {
                return "string" != typeof t || t.match(/^[\-0-9\.]+$/) ? "" + t + e : t
            }
            function u(e) {
                var i = e;
                return t.fx.speeds[i] && (i = t.fx.speeds[i]), h(i, "ms")
            }
            t.transit = {
                version: "0.9.9",
                propertyMap: {
                    marginLeft: "margin",
                    marginRight: "margin",
                    marginBottom: "margin",
                    marginTop: "margin",
                    paddingLeft: "padding",
                    paddingRight: "padding",
                    paddingBottom: "padding",
                    paddingTop: "padding"
                },
                enabled: !0,
                useTransitionEnd: !1
            };
            var c = document.createElement("div"), p = {}, d = navigator.userAgent.toLowerCase().indexOf("chrome")>-1;
            p.transition = e("transition"), p.transitionDelay = e("transitionDelay"), p.transform = e("transform"), p.transformOrigin = e("transformOrigin"), p.transform3d = i();
            var f = {
                transition: "transitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd",
                WebkitTransition: "webkitTransitionEnd",
                msTransition: "MSTransitionEnd"
            }, g = p.transitionEnd = f[p.transition] || null;
            for (var m in p)
                p.hasOwnProperty(m) && "undefined" == typeof t.support[m] && (t.support[m] = p[m]);
            c = null, t.cssEase = {
                _default: "ease",
                "in": "ease-in",
                out: "ease-out",
                "in-out": "ease-in-out",
                snap: "cubic-bezier(0,1,.5,1)",
                easeOutCubic: "cubic-bezier(.215,.61,.355,1)",
                easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",
                easeInCirc: "cubic-bezier(.6,.04,.98,.335)",
                easeOutCirc: "cubic-bezier(.075,.82,.165,1)",
                easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",
                easeInExpo: "cubic-bezier(.95,.05,.795,.035)",
                easeOutExpo: "cubic-bezier(.19,1,.22,1)",
                easeInOutExpo: "cubic-bezier(1,0,0,1)",
                easeInQuad: "cubic-bezier(.55,.085,.68,.53)",
                easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",
                easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",
                easeInQuart: "cubic-bezier(.895,.03,.685,.22)",
                easeOutQuart: "cubic-bezier(.165,.84,.44,1)",
                easeInOutQuart: "cubic-bezier(.77,0,.175,1)",
                easeInQuint: "cubic-bezier(.755,.05,.855,.06)",
                easeOutQuint: "cubic-bezier(.23,1,.32,1)",
                easeInOutQuint: "cubic-bezier(.86,0,.07,1)",
                easeInSine: "cubic-bezier(.47,0,.745,.715)",
                easeOutSine: "cubic-bezier(.39,.575,.565,1)",
                easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",
                easeInBack: "cubic-bezier(.6,-.28,.735,.045)",
                easeOutBack: "cubic-bezier(.175, .885,.32,1.275)",
                easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)"
            }, t.cssHooks["transit:transform"] = {
                get: function(e) {
                    return t(e).data("transform") || new n
                },
                set: function(e, i) {
                    var s = i;
                    s instanceof n || (s = new n(s)), e.style[p.transform] = "WebkitTransform" !== p.transform || d ? s.toString() : s.toString(!0), t(e).data("transform", s)
                }
            }, t.cssHooks.transform = {
                set: t.cssHooks["transit:transform"].set
            }, t.fn.jquery < "1.8" && (t.cssHooks.transformOrigin = {
                get: function(t) {
                    return t.style[p.transformOrigin]
                },
                set: function(t, e) {
                    t.style[p.transformOrigin] = e
                }
            }, t.cssHooks.transition = {
                get: function(t) {
                    return t.style[p.transition]
                },
                set: function(t, e) {
                    t.style[p.transition] = e
                }
            }), a("scale"), a("translate"), a("rotate"), a("rotateX"), a("rotateY"), a("rotate3d"), a("perspective"), a("skewX"), a("skewY"), a("x", !0), a("y", !0), n.prototype = {
                setFromString: function(t, e) {
                    var i = "string" == typeof e ? e.split(","): e.constructor === Array ? e: [e];
                    i.unshift(t), n.prototype.set.apply(this, i)
                },
                set: function(t) {
                    var e = Array.prototype.slice.apply(arguments, [1]);
                    this.setter[t] ? this.setter[t].apply(this, e) : this[t] = e.join(",")
                },
                get: function(t) {
                    return this.getter[t] ? this.getter[t].apply(this) : this[t] || 0
                },
                setter: {
                    rotate: function(t) {
                        this.rotate = h(t, "deg")
                    },
                    rotateX: function(t) {
                        this.rotateX = h(t, "deg")
                    },
                    rotateY: function(t) {
                        this.rotateY = h(t, "deg")
                    },
                    scale: function(t, e) {
                        void 0 === e && (e = t), this.scale = t + "," + e
                    },
                    skewX: function(t) {
                        this.skewX = h(t, "deg")
                    },
                    skewY: function(t) {
                        this.skewY = h(t, "deg")
                    },
                    perspective: function(t) {
                        this.perspective = h(t, "px")
                    },
                    x: function(t) {
                        this.set("translate", t, null)
                    },
                    y: function(t) {
                        this.set("translate", null, t)
                    },
                    translate: function(t, e) {
                        void 0 === this._translateX && (this._translateX = 0), void 0 === this._translateY && (this._translateY = 0), null !== t && void 0 !== t && (this._translateX = h(t, "px")), null !== e && void 0 !== e && (this._translateY = h(e, "px")), this.translate = this._translateX + "," + this._translateY
                    }
                },
                getter: {
                    x: function() {
                        return this._translateX || 0
                    },
                    y: function() {
                        return this._translateY || 0
                    },
                    scale: function() {
                        var t = (this.scale || "1,1").split(",");
                        return t[0] && (t[0] = parseFloat(t[0])), t[1] && (t[1] = parseFloat(t[1])), t[0] === t[1] ? t[0] : t
                    },
                    rotate3d: function() {
                        for (var t = (this.rotate3d || "0,0,0,0deg").split(","), e = 0; 3 >= e; ++e)
                            t[e] && (t[e] = parseFloat(t[e]));
                        return t[3] && (t[3] = h(t[3], "deg")), t
                    }
                },
                parse: function(t) {
                    var e = this;
                    t.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(t, i, n) {
                        e.setFromString(i, n)
                    })
                },
                toString: function(t) {
                    var e = [];
                    for (var i in this)
                        if (this.hasOwnProperty(i)) {
                            if (!p.transform3d && ("rotateX" === i || "rotateY" === i || "perspective" === i || "transformOrigin" === i))
                                continue;
                                "_" !== i[0] && e.push(t && "scale" === i ? i + "3d(" + this[i] + ",1)" : t && "translate" === i ? i + "3d(" + this[i] + ",0)" : i + "(" + this[i] + ")")
                        }
                    return e.join(" ")
                }
            }, t.fn.transition = t.fn.transit = function(e, i, n, r) {
                var a = this, l = 0, h=!0;
                "function" == typeof i && (r = i, i = void 0), "function" == typeof n && (r = n, n = void 0), "undefined" != typeof e.easing && (n = e.easing, delete e.easing), "undefined" != typeof e.duration && (i = e.duration, delete e.duration), "undefined" != typeof e.complete && (r = e.complete, delete e.complete), "undefined" != typeof e.queue && (h = e.queue, delete e.queue), "undefined" != typeof e.delay && (l = e.delay, delete e.delay), "undefined" == typeof i && (i = t.fx.speeds._default), "undefined" == typeof n && (n = t.cssEase._default), i = u(i);
                var c = o(e, i, n, l), d = t.transit.enabled && p.transition, f = d ? parseInt(i, 10) + parseInt(l, 10): 0;
                if (0 === f) {
                    var m = function(t) {
                        a.css(e), r && r.apply(a), t && t()
                    };
                    return s(a, h, m), a
                }
                var v = {}, _ = function(i) {
                    var n=!1, s = function() {
                        n && a.unbind(g, s), f > 0 && a.each(function() {
                            this.style[p.transition] = v[this] || null
                        }), "function" == typeof r && r.apply(a), "function" == typeof i && i()
                    };
                    f > 0 && g && t.transit.useTransitionEnd ? (n=!0, a.bind(g, s)) : window.setTimeout(s, f), a.each(function() {
                        f > 0 && (this.style[p.transition] = c), t(this).css(e)
                    })
                }, y = function(t) {
                    var e = 0;
                    "MozTransition" === p.transition && 25 > e && (e = 25), window.setTimeout(function() {
                        _(t)
                    }, e)
                };
                return s(a, h, y), this
            }, t.transit.getTransitionValue = o
        }(t), t
    }), define("widgets/hover", ["jquery", "lodash", "jqueryui/widget"], function(t, e) {
        "use strict";
        function i(t, e, i) {
            return Math.abs(t[0] - e[0]) > i || Math.abs(t[1] - e[1]) > i
        }
        function n(t) {
            t._hoverIsTouchTriggered=!1
        }
        var s = t(document);
        t.widget("ted.hover", {
            options: {
                hoverIdleDelay: 4e3,
                hoverStartDelay: 200,
                hoverStopDelay: 400,
                hoverSwipeTolerance: 5
            },
            hoverState: function(t) {
                return e.isUndefined(t) || this._hoverChangeState(null, !!t), this._hoverIsOn
            },
            _hoverIsClicking: !1,
            _hoverIsOn: !1,
            _hoverIsTouchTriggered: !1,
            _hoverLastCoords: null,
            _hoverStartTimeout: null,
            _hoverIdleTimeout: null,
            _hoverStopTimeout: null,
            _hoverChangeStateBound: null,
            _hoverMoveChangeBound: null,
            _hoverMouseMoveThrottled: null,
            _hoverTouchOutBound: null,
            _create: function() {
                this._hoverInit()
            },
            _hoverEvents: function() {
                return {
                    mouseenter: this._hoverMouseMoveThrottled,
                    mousemove: this._hoverMouseMoveThrottled,
                    mouseleave: this._hoverOut,
                    touchstart: this._hoverTouchStart,
                    touchend: this._hoverTouchEnd,
                    touchmove: this._hoverTouchMove,
                    touchcancel: this._hoverTouchCancel,
                    mousedown: this._hoverMouseDown,
                    mouseup: this._hoverMouseUp,
                    click: this._hoverMouseClick
                }
            },
            _hoverMove: function(t) {
                this._hoverIsOn ? this._hoverMoveChange(t) : this._hoverStartSetTimeout(t)
            },
            _hoverMoveChange: function(t) {
                var e = {
                    x: t.pageX || null,
                    y: t.pageY || null
                };
                "mousedown" !== t.type && "touchstart" !== t.type && this._hoverLastCoords && e.x && e.x === this._hoverLastCoords.x && e.y === this._hoverLastCoords.y || (this._hoverLastCoords = e, this._hoverChangeState(t, !0), this._hoverIdleSetTimeout(t))
            },
            _hoverOut: function(t) {
                this._hoverStartClearTimeout(), this._hoverStopSetTimeout(t)
            },
            _hoverMouseClick: function(t) {
                this._hoverIsTouchTriggered || this._hoverIsOn && this._trigger("tap", t)
            },
            _hoverMouseDown: function() {
                this._hoverIsTouchTriggered || (this._hoverIsClicking=!0, this._hoverIdleClearTimeout())
            },
            _hoverMouseMove: function(t) {
                this._hoverIsTouchTriggered || this._hoverMove(t)
            },
            _hoverMouseUp: function(t) {
                this._hoverIsTouchTriggered || (this._hoverIsClicking=!1, this._hoverIdleSetTimeout(t))
            },
            _hoverTouchStart: function() {
                this._hoverIsTouchTriggered=!0, this._hoverTouchStartCoords = null, this._hoverTouchEndCoords = null
            },
            _hoverTouchEnd: function(t) {
                this._hoverTouchSafetyTimeout && window.clearTimeout(this._hoverTouchSafetyTimeout), this._hoverTouchSafetyTimeout = e.delay(n, 600, this), this._hoverTouchEndCoords && i(this._hoverTouchStartCoords, this._hoverTouchEndCoords, this.options.hoverSwipeTolerance) || (this._hoverIsOn && this._trigger("tap", t), this._hoverMoveChange(t))
            },
            _hoverTouchCancel: function(t) {
                t.preventDefault()
            },
            _hoverTouchMove: function(t) {
                var e = t.originalEvent.touches[0], i = [e.pageX, e.pageY];
                null === this._hoverTouchStartCoords ? this._hoverTouchStartCoords = i : this._hoverTouchEndCoords = i, this._hoverIsOn && this._hoverMove(t)
            },
            _hoverTouchOut: function(e) {
                t(e.target).closest(this.element).length || this._hoverChangeState(e, !1)
            },
            _hoverChangeState: function(t, e) {
                e=!!e, this._hoverIdleClearTimeout(), this._hoverStartClearTimeout(), this._hoverStopClearTimeout(), (e ||!this._hoverIsClicking) && e !== this._hoverIsOn && (this._hoverIsOn = e, this[e ? "_hoverStart": "_hoverStop"](t), e ? this._on(s, {
                    touchstart: this._hoverTouchOutBound
                }) : this._off(s, "touchstart"))
            },
            _hoverStartSetTimeout: function(t) {
                this._hoverStartTimeout || (this._hoverStartTimeout = e.delay(this._hoverMoveChangeBound, this.options.hoverStartDelay, t))
            },
            _hoverStartClearTimeout: function() {
                this._hoverStartTimeout && (window.clearTimeout(this._hoverStartTimeout), this._hoverStartTimeout = null)
            },
            _hoverStopSetTimeout: function(t) {
                this._hoverStopClearTimeout(), this._hoverStopTimeout = e.delay(this._hoverChangeStateBound, this.options.hoverStopDelay, t, !1)
            },
            _hoverStopClearTimeout: function() {
                this._hoverStopTimeout && (window.clearTimeout(this._hoverStopTimeout), this._hoverStopTimeout = null)
            },
            _hoverIdleSetTimeout: function(t) {
                this._hoverIdleClearTimeout(), !this._hoverIsClicking && this.options.hoverIdleDelay && (this._hoverIdleTimeout = e.delay(this._hoverChangeStateBound, this.options.hoverIdleDelay, t, !1))
            },
            _hoverIdleClearTimeout: function() {
                this._hoverIdleTimeout && (window.clearTimeout(this._hoverIdleTimeout), this._hoverIdleTimeout = null)
            },
            _hoverInit: function() {
                this._hoverChangeStateBound = e.bind(this._hoverChangeState, this), this._hoverMoveChangeBound = e.bind(this._hoverMoveChange, this), this._hoverTouchOutBound = e.bind(this._hoverTouchOut, this), this._hoverMouseMoveThrottled = e.throttle(e.bind(this._hoverMouseMove, this), 100, {
                    leading: !0,
                    trailing: !1
                }), this._on(this._hoverEvents())
            },
            _hoverDestroy: function() {
                this._off(this._hoverEvents())
            },
            _hoverStart: function(t) {
                this._trigger("start", t)
            },
            _hoverStop: function(t) {
                this._trigger("stop", t)
            }
        })
    }), define("views/TalkGridTileView", ["jquery", "lodash", "Backbone", "hbs!templates/talkGridTile", "templates/helpers/crushinator", "lib/pubSub", "Modernizr", "lib/resize", "transit", "widgets/hover"], function(t, e, i, n, s, r, o) {
        "use strict";
        function a(t) {
            t.decoize()
        }
        var l = "talk-grid__tile", h = l + "--hover", u = l + "--deco", c = i.View.extend({
            className: l,
            index: 1,
            hoverWidths: {
                sm: {
                    1: 580,
                    2: 580,
                    0: 400
                },
                lg: {
                    1: 720,
                    2: 540,
                    3: 540,
                    0: 390
                }
            },
            click: function() {
                r("breakpoint").read() < 768 && this.loadTalk()
            },
            decoize: function() {
                if (this.$el.hasClass(h)) {
                    this.$el.addClass(u);
                    for (var e = this.$el.height() - this.$description.position().top - 20, i = this._originalText, n = i.length; this.$description.height() > e && n > 0;)
                        i = t.trim(i.substr(0, n - 10)) + "…", this.$description.text(i), n = i.length
                }
            },
            hoverStart: function() {
                var t = this._getHoverCss();
                o.cssanimations && t && (this.$el.addClass(h).css(t), e.delay(a, 300, this))
            },
            hoverForceStop: function() {
                r("breakpoint").read() >= 768 && this.$el.hover("hoverState", !1)
            },
            hoverStop: function() {
                o.cssanimations && (this.$el.removeClass(h).removeClass(u), this.$el.css("width", ""), this.setPosition())
            },
            hoverTap: function() {
                r("breakpoint").read() >= 768 && this.loadTalk()
            },
            initialize: function(t) {
                this.index = t.index, this.$el.data("view", this)
            },
            loadTalk: function() {
                var t = "/talks/" + this.model.get("slug");
                this.model.set("load", !0), e.delay(function() {
                    window.location.href = t
                }, 50)
            },
            render: function() {
                var t;
                return t = this._getRenderDetails(), t.thumb = s(t.thumb, "w=" + this._getThumbWidth() + "&quality=90"), this.$el.html(n(t)), this.$el.addClass(this.className + "--tile-" + this.index), this.$el.data("index", this.index), this._rendered=!0, this.setPosition(), t.isTodaysTalk && this.$el.addClass(this.className + "--marked"), r("breakpoint").read() >= 768 && this.$el.hover({
                    hoverIdleDelay: null
                }), this.$description = this.$el.find("div.talk-grid__tile__description"), this._originalText = this.$description.text(), this
            },
            setPosition: function(t) {
                t && (this.position = t), this.position && this._rendered && this.$el.css({
                    left: this.position.x + "%",
                    top: this.position.y + "%"
                })
            },
            _getHoverCss: function() {
                var e = this._getHoverWidth();
                if (e) {
                    var i = this.$el, n = .5625 * e, s = i.position(), o = {
                        height: i.height(),
                        width: i.width()
                    };
                    s.top = Math.round(s.top + o.height / 2 - n / 2), s.left = Math.round(s.left + o.width / 2 - e / 2);
                    var a = 4, l = 15, h = i.offsetParent(), u = h.height(), c = h.offset(), p = c.left - a + s.left;
                    0 > p && (s.left -= p);
                    var d = c.left + s.left + e + a, f = r("width").read();
                    d > f && (s.left -= d - f);
                    var g = t(window).scrollTop(), m = c.top - a + s.top;
                    g > m && (s.top += g - m);
                    var v = c.top + s.top + n + a;
                    f = g + r("height").read(), v > f && (s.top -= v - f);
                    var _ = 0 - l;
                    return u - s.top - n < _ && (s.top = u - n + l), s.top < _ && (s.top = _), {
                        width: e,
                        top: s.top,
                        left: s.left
                    }
                }
            },
            _getHoverWidth: function() {
                var t = r("sizeGroup").read(), e = this.hoverWidths[t];
                if (e)
                    return e[this.index] ? e[this.index] : e[0]
            },
            _getThumbWidth: function() {
                var t = this._getHoverWidth();
                return t || (t = r("breakpoint").read(), this.model.isFirstTalk() && (t*=2)), t
            },
            _getRenderDetails: function() {
                return e.extend({
                    isTodaysTalk: this.model.isTodaysTalk(),
                    index: this.index
                }, this.model.toJSON())
            }
        });
        return c
    }), define("views/TalkGridPageView", ["jquery", "lodash", "Backbone", "hbs!templates/talkGridPage", "views/TalkGridTileView", "lib/pubSub", "lib/resize"], function(t, e, i, n, s, r) {
        "use strict";
        function o(t) {
            return "1" === t[0][0]
        }
        var a = i.View.extend({
            className: "talk-grid__page",
            pageIndex: null,
            tileViews: [],
            breakpoint: null,
            layout: null,
            layouts: {
                large: [["1  4 ", "   2 ", "     ", "53 6 ", "   7 "], ["1  2 ", "     ", "   4 ", "5673 ", "     "], ["1  2 ", "     ", "    4", "5 3  ", "6   7"], ["1  4 ", "   2 ", "     ", "563 7", "     "], ["1   4", "   2 ", "     ", "3 567", "     "], ["  1  ", "2    ", "     ", "43 67", "5    "], [" 41  ", " 5   ", "2    ", "   3 ", "6 7  "], [" 1  6", "4    ", "5   7", "2  3 ", "     "], [" 1   ", "4   5", "    6", "2 3 7", "     "], ["4 1  ", " 5   ", " 6   ", "2 73 ", "     "]],
                medium: [["1 3 ", "  45", "62 7", "    "], ["1  3", "  45", "672 ", "    "], ["1 3 ", "  2 ", "4   ", "56 7"], ["1 34", "   5", "62  ", "   7"], [" 31 ", "2   ", "   4", "7 56"], ["  1 ", "34  ", "2  5", "  67"], ["3 1 ", "2   ", "  45", " 7 6"], [" 31 ", "4   ", "52 7", "6   "], [" 1 3", "4   ", "562 ", " 7  "], ["31  ", "4  5", "2  6", "  7 "]]
            },
            initialize: function(t) {
                t.pageIndex && (this.pageIndex = t.pageIndex)
            },
            render: function() {
                return this.$el.html(n()), this.$el.addClass(this.className + "--page-" + (this.pageIndex + 1)), r("breakpoint").subscribe(e.bind(this._rebuildTiles, this)), this
            },
            _buildTileViews: function() {
                this.tileViews.length && e.invoke(this.tileViews, "remove"), this.tileViews = [];
                var t = "small" === this.breakpoint, i = this.pageIndex <= 0, n = t ? i ? 3: 6: 7, s = this.pageIndex * n - (t&&!i ? 3 : 0);
                e.each(this.collection.slice(s, n + s), e.bind(this._buildTileView, this))
            },
            _buildTileView: function(t, e) {
                var i = new s({
                    index: e + 1,
                    model: t
                });
                this.tileViews.push(i)
            },
            _chooseLayout: function() {
                var t = r("breakpoint").read();
                if (this.breakpoint = 768 > t ? "small" : 1024 > t ? "medium" : "large", "small" === this.breakpoint)
                    return void(this.layout = null);
                var i = this.layouts[this.breakpoint];
                this.pageIndex <= 0 && (i = e.filter(i, o)), this.layout = i[e.random(0, i.length - 1)]
            },
            _rebuildTiles: function() {
                var t = this.breakpoint;
                this._chooseLayout(), t && (this.breakpoint === t || "small" !== t && "small" !== this.breakpoint) || this._buildTileViews(), this._parseLayout(), this._renderTileViews()
            },
            _parseLayout: function() {
                var t, e, i, n, s, r, o;
                if (this.layout)
                    for (t = this.layout, e = t.length, i = e; i--;)
                        for (n = t[i].split(""), s = n.length, r = s; r--;)
                            if (o =+ n[r]) {
                                if (!this.tileViews[o - 1])
                                    throw new Error("TalkGridPageView error: there are not " + o + " tiles on the page.");
                                    this.tileViews[o - 1].setPosition({
                                        x: r / s * 100,
                                        y: i / e * 100
                                    })
                            }
            },
            _renderTileView: function(t) {
                t.render().$el.appendTo(this.$content)
            },
            _renderTileViews: function() {
                this.$content || (this.$content = this.$el.find("div." + this.className + "__content")), e.forEach(this.tileViews, this._renderTileView, this)
            }
        });
        return a
    }), function(t, e) {
        "object" == typeof exports ? module.exports = e() : "function" == typeof define && define.amd ? define("spinjs", e) : t.Spinner = e()
    }(this, function() {
        "use strict";
        function t(t, e) {
            var i, n = document.createElement(t || "div");
            for (i in e)
                n[i] = e[i];
            return n
        }
        function e(t) {
            for (var e = 1, i = arguments.length; i > e; e++)
                t.appendChild(arguments[e]);
            return t
        }
        function i(t, e, i, n) {
            var s = ["opacity", e, ~~(100 * t), i, n].join("-"), r = .01 + i / n * 100, o = Math.max(1 - (1 - t) / e * (100 - r), t), a = u.substring(0, u.indexOf("Animation")).toLowerCase(), l = a && "-" + a + "-" || "";
            return p[s] || (d.insertRule("@" + l + "keyframes " + s + "{0%{opacity:" + o + "}" + r + "%{opacity:" + t + "}" + (r + .01) + "%{opacity:1}" + (r + e)%100 + "%{opacity:" + t + "}100%{opacity:" + o + "}}", d.cssRules.length), p[s] = 1), s
        }
        function n(t, e) {
            var i, n, s = t.style;
            for (e = e.charAt(0).toUpperCase() + e.slice(1), n = 0; n < c.length; n++)
                if (i = c[n] + e, void 0 !== s[i])
                    return i;
            return void 0 !== s[e] ? e : void 0
        }
        function s(t, e) {
            for (var i in e)
                t.style[n(t, i) || i] = e[i];
            return t
        }
        function r(t) {
            for (var e = 1; e < arguments.length; e++) {
                var i = arguments[e];
                for (var n in i)
                    void 0 === t[n] && (t[n] = i[n])
            }
            return t
        }
        function o(t) {
            for (var e = {
                x: t.offsetLeft,
                y: t.offsetTop
            }; t = t.offsetParent;)
                e.x += t.offsetLeft, e.y += t.offsetTop;
            return e
        }
        function a(t, e) {
            return "string" == typeof t ? t : t[e%t.length]
        }
        function l(t) {
            return "undefined" == typeof this ? new l(t) : void(this.opts = r(t || {}, l.defaults, f))
        }
        function h() {
            function i(e, i) {
                return t("<" + e + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', i)
            }
            d.addRule(".spin-vml", "behavior:url(#default#VML)"), l.prototype.lines = function(t, n) {
                function r() {
                    return s(i("group", {
                        coordsize: u + " " + u,
                        coordorigin: - h + " " +- h
                    }), {
                        width: u,
                        height: u
                    })
                }
                function o(t, o, l) {
                    e(p, e(s(r(), {
                        rotation: 360 / n.lines * t + "deg",
                        left: ~~o
                    }), e(s(i("roundrect", {
                        arcsize: n.corners
                    }), {
                        width: h,
                        height: n.width,
                        left: n.radius,
                        top: - n.width>>1,
                        filter: l
                    }), i("fill", {
                        color: a(n.color, t),
                        opacity: n.opacity
                    }), i("stroke", {
                        opacity: 0
                    }))))
                }
                var l, h = n.length + n.width, u = 2 * h, c = 2*-(n.width + n.length) + "px", p = s(r(), {
                    position: "absolute",
                    top: c,
                    left: c
                });
                if (n.shadow)
                    for (l = 1; l <= n.lines; l++)
                        o(l, - 2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
                for (l = 1; l <= n.lines; l++)
                    o(l);
                return e(t, p)
            }, l.prototype.opacity = function(t, e, i, n) {
                var s = t.firstChild;
                n = n.shadow && n.lines || 0, s && e + n < s.childNodes.length && (s = s.childNodes[e + n], s = s && s.firstChild, s = s && s.firstChild, s && (s.opacity = i))
            }
        }
        var u, c = ["webkit", "Moz", "ms", "O"], p = {}, d = function() {
            var i = t("style", {
                type: "text/css"
            });
            return e(document.getElementsByTagName("head")[0], i), i.sheet || i.styleSheet
        }(), f = {
            lines: 12,
            length: 7,
            width: 5,
            radius: 10,
            rotate: 0,
            corners: 1,
            color: "#000",
            direction: 1,
            speed: 1,
            trail: 100,
            opacity: .25,
            fps: 20,
            zIndex: 2e9,
            className: "spinner",
            top: "auto",
            left: "auto",
            position: "relative"
        };
        l.defaults = {}, r(l.prototype, {
            spin: function(e) {
                this.stop();
                var i, n, r = this, a = r.opts, l = r.el = s(t(0, {
                    className: a.className
                }), {
                    position: a.position,
                    width: 0,
                    zIndex: a.zIndex
                }), h = a.radius + a.length + a.width;
                if (e && (e.insertBefore(l, e.firstChild || null), n = o(e), i = o(l), s(l, {
                    left: ("auto" == a.left ? n.x - i.x + (e.offsetWidth>>1) : parseInt(a.left, 10) + h) + "px",
                    top: ("auto" == a.top ? n.y - i.y + (e.offsetHeight>>1) : parseInt(a.top, 10) + h) + "px"
                })), l.setAttribute("role", "progressbar"), r.lines(l, r.opts), !u) {
                    var c, p = 0, d = (a.lines - 1) * (1 - a.direction) / 2, f = a.fps, g = f / a.speed, m = (1 - a.opacity) / (g * a.trail / 100), v = g / a.lines;
                    !function _() {
                        p++;
                        for (var t = 0; t < a.lines; t++)
                            c = Math.max(1 - (p + (a.lines - t) * v)%g * m, a.opacity), r.opacity(l, t * a.direction + d, c, a);
                        r.timeout = r.el && setTimeout(_, ~~(1e3 / f))
                    }()
                }
                return r
            },
            stop: function() {
                var t = this.el;
                return t && (clearTimeout(this.timeout), t.parentNode && t.parentNode.removeChild(t), this.el = void 0), this
            },
            lines: function(n, r) {
                function o(e, i) {
                    return s(t(), {
                        position: "absolute",
                        width: r.length + r.width + "px",
                        height: r.width + "px",
                        background: e,
                        boxShadow: i,
                        transformOrigin: "left",
                        transform: "rotate("+~~(360 / r.lines * h + r.rotate) + "deg) translate(" + r.radius + "px,0)",
                        borderRadius: (r.corners * r.width>>1) + "px"
                    })
                }
                for (var l, h = 0, c = (r.lines - 1) * (1 - r.direction) / 2; h < r.lines; h++)
                    l = s(t(), {
                        position: "absolute",
                        top: 1+~(r.width / 2) + "px",
                        transform: r.hwaccel ? "translate3d(0,0,0)": "",
                        opacity: r.opacity,
                        animation: u && i(r.opacity, r.trail, c + h * r.direction, r.lines) + " " + 1 / r.speed + "s linear infinite"
                    }), r.shadow && e(l, s(o("#000", "0 0 4px #000"), {
                        top: "2px"
                    })), e(n, e(l, o(a(r.color, h), "0 0 1px rgba(0,0,0,.1)")));
                return n
            },
            opacity: function(t, e, i) {
                e < t.childNodes.length && (t.childNodes[e].style.opacity = i)
            }
        });
        var g = s(t("group"), {
            behavior: "url(#default#VML)"
        });
        return !n(g, "transform") && g.adj ? h() : u = n(g, "animation"), l
    }), define("utils/delay", ["jquery"], function(t) {
        "use strict";
        return function(e) {
            var i = t.Deferred();
            return window.setTimeout(function() {
                i.resolve()
            }, e), i.promise()
        }
    }), define("views/TalkGridView", ["jquery", "lodash", "Backbone", "hbs!templates/talkGrid", "SwipeView", "collections/TalkGridTalks", "views/TalkGridPageView", "spinjs", "utils/delay"], function(t, e, i, n, s, r, o, a, l) {
        "use strict";
        function h(e, i) {
            var n = t(i.target).closest("div.talk-grid__tile"), s = n.data("view");
            s[e].call(s, i)
        }
        var u = i.View.extend({
            className: "talk-grid",
            carousel: null,
            pages: 5,
            collections: {},
            events: {
                "click div.talk-grid__page": "clickPage",
                "click a.page-nav__next": "showNext",
                "click a.talk-grid__next": "showNext",
                "click a.page-nav__prev": "showPrev",
                "click a.talk-grid__prev": "showPrev",
                "click a.page-nav__dot__link": "showPage",
                "click div.talk-grid__page--current div.talk-grid__tile": "click",
                "hoverstart div.talk-grid__page--current div.talk-grid__tile": "hoverStart",
                "hoverstop div.talk-grid__page--current div.talk-grid__tile": "hoverStop",
                "hovertap div.talk-grid__page--current div.talk-grid__tile": "hoverTap"
            },
            filter: "latest",
            pageViews: {},
            clickPage: function(e) {
                var i = t(e.target).closest("div.talk-grid__page");
                if (!i.hasClass("talk-grid__page--current")) {
                    var n =+ i.parent().attr("data-page-index"), s = this.carousel.masterPages[this.carousel.currentMasterPage].dataset.pageIndex, r = n - s;
                    e.preventDefault(), 1 === r && this.showNext(), - 1 === r && this.showPrev()
                }
            },
            click: function(t) {
                h("click", t)
            },
            hoverStart: function(t) {
                this._closeStragglers(t), h("hoverStart", t)
            },
            hoverStop: function(t) {
                h("hoverStop", t)
            },
            hoverTap: function(t) {
                h("hoverTap", t)
            },
            initialize: function(t) {
                t.filter && (this.filter = t.filter), this.collections[this.filter] = this.collection, this.initializeCollection(this.collection)
            },
            initializeCollection: function(t) {
                var e = this;
                t.on("change:load", function(t) {
                    e.trigger("loadTalk", t)
                })
            },
            render: function() {
                return this.carousel || this._renderFirst(), this._populateCarousel(), this
            },
            _requestedFilter: null,
            setFilter: function(e) {
                var i, n = this, s = this.className + "--loading";
                this._requestedFilter = e, this.$el.addClass(s), this.collections[e] || (i = t.ajax({
                    url: "/talks/grid",
                    dataType: "json",
                    data: {
                        filter: e
                    }
                }), this._getSpinner().spin(this.el)), t.when(i, l(400)).done(function(t) {
                    if (!n.collections[e]) {
                        var i = new r;
                        i.add(t[0]), n.collections[e] = i, n.initializeCollection(i)
                    }
                    n._requestedFilter === e && (n.filter = e, n.carousel.goToPage(0), n._getSpinner().stop(), n.$el.removeClass(s))
                })
            },
            showNext: function(t) {
                t && t.preventDefault(), this.trigger("showNext"), this.carousel.next()
            },
            showPrev: function(t) {
                t && t.preventDefault(), this.trigger("showPrev"), this.carousel.prev()
            },
            showPage: function(e) {
                var i =+ t(e.target).closest("li").data("pageno");
                e && e.preventDefault(), this.trigger("showPage", i + 1), this.carousel.goToPage(i)
            },
            _closeStragglers: function(t) {
                var e = this.$el.find("div.talk-grid__tile--hover");
                e.length && e.data("view").hoverForceStop(t)
            },
            _lastRenderedFilter: null,
            _populateCarousel: function() {
                var i, n, s;
                this._closeStragglers(), this.pageViews[this.filter] || (this.pageViews[this.filter] = []);
                for (var r = this.pageViews[this.filter], a = this.className + "__page--current", l = this.carousel.currentMasterPage, h = 3; h--;)
                    i =+ this.carousel.masterPages[h].dataset.upcomingPageIndex, e.isNaN(i) || (n =+ this.carousel.masterPages[h].dataset.pageIndex, s = i !== n, this._lastRenderedFilter !== this.filter && (s=!0), r[i] || (s=!0, r[i] = new o({
                        collection: this.collections[this.filter],
                        pageIndex: i
                    }).render()), h === l ? r[i].$el.addClass(a) : r[i].$el.removeClass(a), s && t(this.carousel.masterPages[h]).find("div.talk-grid__page").detach().end().append(r[i].$el));
                this._lastRenderedFilter = this.filter, this.$dots.removeClass("page-nav__dot--active").filter("[data-pageno=" + this.carousel.pageIndex + "]").addClass("page-nav__dot--active"), this.$prev[0 === this.carousel.pageIndex ? "addClass": "removeClass"]("invisible"), this.$next[this.carousel.pageIndex === this.pages - 1 ? "addClass": "removeClass"]("invisible")
            },
            _renderFirst: function() {
                this.$el.html(n({
                    pages: this.pages
                })), this.$dots = this.$el.find("li.page-nav__dot"), this.$prev = this.$el.find("a.page-nav__prev, a.talk-grid__prev"), this.$next = this.$el.find("a.page-nav__next, a.talk-grid__next");
                var i = this.$el.find("div.talk-grid__content");
                this.carousel = new s(i.get(0), {
                    clientWidth: i.width(),
                    loop: !1,
                    numberOfPages: this.pages
                }), t(this.carousel.wrapper).attr("style", ""), this.carousel.onFlip(e.bind(this._populateCarousel, this))
            },
            _getSpinner: function() {
                return this._spinner || (this._spinner = new a), this._spinner
            }
        });
        return u
    }), define("global/floodlight", ["jquery", "exports"], function(t, e) {
        "use strict";
        e.close = function() {
            window.localStorage.setItem("floodlight", "hide"), t("#floodlight").slideUp(240)
        }, e.clear = function() {
            try {
                window.localStorage.removeItem("floodlight")
            } catch (t) {}
        }
    }), define("global/links", ["jquery", "deferLink", "lib/ga"], function(t, e, i) {
        "use strict";
        function n(t) {
            if (t.match(location.origin))
                return !1;
            for (var e =- 1; ++e < a;)
                if (t.match(o[e].re))
                    return o[e]
        }
        function s(e, i, n) {
            e = t.extend({}, l, e);
            for (var s in e)
                e.hasOwnProperty(s) && t.isFunction(e[s]) && (e[s] = e[s].call(i, n));
            return e
        }
        function r(t) {
            var r = n(this.href);
            return r ? (i.send(s(r, this, t)), e.call(this, t)) : !0
        }
        var o = [{
            re: /^https?:\/\/(?:.*\.)tedprize\.(org|com)/,
            eventCategory: "link.outbound.tedPrize"
        }, {
            re: /^https?:\/\/ed\.ted\.com/,
            eventCategory: "link.outbound.tedEd"
        }, {
            re: /^https?:\/\/tedfellows\.posterous\.com/,
            eventCategory: "link.outbound.fellowsBlog"
        }, {
            re: /^https?:\/\/(?:.*\.)universalsubtitles\.org/,
            eventCategory: "link.outbound.translatorDashboard"
        }, {
            re: /^https?:\/\/(?:.*\.)feedburner\.com/,
            eventCategory: "link.outbound.feedburner"
        }, {
            re: /^https?:\/\//
        }
        ], a = o.length, l = {
            hitType: "event",
            eventCategory: "link.outbound.other",
            eventAction: "click",
            eventLabel: function() {
                return this.href
            }
        };
        return {
            init: function() {
                t("body").on("click", "a[href]", r)
            }
        }
    }), define("global/subscribe", ["jquery", "lodash", "lib/newsletter", "lib/ga"], function(t, e, i, n) {
        "use strict";
        function s(t) {
            g(), n.sendEvent("newsletter", "submit", "footer"), a = {
                email: c.val(),
                isDaily: h.is(":checked"),
                isWeekly: u.is(":checked")
            }, i.subscribe(a).then(r, o), t.preventDefault()
        }
        function r() {
            n.sendEvent("newsletter", "success", e.filter([a.isDaily ? "daily": !1, a.isWeekly ? "weekly": !1]).join(",")), t(d + "-details").slideUp(f), t(d + "-success").slideDown(f)
        }
        function o(e) {
            var i, n, s, r = e[0];
            if (p.slideUp(f), "object" == typeof r ? (i = r.type, n = r.data) : i = r, s = t(d + "-error-" + i), s.slideDown(f), n) {
                var o = s.find(".newsletter-signup-error__data");
                o.text(n), o.click(function(t) {
                    t.preventDefault(), c.val(n), p.slideUp(f)
                })
            }
        }
        var a, l, h, u, c, p, d = "#newsletter-signup", f = "fast", g = e.once(function() {
            h = t(d + "-daily"), u = t(d + "-weekly"), c = t(d + "-email"), p = l.find("p.footer-newsletter__error")
        });
        return {
            init: function() {
                l = t(d), l.on("submit", s)
            }
        }
    }), define("hbs!templates/latcherFixture", ["hbs", "hbs/handlebars"], function(t, e) {
        var i = e.template(function(t, e, i) {
            this.compilerInfo = [4, ">= 1.0.0"], i = this.merge(i, t.helpers);
            var n = "";
            return n += '\n\n<div class="latcher">\n  <a class="latcher__back" href="#">Main</a>\n</div>\n'
        });
        return i
    }), define("global/navs", ["jquery", "lib/ga", "lib/pubSub", "spinjs", "hbs!templates/latcherFixture", "lib/resize"], function(t, e, i, n, s) {
        "use strict";
        function r() {
            return l || (l = new n({
                className: "spinner spinner--centered"
            })), l
        }
        function o(e, i) {
            var n = e.data("url");
            i.drillDown("findNext", n, function(e) {
                if (e)
                    e.element.drillDown("show");
                else {
                    var o = t(s());
                    r().spin(o.get(0)), o.find("a.latcher__back").on("click", function() {
                        i.drillDown("show")
                    }), i.drillDown("queue", o, {
                        id: n
                    }), o.drillDown("show"), t.ajax({
                        url: n,
                        xhrFields: {
                            withCredentials: !0
                        }
                    }).done(function(e) {
                        r().stop(), o.append(t(e).find("#submenu").addClass("submenu--fixture").find("a.submenu__heading__link[href=#]").closest("h3").remove().end().end().find("li." + d).removeClass(d).end())
                    })
                }
            })
        }
        function a(n) {
            var s = i("breakpoint").read() >= 1024, r = t(this), a = r.closest("li.nav__item"), l = a.siblings(), h = a.closest("div.shoji__fixture"), d = a.closest("div.drillDown"), f = a.children(c), g = a.hasClass(p), m = r.data("ga-label");
            if (!a.hasClass("nav__item--disabled")) {
                if (a[s ? "addClass": "toggleClass"](p), l.not(u).removeClass(p), !f.length)
                    return void(d.length && a.hasClass("nav__item--latch") && (n.preventDefault(), o(r, d)));
                !g && m && a.hasClass(p) && e.sendEvent("navigation.menu", "open", m), (h.length ||!s) && (l.filter(u).removeClass(p).children(c).stop(!0, !0).animate({
                    height: "hide"
                }, 200), f.stop(!0, !0).animate({
                    height: "toggle"
                }, 200), n.preventDefault())
            }
        }
        var l, h = {}, u = "li.nav__item--foldable", c = "div.nav__folder", p = "nav__item--active", d = "submenu__item--active";
        return h.init = function() {
            t(document).on("click", "a.nav__link", a)
        }, h
    }), define("lib/shoji", ["jquery", "lodash", "Modernizr", "lib/pubSub", "utils/throwError", "lib/resize"], function(t, e, i, n, s) {
        "use strict";
        function r(e) {
            var i = t(e);
            return i.hasClass(f) || (i = i.closest("div." + f)), i.length || s("Could not find fixture " + e), i
        }
        function o(i, n) {
            var s = t("<div class=" + f + ">"), r = {};
            return e.defaults(r, n, {
                at: "left"
            }), _(), s.addClass(f + "--" + r.at), s.data("at", r.at), s.append(i), s.appendTo(p), s
        }
        function a() {
            return _(), i.csstransforms3d && d >= 320
        }
        function l() {
            _(), t(document.activeElement).blur(), c.removeClass(g + " " + m)
        }
        function h(t) {
            var e = r(t);
            _(), p.children().removeClass(v), e.addClass(v), u(e.data("at"))
        }
        function u(t) {
            l(), c.addClass("shoji--opened shoji--" + t)
        }
        var c, p, d, f = "shoji__fixture", g = "shoji--left", m = "shoji--right", v = f + "--revealed", _ = e.once(function() {
            c = t("#shoji"), p = t("#shoji-fixtures"), t("#shoji-lattice").on("click", function() {
                return l(), !1
            }), n("breakpoint").subscribe(function(t) {
                d = t
            })
        });
        return {
            _getFixture: r,
            _init: _,
            addFixture: o,
            canSlide: a,
            concealFixture: l,
            revealFixture: h,
            slide: u
        }
    }), define("widgets/fixture", ["jquery", "lodash", "lib/shoji", "jqueryui/widget"], function(t, e, i) {
        "use strict";
        var n, s = e.once(function() {
            n = t("body,html")
        });
        return t.widget("ted.fixture", {
            options: {
                at: "left",
                autoReveal: !0,
                scrollAnimationDuration: 200
            },
            _create: function() {
                s(), this.fixture = i.addFixture(this.element.remove(), {
                    at: this.options.at
                }), this.options.autoReveal && this.reveal()
            },
            reveal: function() {
                this.options.scrollAnimationDuration && n.scrollTop() && n.animate({
                    scrollTop: 0
                }, this.options.scrollAnimationDuration), i.revealFixture(this.fixture)
            },
            conceal: function() {
                i.concealFixture()
            }
        }), function(e, i) {
            return t(e).fixture(i)
        }
    }), define("widgets/drillDown", ["jquery", "lodash", "jqueryui/widget"], function(t, e) {
        "use strict";
        t.widget("ted.drillDown", {
            options: {
                id: null,
                prev: null,
                next: null,
                tense: null
            },
            _create: function() {
                var t = this.options, e = t.prev;
                t.next || (t.next = []);
                var i = t.next.length, n = t.tense;
                n || (n = "present", e && (n = "future"), i && (n = "past")), this.element.addClass("drillDown drillDown--" + n), e ? t.prev.after(this.element) : i && t.next[0].element.before(this.element)
            },
            next: function(t) {
                return t && (this.options.next = t), this.options.next
            },
            prev: function(t, e) {
                return arguments.length ? this.options.prev = this._drify(t, {
                    next: this.element
                }, e) : this.options.prev
            },
            queue: function(t, e) {
                this.options.next.push(this._drify(t, {
                    prev: this.element
                }, e))
            },
            show: function() {
                var t = this.options;
                if (t.prev && t.prev.addClass("drillDown--past"), this._nextEls().addClass("drillDown--future"), this._dShow)
                    this._dShow();
                else {
                    var i = this.element;
                    this._dShow = function() {
                        i.removeClass("drillDown--past drillDown--future")
                    }, e.defer(this._dShow)
                }
            },
            findNext: function(t, e) {
                for (var i, n = this.options.next, s = n.length; s--&&!i;)
                    n[s].options.id === t && (i = n[s]);
                return e && e.call(i, i), i
            },
            _drify: function(e, i, n) {
                var s = t(e), r = this.widgetFullName;
                return s.data(r) || s.drillDown(t.extend(i, n || {})).data(r)
            },
            _nextEls: function() {
                for (var e = t(), i = this.options.next, n = i.length; n--;)
                    e = e.add(i[n].element);
                return e
            }
        })
    }), define("menuAim", ["jquery"], function(t) {
        "use strict";
        function e(e) {
            var i = t(this), n = null, s = [], r = null, o = null, a = t.extend({
                rowSelector: "> li",
                submenuSelector: "*",
                submenuDirection: "right",
                tolerance: 75,
                enter: t.noop,
                exit: t.noop,
                activate: t.noop,
                deactivate: t.noop,
                exitMenu: t.noop
            }, e), l = 3, h = 300, u = 200, c = function(t) {
                s.push({
                    x: t.pageX,
                    y: t.pageY
                }), s.length > l && s.shift()
            }, p = function() {
                o && clearTimeout(o), a.exitMenu(this) && (n && a.deactivate(n), n = null)
            }, d = function() {
                o && clearTimeout(o), a.enter(this), v(this)
            }, f = function() {
                a.exit(this)
            }, g = function() {
                m(this)
            }, m = function(t) {
                t !== n && (n && a.deactivate(n), a.activate(t), n = t)
            }, v = function(t) {
                var e = _();
                null === e ? o = setTimeout(function() {
                    m(t)
                }, u) : e ? o = setTimeout(function() {
                    v(t)
                }, e) : m(t)
            }, _ = function() {
                function e(t, e) {
                    return (e.y - t.y) / (e.x - t.x)
                }
                if (!n ||!t(n).is(a.submenuSelector))
                    return null;
                var o = i.offset(), l = {
                    x: o.left,
                    y: o.top - a.tolerance
                }, u = {
                    x: o.left + i.outerWidth(),
                    y: l.y
                }, c = {
                    x: o.left,
                    y: o.top + i.outerHeight() + a.tolerance
                }, p = {
                    x: o.left + i.outerWidth(),
                    y: c.y
                }, d = s[s.length - 1], f = s[0];
                if (!d)
                    return 0;
                if (f || (f = d), f.x < o.left || f.x > p.x || f.y < o.top || f.y > p.y)
                    return 0;
                if (r && d.x === r.x && d.y === r.y)
                    return 0;
                var g = u, m = p;
                "left" === a.submenuDirection ? (g = c, m = l) : "below" === a.submenuDirection ? (g = p, m = c) : "above" === a.submenuDirection && (g = l, m = u);
                var v = e(d, g), _ = e(d, m), y = e(f, g), b = e(f, m);
                return y > v && _ > b ? (r = d, h) : (r = null, 0)
            };
            i.mouseleave(p).find(a.rowSelector).mouseenter(d).mouseleave(f).on("touchend", function(e) {
                n && t(n).is(a.submenuSelector) || (e.preventDefault(), g.apply(this, Array.prototype.slice.call(arguments, 0)))
            }).click(g), t(document).mousemove(c)
        }
        return t.fn.menuAim = function(t) {
            return this.each(function() {
                e.call(this, t)
            }), this
        }, t
    }), define("global/mainNav", ["jquery", "lodash", "lib/shoji", "lib/pubSub", "lib/ga", "hbs!templates/latcherFixture", "lib/resize", "widgets/fixture", "widgets/drillDown", "menuAim"], function(t, e, i, n, s, r) {
        "use strict";
        function o(e) {
            if (e.preventDefault(), i.canSlide())
                if (h)
                    h.fixture("reveal");
                else {
                    h = t("#banner-core").clone(), h.find("nav.nav--main").removeClass("nav--main"), h.add("*[id]", h).removeAttr("id"), h.find("li.nav__item--latch a").attr("href", function() {
                        var e = t(this), i = e.attr("href");
                        return e.attr("data-url", i), "#"
                    }), h.show(), h.fixture();
                    var n = t("div.shoji__fixture--left #submenu");
                    if (h.drillDown({
                        tense: n.length ? "past": "present"
                    }), !n.length)
                        return;
                        var s = t(r()).append(n.clone().addClass("submenu--fixture"));
                        s.find("a.latcher__back").on("click", function() {
                            h.drillDown("show")
                        }), h.drillDown("queue", s, {
                            tense: "present"
                        })
                } else
                    t("#main-nav").toggleClass("nav--main--open")
        }
        function a(e) {
            1024 > e || (n("breakpoint").unsubscribe(a), t("#main-nav").find("ul:first > li > a").each(function() {
                var e = t(this);
                t('<span class="nav__link nav__link--placeholder" aria-hidden></span>').text(e.text()).insertAfter(e), e.addClass("nav__link--placeheld")
            }))
        }
        function l() {
            function i() {
                l=!0, f.trigger("mouseleave")
            }
            function r() {
                return p.read() >= 1024
            }
            function o(n) {
                1024 > n || (p.unsubscribe(o), f.menuAim({
                    activate: function(e) {
                        var i = t(e), n = i.find("a.nav__link"), o = n.data("ga-label");
                        return r() ? (o&&!i.hasClass(h) && s.sendEvent("navigation.menu", "open", o), i.addClass(h).removeClass(u), void g.addClass(c)) : !1
                    },
                    deactivate: function(e) {
                        return r() ? (t(e).removeClass(h).removeClass(u), void g.removeClass(c)) : !1
                    },
                    exitMenu: function(n) {
                        return r() ? l ? (l=!1, !0) : (t(n).find("li." + h).addClass(u), a = e.delay(i, d), !1) : !1
                    },
                    enter: function(e) {
                        return r() ? (t(e).removeClass(u), clearTimeout(a), void(a = null)) : !1
                    },
                    submenuDirection: "below"
                }), g.on("click", i))
            }
            var a, l, h = "nav__item--active", u = "nav__item--deactivating", c = "main-nav-screen--active", p = n("breakpoint"), d = 250, f = t(this).children("ul"), g = t("#main-nav-screen");
            n("breakpoint").subscribe(o)
        }
        var h, u = {};
        return u.init = function() {
            n("breakpoint").subscribe(a), t("#main-nav-toggle").on("click", o), t("nav.nav--main").each(l)
        }, u
    }), define("templates/helpers/t", ["Handlebars"], function(t) {
        "use strict";
        t.registerHelper("t", function(t) {
            return t
        })
    }), define("hbs!templates/login", ["hbs", "hbs/handlebars", "templates/helpers/t"], function(t, e) {
        var i = e.template(function(t, e, i) {
            this.compilerInfo = [4, ">= 1.0.0"], i = this.merge(i, t.helpers);
            var n, s, r = "", o = i.helperMissing, a = this.escapeExpression;
            return r += '\n\n<div class="login-form">\n  <form class="form-vertical" action="https://auth.ted.com/session" method="post">\n    <label class="form-group">\n      <span class="form-label">' + a((n = i.t || e && e.t, s = {
                hash: {}
            }, n ? n.call(e, "Email:", s) : o.call(e, "t", "Email:", s))) + '</span>\n      <input class="form-control" name="user[email]" type="email">\n    </label>\n\n    <label class="form-group">\n      <span class="form-label">' + a((n = i.t || e && e.t, s = {
                hash: {}
            }, n ? n.call(e, "Password:", s) : o.call(e, "t", "Password:", s))) + '</span>\n      <input class="form-control" name="user[password]" type="password">\n    </label>\n\n    <div class="form-group">\n      <input class="button button--dark button--wide" type="submit" value="Log in">\n\n      <div>\n        <a class="l3" href="https://auth.ted.com/account/password/new">' + a((n = i.t || e && e.t, s = {
                hash: {}
            }, n ? n.call(e, "Need help logging in?", s) : o.call(e, "t", "Need help logging in?", s))) + '</a>\n      </div>\n    </div>\n  </form>\n\n  <div class="login-form__or"></div>\n\n  <div>\n    <a class="button button--wide button--dark button--facebook" href="/account/auth/facebook">' + a((n = i.t || e && e.t, s = {
                hash: {}
            }, n ? n.call(e, "Log in with Facebook", s) : o.call(e, "t", "Log in with Facebook", s))) + "</a>\n  </div>\n\n  <div>\n    " + a((n = i.t || e && e.t, s = {
                hash: {}
            }, n ? n.call(e, "Don't have a TED account?", s) : o.call(e, "t", "Don't have a TED account?", s))) + '\n    <a class="l3" href="https://auth.ted.com/users/new">' + a((n = i.t || e && e.t, s = {
                hash: {}
            }, n ? n.call(e, "Sign up", s) : o.call(e, "t", "Sign up", s))) + "</a>\n  </div>\n</div>\n"
        });
        return i
    }), define("jqueryui/position", ["jquery"], function(t) {
        return function(t, e) {
            function i(t, e, i) {
                return [parseFloat(t[0]) * (d.test(t[0]) ? e / 100 : 1), parseFloat(t[1]) * (d.test(t[1]) ? i / 100 : 1)]
            }
            function n(e, i) {
                return parseInt(t.css(e, i), 10) || 0
            }
            function s(e) {
                var i = e[0];
                return 9 === i.nodeType ? {
                    width: e.width(),
                    height: e.height(),
                    offset: {
                        top: 0,
                        left: 0
                    }
                } : t.isWindow(i) ? {
                    width: e.width(),
                    height: e.height(),
                    offset: {
                        top: e.scrollTop(),
                        left: e.scrollLeft()
                    }
                } : i.preventDefault ? {
                    width: 0,
                    height: 0,
                    offset: {
                        top: i.pageY,
                        left: i.pageX
                    }
                } : {
                    width: e.outerWidth(),
                    height: e.outerHeight(),
                    offset: e.offset()
                }
            }
            t.ui = t.ui || {};
            var r, o = Math.max, a = Math.abs, l = Math.round, h = /left|center|right/, u = /top|center|bottom/, c = /[\+\-]\d+(\.[\d]+)?%?/, p = /^\w+/, d = /%$/, f = t.fn.position;
            t.position = {
                scrollbarWidth: function() {
                    if (r !== e)
                        return r;
                    var i, n, s = t("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"), o = s.children()[0];
                    return t("body").append(s), i = o.offsetWidth, s.css("overflow", "scroll"), n = o.offsetWidth, i === n && (n = s[0].clientWidth), s.remove(), r = i - n
                },
                getScrollInfo: function(e) {
                    var i = e.isWindow || e.isDocument ? "": e.element.css("overflow-x"), n = e.isWindow || e.isDocument ? "": e.element.css("overflow-y"), s = "scroll" === i || "auto" === i && e.width < e.element[0].scrollWidth, r = "scroll" === n || "auto" === n && e.height < e.element[0].scrollHeight;
                    return {
                        width: r ? t.position.scrollbarWidth(): 0,
                        height: s ? t.position.scrollbarWidth(): 0
                    }
                },
                getWithinInfo: function(e) {
                    var i = t(e || window), n = t.isWindow(i[0]), s=!!i[0] && 9 === i[0].nodeType;
                    return {
                        element: i,
                        isWindow: n,
                        isDocument: s,
                        offset: i.offset() || {
                            left: 0,
                            top: 0
                        },
                        scrollLeft: i.scrollLeft(),
                        scrollTop: i.scrollTop(),
                        width: n ? i.width(): i.outerWidth(),
                        height: n ? i.height(): i.outerHeight()
                    }
                }
            }, t.fn.position = function(e) {
                if (!e ||!e.of)
                    return f.apply(this, arguments);
                e = t.extend({}, e);
                var r, d, g, m, v, _, y = t(e.of), b = t.position.getWithinInfo(e.within), w = t.position.getScrollInfo(b), k = (e.collision || "flip").split(" "), x = {};
                return _ = s(y), y[0].preventDefault && (e.at = "left top"), d = _.width, g = _.height, m = _.offset, v = t.extend({}, m), t.each(["my", "at"], function() {
                    var t, i, n = (e[this] || "").split(" ");
                    1 === n.length && (n = h.test(n[0]) ? n.concat(["center"]) : u.test(n[0]) ? ["center"].concat(n) : ["center", "center"]), n[0] = h.test(n[0]) ? n[0] : "center", n[1] = u.test(n[1]) ? n[1] : "center", t = c.exec(n[0]), i = c.exec(n[1]), x[this] = [t ? t[0]: 0, i ? i[0]: 0], e[this] = [p.exec(n[0])[0], p.exec(n[1])[0]]
                }), 1 === k.length && (k[1] = k[0]), "right" === e.at[0] ? v.left += d : "center" === e.at[0] && (v.left += d / 2), "bottom" === e.at[1] ? v.top += g : "center" === e.at[1] && (v.top += g / 2), r = i(x.at, d, g), v.left += r[0], v.top += r[1], this.each(function() {
                    var s, h, u = t(this), c = u.outerWidth(), p = u.outerHeight(), f = n(this, "marginLeft"), _ = n(this, "marginTop"), S = c + f + n(this, "marginRight") + w.width, T = p + _ + n(this, "marginBottom") + w.height, C = t.extend({}, v), E = i(x.my, u.outerWidth(), u.outerHeight());
                    "right" === e.my[0] ? C.left -= c : "center" === e.my[0] && (C.left -= c / 2), "bottom" === e.my[1] ? C.top -= p : "center" === e.my[1] && (C.top -= p / 2), C.left += E[0], C.top += E[1], t.support.offsetFractions || (C.left = l(C.left), C.top = l(C.top)), s = {
                        marginLeft: f,
                        marginTop: _
                    }, t.each(["left", "top"], function(i, n) {
                        t.ui.position[k[i]] && t.ui.position[k[i]][n](C, {
                            targetWidth: d,
                            targetHeight: g,
                            elemWidth: c,
                            elemHeight: p,
                            collisionPosition: s,
                            collisionWidth: S,
                            collisionHeight: T,
                            offset: [r[0] + E[0], r[1] + E[1]],
                            my: e.my,
                            at: e.at,
                            within: b,
                            elem: u
                        })
                    }), e.using && (h = function(t) {
                        var i = m.left - C.left, n = i + d - c, s = m.top - C.top, r = s + g - p, l = {
                            target: {
                                element: y,
                                left: m.left,
                                top: m.top,
                                width: d,
                                height: g
                            },
                            element: {
                                element: u,
                                left: C.left,
                                top: C.top,
                                width: c,
                                height: p
                            },
                            horizontal: 0 > n ? "left": i > 0 ? "right": "center",
                            vertical: 0 > r ? "top": s > 0 ? "bottom": "middle"
                        };
                        c > d && a(i + n) < d && (l.horizontal = "center"), p > g && a(s + r) < g && (l.vertical = "middle"), l.important = o(a(i), a(n)) > o(a(s), a(r)) ? "horizontal" : "vertical", e.using.call(this, t, l)
                    }), u.offset(t.extend(C, {
                        using: h
                    }))
                })
            }, t.ui.position = {
                fit: {
                    left: function(t, e) {
                        var i, n = e.within, s = n.isWindow ? n.scrollLeft: n.offset.left, r = n.width, a = t.left - e.collisionPosition.marginLeft, l = s - a, h = a + e.collisionWidth - r - s;
                        e.collisionWidth > r ? l > 0 && 0 >= h ? (i = t.left + l + e.collisionWidth - r - s, t.left += l - i) : t.left = h > 0 && 0 >= l ? s : l > h ? s + r - e.collisionWidth : s : l > 0 ? t.left += l : h > 0 ? t.left -= h : t.left = o(t.left - a, t.left)
                    },
                    top: function(t, e) {
                        var i, n = e.within, s = n.isWindow ? n.scrollTop: n.offset.top, r = e.within.height, a = t.top - e.collisionPosition.marginTop, l = s - a, h = a + e.collisionHeight - r - s;
                        e.collisionHeight > r ? l > 0 && 0 >= h ? (i = t.top + l + e.collisionHeight - r - s, t.top += l - i) : t.top = h > 0 && 0 >= l ? s : l > h ? s + r - e.collisionHeight : s : l > 0 ? t.top += l : h > 0 ? t.top -= h : t.top = o(t.top - a, t.top)
                    }
                },
                flip: {
                    left: function(t, e) {
                        var i, n, s = e.within, r = s.offset.left + s.scrollLeft, o = s.width, l = s.isWindow ? s.scrollLeft: s.offset.left, h = t.left - e.collisionPosition.marginLeft, u = h - l, c = h + e.collisionWidth - o - l, p = "left" === e.my[0]?-e.elemWidth : "right" === e.my[0] ? e.elemWidth : 0, d = "left" === e.at[0] ? e.targetWidth : "right" === e.at[0]?-e.targetWidth : 0, f =- 2 * e.offset[0];
                        0 > u ? (i = t.left + p + d + f + e.collisionWidth - o - r, (0 > i || i < a(u)) && (t.left += p + d + f)) : c > 0 && (n = t.left - e.collisionPosition.marginLeft + p + d + f - l, (n > 0 || a(n) < c) && (t.left += p + d + f))
                    },
                    top: function(t, e) {
                        var i, n, s = e.within, r = s.offset.top + s.scrollTop, o = s.height, l = s.isWindow ? s.scrollTop: s.offset.top, h = t.top - e.collisionPosition.marginTop, u = h - l, c = h + e.collisionHeight - o - l, p = "top" === e.my[1], d = p?-e.elemHeight : "bottom" === e.my[1] ? e.elemHeight : 0, f = "top" === e.at[1] ? e.targetHeight : "bottom" === e.at[1]?-e.targetHeight : 0, g =- 2 * e.offset[1];
                        0 > u ? (n = t.top + d + f + g + e.collisionHeight - o - r, t.top + d + f + g > u && (0 > n || n < a(u)) && (t.top += d + f + g)) : c > 0 && (i = t.top - e.collisionPosition.marginTop + d + f + g - l, t.top + d + f + g > c && (i > 0 || a(i) < c) && (t.top += d + f + g))
                    }
                },
                flipfit: {
                    left: function() {
                        t.ui.position.flip.left.apply(this, arguments), t.ui.position.fit.left.apply(this, arguments)
                    },
                    top: function() {
                        t.ui.position.flip.top.apply(this, arguments), t.ui.position.fit.top.apply(this, arguments)
                    }
                }
            }, function() {
                var e, i, n, s, r, o = document.getElementsByTagName("body")[0], a = document.createElement("div");
                e = document.createElement(o ? "div" : "body"), n = {
                    visibility: "hidden",
                    width: 0,
                    height: 0,
                    border: 0,
                    margin: 0,
                    background: "none"
                }, o && t.extend(n, {
                    position: "absolute",
                    left: "-1000px",
                    top: "-1000px"
                });
                for (r in n)
                    e.style[r] = n[r];
                e.appendChild(a), i = o || document.documentElement, i.insertBefore(e, i.firstChild), a.style.cssText = "position: absolute; left: 10.7432222px;", s = t(a).offset().left, t.support.offsetFractions = s > 10 && 11 > s, e.innerHTML = "", i.removeChild(e)
            }()
        }(t), t
    }), define("widgets/popup", ["jquery", "lodash", "jqueryui/widget", "jqueryui/position"], function(t, e) {
        "use strict";
        function i(t, e) {
            this.element.removeClass(o).css(t).addClass(s + e.horizontal + " " + s + ("center" === e.vertical ? "middle" : e.vertical))
        }
        for (var n = 300, s = "popup--tailed--", r = ["center", "left", "middle", "right", "bottom", "top"], o = "", a = r.length; a--;)
            o += s + r[a] + " ";
        return t.widget("ted.popup", {
            options: {
                position: {
                    my: "center bottom-20",
                    at: "center top",
                    of: window,
                    collision: "fit flip"
                },
                inverse: !1,
                tail: !0
            },
            _create: function() {
                this.options.position.using || (this.options.position.using = e.bind(i, this)), this.element.addClass("popup" + (this.options.tail ? " popup--tailed" : "") + (this.options.inverse ? " popup--inverse" : " inverse"))
            },
            _isOpen: !1,
            open: function(t) {
                var e = this;
                e._trigger("beforeOpen", t)!==!1 && (e.position(), e._isOpen=!0, e.element.removeClass("popup--hide").addClass("popup--show"), e._trigger("open"))
            },
            close: function(t) {
                var e = this, i = e.element;
                e._trigger("beforeClose", t)!==!1 && (e._isOpen=!1, i.addClass("popup--hide"), setTimeout(function() {
                    e._isOpen || i.removeClass("popup--show")
                }, n), e._trigger("close"))
            },
            position: function() {
                this.element.addClass("popup--positioning").position(this.options.position).removeClass("popup--positioning")
            }
        }), function(e, i) {
            return t(e).popup(i)
        }
    }), define("widgets/tooltip", ["jquery", "lodash", "jqueryui/widget", "widgets/popup"], function(t) {
        "use strict";
        var e;
        return t.widget("ted.tooltip", {
            options: {
                content: "",
                interactive: !1,
                interactiveTolerance: 350,
                position: {},
                openDelay: 0,
                supportTouch: !0,
                allowClick: !1
            },
            _create: function() {
                var i;
                e || (e = t(document.body)), this.element.addClass("tooltip"), this.options.position.of = this.element, this.popupObject = t("<div class=tooltip__popup>").append(this.options.content).popup(this.options).insertAfter(this.element), i = this.element, this.options.interactive && (i = i.add(this.popupObject)), this._on(i, this._handleEvents), this._on(t("#shoji"), {
                    click: function(e) {
                        !this._isOpened || this.options.interactive && t(e.target).closest(this.popupObject).length || (this._isOpened=!1, this.popupObject.popup("close"))
                    }
                })
            },
            _isHoverClickEnabled: !1,
            _isFirstTouch: !1,
            _isTouched: !1,
            _isMousedOver: !1,
            _handleEvents: {
                touchstart: function() {
                    this._isTouched=!0, this._isHoverClickEnabled || (this._isFirstTouch=!0)
                },
                mouseover: function(t) {
                    var e = this, i = e.options.openDelay || 0;
                    (this.options.supportTouch ||!this._isTouched) && (this._isMousedOver=!0, this._isOpened && (i = 0), clearTimeout(this.timeout), this.timeout = setTimeout(function() {
                        e._isMousedOver && e.openPopup(t)
                    }, i))
                },
                mouseout: function(t) {
                    var e = this, i = this.options.interactiveTolerance || 0;
                    this._isMousedOver=!1, this._isOpened || (i = 0), clearTimeout(this.timeout), this.timeout = setTimeout(function() {
                        e._isMousedOver || e.closePopup(t)
                    }, i)
                },
                click: function(e) {
                    t(e.target).closest(this.element).length && ((this.options.supportTouch ||!this._isTouched) && (this.openPopup(e), !this._isFirstTouch && this._isHoverClickEnabled && this._trigger("hoverclick", e), this._isFirstTouch=!1), this.options.allowClick || (e.preventDefault(), e.stopPropagation()))
                },
                popupopen: function() {
                    this._isHoverClickEnabled=!0
                },
                popupclose: function() {
                    this._isHoverClickEnabled=!1
                }
            },
            _setOption: function(t, e) {
                "content" === t && this.popupObject.html(e)
            },
            openPopup: function(t) {
                this._isOpened=!0, this.popupObject.popup("open", t)
            },
            closePopup: function(t) {
                this.popupObject.popup("close", t), this._off(e, "click"), this._isOpened=!1
            },
            popup: function() {
                return this.popupObject
            }
        }), function(e, i) {
            return t(e).tooltip(i)
        }
    }), define("global/login", ["jquery", "lib/shoji", "lib/pubSub", "hbs!templates/login", "lib/resize", "widgets/fixture", "widgets/tooltip"], function(t, e, i, n) {
        "use strict";
        function s(s) {
            var r = i("breakpoint").read() >= 1024;
            if (h&&!r && e.canSlide())
                return s.preventDefault(), a ? void a.fixture("reveal") : void(a = t(n()).fixture({
                    at: "right"
                }))
        }
        function r(t) {
            1024 > t || h && (i("breakpoint").unsubscribe(r), o.tooltip({
                content: n(),
                interactive: !0,
                position: {
                    my: "right bottom-20",
                    at: "right top",
                    of: window,
                    collision: "fit flip"
                },
                beforeOpen: function() {
                    return i("breakpoint").read() >= 1024
                }
            }))
        }
        var o, a, l = {}, h=!1;
        return l.init = function() {
            o = t("#login-link"), o.on("click", s), i("breakpoint").subscribe(r)
        }, l
    }), function(t) {
        "use strict";
        var e = function(t, i, n) {
            return 1 === arguments.length ? e.get(t) : e.set(t, i, n)
        };
        e._document = document, e._navigator = navigator, e.defaults = {
            path: "/"
        }, e.get = function(t) {
            return e._cachedDocumentCookie !== e._document.cookie && e._renewCache(), e._cache[t]
        }, e.set = function(i, n, s) {
            return s = e._getExtendedOptions(s), s.expires = e._getExpiresDate(n === t?-1 : s.expires), e._document.cookie = e._generateCookieString(i, n, s), e
        }, e.expire = function(i, n) {
            return e.set(i, t, n)
        }, e._getExtendedOptions = function(i) {
            return {
                path: i && i.path || e.defaults.path,
                domain: i && i.domain || e.defaults.domain,
                expires: i && i.expires || e.defaults.expires,
                secure: i && i.secure !== t ? i.secure: e.defaults.secure
            }
        }, e._isValidDate = function(t) {
            return "[object Date]" === Object.prototype.toString.call(t)&&!isNaN(t.getTime())
        }, e._getExpiresDate = function(t, i) {
            switch (i = i || new Date, typeof t) {
            case"number":
                t = new Date(i.getTime() + 1e3 * t);
                break;
            case"string":
                t = new Date(t)
            }
            if (t&&!e._isValidDate(t))
                throw new Error("`expires` parameter cannot be converted to a valid Date instance");
            return t
        }, e._generateCookieString = function(t, e, i) {
            t = encodeURIComponent(t), e = (e + "").replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent), i = i || {};
            var n = t + "=" + e;
            return n += i.path ? ";path=" + i.path : "", n += i.domain ? ";domain=" + i.domain : "", n += i.expires ? ";expires=" + i.expires.toGMTString() : "", n += i.secure ? ";secure" : ""
        }, e._getCookieObjectFromString = function(i) {
            for (var n = {}, s = i ? i.split("; ") : [], r = 0; r < s.length; r++) {
                var o = e._getKeyValuePairFromCookieString(s[r]);
                n[o.key] === t && (n[o.key] = o.value)
            }
            return n
        }, e._getKeyValuePairFromCookieString = function(t) {
            var e = t.indexOf("=");
            return e = 0 > e ? t.length : e, {
                key: decodeURIComponent(t.substr(0, e)),
                value: decodeURIComponent(t.substr(e + 1))
            }
        }, e._renewCache = function() {
            e._cache = e._getCookieObjectFromString(e._document.cookie), e._cachedDocumentCookie = e._document.cookie
        }, e._areEnabled = function() {
            return e._navigator.cookieEnabled || "1" === e.set("cookies.js", 1).get("cookies.js")
        }, e.enabled = e._areEnabled(), "function" == typeof define && define.amd ? define("Cookies", [], function() {
            return e
        }) : "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = e), exports.Cookies = e) : window.Cookies = e
    }(), define("lib/currentUserId", ["Cookies"], function(t) {
        "use strict";
        var e = "_ted_user_id";
        return {
            get: function() {
                return t.get(e)
            }
        }
    }), define("lib/personalStorage", ["lodash", "Modernizr", "exports", "lib/currentUserId"], function(t, e, i, n) {
        "use strict";
        function s(e, n) {
            var s = t.toArray(arguments);
            return i.storageAdapter ? (s[1] = i.getKey(n), e.apply(i.storageAdapter, s.slice(1))) : !1
        }
        i.storageAdapter = e.localstorage ? window.localStorage : void 0, i.getKey = function(t) {
            var e = n.get();
            return e || (e = "0"), e + "-" + t
        }, i.getItem = t.wrap(function(t) {
            return i.storageAdapter.getItem(t)
        }, s), i.setItem = t.wrap(function(t, e) {
            i.storageAdapter.setItem(t, e)
        }, s), i.removeItem = t.wrap(function(t) {
            i.storageAdapter.removeItem(t)
        }, s)
    }), define("lib/currentUser", ["jquery", "lodash", "lib/currentUserId", "lib/personalStorage"], function(t, e, i, n) {
        "use strict";
        function s(t) {
            return e.isFinite(t)?+t : null
        }
        function r(t) {
            return t ? "" + t : null
        }
        function o(t) {
            return t = e.pick(t, T), e.forOwn(t, function(e, i) {
                t[i] = S[i](e)
            }), t
        }
        function a(t) {
            return t && JSON.parse(t)
        }
        function l() {
            return o(a(w.storageAdapter.getItem(k)))
        }
        function h() {
            return t.ajax({
                dataType: "json",
                url: "/me",
                data: {
                    c: i.get() + "-" + Math.round( + new Date / 1e3 / 120)
                },
                timeout: 3e3
            })
        }
        function u(t) {
            h().then(e.bind(c, w, t), e.bind(p, w, t))
        }
        function c(t, e) {
            if (!e)
                return void p(t, e);
            if (e.unavailable && e.unavailable.length)
                for (var i = l(), n = e.unavailable, s = n.length; s--;)
                    e[n[s]] = i[n[s]] || e[n[s]];
            e.lastDownloaded = (new Date).getTime(), v = o(e), m(t) && w.storageAdapter.setItem(k, JSON.stringify(v))
        }
        function p(t) {
            d(), t.reject()
        }
        function d() {
            v = null, w.storageAdapter.removeItem(k), t(document.documentElement).removeClass("loggedin").addClass("loggedout")
        }
        function f(t, e) {
            var i = (new Date).getTime();
            return t > i - (e || 0)
        }
        function g() {
            return w._check(v)
        }
        function m(t) {
            var e = g();
            return e ? t.resolve(v) : (d(), t.reject()), e
        }
        var v, _ = function(t) {
            return !!t
        }, y = function(t) {
            return t
        }, b = t.Deferred, w = {}, k = "me", x=!0, S = {
            id: s,
            profileId: s,
            firstName: r,
            lastName: r,
            avatarUrl: r,
            hasConferences: _,
            upcomingConferences: y,
            isCommentModerator: _,
            hasEdActivity: _,
            isTEDxOrganizer: _,
            lastDownloaded: s
        }, T = e.keys(S);
        return w.storageAdapter = n, w.getDetails = function() {
            var t = new b;
            return v = v || l(), g() || (v = null), v ? (t.resolve(v), x&&!f(18e4, v.lastDownloaded) && (x=!1, u(new b))) : i.get() ? u(t) : t.reject(), t.promise()
        }, w._check = function(t) {
            var n = 864e5;
            return t&&+t.id ===+ i.get() && T.length === e.keys(e.pick(t, T)).length && f(n, t.lastDownloaded)
        }, w._reset = function() {
            v = void 0, x=!0
        }, w
    }), define("lib/watchLaterLocal", ["exports", "jquery", "lodash", "Modernizr", "lib/currentUserId", "lib/personalStorage"], function(t, e, i, n, s, r) {
        "use strict";
        function o(t) {
            return + t.split("|", 1).pop()
        }
        function a(t) {
            return (t.match(/(\|\d+)+/) || "|")[0] + "|"
        }
        function l(e) {
            var i = new h, n = i.promise(), s = t._checkCapability();
            return s!==!0 ? (i.reject(s), n) : (e.apply(i, Array.prototype.splice.call(arguments, 1)), n)
        }
        var h = e.Deferred, u = "wl", c = null, p = 18e4, d = null;
        t.addPlaylist = function(e) {
            return t._add("playlists", e)
        }, t.addTalk = function(e) {
            return t._add("talks", e)
        }, t.checkPlaylist = function(e) {
            return t._check("playlists", e)
        }, t.checkTalk = function(e) {
            return t._check("talks", e)
        }, t.count = i.wrap(function() {
            var e = this;
            t._getCache().then(function(t) {
                e.resolve({
                    total: t.talksCount + t.playlistsCount,
                    talks: t.talksCount,
                    playlists: t.playlistsCount
                })
            }, function(t) {
                e.reject(t)
            })
        }, l), t.removePlaylist = function(e) {
            return t._remove("playlists", e)
        }, t.removeTalk = function(e) {
            return t._remove("talks", e)
        }, t.sync = i.wrap(function() {
            if (d)
                return d;
            var n = this;
            return d = n.promise(), e.get("/saved_items/sync.txt").then(function(e) {
                return e =+ new Date + ";" + e, (c = t._fromS(e)) ? (r.setItem(u, e), void n.resolve(c)) : void n.reject(new Error("Invalid response"))
            }, function() {
                n.reject(new Error("Rejected by server"))
            }).always(i.delay(function() {
                d = null
            }, p)), d
        }, l), t._add = i.wrap(function(e, i) {
            var n = this;
            t._check(e, i).then(function(s) {
                s || (c[e + "List"] += i + "|", c[e + "Count"]++, r.setItem(u, t._toS(c))), n.resolve(c)
            }, function(t) {
                n.reject(t)
            })
        }, l), t._check = i.wrap(function(e, i) {
            var n = this;
            t._getCache().then(function(t) {
                n.resolve( - 1 !== t[e + "List"].indexOf("|" + i + "|"))
            }, function(t) {
                n.reject(t)
            })
        }, l), t._checkCapability = function() {
            return n.localstorage ? s.get()?!0 : new Error("Not logged in") : new Error("No localStorage")
        }, t._getCache = function() {
            var e = new h, i = e.promise();
            return c ? (e.resolve(c), i) : (c = t._fromS(r.getItem(u)), c ? (e.resolve(c), + new Date-+c.lastSync > p && t.sync()) : t.sync().then(function() {
                e.resolve(c)
            }, function(t) {
                e.reject(t)
            }), i)
        }, t._remove = i.wrap(function(e, i) {
            var n = this;
            t._check(e, i).then(function(s) {
                s && (c[e + "List"] = c[e + "List"].replace("|" + i + "|", "|"), c[e + "Count"]--, r.setItem(u, t._toS(c))), n.resolve(c)
            }, function(t) {
                n.reject(t)
            })
        }, l), t._reset = function() {
            c = null, d = null
        }, t._fromS = function(t) {
            if (!t)
                return null;
            if (!t.match(/^\d+;\d+(\|\d+)*;\d+(\|\d+)*$/))
                return null;
            var e = t.split(";");
            return {
                lastSync: + e[0],
                talksCount: o(e[1]),
                talksList: a(e[1]),
                playlistsCount: o(e[2]),
                playlistsList: a(e[2])
            }
        }, t._toS = function(t) {
            return t ? [t.lastSync, t.talksCount + t.talksList.slice(0, - 1), t.playlistsCount + t.playlistsList.slice(0, - 1)].join(";") : null
        }
    }), define("utils/monogram", ["jquery"], function(t) {
        "use strict";
        return function(e) {
            return (e = t.trim(e)) ? (e = e.split(",")[0], e = e.replace(/\s[a-z]\w+\s/g, " "), e = e.replace(/\s\w+\.$/, ""), e = e.replace(/\s[A-Z]+$/, ""), e = e.replace(/[^\s\w]+([\w])/g, "$1"), e = t.trim(e).toUpperCase().split(/\s+/), e[0][0] + (e.length > 1 ? e[e.length - 1][0] : "")) : ""
        }
    }), define("hbs!templates/accountFixture", ["hbs", "hbs/handlebars", "templates/helpers/t"], function(t, e) {
        var i = e.template(function(t, e, i, n, s) {
            function r(t, e) {
                var n, s = "";
                return s += "\n        ", n = i["if"].call(t, t && t.items, {
                    hash: {},
                    inverse: y.program(10, c, e),
                    fn: y.program(2, o, e)
                }), (n || 0 === n) && (s += n), s += "\n      "
            }
            function o(t, e) {
                var n, s, r = "";
                return r += '\n          <li class="nav__item nav__item--foldable ', n = i["if"].call(t, t && t.open, {
                    hash: {},
                    inverse: y.noop,
                    fn: y.program(3, a, e)
                }), (n || 0 === n) && (r += n), r += '">\n            <a class="nav__link" href="#">', (s = i.name) ? n = s.call(t, {
                    hash: {}
                }) : (s = t && t.name, n = typeof s === v ? s.call(t, {
                    hash: {}
                }) : s), r += _(n) + '</a>\n            <div class="nav__folder" ', n = i["if"].call(t, t && t.open, {
                    hash: {},
                    inverse: y.noop,
                    fn: y.program(5, l, e)
                }), (n || 0 === n) && (r += n), r += '>\n              <ul class="nav__menu">\n                ', n = i.each.call(t, t && t.items, {
                    hash: {},
                    inverse: y.noop,
                    fn: y.program(7, h, e)
                }), (n || 0 === n) && (r += n), r += "\n              </ul>\n            </div>\n          </li>\n        "
            }
            function a() {
                return "nav__item--active"
            }
            function l() {
                return 'style="display:block"'
            }
            function h(t, e) {
                var n, s, r = "";
                return r += '\n                  <li class="nav__item">\n                    <a class="nav__link" href="', (s = i.url) ? n = s.call(t, {
                    hash: {}
                }) : (s = t && t.url, n = typeof s === v ? s.call(t, {
                    hash: {}
                }) : s), r += _(n) + '" ', n = i["if"].call(t, t && t.external, {
                    hash: {},
                    inverse: y.noop,
                    fn: y.program(8, u, e)
                }), (n || 0 === n) && (r += n), r += ">", (s = i.name) ? n = s.call(t, {
                    hash: {}
                }) : (s = t && t.name, n = typeof s === v ? s.call(t, {
                    hash: {}
                }) : s), r += _(n) + "</a>\n                  </li>\n                "
            }
            function u() {
                return 'target="_blank"'
            }
            function c(t, e) {
                var n, s, r = "";
                return r += '\n          <li class="nav__item ', n = i["if"].call(t, t && t.latch, {
                    hash: {},
                    inverse: y.noop,
                    fn: y.program(11, p, e)
                }), (n || 0 === n) && (r += n), r += '">\n            <a class="nav__link" href="', (s = i.url) ? n = s.call(t, {
                    hash: {}
                }) : (s = t && t.url, n = typeof s === v ? s.call(t, {
                    hash: {}
                }) : s), r += _(n) + '" ', n = i["if"].call(t, t && t.external, {
                    hash: {},
                    inverse: y.noop,
                    fn: y.program(8, u, e)
                }), (n || 0 === n) && (r += n), r += ">", (s = i.name) ? n = s.call(t, {
                    hash: {}
                }) : (s = t && t.name, n = typeof s === v ? s.call(t, {
                    hash: {}
                }) : s), r += _(n) + "</a>\n          </li>\n        "
            }
            function p() {
                return "nav__item--latch"
            }
            this.compilerInfo = [4, ">= 1.0.0"], i = this.merge(i, t.helpers);
            var d, f, g, m = "", v = "function", _ = this.escapeExpression, y = this, b = i.helperMissing;
            return m += '\n\n<div class="account__fixture">\n  <div class="account__fixture__welcome">\n    <h2 class="h6">' + _((f = i.t || e && e.t, g = {
                hash: {}
            }, f ? f.call(e, "Hi ", g) : b.call(e, "t", "Hi ", g))) + _((d = e && e.user, d = null == d || d===!1 ? d : d.firstName, typeof d === v ? d.apply(e) : d)) + ",</h2>\n    <div>" + _((f = i.t || e && e.t, g = {
                hash: {}
            }, f ? f.call(e, "This is your stuff.", g) : b.call(e, "t", "This is your stuff.", g))) + '</div>\n  </div>\n\n  <nav class="nav">\n    <ul class="nav__menu">\n      ', d = i.each.call(e, e && e.items, {
                hash: {},
                inverse: y.noop,
                fn: y.program(1, r, s)
            }), (d || 0 === d) && (m += d), m += "\n    </ul>\n  </nav>\n</div>\n"
        });
        return i
    }), define("hbs!templates/accountPoparoo", ["hbs", "hbs/handlebars", "templates/helpers/t"], function(t, e) {
        var i = e.template(function(t, e, i, n, s) {
            function r() {
                return "account__poparoo__later--populated"
            }
            function o(t) {
                var e, n, s, r = "";
                return r += '\n      <li class="account__poparoo__item">\n        <a class="l3" href="/profiles/' + f((e = t && t.user, e = null == e || e===!1 ? e : e.profileId, typeof e === d ? e.apply(t) : e)) + '/tedx-event-management">\n          ' + f((n = i.t || t && t.t, s = {
                    hash: {}
                }, n ? n.call(t, "TEDx Events", s) : g.call(t, "t", "TEDx Events", s))) + "\n        </a>\n      </li>\n    "
            }
            function a(t) {
                var e, n, s, r = "";
                return r += '\n      <li class="account__poparoo__item">\n        <a class="l3" href="' + f((e = t && t.itemUrls, e = null == e || e===!1 ? e : e.conferences, typeof e === d ? e.apply(t) : e)) + '">\n          ' + f((n = i.t || t && t.t, s = {
                    hash: {}
                }, n ? n.call(t, "Conferences", s) : g.call(t, "t", "Conferences", s))) + "\n        </a>\n      </li>\n    "
            }
            function l(t) {
                var e, n, s, r = "";
                return r += '\n      <li class="account__poparoo__item">\n        <a class="l3" href="' + f((e = t && t.itemUrls, e = null == e || e===!1 ? e : e.tedEdHistory, typeof e === d ? e.apply(t) : e)) + '" target="_blank">\n          ' + f((n = i.t || t && t.t, s = {
                    hash: {}
                }, n ? n.call(t, "Your activity on TED-Ed", s) : g.call(t, "t", "Your activity on TED-Ed", s))) + "\n        </a>\n      </li>\n    "
            }
            this.compilerInfo = [4, ">= 1.0.0"], i = this.merge(i, t.helpers);
            var h, u, c, p = "", d = "function", f = this.escapeExpression, g = i.helperMissing, m = this;
            return p += '\n\n<div class="account__poparoo">\n  <h2>' + f((u = i.t || e && e.t, c = {
                hash: {}
            }, u ? u.call(e, "Hi ", c) : g.call(e, "t", "Hi ", c))) + f((h = e && e.user, h = null == h || h===!1 ? h : h.firstName, typeof h === d ? h.apply(e) : h)) + ",</h2>\n  <div>" + f((u = i.t || e && e.t, c = {
                hash: {}
            }, u ? u.call(e, "This is your stuff.", c) : g.call(e, "t", "This is your stuff.", c))) + '</div>\n\n  <ul class="account__poparoo__menu">\n    <li class="account__poparoo__item" id="account-talks">\n      <a class="l3" href="' + f((h = e && e.itemUrls, h = null == h || h===!1 ? h : h.savedTalks, typeof h === d ? h.apply(e) : h)) + '">\n        ' + f((u = i.t || e && e.t, c = {
                hash: {}
            }, u ? u.call(e, "Saved talks", c) : g.call(e, "t", "Saved talks", c))) + '\n      </a>\n\n      <a class="account__poparoo__later ', h = i["if"].call(e, e && e.savedTalksCount, {
                hash: {},
                inverse: m.noop,
                fn: m.program(1, r, s)
            }), (h || 0 === h) && (p += h), p += '" href="' + f((h = e && e.itemUrls, h = null == h || h===!1 ? h : h.savedTalks, typeof h === d ? h.apply(e) : h)) + '">\n        <span class="account__poparoo__later__count">', (u = i.savedTalksCount) ? h = u.call(e, {
                hash: {}
            }) : (u = e && e.savedTalksCount, h = typeof u === d ? u.call(e, {
                hash: {}
            }) : u), p += f(h) + '</span>\n      </a>\n    </li>\n\n    <li class="account__poparoo__item" id="account-playlists">\n      <a class="l3" href="' + f((h = e && e.itemUrls, h = null == h || h===!1 ? h : h.savedPlaylists, typeof h === d ? h.apply(e) : h)) + '">\n        ' + f((u = i.t || e && e.t, c = {
                hash: {}
            }, u ? u.call(e, "Saved playlists", c) : g.call(e, "t", "Saved playlists", c))) + '\n      </a>\n\n      <a class="account__poparoo__later ', h = i["if"].call(e, e && e.savedPlaylistsCount, {
                hash: {},
                inverse: m.noop,
                fn: m.program(1, r, s)
            }), (h || 0 === h) && (p += h), p += '" href="' + f((h = e && e.itemUrls, h = null == h || h===!1 ? h : h.savedPlaylists, typeof h === d ? h.apply(e) : h)) + '">\n        <span class="account__poparoo__later__count">', (u = i.savedPlaylistsCount) ? h = u.call(e, {
                hash: {}
            }) : (u = e && e.savedPlaylistsCount, h = typeof u === d ? u.call(e, {
                hash: {}
            }) : u), p += f(h) + '</span>\n      </a>\n    </li>\n\n    <li class="account__poparoo__item">\n      <a class="l3" href="' + f((h = e && e.itemUrls, h = null == h || h===!1 ? h : h.favoriteTalks, typeof h === d ? h.apply(e) : h)) + '">\n        ' + f((u = i.t || e && e.t, c = {
                hash: {}
            }, u ? u.call(e, "Favorite talks", c) : g.call(e, "t", "Favorite talks", c))) + '\n      </a>\n    </li>\n\n    <li class="account__poparoo__item">\n      <a class="l3" href="' + f((h = e && e.itemUrls, h = null == h || h===!1 ? h : h.favoritePlaylists, typeof h === d ? h.apply(e) : h)) + '">\n        ' + f((u = i.t || e && e.t, c = {
                hash: {}
            }, u ? u.call(e, "Favorite playlists", c) : g.call(e, "t", "Favorite playlists", c))) + "\n      </a>\n    </li>\n\n    ", h = i["if"].call(e, (h = e && e.user, null == h || h===!1 ? h : h.isTEDxOrganizer), {
                hash: {},
                inverse: m.noop,
                fn: m.program(3, o, s)
            }), (h || 0 === h) && (p += h), p += "\n\n    ", h = i["if"].call(e, (h = e && e.user, null == h || h===!1 ? h : h.hasConferences), {
                hash: {},
                inverse: m.noop,
                fn: m.program(5, a, s)
            }), (h || 0 === h) && (p += h), p += "\n\n    ", h = i["if"].call(e, (h = e && e.user, null == h || h===!1 ? h : h.hasEdActivity), {
                hash: {},
                inverse: m.noop,
                fn: m.program(7, l, s)
            }), (h || 0 === h) && (p += h), p += '\n\n    <li class="account__poparoo__item">\n      <a class="l3" href="' + f((h = e && e.itemUrls, h = null == h || h===!1 ? h : h.settings, typeof h === d ? h.apply(e) : h)) + '">\n        ' + f((u = i.t || e && e.t, c = {
                hash: {}
            }, u ? u.call(e, "Settings", c) : g.call(e, "t", "Settings", c))) + '\n      </a>\n    </li>\n\n    <li class="account__poparoo__item">\n      <a class="l3" href="' + f((h = e && e.itemUrls, h = null == h || h===!1 ? h : h.profile, typeof h === d ? h.apply(e) : h)) + '">\n        ' + f((u = i.t || e && e.t, c = {
                hash: {}
            }, u ? u.call(e, "Your profile", c) : g.call(e, "t", "Your profile", c))) + '\n      </a>\n    </li>\n  </ul>\n\n  <a class="account__poparoo__leave" href="' + f((h = e && e.itemUrls, h = null == h || h===!1 ? h : h.logOut, typeof h === d ? h.apply(e) : h)) + '">' + f((u = i.t || e && e.t, c = {
                hash: {}
            }, u ? u.call(e, "Log out", c) : g.call(e, "t", "Log out", c))) + "</a>\n</div>\n"
        });
        return i
    }), define("plugins/addClassFor", ["jquery"], function(t) {
        "use strict";
        t.fn.extend({
            addClassFor: function(t, e) {
                var i = this;
                return window.setTimeout(function() {
                    i.removeClass(t)
                }, e), i.addClass(t)
            }
        })
    }), define("global/account", ["jquery", "lodash", "lib/shoji", "lib/pubSub", "lib/currentUser", "lib/personalStorage", "lib/watchLaterLocal", "utils/monogram", "hbs!templates/accountFixture", "hbs!templates/accountPoparoo", "hbs!templates/latcherFixture", "lib/resize", "transit", "widgets/fixture", "plugins/addClassFor"], function(t, e, i, n, s, r, o, a, l, h, u) {
        "use strict";
        function c(e) {
            var s = n("breakpoint").read() >= 1024;
            if (i.canSlide() && (e.preventDefault(), !s)) {
                if (y)
                    return void y.fixture("reveal");
                y = t(l({
                    items: T(w),
                    user: w
                })).fixture({
                    at: "right"
                }), y.find("li.nav__item--latch a").attr("href", function() {
                    var e = t(this), i = e.attr("href");
                    return e.attr("data-url", i), "#"
                });
                var r = t("div.shoji__fixture--right #submenu");
                if (y.drillDown({
                    tense: r.length ? "past": "present"
                }), r.length) {
                    r.find("h3.submenu__heading").remove();
                    var o = t(u()).append(r.clone().addClass("submenu--fixture"));
                    o.find("a.latcher__back").on("click", function() {
                        y.drillDown("show")
                    }), y.drillDown("queue", o, {
                        tense: "present"
                    })
                }
            }
        }
        function p(t) {
            if (!(1024 > t)) {
                n("breakpoint").unsubscribe(p);
                var e = v.parent().find("div.nav__folder").html(h({
                    itemUrls: S,
                    user: w,
                    savedTalksCount: !1,
                    savedPlaylistsCount: !1
                }));
                b = e.find("a." + x), f()
            }
        }
        function d() {
            _ || (_ = t("#account-link").find("img.banner__account__image")), _.transition({
                opacity: 0
            }).transition({
                opacity: 1
            }).transition({
                opacity: 0
            }).transition({
                opacity: 1
            })
        }
        function f() {
            o.count().done(C)
        }
        function g(t, e) {
            t.find("a.account__poparoo__later")[e ? "addClass": "removeClass"]("account__poparoo__later--populated").find("span").text(e)
        }
        function m(e) {
            var i;
            w = e, E(), f(), w.avatarUrl ? (i = t("<img class=banner__account__image id=account-image>"), i.attr("src", w.avatarUrl), t("#account-image").replaceWith(i)) : t("#account-image").text(a(w.firstName + " " + w.lastName))
        }
        var v, _, y, b, w, k = {}, x = "account__poparoo__later", S = {
            savedTalks: "/dashboard/saved_talks",
            savedPlaylists: "/dashboard/saved_playlists",
            favoriteTalks: "/dashboard/favorite_talks",
            favoritePlaylists: "/dashboard/favorite_playlists",
            watchHistory: "/dashboard/history",
            conferences: "/dashboard/conferences",
            tedEdHistory: "http://ed.ted.com/activity/lessons",
            settings: TED.settingsUrl,
            profile: "/profile",
            logOut: TED.signOutUrl
        }, T = function(t) {
            var e = [];
            if (e.push({
                name: "Talks",
                open: !0,
                items: [{
                    name: "Saved talks",
                    url: S.savedTalks
                }, {
                    name: "Saved playlists",
                    url: S.savedPlaylists
                }, {
                    name: "Favorite talks",
                    url: S.favoriteTalks
                }, {
                    name: "Favorite playlists",
                    url: S.favoritePlaylists
                }, {
                    name: "Talks you've watched",
                    url: S.watchHistory
                }
                ]
            }), t && t.isTEDxOrganizer && e.push({
                name: "TEDx Events",
                url: "/profiles/" + t.profileId + "/tedx-event-management"
            }), t && t.hasConferences) {
                var i = {
                    name: "Conferences",
                    open: !1,
                    items: []
                };
                t.upcomingConferences && t.upcomingConferences.reduce(function(t, e) {
                    return t.push({
                        name: e.name,
                        url: "/dashboard/conferences/" + e.slug
                    }), t
                }, i.items), i.items.push({
                    name: "Badge",
                    url: "/dashboard/conferences/badge"
                }), i.items.push({
                    name: "Contact us",
                    url: "/dashboard/conferences/contact"
                }), e.push(i)
            }
            return t && t.hasEdActivity && e.push({
                name: "Your TED-Ed activity",
                url: S.tedEdHistory,
                external: !0
            }), e.push({
                latch: !0,
                name: "Settings",
                url: TED.settingsUrl
            }), e.push({
                name: "Your profile",
                url: "/profile"
            }), e.push({
                name: "Log out",
                url: TED.signOutUrl
            }), e
        }, C = function() {
            var e, i, n;
            return function(s) {
                var r, o = s.total, a = o > 0;
                if (o !== e) {
                    var l;
                    i && s.talks !== i && (r = "talks", l = s.talks > i), n && s.playlists !== n && (r = "playlists", l = s.playlists > n), r && t("#account-" + r)[l ? "addClass": "removeClass"]("account__poparoo__item--active"), s.talks !== i && g(t("#account-talks"), s.talks), s.playlists !== n && g(t("#account-playlists"), s.playlists);
                    var h = t("#account-badge");
                    h.text(s.total > 99 ? 99 : s.total)[a ? "addClass": "removeClass"]("badge--visible"), a && null !== e && s.total > e && h.addClassFor("badge--notify", 600), i = s.talks, n = s.playlists, e = o
                }
            }
        }(), E = e.once(function() {
            v = t("#account-link"), v.on("click", c), n("breakpoint").subscribe(p), n("favorite.add").subscribe(d), n("watchLater.add").subscribe(f), n("watchLater.remove").subscribe(f)
        });
        return k.init = e.once(function() {
            n("auth.login").subscribe(m), s.getDetails().done(m)
        }), k
    }), define("global/uconf", ["jquery", "Cookies"], function(t, e) {
        "use strict";
        var i = "#";
        return {
            init: function(n, s) {
                t(i + s).on("click", function(s) {
                    s.preventDefault(), t(i + n).slideUp("fast"), e.expire("_uconf", {
                        domain: "ted.com",
                        path: "/"
                    })
                })
            }
        }
    }), define("utils/query_param", [], function() {
        "use strict";
        return function(t) {
            t = t.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var e = new RegExp("[\\?&]" + t + "=([^&#]*)"), i = e.exec(location.search);
            return null === i ? "" : decodeURIComponent(i[1].replace(/\+/g, " "))
        }
    }), define("lib/browserDetect", ["exports"], function(t) {
        "use strict";
        function e(t) {
            for (var e = 0; e < t.length; e++) {
                var i = t[e].string, s = t[e].prop;
                if (n = t[e].versionSearch || t[e].identity, i) {
                    if ( - 1 != i.indexOf(t[e].subString))
                        return t[e].identity
                } else if (s)
                    return t[e].identity
            }
        }
        function i(t) {
            var e = t.indexOf(n);
            if ( - 1 != e)
                return parseFloat(t.substring(e + n.length + 1))
        }
        var n, s = window.navigator, r = [{
            string: s.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        }, {
            string: s.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        }, {
            prop: window.opera,
            identity: "Opera"
        }, {
            string: s.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        }, {
            string: s.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        }, {
            string: s.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        }
        ];
        t.browser = e(r) || "Unknown Browser", t.version = i(window.navigator.userAgent) || i(window.navigator.appVersion) || "Unknown Version"
    }), define("lib/errorCollector", ["jquery", "lodash", "lib/browserDetect", "lib/currentUserId", "exports"], function(t, e, i, n, s) {
        "use strict";
        s.post = e.throttle(function(e) {
            t.post("/error_collector.php", {
                message: e
            })
        }, 5e3), s.log = function(e, r) {
            s.post(t.extend({
                message: e,
                context: "js",
                uri: window.location.href,
                client_name: i.browser,
                client_version: i.version,
                elapsed_seconds: Math.floor(( + new Date - TED.startTime) / 1e3),
                profile_id: n.get() || "N/A",
                user_agent: window.navigator ? window.navigator.userAgent: "Unknown User Agent"
            }, r || {}))
        }
    }), define("widgets/ad", ["lodash", "jquery", "jqueryui/widget"], function(t, e) {
        "use strict";
        e.widget("ted.ad", {
            _rendered: !1,
            $image: null,
            $text: null,
            $link: null,
            blocked: function() {
                this.element.hide()
            },
            refreshJsonAd: function() {
                if (this.options.blocked)
                    return void this.blocked();
                if (this._rendered || (this._addAdClass(), this.element.html(""), this.options.ad.houseAd || this._getAppreciationText().appendTo(this.element), this.$link = e('<a class="ad__unit" href="#" rel="nofollow" target="_blank">').appendTo(this.element), this.$image = e("<img>").appendTo(this.$link), this._rendered=!0), !this.options.ad)
                    return void this.element.hide();
                var t = this._getRenderDetails();
                this.$link.attr("href", t.click), this.$image.attr({
                    src: t.currentCreative.url,
                    width: t.dimensions.width,
                    height: t.dimensions.height
                }), this.element[this.options.ad.hasDisplay===!1 ? "hide": "show"](), this._impress()
            },
            refreshHtmlAd: function() {
                this._addAdClass(), this._getAppreciationText().prependTo(this.element)
            },
            _init: function() {
                this._rendered=!1, "json" == this.options.mode ? this.refreshJsonAd() : "html" == this.options.mode && this.refreshHtmlAd()
            },
            _fireImpression: function(t) {
                var e = new Image;
                e.src = t
            },
            _impress: function() {
                this._fireImpression(this.options.ad.impression), t.forEach(this.options.ad.thirdPartyImpressions, this._fireImpression)
            },
            _getCreative: function() {
                var e = t.filter(this.options.ad.creative, function(t) {
                    return "" !== t.url
                }), i = Math.max(window.devicePixelRatio || 1, 1);
                return t.reduce(e, function(t, e) {
                    return e.density <= i ? e : t || e
                }, {})
            },
            _getRenderDetails: function() {
                return t.extend({
                    currentCreative: this._getCreative()
                }, this.options.ad)
            },
            _getAppreciationText: function() {
                return this.$text = e('<div class="ad__text">TED Talks are free thanks to support from</div>'), this.$text
            },
            _addAdClass: function() {
                this.element.addClass("ad")
            }
        })
    }), define("hbs!templates/sponsorshipBug", ["hbs", "hbs/handlebars"], function(t, e) {
        var i = e.template(function(t, e, i) {
            this.compilerInfo = [4, ">= 1.0.0"], i = this.merge(i, t.helpers);
            var n = "";
            return n += '\n\n<a class="sponsorship-bug__link media" href="#" rel="nofollow" target="_blank">\n  <div class="sponsorship-bug__image media__image media__image--alt">\n    <img src="" alt="">\n  </div>\n  <div class="sponsorship-bug__message media__message">\n    TED Talks are free<br>\n    thanks to support from\n  </div>\n</a>\n'
        });
        return i
    }), define("templates/helpers/assetUrl", ["Handlebars"], function(t) {
        "use strict";
        function e(t) {
            return TED.assetHost + t
        }
        return t.registerHelper("assetUrl", e), e
    }), define("hbs!templates/sponsorshipBugBlocked", ["hbs", "hbs/handlebars", "templates/helpers/assetUrl"], function(t, e) {
        var i = e.template(function(t, e, i) {
            this.compilerInfo = [4, ">= 1.0.0"], i = this.merge(i, t.helpers);
            var n, s, r = "", o = i.helperMissing, a = this.escapeExpression;
            return r += '\n\n<a class="sponsorship-bug__nag" href="http://support.ted.com/customer/portal/articles/1532436-how-can-i-support-ted-by-modifying-my-ad-blocker-settings" target="_blank">\n  <img class="sponsorship-bug__nag__image" src="' + a((n = i.assetUrl || e && e.assetUrl, s = {
                hash: {}
            }, n ? n.call(e, "/temp/ad-blocker-bug.png", s) : o.call(e, "assetUrl", "/temp/ad-blocker-bug.png", s))) + '" alt="Show your support by unblocking ted.com from ad blockers">\n</a>\n'
        });
        return i
    }), define("widgets/sponsorshipBug", ["jquery", "hbs!templates/sponsorshipBug", "hbs!templates/sponsorshipBugBlocked", "widgets/ad"], function(t, e, i) {
        "use strict";
        t.widget("ted.sponsorshipBug", t.ted.ad, {
            blocked: function() {
                this.element.html(i()), this.element.show(), this._rendered=!1
            },
            refreshJsonAd: function() {
                return this.options.blocked ? this.blocked() : (this._rendered || (this.element.html(e()), this.$image = this.element.find("img"), this.$link = this.element.find("a.sponsorship-bug__link"), this._rendered=!0), void this._super())
            },
            _init: function() {
                this.element.addClass("sponsorship-bug"), this._super()
            }
        })
    }), define("lib/ads", ["jquery", "lodash", "utils/query_param", "lib/errorCollector", "widgets/ad", "widgets/sponsorshipBug"], function(t, e, i, n) {
        "use strict";
        function s(e) {
            var i = c[e.type];
            "master" == e.type ? p.deferred.resolve(e) : void 0 === i ? window.console && console.log && (console.log("Unknown ad type"), console.log(e)) : t(i.id)[i.widget]({
                ad: e,
                mode: "json"
            })
        }
        function r(i) {
            e.forEach(p.companionAdSlots, function(e) {
                if (e.gptSlot.setTargeting(e.key, i.target), e.displayed) {
                    var n = t("#" + e.containerId);
                    n.data("tedAd") ? n.ad("destroy") : n.data("sponsorshipBug") && n.sponsorshipBug("destroy"), d.refreshAd(e.gptSlot)
                } else
                    d.displayAd(e.containerId);
                e.displayed=!0
            }), h(i.impression)
        }
        function o(t) {
            d.player.player("sendAds", {
                postroll: a(t.postrollURL),
                preroll: a(t.prerollURL)
            })
        }
        function a(t) {
            return t.replace("{adUnit}", p.slot.adUnit)
        }
        function l(e) {
            var i = d.player = e;
            if (i) {
                var n = d.playerMode = i.player("mode");
                if ("hls" == n)
                    i.on({
                        playerad: function(t, e) {
                            s(e.ad)
                        }
                    });
                else {
                    p.deferred.done(r), i.on({
                        playeradblock: function() {
                            var e = c.bug;
                            t(e.id)[e.widget]({
                                blocked: !0
                            })
                        }
                    });
                    var a=!0;
                    i.on({
                        playertalk: function(t, e) {
                            a && i.player("talks")[0].id == e.id ? (a=!1, "flash" == n && p.deferred.done(o)) : d.refreshMasterAd({
                                targeting: e.targeting
                            }), a=!1
                        }
                    })
                }
            }
        }
        function h(t) {
            var e = new Image;
            e.src = t
        }
        function u() {
            e.forEach(p.slot.targeting, function(t, i) {
                p.slot.gptSlot.setTargeting(i, e.isArray(t) ? t.join(",") : t)
            });
            var t = i("dfptest");
            t && p.slot.gptSlot.setTargeting("dfptest", t)
        }
        var c, p = {
            companionAdSlots: [],
            deferred: t.Deferred(),
            slot: {
                adUnit: null,
                containerId: null,
                gptSlot: null,
                targeting: {}
            }
        }, d = {
            player: null
        };
        return window.googletag = window.googletag || {
            cmd: []
        }, c = {
            bug: {
                id: "#sponsorship-bug-placeholder",
                widget: "sponsorshipBug"
            },
            companion: {
                id: "#ad-unit",
                widget: "ad"
            },
            "companion-mobile": {
                id: "#ad-unit-mobile",
                widget: "ad"
            },
            devil: {
                id: "#devil-ad",
                widget: "ad"
            },
            onPage: {
                id: "#ad-unit",
                widget: "ad"
            }
        }, window.googletag.cmd.push(function() {
            googletag.pubads().addEventListener("slotRenderEnded", function(i) {
                var n = e.find(p.companionAdSlots, function(t) {
                    return t.gptSlot == i.slot
                });
                if (n && "ad-unit" == n.containerId&&!i.isEmpty) {
                    var s = t("#ad-unit"), r = s.data("tedAd");
                    r || s.ad({
                        mode: "html"
                    })
                }
            })
        }), d.displayMasterAd = function(t) {
            p.slot.containerId = t.containerId, p.slot.adUnit = t.adUnit, window.googletag.cmd.push(function() {
                googletag && googletag.impl && googletag.impl.pubads && (googletag.impl.pubads.setAdContentsBySlotForSync = function(t) {
                    n.log("sync ad call", t)
                }), p.slot.gptSlot = googletag.defineOutOfPageSlot(p.slot.adUnit, p.slot.containerId).addService(googletag.pubads()), e.assign(p.slot.targeting, t.targeting), u(), d.displayAd(p.slot.containerId)
            })
        }, d.refreshMasterAd = function(i) {
            "hls" != d.playerMode && (p.deferred = t.Deferred(), p.deferred.done(r), "flash" == d.playerMode && p.deferred.done(o), p.slot.gptSlot.clearTargeting(), e.forEach(p.companionAdSlots, function(t) {
                t.gptSlot.clearTargeting()
            }), e.assign(p.slot.targeting, i.targeting), u(), d.refreshAd(p.slot.gptSlot))
        }, d.displayAd = function(e) {
            t(function() {
                window.googletag.cmd.push(function() {
                    googletag.display(e)
                })
            })
        }, d.refreshAd = function(t) {
            window.googletag.cmd.push(function() {
                googletag.pubads().refresh([t])
            })
        }, d.createCompanionSlot = function(t) {
            window.googletag.cmd.push(function() {
                var e = googletag.defineSlot(t.adUnit, t.size, t.containerId).addService(googletag.pubads());
                p.companionAdSlots.push({
                    containerId: t.containerId,
                    gptSlot: e,
                    key: t.key
                })
            })
        }, d.initPlayer = l, d.gptAd = function(t) {
            s(t.ad)
        }, d
    }), define("global/errors", ["lib/errorCollector"], function(t) {
        "use strict";
        window.onerror = function(e, i, n) {
            n && i.match(/^https?:\/\/(?:.*\.)?(?:ted|tedcdn)\.com\//) && (!i.match(/\.js/) && 5 > n || t.log(e, {
                file: i,
                line: n
            }))
        }
    }), define("hbs!templates/authPromptModal", ["hbs", "hbs/handlebars", "templates/helpers/icon"], function(t, e) {
        var i = e.template(function(t, e, i) {
            this.compilerInfo = [4, ">= 1.0.0"], i = this.merge(i, t.helpers);
            var n, s, r, o = "", a = "function", l = this.escapeExpression, h = i.helperMissing;
            return o += '\n\n<div class="auth-prompt__section auth-prompt__header">\n  <h2 class="auth-prompt__header__title">\n    Log in to\n    TED\n  </h2>\n\n  <a href="#" class="modal__close auth-prompt__close">\n    <i class="g-button-modal-close">Close</i>\n  </a>\n</div>\n\n<div class="auth-prompt__section auth-prompt__options">\n  <form class="auth-prompt__option auth-prompt__option--standard">\n    <div class="auth-prompt__message">\n      Your email or password was incorrect.\n    </div>\n\n    <div class="m3">\n      <label class="form-label">Email</label>\n      <input class="form-control auth-prompt__email" name="user[email]" type="email">\n    </div>\n\n    <div class="m3">\n      <label class="form-label">Password</label>\n      <input class="form-control auth-prompt__password" name="user[password]" type="password">\n    </div>\n\n    <div class="m3">\n      <label>\n        <input class="auth-prompt__remember" type="checkbox" checked name="user[remember_me]">\n        <span class="form-label" style="display:inline; margin-left: 2px;">\n          Remember me\n        </span>\n      </label>\n    </div>\n\n    <div>\n      <button class="button button--dark auth-prompt__login">Log in</button>\n      <a class="l3 auth-prompt__halp" href="', (s = i.signInHelpUrl) ? n = s.call(e, {
                hash: {}
            }) : (s = e && e.signInHelpUrl, n = typeof s === a ? s.call(e, {
                hash: {}
            }) : s), o += l(n) + '" target="_blank">Need help logging in?</a>\n    </div>\n  </form>\n\n  <div class="auth-prompt__option auth-prompt__option--social">\n    <button class="button button--wide button--dark button--labeled button--facebook auth-prompt__facebook">\n      ' + l((s = i.icon || e && e.icon, r = {
                hash: {}
            }, s ? s.call(e, "facebook", "", "button__icon", r) : h.call(e, "icon", "facebook", "", "button__icon", r))) + '\n      <span class="button__label">Log in with Facebook</span>\n    </button>\n  </div>\n</div>\n\n<div class="auth-prompt__section auth-prompt__footer">\n  <span class="auth-prompt__footer__question">Don\'t have an account yet?</span>\n  <a class="l3" href="', (s = i.signUpUrl) ? n = s.call(e, {
                hash: {}
            }) : (s = e && e.signUpUrl, n = typeof s === a ? s.call(e, {
                hash: {}
            }) : s), o += l(n) + '" target="_blank">Sign up</a>\n</div>\n\n<div class="auth-prompt__thinking"></div>\n'
        });
        return i
    }), define("hbs!templates/modalDefault", ["hbs", "hbs/handlebars", "templates/helpers/t"], function(t, e) {
        var i = e.template(function(t, e, i) {
            this.compilerInfo = [4, ">= 1.0.0"], i = this.merge(i, t.helpers);
            var n, s, r, o = "", a = i.helperMissing, l = this.escapeExpression, h = "function";
            return o += '\n\n<div class="modal__head">\n  <a class="modal__close modal__head__close" href="#">\n    <i class="g-button-modal-close">' + l((s = i.t || e && e.t, r = {
                hash: {}
            }, s ? s.call(e, "Close", r) : a.call(e, "t", "Close", r))) + '</i>\n  </a>\n  <h3 class="modal__head__title">', (s = i.title) ? n = s.call(e, {
                hash: {}
            }) : (s = e && e.title, n = typeof s === h ? s.call(e, {
                hash: {}
            }) : s), o += l(n) + "</h3>\n</div>\n"
        });
        return i
    }), define("widgets/modal", ["jquery", "lodash", "hbs!templates/modalDefault", "lib/pubSub", "jqueryui/widget", "lib/resize"], function(t, e, i, n) {
        "use strict";
        function s() {
            u || (h = t(window), a = t(document.body), l = t("html"))
        }
        var r, o, a, l, h, u = 0, c = "modal-backdrop--show", p = "modal--show", d = "modal-open", f = "modal__content", g = 0;
        return o = ["<div class=modal>", "<div class=modal__outer>", "<div class=modal__inner>"].join(""), n("breakpoint").subscribe(function(t) {
            r = 768 > t
        }), t.widget("ted.modal", {
            options: {
                align: "middle",
                autoOpen: !0
            },
            _create: function() {
                var e = this;
                s(), this.options.title && this.element.prepend(i(this.options)), this.modal = this.element.addClass(f).css("display", "").wrap(o).closest("div.modal"), this.modal.addClass("modal--align-" + this.options.align), this.backdrop = t("<div class=modal-backdrop>"), this.wrapper = t("<div class=modal-wrapper>").append(this.backdrop).append(this.modal), this.wrapper.on("click", function(i) {
                    return r?!0 : t(i.target).closest("div.modal__content").length?!0 : (i.preventDefault(), void e.close())
                }), this._on("keyup", function(t) {
                    t.preventDefault(), 27 === t.keyCode && e.close()
                }), a.append(this.wrapper), this._on("a.modal__close", {
                    click: function(t) {
                        t.preventDefault(), e.close()
                    }
                }), this.options.autoOpen && e.open()
            },
            _destroy: function() {
                var t = this;
                e.defer(function() {
                    t.wrapper.remove()
                })
            },
            open: function() {
                var t = this;
                return this._hasOpened ? (t.backdrop.addClass(c), t.openedAt = {
                    y: h.scrollTop()
                }, g++||l.addClass(d), r && window.scrollTo(0, 0), t.modal.addClass(p), void t._trigger("open")) : void window.setTimeout(function() {
                    t._hasOpened || (t._hasOpened=!0, t.open())
                }, 10)
            },
            close: function() {
                this.modal.removeClass(p), --g || l.removeClass(d), this.openedAt && window.scrollTo(0, this.openedAt.y), this.backdrop.removeClass(c), this._trigger("close")
            }
        }), function(e, i) {
            return t(e).modal(i)
        }
    }), define("views/AuthPromptView", ["lodash", "Modernizr", "Backbone", "lib/auth", "hbs!templates/authPromptModal", "spinjs", "widgets/modal"], function(t, e, i, n, s, r) {
        "use strict";
        function o() {
            n || (n = require("lib/auth"))
        }
        var a = i.View.extend({
            template: s,
            events: {
                "click button.auth-prompt__facebook": "facebook",
                "click button.auth-prompt__login": "login",
                "submit form.auth-prompt__option--standard": "login"
            },
            close: function() {
                this.$el.modal("close")
            },
            open: function() {
                this.$el.removeClass("auth-prompt--error"), this.$el.modal("open");
                var t = e.localstorage ? window.localStorage.getItem("auth") || "": "";
                this.$email.val(t), this[t ? "$password": "$email"].focus()
            },
            login: function(t) {
                t && t.preventDefault(), this._startThinking(), o(), n.login(this.$email.val(), this.$password.val()).then(this._loginSuccess, this._loginFailure).always(this._stopThinking), this.$password.val("")
            },
            facebook: function(t) {
                t && t.preventDefault(), this._startThinking(), o(), n.facebook().then(this._facebookSuccess, this._facebookFailure).always(this._stopThinking)
            },
            initialize: function() {
                var t = this;
                this._loginSuccess = function() {
                    t.close();
                    var i = t.$email.val();
                    i && e.localstorage && window.localStorage.setItem("auth", t.$el.find("input.auth-prompt__remember").is(":checked") ? i : ""), t.trigger("login.success")
                }, this._facebookSuccess = this._loginSuccess, this._loginFailure = function() {
                    t.$el.addClass("auth-prompt--error"), t.trigger("login.failure")
                }, this._facebookFailure = function() {
                    t.trigger("login.failure")
                }, this._stopThinking = function() {
                    t.$thinkers.prop("disabled", !1), t.$el.removeClass("auth-prompt--thinking"), t._spinner && t._spinner.stop()
                }
            },
            render: function() {
                var t = this;
                return this.$el.addClass("auth-prompt").html(t.template({
                    signInHelpUrl: TED.signInHelpUrl,
                    signUpUrl: TED.signUpUrl
                })).modal({
                    autoOpen: !1
                }).on("modalclose", function() {
                    t.trigger("close")
                }).on("modalopen", function() {
                    t.trigger("open")
                }), this.$email = this.$el.find("input.auth-prompt__email"), this.$password = this.$el.find("input.auth-prompt__password"), this.$thinkers = this.$el.find(["form.auth-prompt__option--standard", "button.auth-prompt__login", "button.auth-prompt__facebook"].join(", ")).add(this.$email).add(this.$password), this
            },
            _startThinking: function() {
                this.$thinkers.prop("disabled", !0), this.$el.addClass("auth-prompt--thinking"), this._spinner || (this._spinner = new r({
                    className: "spinner spinner--centered"
                })), this._spinner.spin(this.el)
            }
        });
        return a
    }), define("hbs!templates/authError", ["hbs", "hbs/handlebars", "templates/helpers/t"], function(t, e) {
        var i = e.template(function(t, e, i) {
            this.compilerInfo = [4, ">= 1.0.0"], i = this.merge(i, t.helpers);
            var n, s, r = "", o = i.helperMissing, a = this.escapeExpression;
            return r += '\n\n<div>\n  <div class="modal__head">\n    <a class="modal__close modal__head__close" href="#">\n      <i class="g-button-modal-close">' + a((n = i.t || e && e.t, s = {
                hash: {}
            }, n ? n.call(e, "Close", s) : o.call(e, "t", "Close", s))) + '</i>\n    </a>\n    <h3 class="modal__head__title">' + a((n = i.t || e && e.t, s = {
                hash: {}
            }, n ? n.call(e, "Error", s) : o.call(e, "t", "Error", s))) + "</h3>\n  </div>\n\n  <p>" + a((n = i.t || e && e.t, s = {
                hash: {}
            }, n ? n.call(e, "Sorry, an error occurred. Please log in and try again.", s) : o.call(e, "t", "Sorry, an error occurred. Please log in and try again.", s))) + '</p>\n  <p><a class="l3" href="/session/new">' + a((n = i.t || e && e.t, s = {
                hash: {}
            }, n ? n.call(e, "Log in", s) : o.call(e, "t", "Log in", s))) + "</a></p>\n</div>\n"
        });
        return i
    }), define("utils/callback", ["lodash"], function(t) {
        "use strict";
        var e = "tedc" + + new Date, i = 0;
        return function(n) {
            var s = e + ++i, r = this;
            return window[s] = function() {
                n.apply(r, t.toArray(arguments)), delete window[s]
            }, s
        }
    }), define("utils/iframep", ["jquery", "utils/callback"], function(t, e) {
        "use strict";
        return function(i) {
            function n() {
                "pending" === r.state && (r.reject(), delete window[o])
            }
            function s() {
                var t = l.contentDocument || l.contentWindow && l.contentWindow.document;
                window[o] && window.setTimeout("complete" === t.readyState ? n : s, 300)
            }
            var r = new t.Deferred, o = e(function(t) {
                r.resolve(t)
            });
            i = i.replace("callback=?", "callback=" + o);
            var a = t("<iframe></iframe>").css({
                display: "none",
                width: 0,
                height: 0
            }).appendTo(document.body), l = a.get(0);
            return a.ready(s).attr("src", i), r.always(function() {
                a.remove()
            }), window.setTimeout(n, 5e3), r.promise()
        }
    }), define("utils/origin", [], function() {
        "use strict";
        return window.location.origin || window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "")
    }), define("lib/auth", ["jquery", "lodash", "lib/currentUser", "lib/errorCollector", "Modernizr", "views/AuthPromptView", "hbs!templates/authError", "utils/callback", "utils/iframep", "utils/origin", "lib/pubSub", "exports"], function(t, e, i, n, s, r, o, a, l, h, u, c) {
        "use strict";
        function p(t) {
            t.done(function(t) {
                u("auth.login").publish(t)
            })
        }
        function d() {
            w ? w.open() : t(o()).modal()
        }
        function f() {
            if (!S)
                throw new Error("lib/auth: please check auth.capable() to ensure client support before using auth methods.");
            if (!c.capable())
                throw d(), new Error("lib/auth: this client is not capable of using auth methods.")
        }
        function g() {
            return l("/session/check?callback=?").done(m)
        }
        function m(e) {
            t("head").append(v("csrf-param", e.csrf.param) + v("csrf-token", e.csrf.token))
        }
        function v(t, e) {
            return '<meta name="' + t + '" content="' + e + '">'
        }
        function _(t, e) {
            return function() {
                t.reject();
                var i = "Auth error: " + e;
                n.log(i), T && T.log && T.log(i)
            }
        }
        function y(t) {
            return i.getDetails().done(function(e) {
                t.resolve(e)
            })
        }
        function b() {
            r || (r = require("views/AuthPromptView"))
        }
        var w, k, x, S=!1, T = window.console, C = function() {
            x || (b(), x = new r, x.on("close", function() {
                e.defer(function() {
                    k && "pending" !== k.state() && k.reject()
                })
            }).on("login.success", function() {
                y(k).fail(d)
            }).render()), x.open()
        };
        c.capable = function() {
            return S=!0, s.cors&&!document.location.port
        }, c.facebook = function() {
            function e(t) {
                t && t.csrf && m(t), "pending" === i.state() && (p(i), y(i).fail(_(i, "unable to corroborate Facebook authentication")), s && s.close())
            }
            f();
            var i = new t.Deferred, n = a(e), s = window.open(TED.authHost + "/account/auth/facebook?referer=" + encodeURIComponent(h + "/session/check?callback=" + n), "authfb", ["scrollbars=1", "resizable=1", "height=480", "width=640"].join(",")), r = 0, o = 300, l = 1e4, u = window.setInterval(function() {
                r++, (s.closed ||!s && r * o > l) && (e(), window[n] && delete window[n], window.clearInterval(u), u = null)
            }, o);
            return i.promise()
        }, c.login = function(e, i) {
            f();
            var n = new t.Deferred;
            return y(n).fail(function() {
                t.ajax({
                    url: TED.authHost + "/session/new.json",
                    timeout: 3e3,
                    type: "GET",
                    xhrFields: {
                        withCredentials: !0
                    }
                }).then(function(s) {
                    p(n), t.ajax({
                        url: TED.authHost + "/session.json",
                        timeout: 3e3,
                        type: "POST",
                        data: {
                            authenticity_token: s.authenticity_token,
                            user: {
                                email: e,
                                password: i
                            }
                        },
                        xhrFields: {
                            withCredentials: !0
                        }
                    }).then(function() {
                        g().then(function() {
                            y(n).fail(_(n, "unable to corroborate authentication"))
                        }, _(n, "session check timed out"))
                    }, _(n, "credentials rejected"))
                }, _(n, "could not obtain token"))
            }), n.promise()
        }, c.logout = function() {
            f()
        }, c.prompt = function() {
            f();
            var e = new t.Deferred;
            return k = e, y(e).fail(C), e.promise()
        }, u("auth.login").subscribe(function() {
            t(document.documentElement).addClass("loggedin").removeClass("loggedout")
        }), t(function() {
            t(document).on("click", "a.auth-login", function(t) {
                c.capable() && (t.preventDefault(), c.prompt())
            })
        })
    }), require(["jquery", "lodash", "dq", "global/floodlight", "global/links", "global/subscribe", "global/navs", "global/mainNav", "global/login", "global/account", "global/uconf", "lib/ads", "global/errors", "lib/auth", "jqueryujs"], function(t, e, i, n, s, r, o, a, l, h, u, c) {
        "use strict";
        e.defer(function() {
            s.init(), r.init(), o.init(), a.init(), l.init(), h.init()
        }), i({
            q: _g,
            modules: {
                ads: c,
                floodlight: n,
                uconf: u
            }
        })
    }), define("global", function() {}), define("home", ["jquery", "lodash", "dq", "home/spotlightCustom", "Backbone", "collections/TalkGridTalks", "views/TalkGridView", "lib/ga", "exports", "global"], function(t, e, i, n, s, r, o, a, l) {
        "use strict";
        function h() {
            var e = t("#talk-grid-filter-dropdown"), i = t("#talk-grid-filter-links").find("a"), n = "home-grid__filter--current";
            e.on("change", function(t) {
                var s = e.val();
                i.removeClass(n).filter("a[data-filter=" + s + "]").addClass(n), c(s, t)
            }), i.on("click", function(s) {
                var r = t(this);
                if (s.preventDefault(), !r.hasClass(n)) {
                    i.removeClass(n), r.addClass(n);
                    var o = r.data("filter");
                    e.val(o), c(o)
                }
            })
        }
        function u(t) {
            var e = new r;
            e.add(t);
            var i = new o({
                el: document.getElementById("talk-grid"),
                collection: e
            });
            i.render(), i.on("showNext", function() {
                a.sendEvent("homepage.talkGrid", "nav", "next"), p++
            }), i.on("showPrev", function() {
                a.sendEvent("homepage.talkGrid", "nav", "prev"), p--
            }), i.on("showPage", function(t) {
                a.sendEvent("homepage.talkGrid", "nav", t), p = t
            }), i.on("loadTalk", function(t) {
                a.sendEvent("homepage.talkGrid", "click", p + " | " + d + " | " + t.get("id"))
            }), l.gridView = i
        }
        function c(t) {
            return d = t, p = 1, a.sendEvent("homepage.talkGrid", "show", t), "explore" === t ? void e.delay(function() {
                location.href = "/talks"
            }, 50) : void l.gridView.setFilter(t)
        }
        var p = 1, d = "newest";
        l.init = e.once(function(t) {
            u(t.talks), h()
        }), l.spotlight = e.once(function() {
            t("a.spotlight__item").each(function() {
                a.sendEvent("homepage.spotlight", "impression", t(this).data("ga-label"), {
                    nonInteraction: 1
                })
            })
        }), n && (l.spotlightCustom = n), i({
            modules: {
                home: l
            }
        })
    })
}();
//# sourceMappingURL=home.js
//# sourceMappingURL=home.js.map

