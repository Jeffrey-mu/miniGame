! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).minigame = {})
}(this, function(L) {
    "use strict";

    function h(t, o, a, c) {
        return new(a = a || Promise)(function(n, e) {
            function r(t) {
                try {
                    s(c.next(t))
                } catch (t) {
                    e(t)
                }
            }

            function i(t) {
                try {
                    s(c.throw(t))
                } catch (t) {
                    e(t)
                }
            }

            function s(t) {
                var e;
                t.done ? n(t.value) : ((e = t.value) instanceof a ? e : new a(function(t) {
                    t(e)
                })).then(r, i)
            }
            s((c = c.apply(t, o || [])).next())
        })
    }
    var i, s;

    function M(n, r) {
        return h(this, void 0, void 0, function*() {
            return new Promise((t, e) => {
                setTimeout(() => {
                    try {
                        r && r(),
                            t()
                    } catch (t) {
                        e(t)
                    }
                }, 1e3 * n)
            })
        })
    }
    (t = i = i || {})[t.INTERSTITIAL = 0] = "INTERSTITIAL",
    t[t.REWARDED_VIDEO = 1] = "REWARDED_VIDEO",
        t[t.BANNER = 2] = "BANNER",
        (t = s = s || {})[t.NONE = 0] = "NONE",
        t[t.NEW = 1] = "NEW",
        t[t.LOADING = 2] = "LOADING",
        t[t.LOADED = 3] = "LOADED",
        t[t.PLAYING = 4] = "PLAYING";
    const z = {
            code: "AD_INSTANCE_STILL_CREATING",
            message: "AdInstance is on creating."
        },
        H = {
            code: "EXCEED_MAX_AD_INSTANCE",
            message: "Max AD Instance allowed: 3"
        },
        F = {
            code: "NO_READY_AD_INSTANCE",
            message: "AD Instance Not Ready or Played too frequently"
        },
        K = {
            code: "NOT_READY_FOR_LOAD",
            message: "Not Ready for Load"
        },
        G = {
            code: "AD_IS_LOADING",
            message: "AD is Loading"
        },
        V = {
            code: "NOT_READY_FOR_PLAYING",
            message: "Not Ready for Playing"
        },
        W = {
            code: "AD_IS_PLAYING",
            message: "AD is Playing"
        },
        U = {
            code: "NO_BANNER_AD",
            message: "No Banner Ad Instance"
        },
        q = {
            code: "API_NOT_SUPPORT",
            message: "API Not Support"
        },
        j = {
            code: "TOO_FAST_SHOW",
            message: "Too Fast To Show Ads"
        },
        Y = {
            code: "NOT_PLAYING",
            message: "Ads Not Playing"
        },
        X = {
            code: "TOO_MANY_ERRORS",
            message: "Too Many Errors, Stop Next Action"
        },
        $ = "RATE_LIMITED",
        J = "ADS_NO_FILL";

    function Z(t, e, n) {
        return t && void 0 !== t[e] ? t[e] : n
    }
    class Q {
        constructor(t, e) {
            this._lastShowTime = 0,
                this._refreshInterval = 0,
                this._refreshInterval = 0 < t ? t : 0,
                (this._lastShowTime = 0) < e && (this._lastShowTime = Date.now() + 1e3 * e - 1e3 * this._refreshInterval)
        }
        isReadyToRefresh() {
            return this.getNextRefreshInterval() <= 0
        }
        getNextRefreshInterval() {
            let t = 0;
            var e;
            return 0 < this._refreshInterval && 0 < this._lastShowTime && (e = Date.now(),
                    t = this._refreshInterval - (e - this._lastShowTime) / 1e3),
                t
        }
        updateLastShowTime() {
            this._lastShowTime = Date.now()
        }
    }
    class tt {
        constructor(t, e, n, r) {
            this._maxLoadError = 0,
                this._errorCounter = 0,
                this._fatalError = !1,
                this._sharedTimer = null,
                this._adId = t,
                this._state = s.NONE,
                this._type = e,
                this._sharedTimer = n,
                this._fatalError = !1,
                console.assert(!!n, "sharedTimer is invalid", n),
                this._maxLoadError = Z(r, "maxLoadError", 0)
        }
        getStateName() {
            {
                var e = this._state;
                let t = "NONE";
                switch (e) {
                    case s.NEW:
                        t = "NEW";
                        break;
                    case s.LOADING:
                        t = "LOADING";
                        break;
                    case s.LOADED:
                        t = "LOADED";
                        break;
                    case s.PLAYING:
                        t = "PLAYING"
                }
                return t
            }
        }
        getAdTypeName() {
            return this._type === i.INTERSTITIAL ? "Interstitial" : this._type === i.REWARDED_VIDEO ? "RewardedVideo" : this._type === i.BANNER ? "Banner" : "UNKNOWN"
        }
        getInfo() {
            return `[${this.getAdTypeName()}:${this._adId}:${this.getStateName()}]`
        }
        isReadyToRefresh() {
            return this._sharedTimer.isReadyToRefresh()
        }
        getNextRefreshInterval() {
            return this._sharedTimer.getNextRefreshInterval()
        }
        updateLastShowTime() {
            this._sharedTimer.updateLastShowTime()
        }
        increaseErrorCounter() {
            this._errorCounter++
        }
        resetErrorCounter() {
            this._errorCounter = 0
        }
        setFatalError() {
            this._fatalError = !0
        }
        isErrorTooMany() {
            return this._fatalError || 0 < this._maxLoadError && this._errorCounter >= this._maxLoadError
        }
    }
    class et extends tt {
        constructor(t, e, n, r) {
            super(t, e, n, r),
                this._adInstance = null,
                this._autoLoadOnPlay = Z(r, "autoLoadOnPlay", !1)
        }
        loadAsync() {
            return h(this, void 0, void 0, function*() {
                if (null === this._adInstance) {
                    if (this._state !== s.NONE)
                        throw console.log("Ad Instance is still creating: " + this.getInfo()),
                            z;
                    this._state = s.NEW,
                        console.log("Get Ad Instance: " + this.getInfo()),
                        this._adInstance = yield this.createAdInstanceAsync(this._adId)
                }
                if (this._state !== s.NEW)
                    throw console.log("Not ready for preload: " + this.getInfo()),
                        this._state === s.LOADING ? (console.log("Ad is loading, do not reload" + this.getInfo()),
                            G) : K;
                if (this.isErrorTooMany())
                    throw console.log("Too many errors, stop loading: " + this.getInfo()),
                        X;
                try {
                    this._state = s.LOADING,
                        console.log("Start Loading: " + this.getInfo()),
                        yield this._adInstance.loadAsync(),
                        this._state = s.LOADED,
                        this.resetErrorCounter(),
                        console.log("Loading Success: " + this.getInfo())
                } catch (t) {
                    var e;
                    throw console.info("Loading Failed: " + this.getInfo(), t),
                        t.code === J ? (console.info("Ads Not Fill, stop loading: " + this.getInfo()),
                            this.setFatalError()) : (this.increaseErrorCounter(),
                            this._state = s.NEW,
                            e = 10 * this._errorCounter + 1,
                            console.log("Reload after " + e + " seconds: " + this.getInfo()),
                            this.safeReLoadAsync(e)),
                        t
                }
            })
        }
        isReady() {
            return null !== this._adInstance && this._state === s.LOADED
        }
        safeReLoadAsync(t = 1) {
            return h(this, void 0, void 0, function*() {
                M(t, () => h(this, void 0, void 0, function*() {
                    try {
                        yield this.loadAsync()
                    } catch (t) {
                        console.info("Reload Error: ", t)
                    }
                })).catch(t => {
                    console.info("Reload failed: " + this.getInfo(), t)
                })
            })
        }
        showAsync() {
            return h(this, void 0, void 0, function*() {
                if (!this.isReady())
                    throw console.log("Not Ready for play: " + this.getInfo()),
                        this._state === s.PLAYING ? W : V;
                if (!this.isReadyToRefresh())
                    throw console.log("Play too frequently, wait for " + this.getNextRefreshInterval() + " seconds: " + this.getInfo()),
                        j;
                try {
                    this._state = s.PLAYING,
                        console.log("Play Ads: " + this.getInfo()),
                        yield this._adInstance.showAsync(),
                        console.log("Play Success: " + this.getInfo()),
                        this._adInstance = null,
                        this._state = s.NONE,
                        this.updateLastShowTime(),
                        this._autoLoadOnPlay && (console.log("Reload after 1 seconds: " + this.getInfo()),
                            this.safeReLoadAsync(1))
                } catch (t) {
                    throw console.log("Play Failed: " + this.getInfo(), t),
                        t.code === $ ? this._state = s.LOADED : (this._adInstance = null,
                            this._state = s.NONE,
                            this._autoLoadOnPlay && (console.log("Reload after 1 seconds: " + this.getInfo()),
                                this.safeReLoadAsync(1))),
                        t
                }
            })
        }
    }
    class nt extends et {
        constructor(t, e, n) {
            super(t, i.INTERSTITIAL, e, n)
        }
        createAdInstanceAsync(t) {
            return h(this, void 0, void 0, function*() {
                return yield FBInstant.getInterstitialAdAsync(this._adId)
            })
        }
    }
    class rt extends et {
        constructor(t, e, n) {
            super(t, i.REWARDED_VIDEO, e, n)
        }
        createAdInstanceAsync(t) {
            return h(this, void 0, void 0, function*() {
                return yield FBInstant.getRewardedVideoAsync(this._adId)
            })
        }
    }
    class it extends tt {
        constructor(t, e, n) {
            super(t, i.BANNER, e, n)
        }
        showAsync() {
            return h(this, void 0, void 0, function*() {
                if (!this.isReadyToRefresh())
                    throw console.log("Play too frequently, wait for " + this.getNextRefreshInterval() + " seconds: " + this.getInfo()),
                        j;
                if (this.isErrorTooMany())
                    throw console.log("Too many errors, stop: " + this.getInfo()),
                        X;
                if (this._state === s.LOADING)
                    throw console.info("Banner is loading, wait for it: " + this.getInfo()),
                        G;
                try {
                    this._state = s.LOADING,
                        console.log("Show Banner: " + this.getInfo()),
                        yield FBInstant.loadBannerAdAsync(this._adId),
                        this._state = s.PLAYING,
                        console.log("Show Banner Success: " + this.getInfo()),
                        this.updateLastShowTime(),
                        this.resetErrorCounter()
                } catch (t) {
                    throw console.info("Show Banner Failed: " + this.getInfo(), t),
                        t.code === $ ? this._state = s.NONE : t.code === J ? (console.info("Ads Not Fill, Stop: " + this.getInfo()),
                            this.setFatalError()) : (this.increaseErrorCounter(),
                            this._state = s.NONE),
                        t
                }
            })
        }
        hideAsync() {
            return h(this, void 0, void 0, function*() {
                if (this._state !== s.PLAYING)
                    throw console.log("No Banner Playing: " + this.getInfo()),
                        Y;
                try {
                    console.log("Hide Banner: " + this.getInfo()),
                        yield FBInstant.hideBannerAdAsync(),
                        this._state = s.NONE
                } catch (t) {
                    throw console.info("Hide Banner Failed: " + this.getInfo(), t),
                        t
                }
            })
        }
    }
    class a {
        static getVersion() {
            return "1.0.4"
        }
        static initAdOption(t) {
            try {
                this._fb_max_ad_instance = t.fb_max_ad_instance,
                    this._fb_init_ad_count = t.fb_init_ad_count,
                    this.defaultInterstitialOption = {
                        autoLoadOnPlay: t.fb_auto_load_on_play,
                        maxLoadError: t.fb_max_interstitial_error
                    },
                    this.defaultRewardedVideoOption = {
                        autoLoadOnPlay: t.fb_auto_load_on_play,
                        maxLoadError: t.fb_max_rewarded_video_error
                    },
                    this.defaultBannerOption = {
                        autoLoadOnPlay: t.fb_auto_load_on_play,
                        maxLoadError: t.fb_max_banner_error
                    },
                    this.defaultInterstitialTimerOption = {
                        refreshInterval: t.fb_interstitial_refresh_interval,
                        delayForFirstAd: t.fb_ad_delay_for_first_interstitial
                    },
                    this.defaultRewardedVideoTimerOption = {
                        refreshInterval: t.fb_rewarded_video_refresh_interval,
                        delayForFirstAd: t.fb_ad_delay_for_first_rewarded_video
                    },
                    this.defaultBannerTimerOption = {
                        refreshInterval: t.fb_banner_refresh_interval,
                        delayForFirstAd: t.fb_ad_delay_for_first_banner
                    },
                    console.log("FBAdManager initAdOption success")
            } catch (t) {
                console.info("FBAdManager initAdOption error", t)
            }
        }
        static addInterstitial(e, n = this._fb_init_ad_count) {
            null == this._interstitialTimer && (this._interstitialTimer = new Q(this.defaultInterstitialTimerOption.refreshInterval, this.defaultInterstitialTimerOption.delayForFirstAd));
            for (let t = 0; t < n; t++) {
                if (this._interstitialAds.length >= this._fb_max_ad_instance)
                    throw console.log("Fail to add interstitial, too many instances: " + this._interstitialAds.length, e),
                        H;
                var r = new nt(e, this._interstitialTimer, this.defaultInterstitialOption);
                this._interstitialAds.push(r),
                    console.log("Add Interstitial: " + e, "count: " + this._interstitialAds.length)
            }
            return this._interstitialAds.length
        }
        static addRewardedVideo(e, n = this._fb_init_ad_count) {
            null === this._rewardedVideoTimer && (this._rewardedVideoTimer = new Q(this.defaultRewardedVideoTimerOption.refreshInterval, this.defaultRewardedVideoTimerOption.delayForFirstAd));
            for (let t = 0; t < n; t++) {
                if (this._rewardedVideos.length >= this._fb_max_ad_instance)
                    throw console.log("Fail to add RewardedVideo, too many instances: " + this._rewardedVideos.length, e),
                        H;
                var r = new rt(e, this._rewardedVideoTimer, this.defaultRewardedVideoOption);
                this._rewardedVideos.push(r),
                    console.log("Add RewardedVideo: " + e, "count: " + this._rewardedVideos.length)
            }
            return this._rewardedVideos.length
        }
        static addBanner(t) {
            null == this._bannerTimer && (this._bannerTimer = new Q(this.defaultBannerTimerOption.refreshInterval, this.defaultBannerTimerOption.delayForFirstAd));
            var e = new it(t, this._bannerTimer, this.defaultBannerOption);
            return this._banners.push(e),
                console.log("Add Banner: " + t, "count: " + this._banners.length),
                e
        }
        static loadAll() {
            return h(this, void 0, void 0, function*() {
                return yield this.loadAllAsync()
            })
        }
        static loadAllAsync() {
            return h(this, void 0, void 0, function*() {
                console.log("FBAdManager Version: " + this.getVersion()),
                    console.log("Init Ads Queue");
                for (let t = 0; t < this._rewardedVideos.length; t++) {
                    var e = this._rewardedVideos[t];
                    0 < t && (yield M(.1));
                    try {
                        yield e.loadAsync()
                    } catch (t) {}
                }
                for (let t = 0; t < this._interstitialAds.length; t++) {
                    var n = this._interstitialAds[t];
                    0 < t && (yield M(.1));
                    try {
                        yield n.loadAsync()
                    } catch (t) {}
                }
            })
        }
        static _isAdReady(t) {
            var e = t === i.INTERSTITIAL ? this._interstitialAds : this._rewardedVideos;
            let n = !1;
            for (let t = 0; t < e.length; t++) {
                var r = e[t];
                if (r.isReady() && r.isReadyToRefresh()) {
                    n = !0;
                    break
                }
            }
            return n
        }
        static _showAsync(t) {
            var e = t === i.INTERSTITIAL ? this._interstitialAds : this._rewardedVideos;
            let n = null;
            for (let t = 0; t < e.length; t++) {
                var r = e[t];
                if (r.isReady() && r.isReadyToRefresh()) {
                    n = r;
                    break
                }
            }
            if (null != n)
                return n.showAsync();
            throw F
        }
        static _getAdTimer(t) {
            return t === i.INTERSTITIAL ? this._interstitialTimer : t === i.REWARDED_VIDEO ? this._rewardedVideoTimer : this._bannerTimer
        }
        static isInterstitialAdReady() {
            return this._isAdReady(i.INTERSTITIAL)
        }
        static showInterstitialAd() {
            return h(this, void 0, void 0, function*() {
                return yield this._showAsync(i.INTERSTITIAL)
            })
        }
        static isRewardedVideoReady() {
            return this._isAdReady(i.REWARDED_VIDEO)
        }
        static showRewardedVideo() {
            return h(this, void 0, void 0, function*() {
                return yield this._showAsync(i.REWARDED_VIDEO)
            })
        }
        static checkApiSupport(t) {
            return 0 <= FBInstant.getSupportedAPIs().indexOf(t)
        }
        static isBannerSupport() {
            return void 0 === this._bannerSupport && (this._bannerSupport = this.checkApiSupport("loadBannerAdAsync")),
                this._bannerSupport
        }
        static isBannerReady() {
            if (this._banners.length <= 0)
                throw U;
            return this._banners[0].isReadyToRefresh()
        }
        static showBannerAsync() {
            return h(this, void 0, void 0, function*() {
                if (!this.isBannerSupport())
                    throw q;
                if (this._banners.length <= 0)
                    throw U;
                return yield this._banners[0].showAsync()
            })
        }
        static hideBannerAsync() {
            return h(this, void 0, void 0, function*() {
                if (!this.isBannerSupport())
                    throw q;
                if (this._banners.length <= 0)
                    throw U;
                return yield this._banners[0].hideAsync()
            })
        }
    }
    a._interstitialAds = [],
        a._rewardedVideos = [],
        a._banners = [],
        a._interstitialTimer = null,
        a._rewardedVideoTimer = null,
        a._bannerTimer = null,
        a._bannerSupport = void 0,
        a._fb_max_ad_instance = 1,
        a._fb_init_ad_count = 1,
        a.defaultInterstitialOption = {
            autoLoadOnPlay: !0,
            maxLoadError: 3
        },
        a.defaultRewardedVideoOption = {
            autoLoadOnPlay: !0,
            maxLoadError: 3
        },
        a.defaultBannerOption = {
            autoLoadOnPlay: !0,
            maxLoadError: 1
        },
        a.defaultInterstitialTimerOption = {
            refreshInterval: 40,
            delayForFirstAd: 30
        },
        a.defaultRewardedVideoTimerOption = {
            refreshInterval: 0,
            delayForFirstAd: 0
        },
        a.defaultBannerTimerOption = {
            refreshInterval: 40,
            delayForFirstAd: 0
        };
    class c {
        static getTopContainerLowerCaseName(t) {
            return t ? `minigame-${t.toLowerCase()}-dailog-container` : "minigame-dailog-container"
        }
        static getTopContainer(t, e) {
            return c.topContainers && c.topContainers[t.containerName] ? c.topContainers[c.getTopContainerLowerCaseName(t.containerName)] : c.createDailogContainer(t, e)
        }
        static createDailogContainer(t, e) {
            var n = c.getTopContainerLowerCaseName(t.containerName);
            let r = document.getElementById(n);
            return r || ((r = document.createElement("div")).setAttribute("id", n),
                    r.setAttribute("style", t.containerStyle || "position: fixed;top:0;left:0;  z-index: 20000; overflow: hidden; width: 100vw;height: 100vh; background-color: rgb(0, 0, 0,0.2);"),
                    e && r.append(e),
                    document.body.append(r)),
                c.topContainers || (c.topContainers = {}),
                c.topContainers[n] = r
        }
        static removeDailogContainer(t, e) {
            var t = c.getTopContainerLowerCaseName(t.containerName),
                n = document.getElementById(t);
            n && n.childNodes && n.childNodes.length <= 1 ? n && n.remove() : e && e instanceof Function && e(),
                c.topContainers[t] = null
        }
    }
    const st = {
        show(t) {
            const e = t.autoCloseTime || 2;
            var n = t.top || "50%";
            const r = t.finalTop || "30%";
            var i = t.left || "50%";
            const s = document.createElement("div"),
                o = (s.innerHTML = `<div style="transition: all 0.5s ease-out;position: fixed;top: -100%;left:${i};transform: translate(-50%,0%);z-index: 20002;width:100%;text-align: center;">
            <div style="display: inline-block;font-size: 12px;font-weight: 500;color: #F2F8FF;line-height: 17px;background: rgba(20,31,43,0.8);max-width: 280px;min-width: 100px;min-height: 20px;border-radius: 9px;word-break: break-word;padding: 10px;">
                <div>${t.message}</div>
            </div>
        </div>`, {
                    containerName: "pop-show-tip",
                    containerStyle: " "
                });
            c.getTopContainer(o, s),
                s.firstChild.style.top = n,
                setTimeout(() => {
                    s.firstChild.style.top = r,
                        setTimeout(() => {
                            c.removeDailogContainer(o)
                        }, 1e3 * e)
                }, 1)
        },
        error(t) {
            t.autoCloseTime && (this.autoCloseTime = t.autoCloseTime);
            const e = t.autoCloseTime || 1;
            var n = t.top || "50%";
            const r = t.finalTop || "0px";
            var i = t.left || "50%";
            const s = document.createElement("div"),
                o = (s.innerHTML = `<div  style="transition: all 0.5s ease-out;border: 1px solid #fde2e2;color:#f56c6c;background: #fef0f0;max-width: 300px;min-height: 20px;position: fixed;top: -100%;left:${i};transform: translate(-50%,0%);z-index: 20001;border-radius: 4px;word-break: break-word;padding: 10px;">
                <div>
                    <svg t="1655971895182" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3456" width="20" height="20"><path d="M827.392 195.584q65.536 65.536 97.792 147.456t32.256 167.936-32.256 167.936-97.792 147.456-147.456 98.304-167.936 32.768-168.448-32.768-147.968-98.304-98.304-147.456-32.768-167.936 32.768-167.936 98.304-147.456 147.968-97.792 168.448-32.256 167.936 32.256 147.456 97.792zM720.896 715.776q21.504-21.504 18.944-49.152t-24.064-49.152l-107.52-107.52 107.52-107.52q21.504-21.504 24.064-49.152t-18.944-49.152-51.712-21.504-51.712 21.504l-107.52 106.496-104.448-104.448q-21.504-20.48-49.152-23.04t-49.152 17.92q-21.504 21.504-21.504 52.224t21.504 52.224l104.448 104.448-104.448 104.448q-21.504 21.504-21.504 51.712t21.504 51.712 49.152 18.944 49.152-24.064l104.448-104.448 107.52 107.52q21.504 21.504 51.712 21.504t51.712-21.504z" p-id="3457" fill="#f56c6c"></path></svg>
                </div>
                <div>${t.message}</div>
            </div>`, {
                    containerName: "pop-error-tip",
                    containerStyle: " "
                });
            c.getTopContainer(o, s),
                s.firstChild.style.top = n,
                setTimeout(() => {
                    s.firstChild.style.top = r,
                        setTimeout(() => {
                            c.removeDailogContainer(o)
                        }, 1e3 * e)
                }, 1)
        }
    };
    const d = class Rr {
            constructor() {
                this._test = !1,
                    this._enabled = !1,
                    this._isBannerEnabled = !0,
                    this._isAdRadical = !1,
                    this._isAndroidApp = !1,
                    this._isShowErrorTip = !1
            }
            static get instance() {
                return this._instance || (this._instance = new Rr),
                    this._instance
            }
            get isTest() {
                return this._test
            }
            get enabed() {
                return this._enabled
            }
            get isBannerEnabled() {
                return this._isBannerEnabled
            }
            isAdRadical() {
                return this._isAdRadical
            }
            get isAndroidApp() {
                return this._isAndroidApp
            }
            load(t) {
                var e, n, r, i;
                try {
                    var s, o = t.options;
                    this._test = t.isTest,
                        this._enabled = t.enabled,
                        this._isBannerEnabled = null == (e = t.isBannerEnabled) || e,
                        this._isAndroidApp = null != (n = t.isAndroidApp) && n,
                        this._isAdRadical = null != (r = t.isAdRadical) && r,
                        this._isShowErrorTip = null != (i = t.isShowErrorTip) && i,
                        this._enabled ? (a.initAdOption(o),
                            s = t.config,
                            a.addBanner(s.banner),
                            a.addInterstitial(s.interstitial),
                            a.addRewardedVideo(s.rewarded_video),
                            a.loadAllAsync()) : console.info("ads is disabled!")
                } catch (t) {
                    console.log("load ads options error: ", t)
                }
            }
            showInterstitial() {
                return this._enabled ? a.showInterstitialAd().then(() => Promise.resolve()).catch(t => Promise.reject(t)) : (console.info("ad is disabled"),
                    Promise.resolve())
            }
            showRewardedVideo() {
                return this.enabed ? a.showRewardedVideo().then(() => Promise.resolve()).catch(t => (this._isShowErrorTip && ("ADS_NO_FILL" === t.code ? st.show({
                        message: "Ad has not been filled."
                    }) : st.show({
                        message: "Ad show error."
                    })),
                    Promise.reject(t))) : (console.info("ad is disabled"),
                    Promise.resolve())
            }
            showBanner() {
                return this.enabed ? this._isBannerEnabled ? a.showBannerAsync().then(() => Promise.resolve()).catch(t => Promise.reject(t)) : (console.info("banner is disable"),
                    Promise.resolve()) : (console.info("ad is disabled"),
                    Promise.resolve())
            }
            hideBanner() {
                return this.enabed ? this._isBannerEnabled ? a.hideBannerAsync().then(() => Promise.resolve()).catch(t => Promise.reject(t)) : (console.info("banner is disable"),
                    Promise.resolve()) : (console.info("ad is disabled"),
                    Promise.resolve())
            }
            isRewardvideoReady() {
                return !this.enabed || a.isRewardedVideoReady()
            }
            isInterstitialReady() {
                return !this.enabed || a.isInterstitialAdReady()
            }
            isBannerReady() {
                return !this.enabed || a.isBannerReady()
            }
        }
        .instance;
    class ot {
        constructor() {
            this._configUrl = "",
                this._gameId = "",
                this._appId = "",
                this._channel = "",
                this._channelName = "",
                this._minigameOption = null,
                this._playPageData = null,
                this._locationSearch = "",
                this._locationPathName = ""
        }
        get configUrl() {
            return this._configUrl
        }
        get gameId() {
            return this._gameId
        }
        get appId() {
            return this._appId
        }
        get channel() {
            return this._channel
        }
        get channelName() {
            return this._channelName
        }
        get minigameOption() {
            return this._minigameOption
        }
        get playPageData() {
            return this._playPageData
        }
        set playPageData(t) {
            this._playPageData = t
        }
        get locationSearch() {
            return this._locationSearch = window.location.search,
                this._locationSearch
        }
        static get instance() {
            return this._instance || (this._instance = new ot),
                this._instance
        }
        init(t) {
            this._channel = this.getSubChannelName(),
                this._channelName = this.getChannelName(),
                this._minigameOption = t,
                this._gameId = "" + t.game_id,
                this._appId = "" + t.app_id,
                this._locationSearch = window.location.search,
                this._locationPathName = window.location.pathname,
                window.commonInfo = ot
        }
        getChannelName() {
            return window.globalPlatformInfo.channelName || window.channelName || this._playPageData.channelName
        }
        getSubChannelName() {
            return window.globalPlatformInfo.subChannelName || window.subChannelName || this._playPageData.subChannelName
        }
        getChannelConfigId() {
            return this._playPageData.channelConfigId || 0
        }
        getGameManifestJsonUrl() {
            return this._playPageData.gameManifestJsonUrl || ""
        }
        isH5AndroidApp() {
            return this._minigameOption ? this._minigameOption.android ? !!this._minigameOption.android.enabled : (console.warn("minigame config has not android field!!!"), !1) : (console.warn("minigame config is not exist!!!"), !1)
        }
        isAdflyEnable() {
            return this._minigameOption ? this._minigameOption.cpl ? this._minigameOption.cpl.adflyer ? this._minigameOption.cpl.adflyer.enabled : (console.warn("cpl config has not adflyer field!!!"), !1) : (console.warn("minigame config has not cpl field!!!"), !1) : (console.warn("minigame config is not exist!!!"), !1)
        }
        getAdflyChannelID() {
            return this.isAdflyEnable() ? this._minigameOption.cpl.adflyer.channelId : ""
        }
        isSharpMatch() {
            var t = null == (t = this._minigameOption) ? void 0 : t.match;
            return !(null == t || !t.enabled) && "adfly" === t.platform
        }
    }
    ot._instance = null;
    const at = ot.instance;
    var t = {
        OK: "OK",
        UNSUPPORTED_API: "UNSUPPORTED_API",
        TIMEOUT: "TIMEOUT",
        INVALID_PARAM: "INVALID_PARAM",
        NOT_READY: "NOT_READY",
        ADS_NO_FILL: "ADS_NO_FILL",
        AD_LOAD_FAILED: "AD_LOAD_FAILED",
        AD_DISMISSED: "AD_DISMISSED",
        AD_NOT_LOADED: "AD_NOT_LOADED",
        AD_ALREADY_LOADED: "AD_ALREADY_LOADED",
        AD_ALREADY_SHOWED: "AD_ALREADY_SHOWED"
    };
    const ct = {
        CODE: t,
        OK: {
            code: t.OK,
            message: "Success"
        },
        TIMEOUT: {
            code: t.TIMEOUT,
            message: "timeout"
        },
        adLoadFail: {
            code: t.AD_LOAD_FAILED,
            message: "Ad load failed"
        },
        adDismissed: {
            code: t.AD_DISMISSED,
            message: "Ad dismissed"
        },
        adNotLoaded: {
            code: t.AD_NOT_LOADED,
            message: "Ad not loaded"
        },
        adAlreadyLoaded: {
            code: t.AD_ALREADY_LOADED,
            message: "Ad already loaded"
        },
        adAlreadyShowed: {
            code: t.AD_ALREADY_SHOWED,
            message: "Ad already showed"
        }
    };
    class ht {
        constructor(t, e, n) {
            this.type = t,
                this.isOneWay = e,
                this._serviceHandler = n
        }
        onRequest(t) {
            return h(this, void 0, void 0, function*() {
                return this._serviceHandler ? this._serviceHandler(t) : Promise.resolve(r(t))
            })
        }
    }

    function dt(t, e, n, r) {
        return {
            type: t.type + "_RESPONSE",
            requestType: t.type,
            requestId: t.requestId,
            code: e,
            message: n,
            payload: r
        }
    }

    function r(t, e) {
        return dt(t, ct.OK.code, ct.OK.message, e)
    }

    function lt(t, e, n, r) {
        return dt(t, e, n, r)
    }
    class e extends ht {
        static createRequest() {
            return {
                type: e.requestType
            }
        }
        static createService() {
            return new e(e.requestType, !1, e.handleRequestAsync)
        }
        static handleRequestAsync(n) {
            return new Promise((t, e) => {
                t(r(n, at))
            })
        }
    }
    e.requestType = "CommonInfoService";
    const ut = class br {
            constructor() {
                this._playTimes = 0,
                    this._interval = 2,
                    this._enable = !0
            }
            static get instance() {
                return this._instance || (this._instance = new br),
                    this._instance
            }
            init(t) {
                t && (this._enable = !!t.enabled,
                    this._interval = null != (t = t.interstitialAdInterval) ? t : 2,
                    this._interval = 0 === this._interval ? 2 : this._interval)
            }
            onLevelStart(t = 0) {
                console.info("event level start")
            }
            onLevelFinished(t = 0, e, n) {
                return h(this, void 0, void 0, function*() {
                    if (this._playTimes++,
                        console.info("event level finish times: ", this._playTimes),
                        this._playTimes % this._interval != 0)
                        return Promise.resolve();
                    try {
                        return yield d.showInterstitial(),
                            Promise.resolve()
                    } catch (t) {
                        return this._playTimes--,
                            console.error("onLevelFinish show interAd error: ", t.message),
                            Promise.reject(t)
                    }
                })
            }
        }
        .instance;
    window.MiniGameEvent = ut;
    class ft {
        constructor() {
            this._commonInfo = null,
                this.minigameOption = null
        }
        get commonInfo() {
            return this._commonInfo
        }
        static get instance() {
            return this._instance || (this._instance = new ft),
                this._instance
        }
        init() {
            return h(this, void 0, void 0, function*() {
                try {
                    return yield this.getCommonInfo(),
                        this.initCommonInfo(),
                        Promise.resolve()
                } catch (t) {
                    return Promise.reject({
                        code: "MINIGAMEIFNO_INIT_ERROR",
                        message: t.message
                    })
                }
            })
        }
        initCommonInfo() {
            ut.init(this._commonInfo._minigameOption.event),
                this.minigameOption = this._commonInfo._minigameOption
        }
        getCommonInfo() {
            return window.mediationClient.invokeServiceAsync(e.createRequest()).then(t => (this._commonInfo = t.payload,
                Promise.resolve(this._commonInfo))).catch(t => (console.error("get commonInfo error: ", t),
                Promise.reject({
                    code: "GET_COMMONINFO_ERROR",
                    message: t.message
                })))
        }
        getLocationSearch() {
            try {
                return this._commonInfo._locationSearch
            } catch (t) {
                return console.error("====> get loation error: ", t),
                    ""
            }
        }
        isH5Android() {
            return !!this._commonInfo && !!this._commonInfo._minigameOption && !!this._commonInfo._minigameOption.android && this._commonInfo._minigameOption.android.enabled
        }
        isAdflyCplEnable() {
            return !!(this._commonInfo && this._commonInfo._minigameOption && this._commonInfo._minigameOption.cpl && this._commonInfo._minigameOption.cpl.adflyer) && this._commonInfo._minigameOption.cpl.adflyer.enabled
        }
    }
    ft._instance = null;
    const _t = ft.instance;
    window.MiniGameInfo = _t;
    class o extends ht {
        static createRequest(t) {
            return {
                type: o.requestType,
                payload: t
            }
        }
        static createService() {
            return new o(o.requestType, !1, o.handleRequestAsync)
        }
        static handleRequestAsync(t) {
            var e;
            return window.AdInteractive ? (window.AdInteractive.trackEvent(t.payload),
                console.info("====> android trackEvent " + t.payload),
                Promise.resolve(r(t))) : (e = {
                    code: "ANDROID_INSTANCE_ERROR",
                    message: "Android AdInteractive not exist"
                },
                Promise.resolve(lt(t, e.code, e.message)))
        }
    }
    o.requestType = "AndroidLogEventService";
    var mt = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {},
        vt = {},
        t = {
            get exports() {
                return vt
            },
            set exports(t) {
                vt = t
            }
        };
    var gt, pt = {},
        yt = {
            get exports() {
                return pt
            },
            set exports(t) {
                pt = t
            }
        };

    function v() {
        return gt || (gt = 1,
                yt.exports = function(h) {
                    var r;
                    if ("undefined" != typeof window && window.crypto && (r = window.crypto),
                        "undefined" != typeof self && self.crypto && (r = self.crypto), !(r = !(r = !(r = "undefined" != typeof globalThis && globalThis.crypto ? globalThis.crypto : r) && "undefined" != typeof window && window.msCrypto ? window.msCrypto : r) && void 0 !== mt && mt.crypto ? mt.crypto : r))
                        try {
                            r = require("crypto")
                        } catch (t) {}
                    var n = Object.create || function(t) {
                        return e.prototype = t,
                            t = new e,
                            e.prototype = null,
                            t
                    };

                    function e() {}
                    var t = {},
                        i = t.lib = {},
                        s = i.Base = {
                            extend: function(t) {
                                var e = n(this);
                                return t && e.mixIn(t),
                                    e.hasOwnProperty("init") && this.init !== e.init || (e.init = function() {
                                        e.$super.init.apply(this, arguments)
                                    }),
                                    (e.init.prototype = e).$super = this,
                                    e
                            },
                            create: function() {
                                var t = this.extend();
                                return t.init.apply(t, arguments),
                                    t
                            },
                            init: function() {},
                            mixIn: function(t) {
                                for (var e in t)
                                    t.hasOwnProperty(e) && (this[e] = t[e]);
                                t.hasOwnProperty("toString") && (this.toString = t.toString)
                            },
                            clone: function() {
                                return this.init.prototype.extend(this)
                            }
                        },
                        d = i.WordArray = s.extend({
                            init: function(t, e) {
                                t = this.words = t || [],
                                    this.sigBytes = null != e ? e : 4 * t.length
                            },
                            toString: function(t) {
                                return (t || a).stringify(this)
                            },
                            concat: function(t) {
                                var e = this.words,
                                    n = t.words,
                                    r = this.sigBytes,
                                    i = t.sigBytes;
                                if (this.clamp(),
                                    r % 4)
                                    for (var s = 0; s < i; s++) {
                                        var o = n[s >>> 2] >>> 24 - s % 4 * 8 & 255;
                                        e[r + s >>> 2] |= o << 24 - (r + s) % 4 * 8
                                    }
                                else
                                    for (var a = 0; a < i; a += 4)
                                        e[r + a >>> 2] = n[a >>> 2];
                                return this.sigBytes += i,
                                    this
                            },
                            clamp: function() {
                                var t = this.words,
                                    e = this.sigBytes;
                                t[e >>> 2] &= 4294967295 << 32 - e % 4 * 8,
                                    t.length = h.ceil(e / 4)
                            },
                            clone: function() {
                                var t = s.clone.call(this);
                                return t.words = this.words.slice(0),
                                    t
                            },
                            random: function(t) {
                                for (var e = [], n = 0; n < t; n += 4)
                                    e.push(function() {
                                        if (r) {
                                            if ("function" == typeof r.getRandomValues)
                                                try {
                                                    return r.getRandomValues(new Uint32Array(1))[0]
                                                } catch (t) {}
                                            if ("function" == typeof r.randomBytes)
                                                try {
                                                    return r.randomBytes(4).readInt32LE()
                                                } catch (t) {}
                                        }
                                        throw new Error("Native crypto module could not be used to get secure random number.")
                                    }());
                                return new d.init(e, t)
                            }
                        }),
                        o = t.enc = {},
                        a = o.Hex = {
                            stringify: function(t) {
                                for (var e = t.words, n = t.sigBytes, r = [], i = 0; i < n; i++) {
                                    var s = e[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                                    r.push((s >>> 4).toString(16)),
                                        r.push((15 & s).toString(16))
                                }
                                return r.join("")
                            },
                            parse: function(t) {
                                for (var e = t.length, n = [], r = 0; r < e; r += 2)
                                    n[r >>> 3] |= parseInt(t.substr(r, 2), 16) << 24 - r % 8 * 4;
                                return new d.init(n, e / 2)
                            }
                        },
                        c = o.Latin1 = {
                            stringify: function(t) {
                                for (var e = t.words, n = t.sigBytes, r = [], i = 0; i < n; i++) {
                                    var s = e[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                                    r.push(String.fromCharCode(s))
                                }
                                return r.join("")
                            },
                            parse: function(t) {
                                for (var e = t.length, n = [], r = 0; r < e; r++)
                                    n[r >>> 2] |= (255 & t.charCodeAt(r)) << 24 - r % 4 * 8;
                                return new d.init(n, e)
                            }
                        },
                        l = o.Utf8 = {
                            stringify: function(t) {
                                try {
                                    return decodeURIComponent(escape(c.stringify(t)))
                                } catch (t) {
                                    throw new Error("Malformed UTF-8 data")
                                }
                            },
                            parse: function(t) {
                                return c.parse(unescape(encodeURIComponent(t)))
                            }
                        },
                        u = i.BufferedBlockAlgorithm = s.extend({
                            reset: function() {
                                this._data = new d.init,
                                    this._nDataBytes = 0
                            },
                            _append: function(t) {
                                "string" == typeof t && (t = l.parse(t)),
                                    this._data.concat(t),
                                    this._nDataBytes += t.sigBytes
                            },
                            _process: function(t) {
                                var e, n = this._data,
                                    r = n.words,
                                    i = n.sigBytes,
                                    s = this.blockSize,
                                    o = i / (4 * s),
                                    a = (o = t ? h.ceil(o) : h.max((0 | o) - this._minBufferSize, 0)) * s,
                                    t = h.min(4 * a, i);
                                if (a) {
                                    for (var c = 0; c < a; c += s)
                                        this._doProcessBlock(r, c);
                                    e = r.splice(0, a),
                                        n.sigBytes -= t
                                }
                                return new d.init(e, t)
                            },
                            clone: function() {
                                var t = s.clone.call(this);
                                return t._data = this._data.clone(),
                                    t
                            },
                            _minBufferSize: 0
                        }),
                        f = (i.Hasher = u.extend({
                                cfg: s.extend(),
                                init: function(t) {
                                    this.cfg = this.cfg.extend(t),
                                        this.reset()
                                },
                                reset: function() {
                                    u.reset.call(this),
                                        this._doReset()
                                },
                                update: function(t) {
                                    return this._append(t),
                                        this._process(),
                                        this
                                },
                                finalize: function(t) {
                                    return t && this._append(t),
                                        this._doFinalize()
                                },
                                blockSize: 16,
                                _createHelper: function(n) {
                                    return function(t, e) {
                                        return new n.init(e).finalize(t)
                                    }
                                },
                                _createHmacHelper: function(n) {
                                    return function(t, e) {
                                        return new f.HMAC.init(n, e).finalize(t)
                                    }
                                }
                            }),
                            t.algo = {});
                    return t
                }(Math)),
            pt
    }
    var wt, It = {},
        At = {
            get exports() {
                return It
            },
            set exports(t) {
                It = t
            }
        };

    function Et() {
        var t, e, i, s, n;
        return wt || (wt = 1,
                At.exports = (t = v(),
                    n = (e = t).lib,
                    i = n.Base,
                    s = n.WordArray,
                    (n = e.x64 = {}).Word = i.extend({
                        init: function(t, e) {
                            this.high = t,
                                this.low = e
                        }
                    }),
                    n.WordArray = i.extend({
                        init: function(t, e) {
                            t = this.words = t || [],
                                this.sigBytes = null != e ? e : 8 * t.length
                        },
                        toX32: function() {
                            for (var t = this.words, e = t.length, n = [], r = 0; r < e; r++) {
                                var i = t[r];
                                n.push(i.high),
                                    n.push(i.low)
                            }
                            return s.create(n, this.sigBytes)
                        },
                        clone: function() {
                            for (var t = i.clone.call(this), e = t.words = this.words.slice(0), n = e.length, r = 0; r < n; r++)
                                e[r] = e[r].clone();
                            return t
                        }
                    }),
                    t)),
            It
    }
    var St, Dt = {},
        xt = {
            get exports() {
                return Dt
            },
            set exports(t) {
                Dt = t
            }
        };

    function Bt() {
        var e;
        return St || (St = 1,
                xt.exports = (e = v(),
                    function() {
                        var t, i;
                        "function" == typeof ArrayBuffer && (t = e.lib.WordArray,
                            i = t.init,
                            (t.init = function(t) {
                                if ((t = (t = t instanceof ArrayBuffer ? new Uint8Array(t) : t) instanceof Int8Array || "undefined" != typeof Uint8ClampedArray && t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array || t instanceof Float64Array ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : t) instanceof Uint8Array) {
                                    for (var e = t.byteLength, n = [], r = 0; r < e; r++)
                                        n[r >>> 2] |= t[r] << 24 - r % 4 * 8;
                                    i.call(this, n, e)
                                } else
                                    i.apply(this, arguments)
                            }).prototype = t)
                    }(),
                    e.lib.WordArray)),
            Dt
    }
    var Rt, bt = {},
        Tt = {
            get exports() {
                return bt
            },
            set exports(t) {
                bt = t
            }
        };

    function kt() {
        var t, i, e;
        return Rt || (Rt = 1,
                Tt.exports = (t = v(),
                    i = t.lib.WordArray,
                    (e = t.enc).Utf16 = e.Utf16BE = {
                        stringify: function(t) {
                            for (var e = t.words, n = t.sigBytes, r = [], i = 0; i < n; i += 2) {
                                var s = e[i >>> 2] >>> 16 - i % 4 * 8 & 65535;
                                r.push(String.fromCharCode(s))
                            }
                            return r.join("")
                        },
                        parse: function(t) {
                            for (var e = t.length, n = [], r = 0; r < e; r++)
                                n[r >>> 1] |= t.charCodeAt(r) << 16 - r % 2 * 16;
                            return i.create(n, 2 * e)
                        }
                    },
                    e.Utf16LE = {
                        stringify: function(t) {
                            for (var e = t.words, n = t.sigBytes, r = [], i = 0; i < n; i += 2) {
                                var s = o(e[i >>> 2] >>> 16 - i % 4 * 8 & 65535);
                                r.push(String.fromCharCode(s))
                            }
                            return r.join("")
                        },
                        parse: function(t) {
                            for (var e = t.length, n = [], r = 0; r < e; r++)
                                n[r >>> 1] |= o(t.charCodeAt(r) << 16 - r % 2 * 16);
                            return i.create(n, 2 * e)
                        }
                    },
                    t.enc.Utf16)),
            bt;

        function o(t) {
            return t << 8 & 4278255360 | t >>> 8 & 16711935
        }
    }
    var Ct, Ot = {},
        Nt = {
            get exports() {
                return Ot
            },
            set exports(t) {
                Ot = t
            }
        };

    function g() {
        var t, c;
        return Ct || (Ct = 1,
                Nt.exports = (t = v(),
                    c = t.lib.WordArray,
                    t.enc.Base64 = {
                        stringify: function(t) {
                            for (var e = t.words, n = t.sigBytes, r = this._map, i = (t.clamp(), []), s = 0; s < n; s += 3)
                                for (var o = (e[s >>> 2] >>> 24 - s % 4 * 8 & 255) << 16 | (e[s + 1 >>> 2] >>> 24 - (s + 1) % 4 * 8 & 255) << 8 | e[s + 2 >>> 2] >>> 24 - (s + 2) % 4 * 8 & 255, a = 0; a < 4 && s + .75 * a < n; a++)
                                    i.push(r.charAt(o >>> 6 * (3 - a) & 63));
                            var c = r.charAt(64);
                            if (c)
                                for (; i.length % 4;)
                                    i.push(c);
                            return i.join("")
                        },
                        parse: function(t) {
                            var e = t.length,
                                n = this._map;
                            if (!(r = this._reverseMap))
                                for (var r = this._reverseMap = [], i = 0; i < n.length; i++)
                                    r[n.charCodeAt(i)] = i;
                            var s = n.charAt(64);
                            return s && -1 !== (s = t.indexOf(s)) && (e = s),
                                o(t, e, r)
                        },
                        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
                    },
                    t.enc.Base64)),
            Ot;

        function o(t, e, n) {
            for (var r, i, s = [], o = 0, a = 0; a < e; a++)
                a % 4 && (r = n[t.charCodeAt(a - 1)] << a % 4 * 2,
                    i = n[t.charCodeAt(a)] >>> 6 - a % 4 * 2,
                    s[o >>> 2] |= (r | i) << 24 - o % 4 * 8,
                    o++);
            return c.create(s, o)
        }
    }
    var Pt = {},
        Lt = {
            get exports() {
                return Pt
            },
            set exports(t) {
                Pt = t
            }
        };
    var Mt, zt = {},
        Ht = {
            get exports() {
                return zt
            },
            set exports(t) {
                zt = t
            }
        };

    function p() {
        return Mt || (Mt = 1,
                Ht.exports = function(t) {
                    for (var d = Math, e = t, n = e.lib, r = n.WordArray, i = n.Hasher, s = e.algo, x = [], o = 0; o < 64; o++)
                        x[o] = d.abs(d.sin(o + 1)) * 4294967296 | 0;
                    var a = s.MD5 = i.extend({
                        _doReset: function() {
                            this._hash = new r.init([1732584193, 4023233417, 2562383102, 271733878])
                        },
                        _doProcessBlock: function(t, e) {
                            for (var n = 0; n < 16; n++) {
                                var r = e + n;
                                var i = t[r];
                                t[r] = (i << 8 | i >>> 24) & 16711935 | (i << 24 | i >>> 8) & 4278255360
                            }
                            var s = this._hash.words;
                            var o = t[e + 0];
                            var a = t[e + 1];
                            var c = t[e + 2];
                            var h = t[e + 3];
                            var d = t[e + 4];
                            var l = t[e + 5];
                            var u = t[e + 6];
                            var f = t[e + 7];
                            var _ = t[e + 8];
                            var m = t[e + 9];
                            var v = t[e + 10];
                            var g = t[e + 11];
                            var p = t[e + 12];
                            var y = t[e + 13];
                            var w = t[e + 14];
                            var I = t[e + 15];
                            var A = s[0];
                            var E = s[1];
                            var S = s[2];
                            var D = s[3];
                            A = B(A, E, S, D, o, 7, x[0]);
                            D = B(D, A, E, S, a, 12, x[1]);
                            S = B(S, D, A, E, c, 17, x[2]);
                            E = B(E, S, D, A, h, 22, x[3]);
                            A = B(A, E, S, D, d, 7, x[4]);
                            D = B(D, A, E, S, l, 12, x[5]);
                            S = B(S, D, A, E, u, 17, x[6]);
                            E = B(E, S, D, A, f, 22, x[7]);
                            A = B(A, E, S, D, _, 7, x[8]);
                            D = B(D, A, E, S, m, 12, x[9]);
                            S = B(S, D, A, E, v, 17, x[10]);
                            E = B(E, S, D, A, g, 22, x[11]);
                            A = B(A, E, S, D, p, 7, x[12]);
                            D = B(D, A, E, S, y, 12, x[13]);
                            S = B(S, D, A, E, w, 17, x[14]);
                            E = B(E, S, D, A, I, 22, x[15]);
                            A = R(A, E, S, D, a, 5, x[16]);
                            D = R(D, A, E, S, u, 9, x[17]);
                            S = R(S, D, A, E, g, 14, x[18]);
                            E = R(E, S, D, A, o, 20, x[19]);
                            A = R(A, E, S, D, l, 5, x[20]);
                            D = R(D, A, E, S, v, 9, x[21]);
                            S = R(S, D, A, E, I, 14, x[22]);
                            E = R(E, S, D, A, d, 20, x[23]);
                            A = R(A, E, S, D, m, 5, x[24]);
                            D = R(D, A, E, S, w, 9, x[25]);
                            S = R(S, D, A, E, h, 14, x[26]);
                            E = R(E, S, D, A, _, 20, x[27]);
                            A = R(A, E, S, D, y, 5, x[28]);
                            D = R(D, A, E, S, c, 9, x[29]);
                            S = R(S, D, A, E, f, 14, x[30]);
                            E = R(E, S, D, A, p, 20, x[31]);
                            A = b(A, E, S, D, l, 4, x[32]);
                            D = b(D, A, E, S, _, 11, x[33]);
                            S = b(S, D, A, E, g, 16, x[34]);
                            E = b(E, S, D, A, w, 23, x[35]);
                            A = b(A, E, S, D, a, 4, x[36]);
                            D = b(D, A, E, S, d, 11, x[37]);
                            S = b(S, D, A, E, f, 16, x[38]);
                            E = b(E, S, D, A, v, 23, x[39]);
                            A = b(A, E, S, D, y, 4, x[40]);
                            D = b(D, A, E, S, o, 11, x[41]);
                            S = b(S, D, A, E, h, 16, x[42]);
                            E = b(E, S, D, A, u, 23, x[43]);
                            A = b(A, E, S, D, m, 4, x[44]);
                            D = b(D, A, E, S, p, 11, x[45]);
                            S = b(S, D, A, E, I, 16, x[46]);
                            E = b(E, S, D, A, c, 23, x[47]);
                            A = T(A, E, S, D, o, 6, x[48]);
                            D = T(D, A, E, S, f, 10, x[49]);
                            S = T(S, D, A, E, w, 15, x[50]);
                            E = T(E, S, D, A, l, 21, x[51]);
                            A = T(A, E, S, D, p, 6, x[52]);
                            D = T(D, A, E, S, h, 10, x[53]);
                            S = T(S, D, A, E, v, 15, x[54]);
                            E = T(E, S, D, A, a, 21, x[55]);
                            A = T(A, E, S, D, _, 6, x[56]);
                            D = T(D, A, E, S, I, 10, x[57]);
                            S = T(S, D, A, E, u, 15, x[58]);
                            E = T(E, S, D, A, y, 21, x[59]);
                            A = T(A, E, S, D, d, 6, x[60]);
                            D = T(D, A, E, S, g, 10, x[61]);
                            S = T(S, D, A, E, c, 15, x[62]);
                            E = T(E, S, D, A, m, 21, x[63]);
                            s[0] = s[0] + A | 0;
                            s[1] = s[1] + E | 0;
                            s[2] = s[2] + S | 0;
                            s[3] = s[3] + D | 0
                        },
                        _doFinalize: function() {
                            var t = this._data;
                            var e = t.words;
                            var n = this._nDataBytes * 8;
                            var r = t.sigBytes * 8;
                            e[r >>> 5] |= 128 << 24 - r % 32;
                            var i = d.floor(n / 4294967296);
                            var s = n;
                            e[(r + 64 >>> 9 << 4) + 15] = (i << 8 | i >>> 24) & 16711935 | (i << 24 | i >>> 8) & 4278255360;
                            e[(r + 64 >>> 9 << 4) + 14] = (s << 8 | s >>> 24) & 16711935 | (s << 24 | s >>> 8) & 4278255360;
                            t.sigBytes = (e.length + 1) * 4;
                            this._process();
                            var o = this._hash;
                            var a = o.words;
                            for (var c = 0; c < 4; c++) {
                                var h = a[c];
                                a[c] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360
                            }
                            return o
                        },
                        clone: function() {
                            var t = i.clone.call(this);
                            t._hash = this._hash.clone();
                            return t
                        }
                    });

                    function B(t, e, n, r, i, s, o) {
                        var a = t + (e & n | ~e & r) + i + o;
                        return (a << s | a >>> 32 - s) + e
                    }

                    function R(t, e, n, r, i, s, o) {
                        var a = t + (e & r | n & ~r) + i + o;
                        return (a << s | a >>> 32 - s) + e
                    }

                    function b(t, e, n, r, i, s, o) {
                        var a = t + (e ^ n ^ r) + i + o;
                        return (a << s | a >>> 32 - s) + e
                    }

                    function T(t, e, n, r, i, s, o) {
                        var a = t + (n ^ (e | ~r)) + i + o;
                        return (a << s | a >>> 32 - s) + e
                    }
                    return e.MD5 = i._createHelper(a),
                        e.HmacMD5 = i._createHmacHelper(a),
                        t.MD5
                }(v())),
            zt
    }
    var Ft, Kt = {},
        Gt = {
            get exports() {
                return Kt
            },
            set exports(t) {
                Kt = t
            }
        };

    function Vt() {
        var t, e, n, r, d, i;
        return Ft || (Ft = 1,
                Gt.exports = (t = v(),
                    i = (e = t).lib,
                    n = i.WordArray,
                    r = i.Hasher,
                    i = e.algo,
                    d = [],
                    i = i.SHA1 = r.extend({
                        _doReset: function() {
                            this._hash = new n.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
                        },
                        _doProcessBlock: function(t, e) {
                            for (var n = this._hash.words, r = n[0], i = n[1], s = n[2], o = n[3], a = n[4], c = 0; c < 80; c++) {
                                c < 16 ? d[c] = 0 | t[e + c] : (h = d[c - 3] ^ d[c - 8] ^ d[c - 14] ^ d[c - 16],
                                    d[c] = h << 1 | h >>> 31);
                                var h = (r << 5 | r >>> 27) + a + d[c];
                                h += c < 20 ? 1518500249 + (i & s | ~i & o) : c < 40 ? 1859775393 + (i ^ s ^ o) : c < 60 ? (i & s | i & o | s & o) - 1894007588 : (i ^ s ^ o) - 899497514,
                                    a = o,
                                    o = s,
                                    s = i << 30 | i >>> 2,
                                    i = r,
                                    r = h
                            }
                            n[0] = n[0] + r | 0,
                                n[1] = n[1] + i | 0,
                                n[2] = n[2] + s | 0,
                                n[3] = n[3] + o | 0,
                                n[4] = n[4] + a | 0
                        },
                        _doFinalize: function() {
                            var t = this._data,
                                e = t.words,
                                n = 8 * this._nDataBytes,
                                r = 8 * t.sigBytes;
                            return e[r >>> 5] |= 128 << 24 - r % 32,
                                e[14 + (64 + r >>> 9 << 4)] = Math.floor(n / 4294967296),
                                e[15 + (64 + r >>> 9 << 4)] = n,
                                t.sigBytes = 4 * e.length,
                                this._process(),
                                this._hash
                        },
                        clone: function() {
                            var t = r.clone.call(this);
                            return t._hash = this._hash.clone(),
                                t
                        }
                    }),
                    e.SHA1 = r._createHelper(i),
                    e.HmacSHA1 = r._createHmacHelper(i),
                    t.SHA1)),
            Kt
    }
    var Wt, Ut = {},
        qt = {
            get exports() {
                return Ut
            },
            set exports(t) {
                Ut = t
            }
        };

    function jt() {
        return Wt || (Wt = 1,
                qt.exports = function(t) {
                    var i = Math,
                        e = t,
                        n = e.lib,
                        r = n.WordArray,
                        s = n.Hasher,
                        o = e.algo,
                        a = [],
                        A = [];

                    function c(t) {
                        var e = i.sqrt(t);
                        for (var n = 2; n <= e; n++)
                            if (!(t % n))
                                return false;
                        return true
                    }

                    function h(t) {
                        return (t - (t | 0)) * 4294967296 | 0
                    }
                    var d = 2,
                        l = 0;
                    while (l < 64) {
                        if (c(d)) {
                            if (l < 8)
                                a[l] = h(i.pow(d, 1 / 2));
                            A[l] = h(i.pow(d, 1 / 3));
                            l++
                        }
                        d++
                    }
                    var E = [],
                        u = o.SHA256 = s.extend({
                            _doReset: function() {
                                this._hash = new r.init(a.slice(0))
                            },
                            _doProcessBlock: function(t, e) {
                                var n = this._hash.words;
                                var r = n[0];
                                var i = n[1];
                                var s = n[2];
                                var o = n[3];
                                var a = n[4];
                                var c = n[5];
                                var h = n[6];
                                var d = n[7];
                                for (var l = 0; l < 64; l++) {
                                    if (l < 16)
                                        E[l] = t[e + l] | 0;
                                    else {
                                        var u = E[l - 15];
                                        var f = (u << 25 | u >>> 7) ^ (u << 14 | u >>> 18) ^ u >>> 3;
                                        var _ = E[l - 2];
                                        var m = (_ << 15 | _ >>> 17) ^ (_ << 13 | _ >>> 19) ^ _ >>> 10;
                                        E[l] = f + E[l - 7] + m + E[l - 16]
                                    }
                                    var v = a & c ^ ~a & h;
                                    var g = r & i ^ r & s ^ i & s;
                                    var p = (r << 30 | r >>> 2) ^ (r << 19 | r >>> 13) ^ (r << 10 | r >>> 22);
                                    var y = (a << 26 | a >>> 6) ^ (a << 21 | a >>> 11) ^ (a << 7 | a >>> 25);
                                    var w = d + y + v + A[l] + E[l];
                                    var I = p + g;
                                    d = h;
                                    h = c;
                                    c = a;
                                    a = o + w | 0;
                                    o = s;
                                    s = i;
                                    i = r;
                                    r = w + I | 0
                                }
                                n[0] = n[0] + r | 0;
                                n[1] = n[1] + i | 0;
                                n[2] = n[2] + s | 0;
                                n[3] = n[3] + o | 0;
                                n[4] = n[4] + a | 0;
                                n[5] = n[5] + c | 0;
                                n[6] = n[6] + h | 0;
                                n[7] = n[7] + d | 0
                            },
                            _doFinalize: function() {
                                var t = this._data;
                                var e = t.words;
                                var n = this._nDataBytes * 8;
                                var r = t.sigBytes * 8;
                                e[r >>> 5] |= 128 << 24 - r % 32;
                                e[(r + 64 >>> 9 << 4) + 14] = i.floor(n / 4294967296);
                                e[(r + 64 >>> 9 << 4) + 15] = n;
                                t.sigBytes = e.length * 4;
                                this._process();
                                return this._hash
                            },
                            clone: function() {
                                var t = s.clone.call(this);
                                t._hash = this._hash.clone();
                                return t
                            }
                        });
                    return e.SHA256 = s._createHelper(u),
                        e.HmacSHA256 = s._createHmacHelper(u),
                        t.SHA256
                }(v())),
            Ut
    }
    var Yt = {},
        Xt = {
            get exports() {
                return Yt
            },
            set exports(t) {
                Yt = t
            }
        };
    var $t, Jt = {},
        Zt = {
            get exports() {
                return Jt
            },
            set exports(t) {
                Jt = t
            }
        };

    function Qt() {
        return $t || ($t = 1,
                Zt.exports = function(t) {
                    var e = t,
                        n, r = e.lib.Hasher,
                        i = e.x64,
                        s = i.Word,
                        o = i.WordArray,
                        a = e.algo;

                    function c() {
                        return s.create.apply(s, arguments)
                    }
                    for (var St = [c(1116352408, 3609767458), c(1899447441, 602891725), c(3049323471, 3964484399), c(3921009573, 2173295548), c(961987163, 4081628472), c(1508970993, 3053834265), c(2453635748, 2937671579), c(2870763221, 3664609560), c(3624381080, 2734883394), c(310598401, 1164996542), c(607225278, 1323610764), c(1426881987, 3590304994), c(1925078388, 4068182383), c(2162078206, 991336113), c(2614888103, 633803317), c(3248222580, 3479774868), c(3835390401, 2666613458), c(4022224774, 944711139), c(264347078, 2341262773), c(604807628, 2007800933), c(770255983, 1495990901), c(1249150122, 1856431235), c(1555081692, 3175218132), c(1996064986, 2198950837), c(2554220882, 3999719339), c(2821834349, 766784016), c(2952996808, 2566594879), c(3210313671, 3203337956), c(3336571891, 1034457026), c(3584528711, 2466948901), c(113926993, 3758326383), c(338241895, 168717936), c(666307205, 1188179964), c(773529912, 1546045734), c(1294757372, 1522805485), c(1396182291, 2643833823), c(1695183700, 2343527390), c(1986661051, 1014477480), c(2177026350, 1206759142), c(2456956037, 344077627), c(2730485921, 1290863460), c(2820302411, 3158454273), c(3259730800, 3505952657), c(3345764771, 106217008), c(3516065817, 3606008344), c(3600352804, 1432725776), c(4094571909, 1467031594), c(275423344, 851169720), c(430227734, 3100823752), c(506948616, 1363258195), c(659060556, 3750685593), c(883997877, 3785050280), c(958139571, 3318307427), c(1322822218, 3812723403), c(1537002063, 2003034995), c(1747873779, 3602036899), c(1955562222, 1575990012), c(2024104815, 1125592928), c(2227730452, 2716904306), c(2361852424, 442776044), c(2428436474, 593698344), c(2756734187, 3733110249), c(3204031479, 2999351573), c(3329325298, 3815920427), c(3391569614, 3928383900), c(3515267271, 566280711), c(3940187606, 3454069534), c(4118630271, 4000239992), c(116418474, 1914138554), c(174292421, 2731055270), c(289380356, 3203993006), c(460393269, 320620315), c(685471733, 587496836), c(852142971, 1086792851), c(1017036298, 365543100), c(1126000580, 2618297676), c(1288033470, 3409855158), c(1501505948, 4234509866), c(1607167915, 987167468), c(1816402316, 1246189591)], Dt = [], h = 0; h < 80; h++)
                        Dt[h] = c();
                    var d = a.SHA512 = r.extend({
                        _doReset: function() {
                            this._hash = new o.init([new s.init(1779033703, 4089235720), new s.init(3144134277, 2227873595), new s.init(1013904242, 4271175723), new s.init(2773480762, 1595750129), new s.init(1359893119, 2917565137), new s.init(2600822924, 725511199), new s.init(528734635, 4215389547), new s.init(1541459225, 327033209)])
                        },
                        _doProcessBlock: function(L, M) {
                            var t = this._hash.words;
                            var e = t[0];
                            var n = t[1];
                            var r = t[2];
                            var i = t[3];
                            var s = t[4];
                            var o = t[5];
                            var a = t[6];
                            var c = t[7];
                            var z = e.high;
                            var h = e.low;
                            var H = n.high;
                            var d = n.low;
                            var F = r.high;
                            var l = r.low;
                            var K = i.high;
                            var u = i.low;
                            var G = s.high;
                            var f = s.low;
                            var V = o.high;
                            var _ = o.low;
                            var W = a.high;
                            var U = a.low;
                            var q = c.high;
                            var j = c.low;
                            var m = z;
                            var v = h;
                            var g = H;
                            var p = d;
                            var y = F;
                            var w = l;
                            var Y = K;
                            var I = u;
                            var A = G;
                            var E = f;
                            var X = V;
                            var S = _;
                            var $ = W;
                            var D = U;
                            var J = q;
                            var x = j;
                            for (var B = 0; B < 80; B++) {
                                var R;
                                var b;
                                var Z = Dt[B];
                                if (B < 16) {
                                    b = Z.high = L[M + B * 2] | 0;
                                    R = Z.low = L[M + B * 2 + 1] | 0
                                } else {
                                    var Q = Dt[B - 15];
                                    var T = Q.high;
                                    var k = Q.low;
                                    var tt = (T >>> 1 | k << 31) ^ (T >>> 8 | k << 24) ^ T >>> 7;
                                    var et = (k >>> 1 | T << 31) ^ (k >>> 8 | T << 24) ^ (k >>> 7 | T << 25);
                                    var nt = Dt[B - 2];
                                    var C = nt.high;
                                    var O = nt.low;
                                    var rt = (C >>> 19 | O << 13) ^ (C << 3 | O >>> 29) ^ C >>> 6;
                                    var it = (O >>> 19 | C << 13) ^ (O << 3 | C >>> 29) ^ (O >>> 6 | C << 26);
                                    var st = Dt[B - 7];
                                    var ot = st.high;
                                    var at = st.low;
                                    var ct = Dt[B - 16];
                                    var ht = ct.high;
                                    var dt = ct.low;
                                    R = et + at;
                                    b = tt + ot + (R >>> 0 < et >>> 0 ? 1 : 0);
                                    R = R + it;
                                    b = b + rt + (R >>> 0 < it >>> 0 ? 1 : 0);
                                    R = R + dt;
                                    b = b + ht + (R >>> 0 < dt >>> 0 ? 1 : 0);
                                    Z.high = b;
                                    Z.low = R
                                }
                                var lt = A & X ^ ~A & $;
                                var ut = E & S ^ ~E & D;
                                var ft = m & g ^ m & y ^ g & y;
                                var _t = v & p ^ v & w ^ p & w;
                                var mt = (m >>> 28 | v << 4) ^ (m << 30 | v >>> 2) ^ (m << 25 | v >>> 7);
                                var vt = (v >>> 28 | m << 4) ^ (v << 30 | m >>> 2) ^ (v << 25 | m >>> 7);
                                var gt = (A >>> 14 | E << 18) ^ (A >>> 18 | E << 14) ^ (A << 23 | E >>> 9);
                                var pt = (E >>> 14 | A << 18) ^ (E >>> 18 | A << 14) ^ (E << 23 | A >>> 9);
                                var yt = St[B];
                                var wt = yt.high;
                                var It = yt.low;
                                var N = x + pt;
                                var P = J + gt + (N >>> 0 < x >>> 0 ? 1 : 0);
                                var N = N + ut;
                                var P = P + lt + (N >>> 0 < ut >>> 0 ? 1 : 0);
                                var N = N + It;
                                var P = P + wt + (N >>> 0 < It >>> 0 ? 1 : 0);
                                var N = N + R;
                                var P = P + b + (N >>> 0 < R >>> 0 ? 1 : 0);
                                var At = vt + _t;
                                var Et = mt + ft + (At >>> 0 < vt >>> 0 ? 1 : 0);
                                J = $;
                                x = D;
                                $ = X;
                                D = S;
                                X = A;
                                S = E;
                                E = I + N | 0;
                                A = Y + P + (E >>> 0 < I >>> 0 ? 1 : 0) | 0;
                                Y = y;
                                I = w;
                                y = g;
                                w = p;
                                g = m;
                                p = v;
                                v = N + At | 0;
                                m = P + Et + (v >>> 0 < N >>> 0 ? 1 : 0) | 0
                            }
                            h = e.low = h + v;
                            e.high = z + m + (h >>> 0 < v >>> 0 ? 1 : 0);
                            d = n.low = d + p;
                            n.high = H + g + (d >>> 0 < p >>> 0 ? 1 : 0);
                            l = r.low = l + w;
                            r.high = F + y + (l >>> 0 < w >>> 0 ? 1 : 0);
                            u = i.low = u + I;
                            i.high = K + Y + (u >>> 0 < I >>> 0 ? 1 : 0);
                            f = s.low = f + E;
                            s.high = G + A + (f >>> 0 < E >>> 0 ? 1 : 0);
                            _ = o.low = _ + S;
                            o.high = V + X + (_ >>> 0 < S >>> 0 ? 1 : 0);
                            U = a.low = U + D;
                            a.high = W + $ + (U >>> 0 < D >>> 0 ? 1 : 0);
                            j = c.low = j + x;
                            c.high = q + J + (j >>> 0 < x >>> 0 ? 1 : 0)
                        },
                        _doFinalize: function() {
                            var t = this._data;
                            var e = t.words;
                            var n = this._nDataBytes * 8;
                            var r = t.sigBytes * 8;
                            e[r >>> 5] |= 128 << 24 - r % 32;
                            e[(r + 128 >>> 10 << 5) + 30] = Math.floor(n / 4294967296);
                            e[(r + 128 >>> 10 << 5) + 31] = n;
                            t.sigBytes = e.length * 4;
                            this._process();
                            var i = this._hash.toX32();
                            return i
                        },
                        clone: function() {
                            var t = r.clone.call(this);
                            t._hash = this._hash.clone();
                            return t
                        },
                        blockSize: 1024 / 32
                    });
                    return e.SHA512 = r._createHelper(d),
                        e.HmacSHA512 = r._createHmacHelper(d),
                        t.SHA512
                }(v(), Et())),
            Jt
    }
    var te = {},
        ee = {
            get exports() {
                return te
            },
            set exports(t) {
                te = t
            }
        };
    var ne, re = {},
        ie = {
            get exports() {
                return re
            },
            set exports(t) {
                re = t
            }
        };

    function se() {
        return ne || (ne = 1,
                ie.exports = function(t) {
                    for (var u = Math, e = t, n = e.lib, f = n.WordArray, r = n.Hasher, i, s = e.x64.Word, o = e.algo, b = [], T = [], k = [], a = 1, c = 0, h = 0; h < 24; h++) {
                        b[a + 5 * c] = (h + 1) * (h + 2) / 2 % 64;
                        var d = c % 5;
                        var l = (2 * a + 3 * c) % 5;
                        a = d;
                        c = l
                    }
                    for (var a = 0; a < 5; a++)
                        for (var c = 0; c < 5; c++)
                            T[a + 5 * c] = c + (2 * a + 3 * c) % 5 * 5;
                    for (var _ = 1, m = 0; m < 24; m++) {
                        var v = 0;
                        var g = 0;
                        for (var p = 0; p < 7; p++) {
                            if (_ & 1) {
                                var y = (1 << p) - 1;
                                if (y < 32)
                                    g ^= 1 << y;
                                else
                                    v ^= 1 << y - 32
                            }
                            if (_ & 128)
                                _ = _ << 1 ^ 113;
                            else
                                _ <<= 1
                        }
                        k[m] = s.create(v, g)
                    }
                    for (var C = [], w = 0; w < 25; w++)
                        C[w] = s.create();
                    var I = o.SHA3 = r.extend({
                        cfg: r.cfg.extend({
                            outputLength: 512
                        }),
                        _doReset: function() {
                            var t = this._state = [];
                            for (var e = 0; e < 25; e++)
                                t[e] = new s.init;
                            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32
                        },
                        _doProcessBlock: function(t, e) {
                            var n = this._state;
                            var r = this.blockSize / 2;
                            for (var i = 0; i < r; i++) {
                                var s = t[e + 2 * i];
                                var o = t[e + 2 * i + 1];
                                s = (s << 8 | s >>> 24) & 16711935 | (s << 24 | s >>> 8) & 4278255360;
                                o = (o << 8 | o >>> 24) & 16711935 | (o << 24 | o >>> 8) & 4278255360;
                                var a = n[i];
                                a.high ^= o;
                                a.low ^= s
                            }
                            for (var c = 0; c < 24; c++) {
                                for (var h = 0; h < 5; h++) {
                                    var d = 0,
                                        l = 0;
                                    for (var u = 0; u < 5; u++) {
                                        var a = n[h + 5 * u];
                                        d ^= a.high;
                                        l ^= a.low
                                    }
                                    var f = C[h];
                                    f.high = d;
                                    f.low = l
                                }
                                for (var h = 0; h < 5; h++) {
                                    var _ = C[(h + 4) % 5];
                                    var m = C[(h + 1) % 5];
                                    var v = m.high;
                                    var g = m.low;
                                    var d = _.high ^ (v << 1 | g >>> 31);
                                    var l = _.low ^ (g << 1 | v >>> 31);
                                    for (var u = 0; u < 5; u++) {
                                        var a = n[h + 5 * u];
                                        a.high ^= d;
                                        a.low ^= l
                                    }
                                }
                                for (var p = 1; p < 25; p++) {
                                    var d;
                                    var l;
                                    var a = n[p];
                                    var y = a.high;
                                    var w = a.low;
                                    var I = b[p];
                                    if (I < 32) {
                                        d = y << I | w >>> 32 - I;
                                        l = w << I | y >>> 32 - I
                                    } else {
                                        d = w << I - 32 | y >>> 64 - I;
                                        l = y << I - 32 | w >>> 64 - I
                                    }
                                    var A = C[T[p]];
                                    A.high = d;
                                    A.low = l
                                }
                                var E = C[0];
                                var S = n[0];
                                E.high = S.high;
                                E.low = S.low;
                                for (var h = 0; h < 5; h++)
                                    for (var u = 0; u < 5; u++) {
                                        var p = h + 5 * u;
                                        var a = n[p];
                                        var D = C[p];
                                        var x = C[(h + 1) % 5 + 5 * u];
                                        var B = C[(h + 2) % 5 + 5 * u];
                                        a.high = D.high ^ ~x.high & B.high;
                                        a.low = D.low ^ ~x.low & B.low
                                    }
                                var a = n[0];
                                var R = k[c];
                                a.high ^= R.high;
                                a.low ^= R.low
                            }
                        },
                        _doFinalize: function() {
                            var t = this._data;
                            var e = t.words;
                            this._nDataBytes * 8;
                            var n = t.sigBytes * 8;
                            var r = this.blockSize * 32;
                            e[n >>> 5] |= 1 << 24 - n % 32;
                            e[(u.ceil((n + 1) / r) * r >>> 5) - 1] |= 128;
                            t.sigBytes = e.length * 4;
                            this._process();
                            var i = this._state;
                            var s = this.cfg.outputLength / 8;
                            var o = s / 8;
                            var a = [];
                            for (var c = 0; c < o; c++) {
                                var h = i[c];
                                var d = h.high;
                                var l = h.low;
                                d = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360;
                                l = (l << 8 | l >>> 24) & 16711935 | (l << 24 | l >>> 8) & 4278255360;
                                a.push(l);
                                a.push(d)
                            }
                            return new f.init(a, s)
                        },
                        clone: function() {
                            var t = r.clone.call(this);
                            var e = t._state = this._state.slice(0);
                            for (var n = 0; n < 25; n++)
                                e[n] = e[n].clone();
                            return t
                        }
                    });
                    return e.SHA3 = r._createHelper(I),
                        e.HmacSHA3 = r._createHmacHelper(I),
                        t.SHA3
                }(v(), Et())),
            re
    }
    var oe = {},
        ae = {
            get exports() {
                return oe
            },
            set exports(t) {
                oe = t
            }
        };
    var ce, he = {},
        de = {
            get exports() {
                return he
            },
            set exports(t) {
                he = t
            }
        };

    function le() {
        var t, e, a;
        return ce || (ce = 1,
                de.exports = (t = v(),
                    e = t.lib.Base,
                    a = t.enc.Utf8,
                    void(t.algo.HMAC = e.extend({
                        init: function(t, e) {
                            t = this._hasher = new t.init,
                                "string" == typeof e && (e = a.parse(e));
                            for (var n = t.blockSize, r = 4 * n, t = ((e = e.sigBytes > r ? t.finalize(e) : e).clamp(),
                                    this._oKey = e.clone()), e = this._iKey = e.clone(), i = t.words, s = e.words, o = 0; o < n; o++)
                                i[o] ^= 1549556828,
                                s[o] ^= 909522486;
                            t.sigBytes = e.sigBytes = r,
                                this.reset()
                        },
                        reset: function() {
                            var t = this._hasher;
                            t.reset(),
                                t.update(this._iKey)
                        },
                        update: function(t) {
                            return this._hasher.update(t),
                                this
                        },
                        finalize: function(t) {
                            var e = this._hasher,
                                t = e.finalize(t);
                            return e.reset(),
                                e.finalize(this._oKey.clone().concat(t))
                        }
                    })))),
            he
    }
    var ue, fe = {},
        _e = {
            get exports() {
                return fe
            },
            set exports(t) {
                fe = t
            }
        };
    var me, ve = {},
        ge = {
            get exports() {
                return ve
            },
            set exports(t) {
                ve = t
            }
        };

    function y() {
        var t, e, n, d, r, i, s;
        return me || (me = 1,
                ge.exports = (t = v(),
                    Vt(),
                    le(),
                    r = (e = t).lib,
                    n = r.Base,
                    d = r.WordArray,
                    r = e.algo,
                    i = r.MD5,
                    s = r.EvpKDF = n.extend({
                        cfg: n.extend({
                            keySize: 4,
                            hasher: i,
                            iterations: 1
                        }),
                        init: function(t) {
                            this.cfg = this.cfg.extend(t)
                        },
                        compute: function(t, e) {
                            for (var n, r = this.cfg, i = r.hasher.create(), s = d.create(), o = s.words, a = r.keySize, c = r.iterations; o.length < a;) {
                                n && i.update(n),
                                    n = i.update(t).finalize(e),
                                    i.reset();
                                for (var h = 1; h < c; h++)
                                    n = i.finalize(n),
                                    i.reset();
                                s.concat(n)
                            }
                            return s.sigBytes = 4 * a,
                                s
                        }
                    }),
                    e.EvpKDF = function(t, e, n) {
                        return s.create(n).compute(t, e)
                    },
                    t.EvpKDF)),
            ve
    }
    var pe, ye = {},
        we = {
            get exports() {
                return ye
            },
            set exports(t) {
                ye = t
            }
        };

    function w() {
        var o, t, e, n, a, r, i, s, c, h, d, l, u, f, _;
        return pe || (pe = 1,
                we.exports = (t = v(),
                    y(),
                    void(t.lib.Cipher || (o = void 0,
                        e = (t = t).lib,
                        n = e.Base,
                        a = e.WordArray,
                        r = e.BufferedBlockAlgorithm,
                        (l = t.enc).Utf8,
                        i = l.Base64,
                        s = t.algo.EvpKDF,
                        c = e.Cipher = r.extend({
                            cfg: n.extend(),
                            createEncryptor: function(t, e) {
                                return this.create(this._ENC_XFORM_MODE, t, e)
                            },
                            createDecryptor: function(t, e) {
                                return this.create(this._DEC_XFORM_MODE, t, e)
                            },
                            init: function(t, e, n) {
                                this.cfg = this.cfg.extend(n),
                                    this._xformMode = t,
                                    this._key = e,
                                    this.reset()
                            },
                            reset: function() {
                                r.reset.call(this),
                                    this._doReset()
                            },
                            process: function(t) {
                                return this._append(t),
                                    this._process()
                            },
                            finalize: function(t) {
                                return t && this._append(t),
                                    this._doFinalize()
                            },
                            keySize: 4,
                            ivSize: 4,
                            _ENC_XFORM_MODE: 1,
                            _DEC_XFORM_MODE: 2,
                            _createHelper: function() {
                                function i(t) {
                                    return "string" == typeof t ? _ : u
                                }
                                return function(r) {
                                    return {
                                        encrypt: function(t, e, n) {
                                            return i(e).encrypt(r, t, e, n)
                                        },
                                        decrypt: function(t, e, n) {
                                            return i(e).decrypt(r, t, e, n)
                                        }
                                    }
                                }
                            }()
                        }),
                        e.StreamCipher = c.extend({
                            _doFinalize: function() {
                                return this._process(!0)
                            },
                            blockSize: 1
                        }),
                        l = t.mode = {},
                        h = e.BlockCipherMode = n.extend({
                            createEncryptor: function(t, e) {
                                return this.Encryptor.create(t, e)
                            },
                            createDecryptor: function(t, e) {
                                return this.Decryptor.create(t, e)
                            },
                            init: function(t, e) {
                                this._cipher = t,
                                    this._iv = e
                            }
                        }),
                        l = l.CBC = function() {
                            var t = h.extend();

                            function s(t, e, n) {
                                var r, i = this._iv;
                                i ? (r = i,
                                    this._iv = o) : r = this._prevBlock;
                                for (var s = 0; s < n; s++)
                                    t[e + s] ^= r[s]
                            }
                            return t.Encryptor = t.extend({
                                    processBlock: function(t, e) {
                                        var n = this._cipher,
                                            r = n.blockSize;
                                        s.call(this, t, e, r),
                                            n.encryptBlock(t, e),
                                            this._prevBlock = t.slice(e, e + r)
                                    }
                                }),
                                t.Decryptor = t.extend({
                                    processBlock: function(t, e) {
                                        var n = this._cipher,
                                            r = n.blockSize,
                                            i = t.slice(e, e + r);
                                        n.decryptBlock(t, e),
                                            s.call(this, t, e, r),
                                            this._prevBlock = i
                                    }
                                }),
                                t
                        }(),
                        f = (t.pad = {}).Pkcs7 = {
                            pad: function(t, e) {
                                for (var e = 4 * e, n = e - t.sigBytes % e, r = n << 24 | n << 16 | n << 8 | n, i = [], s = 0; s < n; s += 4)
                                    i.push(r);
                                e = a.create(i, n);
                                t.concat(e)
                            },
                            unpad: function(t) {
                                var e = 255 & t.words[t.sigBytes - 1 >>> 2];
                                t.sigBytes -= e
                            }
                        },
                        e.BlockCipher = c.extend({
                            cfg: c.cfg.extend({
                                mode: l,
                                padding: f
                            }),
                            reset: function() {
                                c.reset.call(this);
                                var t, e = this.cfg,
                                    n = e.iv,
                                    e = e.mode;
                                this._xformMode == this._ENC_XFORM_MODE ? t = e.createEncryptor : (t = e.createDecryptor,
                                        this._minBufferSize = 1),
                                    this._mode && this._mode.__creator == t ? this._mode.init(this, n && n.words) : (this._mode = t.call(e, this, n && n.words),
                                        this._mode.__creator = t)
                            },
                            _doProcessBlock: function(t, e) {
                                this._mode.processBlock(t, e)
                            },
                            _doFinalize: function() {
                                var t, e = this.cfg.padding;
                                return this._xformMode == this._ENC_XFORM_MODE ? (e.pad(this._data, this.blockSize),
                                        t = this._process(!0)) : (t = this._process(!0),
                                        e.unpad(t)),
                                    t
                            },
                            blockSize: 4
                        }),
                        d = e.CipherParams = n.extend({
                            init: function(t) {
                                this.mixIn(t)
                            },
                            toString: function(t) {
                                return (t || this.formatter).stringify(this)
                            }
                        }),
                        l = (t.format = {}).OpenSSL = {
                            stringify: function(t) {
                                var e = t.ciphertext,
                                    t = t.salt,
                                    t = t ? a.create([1398893684, 1701076831]).concat(t).concat(e) : e;
                                return t.toString(i)
                            },
                            parse: function(t) {
                                var e, t = i.parse(t),
                                    n = t.words;
                                return 1398893684 == n[0] && 1701076831 == n[1] && (e = a.create(n.slice(2, 4)),
                                        n.splice(0, 4),
                                        t.sigBytes -= 16),
                                    d.create({
                                        ciphertext: t,
                                        salt: e
                                    })
                            }
                        },
                        u = e.SerializableCipher = n.extend({
                            cfg: n.extend({
                                format: l
                            }),
                            encrypt: function(t, e, n, r) {
                                r = this.cfg.extend(r);
                                var i = t.createEncryptor(n, r),
                                    e = i.finalize(e),
                                    i = i.cfg;
                                return d.create({
                                    ciphertext: e,
                                    key: n,
                                    iv: i.iv,
                                    algorithm: t,
                                    mode: i.mode,
                                    padding: i.padding,
                                    blockSize: t.blockSize,
                                    formatter: r.format
                                })
                            },
                            decrypt: function(t, e, n, r) {
                                return r = this.cfg.extend(r),
                                    e = this._parse(e, r.format),
                                    t.createDecryptor(n, r).finalize(e.ciphertext)
                            },
                            _parse: function(t, e) {
                                return "string" == typeof t ? e.parse(t, this) : t
                            }
                        }),
                        f = (t.kdf = {}).OpenSSL = {
                            execute: function(t, e, n, r) {
                                r = r || a.random(8);
                                t = s.create({
                                        keySize: e + n
                                    }).compute(t, r),
                                    n = a.create(t.words.slice(e), 4 * n);
                                return t.sigBytes = 4 * e,
                                    d.create({
                                        key: t,
                                        iv: n,
                                        salt: r
                                    })
                            }
                        },
                        _ = e.PasswordBasedCipher = u.extend({
                            cfg: u.cfg.extend({
                                kdf: f
                            }),
                            encrypt: function(t, e, n, r) {
                                n = (r = this.cfg.extend(r)).kdf.execute(n, t.keySize, t.ivSize),
                                    r.iv = n.iv,
                                    t = u.encrypt.call(this, t, e, n.key, r);
                                return t.mixIn(n),
                                    t
                            },
                            decrypt: function(t, e, n, r) {
                                r = this.cfg.extend(r),
                                    e = this._parse(e, r.format);
                                n = r.kdf.execute(n, t.keySize, t.ivSize, e.salt);
                                return r.iv = n.iv,
                                    u.decrypt.call(this, t, e, n.key, r)
                            }
                        }))))),
            ye
    }
    var Ie, Ae = {},
        Ee = {
            get exports() {
                return Ae
            },
            set exports(t) {
                Ae = t
            }
        };

    function Se() {
        var e;
        return Ie || (Ie = 1,
                Ee.exports = (e = v(),
                    w(),
                    e.mode.CFB = function() {
                        var t = e.lib.BlockCipherMode.extend();

                        function s(t, e, n, r) {
                            var i, s = this._iv;
                            s ? (i = s.slice(0),
                                    this._iv = void 0) : i = this._prevBlock,
                                r.encryptBlock(i, 0);
                            for (var o = 0; o < n; o++)
                                t[e + o] ^= i[o]
                        }
                        return t.Encryptor = t.extend({
                                processBlock: function(t, e) {
                                    var n = this._cipher,
                                        r = n.blockSize;
                                    s.call(this, t, e, r, n),
                                        this._prevBlock = t.slice(e, e + r)
                                }
                            }),
                            t.Decryptor = t.extend({
                                processBlock: function(t, e) {
                                    var n = this._cipher,
                                        r = n.blockSize,
                                        i = t.slice(e, e + r);
                                    s.call(this, t, e, r, n),
                                        this._prevBlock = i
                                }
                            }),
                            t
                    }(),
                    e.mode.CFB)),
            Ae
    }
    var De, xe = {},
        Be = {
            get exports() {
                return xe
            },
            set exports(t) {
                xe = t
            }
        };

    function Re() {
        var n;
        return De || (De = 1,
                Be.exports = (n = v(),
                    w(),
                    n.mode.CTR = function() {
                        var t = n.lib.BlockCipherMode.extend(),
                            e = t.Encryptor = t.extend({
                                processBlock: function(t, e) {
                                    var n = this._cipher,
                                        r = n.blockSize,
                                        i = this._iv,
                                        s = this._counter,
                                        o = (i && (s = this._counter = i.slice(0),
                                                this._iv = void 0),
                                            s.slice(0));
                                    n.encryptBlock(o, 0),
                                        s[r - 1] = s[r - 1] + 1 | 0;
                                    for (var a = 0; a < r; a++)
                                        t[e + a] ^= o[a]
                                }
                            });
                        return t.Decryptor = e,
                            t
                    }(),
                    n.mode.CTR)),
            xe
    }
    var be, Te = {},
        ke = {
            get exports() {
                return Te
            },
            set exports(t) {
                Te = t
            }
        };

    function Ce() {
        var n;
        return be || (be = 1,
                ke.exports = (n = v(),
                    w(),
                    n.mode.CTRGladman = function() {
                        var t = n.lib.BlockCipherMode.extend();

                        function c(t) {
                            var e, n, r;
                            return 255 == (t >> 24 & 255) ? (n = t >> 8 & 255,
                                    r = 255 & t,
                                    255 === (e = t >> 16 & 255) ? (e = 0,
                                        255 === n ? (n = 0,
                                            255 === r ? r = 0 : ++r) : ++n) : ++e,
                                    t = 0,
                                    t = (t += e << 16) + (n << 8) + r) : t += 1 << 24,
                                t
                        }
                        var e = t.Encryptor = t.extend({
                            processBlock: function(t, e) {
                                var n = this._cipher,
                                    r = n.blockSize,
                                    i = this._iv,
                                    s = this._counter,
                                    o = (i && (s = this._counter = i.slice(0),
                                            this._iv = void 0),
                                        0 === ((i = s)[0] = c(i[0])) && (i[1] = c(i[1])),
                                        s.slice(0));
                                n.encryptBlock(o, 0);
                                for (var a = 0; a < r; a++)
                                    t[e + a] ^= o[a]
                            }
                        });
                        return t.Decryptor = e,
                            t
                    }(),
                    n.mode.CTRGladman)),
            Te
    }
    var Oe, Ne = {},
        Pe = {
            get exports() {
                return Ne
            },
            set exports(t) {
                Ne = t
            }
        };

    function Le() {
        var n;
        return Oe || (Oe = 1,
                Pe.exports = (n = v(),
                    w(),
                    n.mode.OFB = function() {
                        var t = n.lib.BlockCipherMode.extend(),
                            e = t.Encryptor = t.extend({
                                processBlock: function(t, e) {
                                    var n = this._cipher,
                                        r = n.blockSize,
                                        i = this._iv,
                                        s = this._keystream;
                                    i && (s = this._keystream = i.slice(0),
                                            this._iv = void 0),
                                        n.encryptBlock(s, 0);
                                    for (var o = 0; o < r; o++)
                                        t[e + o] ^= s[o]
                                }
                            });
                        return t.Decryptor = e,
                            t
                    }(),
                    n.mode.OFB)),
            Ne
    }
    var Me, ze = {},
        He = {
            get exports() {
                return ze
            },
            set exports(t) {
                ze = t
            }
        };
    var Fe, Ke = {},
        Ge = {
            get exports() {
                return Ke
            },
            set exports(t) {
                Ke = t
            }
        };
    var Ve, We = {},
        Ue = {
            get exports() {
                return We
            },
            set exports(t) {
                We = t
            }
        };
    var qe, je = {},
        Ye = {
            get exports() {
                return je
            },
            set exports(t) {
                je = t
            }
        };
    var Xe, $e = {},
        Je = {
            get exports() {
                return $e
            },
            set exports(t) {
                $e = t
            }
        };
    var Ze, Qe = {},
        tn = {
            get exports() {
                return Qe
            },
            set exports(t) {
                Qe = t
            }
        };
    var en, nn = {},
        rn = {
            get exports() {
                return nn
            },
            set exports(t) {
                nn = t
            }
        };
    var sn, on = {},
        an = {
            get exports() {
                return on
            },
            set exports(t) {
                on = t
            }
        };

    function cn() {
        return sn || (sn = 1,
                an.exports = function(t) {
                    for (var e = t, n, r = e.lib.BlockCipher, i = e.algo, d = [], s = [], o = [], a = [], c = [], h = [], l = [], u = [], f = [], _ = [], m = [], v = 0; v < 256; v++)
                        if (v < 128)
                            m[v] = v << 1;
                        else
                            m[v] = v << 1 ^ 283;
                    for (var g = 0, p = 0, v = 0; v < 256; v++) {
                        var y = p ^ p << 1 ^ p << 2 ^ p << 3 ^ p << 4;
                        y = y >>> 8 ^ y & 255 ^ 99;
                        d[g] = y;
                        s[y] = g;
                        var w = m[g];
                        var I = m[w];
                        var A = m[I];
                        var E = m[y] * 257 ^ y * 16843008;
                        o[g] = E << 24 | E >>> 8;
                        a[g] = E << 16 | E >>> 16;
                        c[g] = E << 8 | E >>> 24;
                        h[g] = E;
                        var E = A * 16843009 ^ I * 65537 ^ w * 257 ^ g * 16843008;
                        l[y] = E << 24 | E >>> 8;
                        u[y] = E << 16 | E >>> 16;
                        f[y] = E << 8 | E >>> 24;
                        _[y] = E;
                        if (!g)
                            g = p = 1;
                        else {
                            g = w ^ m[m[m[A ^ w]]];
                            p ^= m[m[p]]
                        }
                    }
                    var S = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
                        D = i.AES = r.extend({
                            _doReset: function() {
                                var t;
                                if (this._nRounds && this._keyPriorReset === this._key)
                                    return;
                                var e = this._keyPriorReset = this._key;
                                var n = e.words;
                                var r = e.sigBytes / 4;
                                var i = this._nRounds = r + 6;
                                var s = (i + 1) * 4;
                                var o = this._keySchedule = [];
                                for (var a = 0; a < s; a++)
                                    if (a < r)
                                        o[a] = n[a];
                                    else {
                                        t = o[a - 1];
                                        if (!(a % r)) {
                                            t = t << 8 | t >>> 24;
                                            t = d[t >>> 24] << 24 | d[t >>> 16 & 255] << 16 | d[t >>> 8 & 255] << 8 | d[t & 255];
                                            t ^= S[a / r | 0] << 24
                                        } else if (r > 6 && a % r == 4)
                                            t = d[t >>> 24] << 24 | d[t >>> 16 & 255] << 16 | d[t >>> 8 & 255] << 8 | d[t & 255];
                                        o[a] = o[a - r] ^ t
                                    }
                                var c = this._invKeySchedule = [];
                                for (var h = 0; h < s; h++) {
                                    var a = s - h;
                                    if (h % 4)
                                        var t = o[a];
                                    else
                                        var t = o[a - 4];
                                    if (h < 4 || a <= 4)
                                        c[h] = t;
                                    else
                                        c[h] = l[d[t >>> 24]] ^ u[d[t >>> 16 & 255]] ^ f[d[t >>> 8 & 255]] ^ _[d[t & 255]]
                                }
                            },
                            encryptBlock: function(t, e) {
                                this._doCryptBlock(t, e, this._keySchedule, o, a, c, h, d)
                            },
                            decryptBlock: function(t, e) {
                                var n = t[e + 1];
                                t[e + 1] = t[e + 3];
                                t[e + 3] = n;
                                this._doCryptBlock(t, e, this._invKeySchedule, l, u, f, _, s);
                                var n = t[e + 1];
                                t[e + 1] = t[e + 3];
                                t[e + 3] = n
                            },
                            _doCryptBlock: function(t, e, n, r, i, s, o, a) {
                                var c = this._nRounds;
                                var h = t[e] ^ n[0];
                                var d = t[e + 1] ^ n[1];
                                var l = t[e + 2] ^ n[2];
                                var u = t[e + 3] ^ n[3];
                                var f = 4;
                                for (var _ = 1; _ < c; _++) {
                                    var m = r[h >>> 24] ^ i[d >>> 16 & 255] ^ s[l >>> 8 & 255] ^ o[u & 255] ^ n[f++];
                                    var v = r[d >>> 24] ^ i[l >>> 16 & 255] ^ s[u >>> 8 & 255] ^ o[h & 255] ^ n[f++];
                                    var g = r[l >>> 24] ^ i[u >>> 16 & 255] ^ s[h >>> 8 & 255] ^ o[d & 255] ^ n[f++];
                                    var p = r[u >>> 24] ^ i[h >>> 16 & 255] ^ s[d >>> 8 & 255] ^ o[l & 255] ^ n[f++];
                                    h = m;
                                    d = v;
                                    l = g;
                                    u = p
                                }
                                var m = (a[h >>> 24] << 24 | a[d >>> 16 & 255] << 16 | a[l >>> 8 & 255] << 8 | a[u & 255]) ^ n[f++];
                                var v = (a[d >>> 24] << 24 | a[l >>> 16 & 255] << 16 | a[u >>> 8 & 255] << 8 | a[h & 255]) ^ n[f++];
                                var g = (a[l >>> 24] << 24 | a[u >>> 16 & 255] << 16 | a[h >>> 8 & 255] << 8 | a[d & 255]) ^ n[f++];
                                var p = (a[u >>> 24] << 24 | a[h >>> 16 & 255] << 16 | a[d >>> 8 & 255] << 8 | a[l & 255]) ^ n[f++];
                                t[e] = m;
                                t[e + 1] = v;
                                t[e + 2] = g;
                                t[e + 3] = p
                            },
                            keySize: 256 / 32
                        });
                    return e.AES = r._createHelper(D),
                        t.AES
                }(v(), (g(),
                    p(),
                    y(),
                    w()))),
            on
    }
    var hn, dn = {},
        ln = {
            get exports() {
                return dn
            },
            set exports(t) {
                dn = t
            }
        };

    function un() {
        var t, e, r, n, h, d, l, u, f, i, s;
        return hn || (hn = 1,
                ln.exports = (t = v(),
                    g(),
                    p(),
                    y(),
                    w(),
                    n = (e = t).lib,
                    r = n.WordArray,
                    n = n.BlockCipher,
                    s = e.algo,
                    h = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4],
                    d = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32],
                    l = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28],
                    u = [{
                        0: 8421888,
                        268435456: 32768,
                        536870912: 8421378,
                        805306368: 2,
                        1073741824: 512,
                        1342177280: 8421890,
                        1610612736: 8389122,
                        1879048192: 8388608,
                        2147483648: 514,
                        2415919104: 8389120,
                        2684354560: 33280,
                        2952790016: 8421376,
                        3221225472: 32770,
                        3489660928: 8388610,
                        3758096384: 0,
                        4026531840: 33282,
                        134217728: 0,
                        402653184: 8421890,
                        671088640: 33282,
                        939524096: 32768,
                        1207959552: 8421888,
                        1476395008: 512,
                        1744830464: 8421378,
                        2013265920: 2,
                        2281701376: 8389120,
                        2550136832: 33280,
                        2818572288: 8421376,
                        3087007744: 8389122,
                        3355443200: 8388610,
                        3623878656: 32770,
                        3892314112: 514,
                        4160749568: 8388608,
                        1: 32768,
                        268435457: 2,
                        536870913: 8421888,
                        805306369: 8388608,
                        1073741825: 8421378,
                        1342177281: 33280,
                        1610612737: 512,
                        1879048193: 8389122,
                        2147483649: 8421890,
                        2415919105: 8421376,
                        2684354561: 8388610,
                        2952790017: 33282,
                        3221225473: 514,
                        3489660929: 8389120,
                        3758096385: 32770,
                        4026531841: 0,
                        134217729: 8421890,
                        402653185: 8421376,
                        671088641: 8388608,
                        939524097: 512,
                        1207959553: 32768,
                        1476395009: 8388610,
                        1744830465: 2,
                        2013265921: 33282,
                        2281701377: 32770,
                        2550136833: 8389122,
                        2818572289: 514,
                        3087007745: 8421888,
                        3355443201: 8389120,
                        3623878657: 0,
                        3892314113: 33280,
                        4160749569: 8421378
                    }, {
                        0: 1074282512,
                        16777216: 16384,
                        33554432: 524288,
                        50331648: 1074266128,
                        67108864: 1073741840,
                        83886080: 1074282496,
                        100663296: 1073758208,
                        117440512: 16,
                        134217728: 540672,
                        150994944: 1073758224,
                        167772160: 1073741824,
                        184549376: 540688,
                        201326592: 524304,
                        218103808: 0,
                        234881024: 16400,
                        251658240: 1074266112,
                        8388608: 1073758208,
                        25165824: 540688,
                        41943040: 16,
                        58720256: 1073758224,
                        75497472: 1074282512,
                        92274688: 1073741824,
                        109051904: 524288,
                        125829120: 1074266128,
                        142606336: 524304,
                        159383552: 0,
                        176160768: 16384,
                        192937984: 1074266112,
                        209715200: 1073741840,
                        226492416: 540672,
                        243269632: 1074282496,
                        260046848: 16400,
                        268435456: 0,
                        285212672: 1074266128,
                        301989888: 1073758224,
                        318767104: 1074282496,
                        335544320: 1074266112,
                        352321536: 16,
                        369098752: 540688,
                        385875968: 16384,
                        402653184: 16400,
                        419430400: 524288,
                        436207616: 524304,
                        452984832: 1073741840,
                        469762048: 540672,
                        486539264: 1073758208,
                        503316480: 1073741824,
                        520093696: 1074282512,
                        276824064: 540688,
                        293601280: 524288,
                        310378496: 1074266112,
                        327155712: 16384,
                        343932928: 1073758208,
                        360710144: 1074282512,
                        377487360: 16,
                        394264576: 1073741824,
                        411041792: 1074282496,
                        427819008: 1073741840,
                        444596224: 1073758224,
                        461373440: 524304,
                        478150656: 0,
                        494927872: 16400,
                        511705088: 1074266128,
                        528482304: 540672
                    }, {
                        0: 260,
                        1048576: 0,
                        2097152: 67109120,
                        3145728: 65796,
                        4194304: 65540,
                        5242880: 67108868,
                        6291456: 67174660,
                        7340032: 67174400,
                        8388608: 67108864,
                        9437184: 67174656,
                        10485760: 65792,
                        11534336: 67174404,
                        12582912: 67109124,
                        13631488: 65536,
                        14680064: 4,
                        15728640: 256,
                        524288: 67174656,
                        1572864: 67174404,
                        2621440: 0,
                        3670016: 67109120,
                        4718592: 67108868,
                        5767168: 65536,
                        6815744: 65540,
                        7864320: 260,
                        8912896: 4,
                        9961472: 256,
                        11010048: 67174400,
                        12058624: 65796,
                        13107200: 65792,
                        14155776: 67109124,
                        15204352: 67174660,
                        16252928: 67108864,
                        16777216: 67174656,
                        17825792: 65540,
                        18874368: 65536,
                        19922944: 67109120,
                        20971520: 256,
                        22020096: 67174660,
                        23068672: 67108868,
                        24117248: 0,
                        25165824: 67109124,
                        26214400: 67108864,
                        27262976: 4,
                        28311552: 65792,
                        29360128: 67174400,
                        30408704: 260,
                        31457280: 65796,
                        32505856: 67174404,
                        17301504: 67108864,
                        18350080: 260,
                        19398656: 67174656,
                        20447232: 0,
                        21495808: 65540,
                        22544384: 67109120,
                        23592960: 256,
                        24641536: 67174404,
                        25690112: 65536,
                        26738688: 67174660,
                        27787264: 65796,
                        28835840: 67108868,
                        29884416: 67109124,
                        30932992: 67174400,
                        31981568: 4,
                        33030144: 65792
                    }, {
                        0: 2151682048,
                        65536: 2147487808,
                        131072: 4198464,
                        196608: 2151677952,
                        262144: 0,
                        327680: 4198400,
                        393216: 2147483712,
                        458752: 4194368,
                        524288: 2147483648,
                        589824: 4194304,
                        655360: 64,
                        720896: 2147487744,
                        786432: 2151678016,
                        851968: 4160,
                        917504: 4096,
                        983040: 2151682112,
                        32768: 2147487808,
                        98304: 64,
                        163840: 2151678016,
                        229376: 2147487744,
                        294912: 4198400,
                        360448: 2151682112,
                        425984: 0,
                        491520: 2151677952,
                        557056: 4096,
                        622592: 2151682048,
                        688128: 4194304,
                        753664: 4160,
                        819200: 2147483648,
                        884736: 4194368,
                        950272: 4198464,
                        1015808: 2147483712,
                        1048576: 4194368,
                        1114112: 4198400,
                        1179648: 2147483712,
                        1245184: 0,
                        1310720: 4160,
                        1376256: 2151678016,
                        1441792: 2151682048,
                        1507328: 2147487808,
                        1572864: 2151682112,
                        1638400: 2147483648,
                        1703936: 2151677952,
                        1769472: 4198464,
                        1835008: 2147487744,
                        1900544: 4194304,
                        1966080: 64,
                        2031616: 4096,
                        1081344: 2151677952,
                        1146880: 2151682112,
                        1212416: 0,
                        1277952: 4198400,
                        1343488: 4194368,
                        1409024: 2147483648,
                        1474560: 2147487808,
                        1540096: 64,
                        1605632: 2147483712,
                        1671168: 4096,
                        1736704: 2147487744,
                        1802240: 2151678016,
                        1867776: 4160,
                        1933312: 2151682048,
                        1998848: 4194304,
                        2064384: 4198464
                    }, {
                        0: 128,
                        4096: 17039360,
                        8192: 262144,
                        12288: 536870912,
                        16384: 537133184,
                        20480: 16777344,
                        24576: 553648256,
                        28672: 262272,
                        32768: 16777216,
                        36864: 537133056,
                        40960: 536871040,
                        45056: 553910400,
                        49152: 553910272,
                        53248: 0,
                        57344: 17039488,
                        61440: 553648128,
                        2048: 17039488,
                        6144: 553648256,
                        10240: 128,
                        14336: 17039360,
                        18432: 262144,
                        22528: 537133184,
                        26624: 553910272,
                        30720: 536870912,
                        34816: 537133056,
                        38912: 0,
                        43008: 553910400,
                        47104: 16777344,
                        51200: 536871040,
                        55296: 553648128,
                        59392: 16777216,
                        63488: 262272,
                        65536: 262144,
                        69632: 128,
                        73728: 536870912,
                        77824: 553648256,
                        81920: 16777344,
                        86016: 553910272,
                        90112: 537133184,
                        94208: 16777216,
                        98304: 553910400,
                        102400: 553648128,
                        106496: 17039360,
                        110592: 537133056,
                        114688: 262272,
                        118784: 536871040,
                        122880: 0,
                        126976: 17039488,
                        67584: 553648256,
                        71680: 16777216,
                        75776: 17039360,
                        79872: 537133184,
                        83968: 536870912,
                        88064: 17039488,
                        92160: 128,
                        96256: 553910272,
                        100352: 262272,
                        104448: 553910400,
                        108544: 0,
                        112640: 553648128,
                        116736: 16777344,
                        120832: 262144,
                        124928: 537133056,
                        129024: 536871040
                    }, {
                        0: 268435464,
                        256: 8192,
                        512: 270532608,
                        768: 270540808,
                        1024: 268443648,
                        1280: 2097152,
                        1536: 2097160,
                        1792: 268435456,
                        2048: 0,
                        2304: 268443656,
                        2560: 2105344,
                        2816: 8,
                        3072: 270532616,
                        3328: 2105352,
                        3584: 8200,
                        3840: 270540800,
                        128: 270532608,
                        384: 270540808,
                        640: 8,
                        896: 2097152,
                        1152: 2105352,
                        1408: 268435464,
                        1664: 268443648,
                        1920: 8200,
                        2176: 2097160,
                        2432: 8192,
                        2688: 268443656,
                        2944: 270532616,
                        3200: 0,
                        3456: 270540800,
                        3712: 2105344,
                        3968: 268435456,
                        4096: 268443648,
                        4352: 270532616,
                        4608: 270540808,
                        4864: 8200,
                        5120: 2097152,
                        5376: 268435456,
                        5632: 268435464,
                        5888: 2105344,
                        6144: 2105352,
                        6400: 0,
                        6656: 8,
                        6912: 270532608,
                        7168: 8192,
                        7424: 268443656,
                        7680: 270540800,
                        7936: 2097160,
                        4224: 8,
                        4480: 2105344,
                        4736: 2097152,
                        4992: 268435464,
                        5248: 268443648,
                        5504: 8200,
                        5760: 270540808,
                        6016: 270532608,
                        6272: 270540800,
                        6528: 270532616,
                        6784: 8192,
                        7040: 2105352,
                        7296: 2097160,
                        7552: 0,
                        7808: 268435456,
                        8064: 268443656
                    }, {
                        0: 1048576,
                        16: 33555457,
                        32: 1024,
                        48: 1049601,
                        64: 34604033,
                        80: 0,
                        96: 1,
                        112: 34603009,
                        128: 33555456,
                        144: 1048577,
                        160: 33554433,
                        176: 34604032,
                        192: 34603008,
                        208: 1025,
                        224: 1049600,
                        240: 33554432,
                        8: 34603009,
                        24: 0,
                        40: 33555457,
                        56: 34604032,
                        72: 1048576,
                        88: 33554433,
                        104: 33554432,
                        120: 1025,
                        136: 1049601,
                        152: 33555456,
                        168: 34603008,
                        184: 1048577,
                        200: 1024,
                        216: 34604033,
                        232: 1,
                        248: 1049600,
                        256: 33554432,
                        272: 1048576,
                        288: 33555457,
                        304: 34603009,
                        320: 1048577,
                        336: 33555456,
                        352: 34604032,
                        368: 1049601,
                        384: 1025,
                        400: 34604033,
                        416: 1049600,
                        432: 1,
                        448: 0,
                        464: 34603008,
                        480: 33554433,
                        496: 1024,
                        264: 1049600,
                        280: 33555457,
                        296: 34603009,
                        312: 1,
                        328: 33554432,
                        344: 1048576,
                        360: 1025,
                        376: 34604032,
                        392: 33554433,
                        408: 34603008,
                        424: 0,
                        440: 34604033,
                        456: 1049601,
                        472: 1024,
                        488: 33555456,
                        504: 1048577
                    }, {
                        0: 134219808,
                        1: 131072,
                        2: 134217728,
                        3: 32,
                        4: 131104,
                        5: 134350880,
                        6: 134350848,
                        7: 2048,
                        8: 134348800,
                        9: 134219776,
                        10: 133120,
                        11: 134348832,
                        12: 2080,
                        13: 0,
                        14: 134217760,
                        15: 133152,
                        2147483648: 2048,
                        2147483649: 134350880,
                        2147483650: 134219808,
                        2147483651: 134217728,
                        2147483652: 134348800,
                        2147483653: 133120,
                        2147483654: 133152,
                        2147483655: 32,
                        2147483656: 134217760,
                        2147483657: 2080,
                        2147483658: 131104,
                        2147483659: 134350848,
                        2147483660: 0,
                        2147483661: 134348832,
                        2147483662: 134219776,
                        2147483663: 131072,
                        16: 133152,
                        17: 134350848,
                        18: 32,
                        19: 2048,
                        20: 134219776,
                        21: 134217760,
                        22: 134348832,
                        23: 131072,
                        24: 0,
                        25: 131104,
                        26: 134348800,
                        27: 134219808,
                        28: 134350880,
                        29: 133120,
                        30: 2080,
                        31: 134217728,
                        2147483664: 131072,
                        2147483665: 2048,
                        2147483666: 134348832,
                        2147483667: 133152,
                        2147483668: 32,
                        2147483669: 134348800,
                        2147483670: 134217728,
                        2147483671: 134219808,
                        2147483672: 134350880,
                        2147483673: 134217760,
                        2147483674: 134219776,
                        2147483675: 0,
                        2147483676: 133120,
                        2147483677: 2080,
                        2147483678: 131104,
                        2147483679: 134350848
                    }],
                    f = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679],
                    i = s.DES = n.extend({
                        _doReset: function() {
                            for (var t = this._key.words, e = [], n = 0; n < 56; n++) {
                                var r = h[n] - 1;
                                e[n] = t[r >>> 5] >>> 31 - r % 32 & 1
                            }
                            for (var i = this._subKeys = [], s = 0; s < 16; s++) {
                                for (var o = i[s] = [], a = l[s], n = 0; n < 24; n++)
                                    o[n / 6 | 0] |= e[(d[n] - 1 + a) % 28] << 31 - n % 6,
                                    o[4 + (n / 6 | 0)] |= e[28 + (d[n + 24] - 1 + a) % 28] << 31 - n % 6;
                                o[0] = o[0] << 1 | o[0] >>> 31;
                                for (n = 1; n < 7; n++)
                                    o[n] = o[n] >>> 4 * (n - 1) + 3;
                                o[7] = o[7] << 5 | o[7] >>> 27
                            }
                            for (var c = this._invSubKeys = [], n = 0; n < 16; n++)
                                c[n] = i[15 - n]
                        },
                        encryptBlock: function(t, e) {
                            this._doCryptBlock(t, e, this._subKeys)
                        },
                        decryptBlock: function(t, e) {
                            this._doCryptBlock(t, e, this._invSubKeys)
                        },
                        _doCryptBlock: function(t, e, n) {
                            this._lBlock = t[e],
                                this._rBlock = t[e + 1],
                                _.call(this, 4, 252645135),
                                _.call(this, 16, 65535),
                                m.call(this, 2, 858993459),
                                m.call(this, 8, 16711935),
                                _.call(this, 1, 1431655765);
                            for (var r = 0; r < 16; r++) {
                                for (var i = n[r], s = this._lBlock, o = this._rBlock, a = 0, c = 0; c < 8; c++)
                                    a |= u[c][((o ^ i[c]) & f[c]) >>> 0];
                                this._lBlock = o,
                                    this._rBlock = s ^ a
                            }
                            var h = this._lBlock;
                            this._lBlock = this._rBlock,
                                this._rBlock = h,
                                _.call(this, 1, 1431655765),
                                m.call(this, 8, 16711935),
                                m.call(this, 2, 858993459),
                                _.call(this, 16, 65535),
                                _.call(this, 4, 252645135),
                                t[e] = this._lBlock,
                                t[e + 1] = this._rBlock
                        },
                        keySize: 2,
                        ivSize: 2,
                        blockSize: 2
                    }),
                    e.DES = n._createHelper(i),
                    s = s.TripleDES = n.extend({
                        _doReset: function() {
                            var t = this._key.words;
                            if (2 !== t.length && 4 !== t.length && t.length < 6)
                                throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
                            var e = t.slice(0, 2),
                                n = t.length < 4 ? t.slice(0, 2) : t.slice(2, 4),
                                t = t.length < 6 ? t.slice(0, 2) : t.slice(4, 6);
                            this._des1 = i.createEncryptor(r.create(e)),
                                this._des2 = i.createEncryptor(r.create(n)),
                                this._des3 = i.createEncryptor(r.create(t))
                        },
                        encryptBlock: function(t, e) {
                            this._des1.encryptBlock(t, e),
                                this._des2.decryptBlock(t, e),
                                this._des3.encryptBlock(t, e)
                        },
                        decryptBlock: function(t, e) {
                            this._des3.decryptBlock(t, e),
                                this._des2.encryptBlock(t, e),
                                this._des1.decryptBlock(t, e)
                        },
                        keySize: 6,
                        ivSize: 2,
                        blockSize: 2
                    }),
                    e.TripleDES = n._createHelper(s),
                    t.TripleDES)),
            dn;

        function _(t, e) {
            e = (this._lBlock >>> t ^ this._rBlock) & e;
            this._rBlock ^= e,
                this._lBlock ^= e << t
        }

        function m(t, e) {
            e = (this._rBlock >>> t ^ this._lBlock) & e;
            this._lBlock ^= e,
                this._rBlock ^= e << t
        }
    }
    var fn, _n = {},
        mn = {
            get exports() {
                return _n
            },
            set exports(t) {
                _n = t
            }
        };
    var vn, gn = {},
        pn = {
            get exports() {
                return gn
            },
            set exports(t) {
                gn = t
            }
        };
    var yn, wn, l, u, f, n, _, m, I, A, E, S, In, D, x, An, En, Sn, Dn, xn, Bn, Rn, B, bn, Tn, kn, R, b, Cn, On, Nn, Pn, Ln, Mn, zn, T, k, Hn, Fn, C, O, Kn, Gn, N, P, Vn, Wn = {},
        Un = {
            get exports() {
                return Wn
            },
            set exports(t) {
                Wn = t
            }
        };

    function qn() {
        for (var t = this._X, e = this._C, n = 0; n < 8; n++)
            u[n] = e[n];
        e[0] = e[0] + 1295307597 + this._b | 0,
            e[1] = e[1] + 3545052371 + (e[0] >>> 0 < u[0] >>> 0 ? 1 : 0) | 0,
            e[2] = e[2] + 886263092 + (e[1] >>> 0 < u[1] >>> 0 ? 1 : 0) | 0,
            e[3] = e[3] + 1295307597 + (e[2] >>> 0 < u[2] >>> 0 ? 1 : 0) | 0,
            e[4] = e[4] + 3545052371 + (e[3] >>> 0 < u[3] >>> 0 ? 1 : 0) | 0,
            e[5] = e[5] + 886263092 + (e[4] >>> 0 < u[4] >>> 0 ? 1 : 0) | 0,
            e[6] = e[6] + 1295307597 + (e[5] >>> 0 < u[5] >>> 0 ? 1 : 0) | 0,
            e[7] = e[7] + 3545052371 + (e[6] >>> 0 < u[6] >>> 0 ? 1 : 0) | 0,
            this._b = e[7] >>> 0 < u[7] >>> 0 ? 1 : 0;
        for (n = 0; n < 8; n++) {
            var r = t[n] + e[n],
                i = 65535 & r,
                s = r >>> 16;
            f[n] = ((i * i >>> 17) + i * s >>> 15) + s * s ^ ((4294901760 & r) * r | 0) + ((65535 & r) * r | 0)
        }
        t[0] = f[0] + (f[7] << 16 | f[7] >>> 16) + (f[6] << 16 | f[6] >>> 16) | 0,
            t[1] = f[1] + (f[0] << 8 | f[0] >>> 24) + f[7] | 0,
            t[2] = f[2] + (f[1] << 16 | f[1] >>> 16) + (f[0] << 16 | f[0] >>> 16) | 0,
            t[3] = f[3] + (f[2] << 8 | f[2] >>> 24) + f[1] | 0,
            t[4] = f[4] + (f[3] << 16 | f[3] >>> 16) + (f[2] << 16 | f[2] >>> 16) | 0,
            t[5] = f[5] + (f[4] << 8 | f[4] >>> 24) + f[3] | 0,
            t[6] = f[6] + (f[5] << 16 | f[5] >>> 16) + (f[4] << 16 | f[4] >>> 16) | 0,
            t[7] = f[7] + (f[6] << 8 | f[6] >>> 24) + f[5] | 0
    }

    function jn() {
        for (var t = this._X, e = this._C, n = 0; n < 8; n++)
            m[n] = e[n];
        e[0] = e[0] + 1295307597 + this._b | 0,
            e[1] = e[1] + 3545052371 + (e[0] >>> 0 < m[0] >>> 0 ? 1 : 0) | 0,
            e[2] = e[2] + 886263092 + (e[1] >>> 0 < m[1] >>> 0 ? 1 : 0) | 0,
            e[3] = e[3] + 1295307597 + (e[2] >>> 0 < m[2] >>> 0 ? 1 : 0) | 0,
            e[4] = e[4] + 3545052371 + (e[3] >>> 0 < m[3] >>> 0 ? 1 : 0) | 0,
            e[5] = e[5] + 886263092 + (e[4] >>> 0 < m[4] >>> 0 ? 1 : 0) | 0,
            e[6] = e[6] + 1295307597 + (e[5] >>> 0 < m[5] >>> 0 ? 1 : 0) | 0,
            e[7] = e[7] + 3545052371 + (e[6] >>> 0 < m[6] >>> 0 ? 1 : 0) | 0,
            this._b = e[7] >>> 0 < m[7] >>> 0 ? 1 : 0;
        for (n = 0; n < 8; n++) {
            var r = t[n] + e[n],
                i = 65535 & r,
                s = r >>> 16;
            I[n] = ((i * i >>> 17) + i * s >>> 15) + s * s ^ ((4294901760 & r) * r | 0) + ((65535 & r) * r | 0)
        }
        t[0] = I[0] + (I[7] << 16 | I[7] >>> 16) + (I[6] << 16 | I[6] >>> 16) | 0,
            t[1] = I[1] + (I[0] << 8 | I[0] >>> 24) + I[7] | 0,
            t[2] = I[2] + (I[1] << 16 | I[1] >>> 16) + (I[0] << 16 | I[0] >>> 16) | 0,
            t[3] = I[3] + (I[2] << 8 | I[2] >>> 24) + I[1] | 0,
            t[4] = I[4] + (I[3] << 16 | I[3] >>> 16) + (I[2] << 16 | I[2] >>> 16) | 0,
            t[5] = I[5] + (I[4] << 8 | I[4] >>> 24) + I[3] | 0,
            t[6] = I[6] + (I[5] << 16 | I[5] >>> 16) + (I[4] << 16 | I[4] >>> 16) | 0,
            t[7] = I[7] + (I[6] << 8 | I[6] >>> 24) + I[5] | 0
    }

    function Yn() {
        for (var t = this._S, e = this._i, n = this._j, r = 0, i = 0; i < 4; i++) {
            var n = (n + t[e = (e + 1) % 256]) % 256,
                s = t[e];
            t[e] = t[n],
                t[n] = s,
                r |= t[(t[e] + t[n]) % 256] << 24 - 8 * i
        }
        return this._i = e,
            this._j = n,
            r
    }

    function Xn(t, e, n) {
        return t & e | ~t & n
    }

    function $n(t, e, n) {
        return t & n | e & ~n
    }

    function Jn(t, e) {
        return t << e | t >>> 32 - e
    }

    function Zn(t, e, n) {
        for (var r, i, s = [], o = 0, a = 0; a < e; a++)
            a % 4 && (r = n[t.charCodeAt(a - 1)] << a % 4 * 2,
                i = n[t.charCodeAt(a)] >>> 6 - a % 4 * 2,
                s[o >>> 2] |= (r | i) << 24 - o % 4 * 8,
                o++);
        return Vn.create(s, o)
    }
    t.exports = (t = v(),
        Et(),
        Bt(),
        kt(),
        g(),
        wn || (wn = 1,
            Lt.exports = (P = v(),
                Vn = P.lib.WordArray,
                P.enc.Base64url = {
                    stringify: function(t, e = !0) {
                        for (var n = t.words, r = t.sigBytes, i = e ? this._safe_map : this._map, s = (t.clamp(), []), o = 0; o < r; o += 3)
                            for (var a = (n[o >>> 2] >>> 24 - o % 4 * 8 & 255) << 16 | (n[o + 1 >>> 2] >>> 24 - (o + 1) % 4 * 8 & 255) << 8 | n[o + 2 >>> 2] >>> 24 - (o + 2) % 4 * 8 & 255, c = 0; c < 4 && o + .75 * c < r; c++)
                                s.push(i.charAt(a >>> 6 * (3 - c) & 63));
                        var h = i.charAt(64);
                        if (h)
                            for (; s.length % 4;)
                                s.push(h);
                        return s.join("")
                    },
                    parse: function(t, e = !0) {
                        var n = t.length,
                            r = e ? this._safe_map : this._map;
                        if (!(i = this._reverseMap))
                            for (var i = this._reverseMap = [], s = 0; s < r.length; s++)
                                i[r.charCodeAt(s)] = s;
                        var e = r.charAt(64);
                        return e && -1 !== (e = t.indexOf(e)) && (n = e),
                            Zn(t, n, i)
                    },
                    _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                    _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
                },
                P.enc.Base64url)),
        p(),
        Vt(),
        jt(),
        n || (n = 1,
            Xt.exports = (P = v(),
                jt(),
                Kn = (O = P).lib.WordArray,
                N = O.algo,
                Gn = N.SHA256,
                N = N.SHA224 = Gn.extend({
                    _doReset: function() {
                        this._hash = new Kn.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428])
                    },
                    _doFinalize: function() {
                        var t = Gn._doFinalize.call(this);
                        return t.sigBytes -= 4,
                            t
                    }
                }),
                O.SHA224 = Gn._createHelper(N),
                O.HmacSHA224 = Gn._createHmacHelper(N),
                P.SHA224)),
        Qt(),
        Er || (Er = 1,
            ee.exports = (O = v(),
                Et(),
                Qt(),
                C = (N = O).x64,
                k = C.Word,
                Hn = C.WordArray,
                C = N.algo,
                Fn = C.SHA512,
                C = C.SHA384 = Fn.extend({
                    _doReset: function() {
                        this._hash = new Hn.init([new k.init(3418070365, 3238371032), new k.init(1654270250, 914150663), new k.init(2438529370, 812702999), new k.init(355462360, 4144912697), new k.init(1731405415, 4290775857), new k.init(2394180231, 1750603025), new k.init(3675008525, 1694076839), new k.init(1203062813, 3204075428)])
                    },
                    _doFinalize: function() {
                        var t = Fn._doFinalize.call(this);
                        return t.sigBytes -= 16,
                            t
                    }
                }),
                N.SHA384 = Fn._createHelper(C),
                N.HmacSHA384 = Fn._createHmacHelper(C),
                O.SHA384)),
        se(),
        Br || (Br = 1,
            ae.exports = (C = v(),
                T = (R = C).lib,
                b = T.WordArray,
                Cn = T.Hasher,
                T = R.algo,
                On = b.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]),
                Nn = b.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]),
                Pn = b.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]),
                Ln = b.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]),
                Mn = b.create([0, 1518500249, 1859775393, 2400959708, 2840853838]),
                zn = b.create([1352829926, 1548603684, 1836072691, 2053994217, 0]),
                T = T.RIPEMD160 = Cn.extend({
                    _doReset: function() {
                        this._hash = b.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
                    },
                    _doProcessBlock: function(t, e) {
                        for (var n = 0; n < 16; n++) {
                            var r = e + n,
                                i = t[r];
                            t[r] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8)
                        }
                        for (var s, o, a, c, h, d, l = this._hash.words, u = Mn.words, f = zn.words, _ = On.words, m = Nn.words, v = Pn.words, g = Ln.words, p = s = l[0], y = o = l[1], w = a = l[2], I = c = l[3], A = h = l[4], n = 0; n < 80; n += 1)
                            d = (d = Jn(d = (d = s + t[e + _[n]] | 0) + (n < 16 ? (o ^ a ^ c) + u[0] : n < 32 ? Xn(o, a, c) + u[1] : n < 48 ? ((o | ~a) ^ c) + u[2] : n < 64 ? $n(o, a, c) + u[3] : (o ^ (a | ~c)) + u[4]) | 0, v[n])) + h | 0,
                            s = h,
                            h = c,
                            c = Jn(a, 10),
                            a = o,
                            o = d,
                            d = (d = Jn(d = (d = p + t[e + m[n]] | 0) + (n < 16 ? (y ^ (w | ~I)) + f[0] : n < 32 ? $n(y, w, I) + f[1] : n < 48 ? ((y | ~w) ^ I) + f[2] : n < 64 ? Xn(y, w, I) + f[3] : (y ^ w ^ I) + f[4]) | 0, g[n])) + A | 0,
                            p = A,
                            A = I,
                            I = Jn(w, 10),
                            w = y,
                            y = d;
                        d = l[1] + a + I | 0,
                            l[1] = l[2] + c + A | 0,
                            l[2] = l[3] + h + p | 0,
                            l[3] = l[4] + s + y | 0,
                            l[4] = l[0] + o + w | 0,
                            l[0] = d
                    },
                    _doFinalize: function() {
                        for (var t = this._data, e = t.words, n = 8 * this._nDataBytes, r = 8 * t.sigBytes, r = (e[r >>> 5] |= 128 << 24 - r % 32,
                                e[14 + (64 + r >>> 9 << 4)] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8),
                                t.sigBytes = 4 * (e.length + 1),
                                this._process(),
                                this._hash), i = r.words, s = 0; s < 5; s++) {
                            var o = i[s];
                            i[s] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8)
                        }
                        return r
                    },
                    clone: function() {
                        var t = Cn.clone.call(this);
                        return t._hash = this._hash.clone(),
                            t
                    }
                }),
                R.RIPEMD160 = Cn._createHelper(T),
                R.HmacRIPEMD160 = Cn._createHmacHelper(T),
                C.RIPEMD160)),
        le(),
        ue || (ue = 1,
            _e.exports = (R = v(),
                Vt(),
                le(),
                B = (T = R).lib,
                Bn = B.Base,
                Rn = B.WordArray,
                B = T.algo,
                bn = B.SHA1,
                Tn = B.HMAC,
                kn = B.PBKDF2 = Bn.extend({
                    cfg: Bn.extend({
                        keySize: 4,
                        hasher: bn,
                        iterations: 1
                    }),
                    init: function(t) {
                        this.cfg = this.cfg.extend(t)
                    },
                    compute: function(t, e) {
                        for (var n = this.cfg, r = Tn.create(n.hasher, t), i = Rn.create(), s = Rn.create([1]), o = i.words, a = s.words, c = n.keySize, h = n.iterations; o.length < c;) {
                            for (var d = r.update(e).finalize(s), l = (r.reset(),
                                    d.words), u = l.length, f = d, _ = 1; _ < h; _++) {
                                f = r.finalize(f),
                                    r.reset();
                                for (var m = f.words, v = 0; v < u; v++)
                                    l[v] ^= m[v]
                            }
                            i.concat(d),
                                a[0]++
                        }
                        return i.sigBytes = 4 * c,
                            i
                    }
                }),
                T.PBKDF2 = function(t, e, n) {
                    return kn.create(n).compute(t, e)
                },
                R.PBKDF2)),
        y(),
        w(),
        Se(),
        Re(),
        Ce(),
        Le(),
        Me || (Me = 1,
            He.exports = (xn = v(),
                w(),
                xn.mode.ECB = function() {
                    var t = xn.lib.BlockCipherMode.extend();
                    return t.Encryptor = t.extend({
                            processBlock: function(t, e) {
                                this._cipher.encryptBlock(t, e)
                            }
                        }),
                        t.Decryptor = t.extend({
                            processBlock: function(t, e) {
                                this._cipher.decryptBlock(t, e)
                            }
                        }),
                        t
                }(),
                xn.mode.ECB)),
        Fe || (Fe = 1,
            Ge.exports = (B = v(),
                w(),
                B.pad.AnsiX923 = {
                    pad: function(t, e) {
                        var n = t.sigBytes,
                            e = 4 * e,
                            e = e - n % e,
                            n = n + e - 1;
                        t.clamp(),
                            t.words[n >>> 2] |= e << 24 - n % 4 * 8,
                            t.sigBytes += e
                    },
                    unpad: function(t) {
                        var e = 255 & t.words[t.sigBytes - 1 >>> 2];
                        t.sigBytes -= e
                    }
                },
                B.pad.Ansix923)),
        Ve || (Ve = 1,
            Ue.exports = (Dn = v(),
                w(),
                Dn.pad.Iso10126 = {
                    pad: function(t, e) {
                        e *= 4,
                            e -= t.sigBytes % e;
                        t.concat(Dn.lib.WordArray.random(e - 1)).concat(Dn.lib.WordArray.create([e << 24], 1))
                    },
                    unpad: function(t) {
                        var e = 255 & t.words[t.sigBytes - 1 >>> 2];
                        t.sigBytes -= e
                    }
                },
                Dn.pad.Iso10126)),
        qe || (qe = 1,
            Ye.exports = (Sn = v(),
                w(),
                Sn.pad.Iso97971 = {
                    pad: function(t, e) {
                        t.concat(Sn.lib.WordArray.create([2147483648], 1)),
                            Sn.pad.ZeroPadding.pad(t, e)
                    },
                    unpad: function(t) {
                        Sn.pad.ZeroPadding.unpad(t),
                            t.sigBytes--
                    }
                },
                Sn.pad.Iso97971)),
        Xe || (Xe = 1,
            Je.exports = (Bn = v(),
                w(),
                Bn.pad.ZeroPadding = {
                    pad: function(t, e) {
                        e *= 4;
                        t.clamp(),
                            t.sigBytes += e - (t.sigBytes % e || e)
                    },
                    unpad: function(t) {
                        for (var e = t.words, n = t.sigBytes - 1, n = t.sigBytes - 1; 0 <= n; n--)
                            if (e[n >>> 2] >>> 24 - n % 4 * 8 & 255) {
                                t.sigBytes = n + 1;
                                break
                            }
                    }
                },
                Bn.pad.ZeroPadding)),
        Ze || (Ze = 1,
            tn.exports = (bn = v(),
                w(),
                bn.pad.NoPadding = {
                    pad: function() {},
                    unpad: function() {}
                },
                bn.pad.NoPadding)),
        en || (en = 1,
            rn.exports = (x = v(),
                w(),
                An = x.lib.CipherParams,
                En = x.enc.Hex,
                x.format.Hex = {
                    stringify: function(t) {
                        return t.ciphertext.toString(En)
                    },
                    parse: function(t) {
                        t = En.parse(t);
                        return An.create({
                            ciphertext: t
                        })
                    }
                },
                x.format.Hex)),
        cn(),
        un(),
        fn || (fn = 1,
            mn.exports = (x = v(),
                g(),
                p(),
                y(),
                w(),
                S = (E = x).lib.StreamCipher,
                D = E.algo,
                In = D.RC4 = S.extend({
                    _doReset: function() {
                        for (var t = this._key, e = t.words, n = t.sigBytes, r = this._S = [], i = 0; i < 256; i++)
                            r[i] = i;
                        for (var i = 0, s = 0; i < 256; i++) {
                            var o = i % n,
                                o = e[o >>> 2] >>> 24 - o % 4 * 8 & 255,
                                s = (s + r[i] + o) % 256,
                                o = r[i];
                            r[i] = r[s],
                                r[s] = o
                        }
                        this._i = this._j = 0
                    },
                    _doProcessBlock: function(t, e) {
                        t[e] ^= Yn.call(this)
                    },
                    keySize: 8,
                    ivSize: 0
                }),
                E.RC4 = S._createHelper(In),
                D = D.RC4Drop = In.extend({
                    cfg: In.cfg.extend({
                        drop: 192
                    }),
                    _doReset: function() {
                        In._doReset.call(this);
                        for (var t = this.cfg.drop; 0 < t; t--)
                            Yn.call(this)
                    }
                }),
                E.RC4Drop = S._createHelper(D),
                x.RC4)),
        vn || (vn = 1,
            pn.exports = (E = v(),
                g(),
                p(),
                y(),
                w(),
                D = (S = E).lib.StreamCipher,
                A = S.algo,
                _ = [],
                m = [],
                I = [],
                A = A.Rabbit = D.extend({
                    _doReset: function() {
                        for (var t = this._key.words, e = this.cfg.iv, n = 0; n < 4; n++)
                            t[n] = 16711935 & (t[n] << 8 | t[n] >>> 24) | 4278255360 & (t[n] << 24 | t[n] >>> 8);
                        for (var r = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16], i = this._C = [t[2] << 16 | t[2] >>> 16, 4294901760 & t[0] | 65535 & t[1], t[3] << 16 | t[3] >>> 16, 4294901760 & t[1] | 65535 & t[2], t[0] << 16 | t[0] >>> 16, 4294901760 & t[2] | 65535 & t[3], t[1] << 16 | t[1] >>> 16, 4294901760 & t[3] | 65535 & t[0]], n = this._b = 0; n < 4; n++)
                            jn.call(this);
                        for (n = 0; n < 8; n++)
                            i[n] ^= r[n + 4 & 7];
                        if (e) {
                            var e = e.words,
                                s = e[0],
                                e = e[1],
                                s = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),
                                e = 16711935 & (e << 8 | e >>> 24) | 4278255360 & (e << 24 | e >>> 8),
                                o = s >>> 16 | 4294901760 & e,
                                a = e << 16 | 65535 & s;
                            i[0] ^= s,
                                i[1] ^= o,
                                i[2] ^= e,
                                i[3] ^= a,
                                i[4] ^= s,
                                i[5] ^= o,
                                i[6] ^= e,
                                i[7] ^= a;
                            for (n = 0; n < 4; n++)
                                jn.call(this)
                        }
                    },
                    _doProcessBlock: function(t, e) {
                        var n = this._X;
                        jn.call(this),
                            _[0] = n[0] ^ n[5] >>> 16 ^ n[3] << 16,
                            _[1] = n[2] ^ n[7] >>> 16 ^ n[5] << 16,
                            _[2] = n[4] ^ n[1] >>> 16 ^ n[7] << 16,
                            _[3] = n[6] ^ n[3] >>> 16 ^ n[1] << 16;
                        for (var r = 0; r < 4; r++)
                            _[r] = 16711935 & (_[r] << 8 | _[r] >>> 24) | 4278255360 & (_[r] << 24 | _[r] >>> 8),
                            t[e + r] ^= _[r]
                    },
                    blockSize: 4,
                    ivSize: 2
                }),
                S.Rabbit = D._createHelper(A),
                E.Rabbit)),
        yn || (yn = 1,
            Un.exports = (A = v(),
                g(),
                p(),
                y(),
                w(),
                Lt = (wn = A).lib.StreamCipher,
                n = wn.algo,
                l = [],
                u = [],
                f = [],
                n = n.RabbitLegacy = Lt.extend({
                    _doReset: function() {
                        for (var t = this._key.words, e = this.cfg.iv, n = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16], r = this._C = [t[2] << 16 | t[2] >>> 16, 4294901760 & t[0] | 65535 & t[1], t[3] << 16 | t[3] >>> 16, 4294901760 & t[1] | 65535 & t[2], t[0] << 16 | t[0] >>> 16, 4294901760 & t[2] | 65535 & t[3], t[1] << 16 | t[1] >>> 16, 4294901760 & t[3] | 65535 & t[0]], i = this._b = 0; i < 4; i++)
                            qn.call(this);
                        for (i = 0; i < 8; i++)
                            r[i] ^= n[i + 4 & 7];
                        if (e) {
                            var t = e.words,
                                e = t[0],
                                t = t[1],
                                e = 16711935 & (e << 8 | e >>> 24) | 4278255360 & (e << 24 | e >>> 8),
                                t = 16711935 & (t << 8 | t >>> 24) | 4278255360 & (t << 24 | t >>> 8),
                                s = e >>> 16 | 4294901760 & t,
                                o = t << 16 | 65535 & e;
                            r[0] ^= e,
                                r[1] ^= s,
                                r[2] ^= t,
                                r[3] ^= o,
                                r[4] ^= e,
                                r[5] ^= s,
                                r[6] ^= t,
                                r[7] ^= o;
                            for (i = 0; i < 4; i++)
                                qn.call(this)
                        }
                    },
                    _doProcessBlock: function(t, e) {
                        var n = this._X;
                        qn.call(this),
                            l[0] = n[0] ^ n[5] >>> 16 ^ n[3] << 16,
                            l[1] = n[2] ^ n[7] >>> 16 ^ n[5] << 16,
                            l[2] = n[4] ^ n[1] >>> 16 ^ n[7] << 16,
                            l[3] = n[6] ^ n[3] >>> 16 ^ n[1] << 16;
                        for (var r = 0; r < 4; r++)
                            l[r] = 16711935 & (l[r] << 8 | l[r] >>> 24) | 4278255360 & (l[r] << 24 | l[r] >>> 8),
                            t[e + r] ^= l[r]
                    },
                    blockSize: 4,
                    ivSize: 2
                }),
                wn.RabbitLegacy = Lt._createHelper(n),
                A.RabbitLegacy)),
        t);
    var Qn, tr = vt;
    class er {}
    er.ADFLY_REPORT_URL = "https://cpl.minigame.work:19443/v1/event-publish/api/event/publish",
        er.ADFLY_REPORT_DOMAIN = "https://ingress.minigame.vip:30443",
        er.ADFLY_REPORT_PUBLISH = "v1/event-publish/api/event/publish";
    class nr {
        static getTimestamp() {
            return (new Date).getTime()
        }
        static getTimeBySecond() {
            return Math.floor((new Date).getTime() / 1e3)
        }
        static getDate() {
            return (new Date).toLocaleDateString()
        }
        static getTargetTimestamp(t = 0, e = 0, n = 0) {
            var r = new Date((new Date).toLocaleDateString()).getTime();
            return new Date(r + 1e3 * (3600 * t + 60 * e + n)).getTime()
        }
        static waitTime(e, n) {
            return new Promise(t => {
                setTimeout(() => {
                    n && n(),
                        t()
                }, e)
            })
        }
        static convertToWIB(t) {
            let e = +t;
            10 === t.length && (e *= 1e3);
            t = e - 36e5,
                t = new Date(t);
            return this.formatDate(t)
        }
        static convertToIST(t) {
            let e = +t;
            10 === t.length && (e *= 1e3);
            t = e - 9e6,
                t = new Date(t);
            return this.formatDate(t)
        }
        static convertToStandardTime(t, e) {
            switch (t) {
                case "ID":
                    return this.convertToWIB(e);
                case "IN":
                    return this.convertToIST(e);
                default:
                    return console.warn("No corresponding country code found."),
                        ""
            }
        }
        static padTo2Digits(t) {
            return t.toString().padStart(2, "0")
        }
        static formatDate(t) {
            return [t.getFullYear(), this.padTo2Digits(t.getMonth() + 1), this.padTo2Digits(t.getDate())].join(".") + " " + [this.padTo2Digits(t.getHours()), this.padTo2Digits(t.getMinutes()), this.padTo2Digits(t.getSeconds())].join(":")
        }
    }
    (Xt = Qn = Qn || {}).get = "GET",
        Xt.post = "POST";
    class rr {
        onGameEvent(e) {
            var n = new URLSearchParams(window.location.search);
            if (n.has("clickid")) {
                var r = n.get("clickid");
                let t = "";
                n.has("gaid") && (t = n.get("gaid"));
                n = {},
                    e = (n.subject = e.eventName,
                        e.label && (n.eventValue = e.label), {});
                e.channelId = at.getChannelName(),
                    e.gameId = at.minigameOption.game_id,
                    e.clickId = r,
                    e.event = n,
                    e.ts = "" + nr.getTimeBySecond(),
                    0 < t.length && (e.gaid = t),
                    this.reportToMinigameEventGateway(e),
                    console.info("====> reportModel: ", e)
            } else
                console.error("location search hasn't clickid field")
        }
        reportToMinigameEventGateway(a) {
            return h(this, void 0, void 0, function*() {
                var t = Qn.post,
                    e = (new Date).toUTCString().toString(),
                    n = tr.SHA256,
                    r = tr.enc.Base64,
                    i = tr.HmacSHA512,
                    s = a,
                    n = "SHA-256=" + r.stringify(n(JSON.stringify(s))),
                    r = r.stringify(i(`(request-target): post /${er.ADFLY_REPORT_PUBLISH}
x-date: ${e}
digest: ` + n, "HMACSHA512-SecretKey")),
                    i = new Headers,
                    r = (i.append("Authorization", `Signature keyId="write",algorithm="hmac-sha512",headers="(request-target) x-date digest",signature="${r}"`),
                        i.append("Content-Type", "application/json"),
                        i.append("x-date", e),
                        i.append("digest", n), {
                            method: t,
                            headers: i,
                            body: JSON.stringify(s)
                        });
                const o = er.ADFLY_REPORT_DOMAIN + "/" + er.ADFLY_REPORT_PUBLISH;
                console.info("=====> reportToMinigameEventGateway: ", JSON.stringify(s)),
                    yield fetch(o, r).then(t => {
                        t.ok ? (t.json(),
                            console.info(`====> reportToMinigameEventGateway post ${o} success response: ` + JSON.stringify(t.json()))) : console.error(`====> reportToMinigameEventGateway post ${o} fail status: ` + t.status)
                    }).catch(t => {
                        console.error("====> reportToMinigameEventGateway setData error: " + t.message)
                    })
            })
        }
    }
    class ir {
        static get instance() {
            return this._instance || (this._instance = new ir),
                this._instance
        }
        constructor() {
            this._curReport = null,
                this._curReport = new rr
        }
        onGameEvent(t) {
            t ? this._curReport ? this._curReport.onGameEvent(t) : console.error("cur report instance is null") : console.error("report event is null")
        }
    }
    ir._instance = null;
    const sr = ir.instance;
    class or extends ht {
        static createRequest(t) {
            return {
                type: or.requestType,
                payload: t
            }
        }
        static createService() {
            return new or(or.requestType, !1, or.handleRequestAsync)
        }
        static handleRequestAsync(t) {
            return sr.onGameEvent(t.payload),
                Promise.resolve(r(t))
        }
    }
    or.requestType = "GameEventReportService";
    let ar = document;

    function cr(s, o = !1, a) {
        return h(this, void 0, void 0, function*() {
            return new Promise((t, e) => {
                const n = ar.createElement("script");
                if (n.src = s,
                    n.async = o,
                    a)
                    for (const i in a)
                        n.setAttribute(i, a[i]);
                const r = () => {
                    n.removeEventListener("load", r),
                        t()
                };
                n.addEventListener("load", r),
                    n.addEventListener("error", t => {
                        console.error(t),
                            e(new Error("Failed to load " + s))
                    }),
                    (ar.getElementsByTagName("head")[0] || document.documentElement).appendChild(n)
            })
        })
    }
    const hr = class Tr {
            constructor() {
                this._gameName = "",
                    this._enabled = !1,
                    this._commonInfo = null
            }
            static get instance() {
                return this._instance || (this._instance = new Tr),
                    this._instance
            }
            initGa(t) {
                function e() {
                    window.dataLayer.push(arguments)
                }
                window.dataLayer = window.dataLayer || [],
                    window.gaLog = window.gtag || e;
                var n = t.config.gid;
                n ? (console.info("[minigame] init ga with id: " + n),
                    cr("https://www.googletagmanager.com/gtag/js?id=" + n, !0, t.attributes).then(() => {}).catch(t => {
                        console.error("[minigame] init ga error: ", t)
                    }),
                    e("js", new Date),
                    e("config", n, {
                        cookie_flags: "max-age=7200;secure;samesite=none"
                    })) : console.warn("[minigame] ga with invalid id: " + n)
            }
            init(t, e, n = 0) {
                try {
                    t && t.enabled ? (this._enabled = t.enabled,
                        this._gameName = e,
                        this._enabled && this.initGa(t)) : (console.info("====> ga is disabled"),
                        this._enabled = !1)
                } catch (t) {
                    this._enabled = !1,
                        console.info("Fail to load init Analytics: ", t)
                }
            }
            isH5AndroidApp() {
                return !!this._commonInfo && !!this._commonInfo._minigameOption && !!this._commonInfo._minigameOption.android && this._commonInfo._minigameOption.android.enabled
            }
            isAdflyCplEnable() {
                return !!(this._commonInfo && this._commonInfo._minigameOption && this._commonInfo._minigameOption.cpl && this._commonInfo._minigameOption.cpl.adflyer) && this._commonInfo._minigameOption.cpl.adflyer.enabled
            }
            onGameEvent(r, i, s) {
                return h(this, void 0, void 0, function*() {
                    if (this._enabled) {
                        var t = window.mediationClient;
                        if (_t.isH5Android())
                            try {
                                yield t.invokeServiceAsync(o.createRequest(r))
                            } catch (t) {
                                console.info("android track event error: " + t)
                            }
                        else {
                            var e, n = r + "_" + window.minigamePlatform;
                            try {
                                (0,
                                    window.gaLog)("event", n, {
                                    event_category: s || "game_" + this._gameName,
                                    event_label: i
                                }),
                                console.info(`gtag event action = ${r}, label = ` + i)
                            } catch (t) {
                                console.info("gtag error: ", t)
                            }
                            try {
                                _t.isAdflyCplEnable() ? (e = {
                                        eventName: r,
                                        label: i
                                    },
                                    yield t.invokeServiceAsync(or.createRequest(e))) : console.info("adflyer cpl is disable")
                            } catch (t) {
                                console.info("game report service invoked error: " + t.message)
                            }
                        }
                    } else
                        console.info("====> onGameEvent is disabled")
                })
            }
        }
        .instance;
    const dr = {
        playit: class extends class {
            invokeMethodByName(t, ...e) {
                return h(this, void 0, void 0, function*() {
                    return "function" != typeof this[t] ? Promise.reject({
                        code: "FOUND_ERROR",
                        message: `Function ${t} is not exist.`
                    }) : yield this[t](...e)
                })
            }
        } {
            scoreUpdate(t) {
                var e = window.WebViewJavascriptBridge;
                if (!e)
                    return Promise.reject({
                        code: "JSBRIGDE_ERROR",
                        message: "WebViewJavascriptBridge is not undefined"
                    });
                try {
                    var n = t[0][0],
                        r = (console.info("scoreUpdate: ", n),
                            Date.now());
                    return null != e && e.callHandler("scoreUpdate", {
                            score: n,
                            time: r
                        }, function(t) {
                            t = JSON.parse(t);
                            console.info("scoreInfo: ", t)
                        }),
                        Promise.resolve()
                } catch (t) {
                    return console.error("playit scoreUpdate error: ", t.message),
                        Promise.reject({
                            code: "SCOREUPDATE_ERROR",
                            message: "playit scoreUpdate error: " + t.message
                        })
                }
            }
            getVersion() {
                const t = window.WebViewJavascriptBridge;
                return t ? new Promise((e, n) => {
                    null !== t && void 0 !== t && t.callHandler("getVersion", {}, function(t) {
                        t || n({
                            code: "GETVERSION_ERROR",
                            message: "getVersion return data null"
                        });
                        t = JSON.parse(t);
                        return t.ver || n({
                                code: "GETVERSION_ERROR",
                                message: "ver null"
                            }),
                            e(t.ver)
                    })
                }) : Promise.reject({
                    code: "JSBRIGDE_ERROR",
                    message: "WebViewJavascriptBridge is not undefined"
                })
            }
            isEntryExist() {
                return h(this, void 0, void 0, function*() {
                    try {
                        var t = yield this.getVersion(),
                            e = parseInt(t);
                        return console.info("version: ", t),
                            20705090 <= e ? !0 : !1
                    } catch (t) {
                        return !1
                    }
                })
            }
        }
    };
    class lr {
        static init() {
            Object.keys(dr).forEach(t => {
                var e = new dr[t];
                this._tpMap.set(t, e)
            })
        }
        static execute(e, n, r) {
            return h(this, void 0, void 0, function*() {
                console.info(`funcName: ${n}, data: `, r);
                var t = this._tpMap.get(e);
                return t ? void 0 === (t = yield t.invokeMethodByName(n, r)) ? Promise.resolve() : Promise.resolve(t) : Promise.reject({
                    code: "TP_NOT_FOUND",
                    message: e + " is not found"
                })
            })
        }
    }
    lr._tpMap = new Map,
        lr.init();
    class ur extends ht {
        static createRequest(t) {
            return {
                type: this.requestType,
                payload: t
            }
        }
        static createService() {
            return new ur(this.requestType, !1, this.hanleRequestAsync)
        }
        static hanleRequestAsync(e) {
            var n;
            return h(this, void 0, void 0, function*() {
                try {
                    var t = yield lr.execute(null == e ? void 0 : e.payload.chnName, null == e ? void 0 : e.payload.funcName, null == (n = e.payload) ? void 0 : n.data);
                    return null == t ? Promise.resolve(r(e)) : Promise.resolve(r(e, t))
                } catch (t) {
                    return console.error("Error executing ExternalHelper:", t),
                        Promise.resolve(lt(e, t.code, t.message))
                }
            })
        }
    }
    ur.requestType = "ExternalService";
    const fr = {
        1: "playit"
    };
    class _r {
        static get instance() {
            return this._instance || (this._instance = new _r),
                this._instance
        }
        execute(t, e, ...n) {
            var r = window.mediationClient,
                t = fr[t];
            return t ? (e = {
                    chnName: t,
                    funcName: e,
                    data: n
                },
                r.invokeServiceAsync(ur.createRequest(e))) : Promise.reject({
                code: "FUN_NOT_FOUND",
                message: `function ${t} is not exist`
            })
        }
    }
    _r._instance = null;
    const mr = _r.instance;

    function vr(e, n = 3, r = 1e3) {
        return h(this, void 0, void 0, function*() {
            try {
                i = e;
                var t = yield new Promise((e, n) => {
                    const r = new XMLHttpRequest;
                    r.open("GET", i),
                        r.onload = function() {
                            var t;
                            4 === r.readyState && 200 === r.status ? (t = JSON.parse(r.responseText),
                                e(t)) : n({
                                message: "fail to get config data from " + i
                            })
                        },
                        r.onerror = function() {
                            n({
                                message: "fail to get config data from : " + r.statusText
                            })
                        },
                        r.send()
                });
                return Promise.resolve(t)
            } catch (t) {
                return 0 < n ? (yield nr.waitTime(r),
                    console.info("loadRemoteConfig retry: ", 3 - n + 1),
                    vr(e, n - 1, r)) : Promise.reject({
                    code: "LOAD_FAILED",
                    message: "load remote config failed: " + e
                })
            }
            var i
        })
    }
    class gr {
        constructor(t) {
            this.style = t
        }
        destroy() {}
        offError(t) {}
        offLoad(t) {}
        offResize(t) {}
        onResize(t) {
            var e = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            t && t(e)
        }
        onError(t) {
            this._onErrorCB = t
        }
        onLoad(t) {
            this._onLoadCB = t
        }
        show() {
            return h(this, void 0, void 0, function*() {
                try {
                    return yield d.showBanner(),
                        Promise.resolve()
                } catch (t) {
                    return this._onErrorCB && this._onErrorCB({
                            errCode: 1001,
                            errMsg: t.message
                        }),
                        Promise.reject(t)
                }
            })
        }
        hide() {
            try {
                d.hideBanner()
            } catch (t) {
                this._onErrorCB && this._onErrorCB({
                        errCode: 1001,
                        errMsg: t.message
                    }),
                    console.error("hide banner error: ", t.message)
            }
        }
    }
    class pr {
        offClose(t) {}
        offHide(t) {}
        offError(t) {}
        offLoad(t) {}
        destroy() {}
        onClose(t) {
            this._onCloseCB = t
        }
        onHide(t) {
            this.onHide = t
        }
        onError(t) {
            this._onErrorCB = t
        }
        onLoad(t) {
            this._onLoadCB = t
        }
        hide() {
            return Promise.resolve()
        }
        isShow() {
            return !0
        }
        show() {
            return h(this, void 0, void 0, function*() {
                try {
                    return yield d.showRewardedVideo(),
                        this._onCloseCB && this._onCloseCB(),
                        Promise.resolve()
                } catch (t) {
                    return "dismissed" === t.code ? this._onCloseCB && this._onCloseCB() : this._onErrorCB && this._onErrorCB({
                            errCode: 1001,
                            errMsg: t.message
                        }),
                        Promise.reject(t)
                }
            })
        }
    }
    class yr {
        offResize(t) {}
        onResize(t) {}
        hide() {}
        destroy() {}
        offError(t) {}
        offLoad(t) {}
        onError(t) {
            this._onErrorCB = t
        }
        onLoad(t) {
            this._onLoadCB = t
        }
        show() {
            return h(this, void 0, void 0, function*() {
                try {
                    return yield d.showInterstitial(),
                        Promise.resolve()
                } catch (t) {
                    return this._onErrorCB && this._onErrorCB({
                            errCode: 1001,
                            errMsg: t.message
                        }),
                        Promise.reject(t)
                }
            })
        }
    }
    class wr {
        destroy() {}
        offLoad(t) {}
        offClose(t) {}
        offError(t) {}
        load() {
            return Promise.resolve()
        }
        onClose(t) {
            this._onCloseCB = t
        }
        onError(t) {
            this._onErrorCB = t
        }
        onLoad(t) {
            this._onLoadCB = t
        }
    }
    class Ir extends wr {
        show() {
            return h(this, void 0, void 0, function*() {
                try {
                    return yield d.showInterstitial(),
                        this._onCloseCB && this._onCloseCB(),
                        Promise.resolve()
                } catch (t) {
                    return this._onErrorCB && this._onErrorCB({
                            errCode: 1001,
                            errMsg: t.message
                        }),
                        Promise.reject(t)
                }
            })
        }
    }
    class Ar extends wr {
        show() {
            return h(this, void 0, void 0, function*() {
                try {
                    return yield d.showRewardedVideo(),
                        this._onCloseCB && this._onCloseCB({
                            isEnded: !0
                        }),
                        Promise.resolve()
                } catch (t) {
                    return "dismissed" === t.code ? this._onCloseCB && this._onCloseCB({
                            isEnded: !1
                        }) : this._onErrorCB && this._onErrorCB({
                            errCode: 1001,
                            errMsg: t.message
                        }),
                        Promise.reject(t)
                }
            })
        }
    }
    var Er = Object.freeze({
        __proto__: null,
        createRewardedVideoAd: function(t) {
            return new Ar
        },
        createInterstitialAd: function(t) {
            return new Ir
        },
        createBannerAd: function(t) {
            return new gr(t.style)
        },
        createGridAd: function(t) {
            return new yr
        },
        createCustomAd: function(t) {
            return new pr
        },
        getSystemInfo: function(t) {
            t.success && t.success({
                brand: "",
                model: "",
                pixelRatio: 1,
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
                statusBarHeight: 0,
                language: "EN",
                version: "1.0.0",
                system: "",
                platform: "",
                fontSizeSetting: 1,
                SDKVersion: "1.0.0",
                benchmarkLevel: 1
            })
        },
        getSystemInfoSync: function() {
            return {
                brand: "",
                model: "",
                pixelRatio: 1,
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
                statusBarHeight: 0,
                language: "EN",
                version: "1.0.0",
                system: "",
                platform: "",
                fontSizeSetting: 1,
                SDKVersion: "1.0.0",
                benchmarkLevel: 1
            }
        },
        getUpdateManager: function() {
            var t = {
                applyUpdate: function() {},
                onCheckForUpdate: t => {
                    t && t({
                        hasUpdate: !1
                    })
                },
                onUpdateReady: t => {
                    t && t()
                },
                onUpdateFailed: t => {
                    t && t()
                }
            };
            return t
        },
        exitMiniProgram: function(t) {
            t.fail && t.fail()
        },
        getLaunchOptionsSync: function() {
            return {
                scene: 1001,
                query: "",
                referrerInfo: {
                    appId: "",
                    extraData: ""
                },
                shareTicket: ""
            }
        },
        onHide: function(t) {
            document.addEventListener("visibilitychange", () => {
                document.hidden && (console.log("页面被挂起"),
                    t) && t()
            })
        },
        offHide: function(t) {},
        onShow: function(t) {
            document.addEventListener("visibilitychange", () => {
                document.hidden ? console.log("页面被挂起") : (console.log("页面呼出"),
                    t && t({
                        scene: 1001,
                        query: "",
                        referrerInfo: {
                            appId: "",
                            extraData: ""
                        },
                        shareTicket: ""
                    }))
            })
        },
        offShow: function(t) {},
        onAudioInterruptionEnd: function(t) {},
        offAudioInterruptionEnd: function(t) {},
        onAudioInterruptionBegin: function(t) {},
        offAudioInterruptionBegin: function(t) {},
        onError: function(t) {},
        offError: function(t) {},
        onTouchStart: function(t) {},
        offTouchStart: function(t) {},
        onTouchMove: function(t) {},
        offTouchMove: function(t) {},
        onTouchEnd: function(t) {},
        offTouchEnd: function(t) {},
        onTouchCancel: function(t) {},
        offTouchCancel: function(t) {},
        getPerformance: function() {
            return {}
        },
        triggerGC: function() {},
        setEnableDebug: function(t) {},
        createCanvas: function() {
            var t = {};
            return t.width = window.innerWidth,
                t.height = window.innerHeight,
                t
        },
        getTextLineHeight: function(t) {
            return 0
        },
        loadFont: function(t) {
            return "family"
        }
    });
    const Sr = {
            LOCAL: "local",
            MINIGAME: "minigame",
            FBIG: "fbig",
            CHALLENGE: "challenge",
            MATCH: "match",
            YANDEX: "yandex",
            DAYU: "dayu"
        },
        Dr = {
            platform: Sr.LOCAL,
            sdk: "https://sdk.minigame.vip/js/1.0/minigame-sdk.js",
            instance: "FBInstant",
            gameName: "minigame",
            features: {
                ads: {
                    enabled: !0,
                    isBannerEnabled: !0,
                    isAdRadical: !1,
                    isTest: !0,
                    isAndroidApp: !1,
                    isShowErrorTip: !1,
                    config: {
                        banner: "4864743603539728_5082905605056859",
                        interstitial: "4864743603539728_5070034729677280",
                        rewarded_video: "4864743603539728_5070034119677341",
                        rewarded_interstitial: "4864743603539728_5070034119677341"
                    },
                    options: {
                        fb_max_ad_instance: 3,
                        fb_init_ad_count: 3,
                        fb_banner_refresh_interval: 0,
                        fb_interstitial_refresh_interval: 0,
                        fb_rewarded_video_refresh_interval: 0,
                        fb_max_banner_error: 1,
                        fb_max_interstitial_error: 3,
                        fb_max_rewarded_video_error: 3,
                        fb_auto_load_on_play: !0,
                        fb_auto_reload_delay: 1,
                        fb_ad_delay_for_first_banner: 0,
                        fb_ad_delay_for_first_interstitial: 0,
                        fb_ad_delay_for_first_rewarded_video: 0
                    }
                },
                leaderboard: {
                    enabled: !1
                },
                ga: {
                    enabled: !1,
                    isDefault: !1,
                    config: {
                        gid: "UA-213371115-3"
                    }
                }
            }
        };
    class xr {
        constructor() {
            this._inited = !1
        }
        initializeAsync() {
            var o, a, c;
            return h(this, void 0, void 0, function*() {
                if (this._inited)
                    return console.warn("minigame sdk already inited"),
                        Promise.reject({
                            message: "minigame sdk already inited"
                        });
                this._inited = !0,
                    console.info("minigame start load config...");
                var e = "minigame.json?st=" + (new Date).getTime();
                let n;
                try {
                    n = yield

                    function(n) {
                        return h(this, void 0, void 0, function*() {
                            let e = Dr;
                            try {
                                var t = yield vr(n);
                                return e = t,
                                    console.info("config loaded with XHR:", e),
                                    Promise.resolve(e)
                            } catch (t) {
                                return console.info("use default config with XHR: ", e),
                                    Promise.reject({
                                        message: "load config failed width XHR: " + t.message
                                    })
                            }
                        })
                    }(e),
                    window.minigamePlatform = n.platform,
                        window.minigameConfig = n.features
                } catch (t) {
                    return Promise.reject({
                        message: `minigame sdk load config ${e} failed: ` + t.message
                    })
                }
                console.info("minigame start load sdk...");
                try {
                    yield

                    function n(r, i = 3) {
                        return h(this, void 0, void 0, function*() {
                            return i < 3 && (yield nr.waitTime(1e3)),
                                cr(r).then(() => Promise.resolve()).catch(t => {
                                    var e = 3 - i + 1;
                                    return 0 < i ? (console.error(`load ${r} retry ${e} times`),
                                        n(r, i - 1)) : Promise.reject({
                                        code: "LOADJS_RETRY_FAILED",
                                        message: `retry load ${r} ${e} fail` + t.message
                                    })
                                })
                        })
                    }(n.sdk);
                    var t = n.instance || Dr.instance,
                        r = window[t];
                    r && r.initializeAsync && (n.platform === Sr.MATCH ? this._matchInstant = r : this._sdkInstant = r)
                } catch (t) {
                    return Promise.reject({
                        message: `load ${n.sdk} error: ` + t.message
                    })
                }
                console.info("minigame start init sdk...");
                try {
                    n.platform === Sr.MATCH ? (yield this._matchInstant.initializeAsync(),
                        this.context = this._matchInstant.context) : (yield this._sdkInstant.initializeAsync(),
                        this.context = this._sdkInstant.context,
                        this.player = this._sdkInstant.player,
                        this.tournament = this._sdkInstant.tournament)
                } catch (t) {
                    return Promise.reject({
                        message: "init sdk error: " + t.message
                    })
                }
                console.info("minigame loader inited..."),
                    null != (o = null == (o = null === n || void 0 === n ? void 0 : n.features) ? void 0 : o.ads) && o.enabled && d.load(n.features.ads),
                    window.MiniGameAds = d,
                    window.MinigameAds = d;
                var { features: e, platform: t } = n, r = e.ads["isTest"];
                if (!(r || t !== Sr.MINIGAME && t !== Sr.MATCH || d.isAndroidApp))
                    try {
                        yield _t.init()
                    } catch (t) {
                        console.error("MiniGameInfo init fail: ", t)
                    }
                window.MiniGameInfo = _t,
                    window.MiniGameEvent = ut,
                    window.minigameExternal = mr;
                try {
                    var i = null != (a = n.features.ga) ? a : Dr.features.ga,
                        s = null != (c = n.gameName) ? c : Dr.gameName;
                    yield hr.init(i, s, r)
                } catch (t) {
                    console.error("MiniGameAnalytics init fail: ", t)
                }
                return window.Analytics = hr,
                    window.MiniGameAnalytics = hr,
                    Promise.resolve()
            })
        }
        startGameAsync() {
            return h(this, void 0, void 0, function*() {
                if (this._sdkInstant || this._matchInstant)
                    return this._matchInstant ? this._matchInstant.startGameAsync() : (yield this._sdkInstant.startGameAsync(),
                        this.payments = this._sdkInstant.payments,
                        Promise.resolve());
                throw new Error("SDK not initialized")
            })
        }
        setLoadingProgress(t) {
            if (!this._sdkInstant && !this._matchInstant)
                throw new Error("SDK not initialized");
            if (this._matchInstant)
                return this._matchInstant.setLoadingProgress(t);
            this._sdkInstant.setLoadingProgress(t)
        }
        setGameReadyAsync() {
            var t;
            if (this._sdkInstant || this._matchInstant)
                return null != (t = this._sdkInstant) && t.setGameReadyAsync ? this._sdkInstant.setGameReadyAsync() : Promise.resolve();
            throw new Error("SDK not initialized")
        }
        getInterstitialAdAsync(t) {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).getInterstitialAdAsync(t);
            throw new Error("SDK not initialized")
        }
        getRewardedVideoAsync(t) {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).getRewardedVideoAsync(t);
            throw new Error("SDK not initialized")
        }
        getEntryPointAsync() {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).getEntryPointAsync();
            throw new Error("SDK not initialized")
        }
        getSupportedAPIs() {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant && !this._matchInstant ? this._matchInstant : this._sdkInstant).getSupportedAPIs();
            throw new Error("SDK not initialized")
        }
        logEvent(t, e, n) {
            if (!this._sdkInstant && !this._matchInstant)
                throw new Error("SDK not initialized");
            this._matchInstant && this._matchInstant.logEvent(t, e, n),
                this._sdkInstant.logEvent(t, e, n)
        }
        canSwitchNativeGameAsync() {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).canSwitchNativeGameAsync();
            throw new Error("SDK not initialized")
        }
        canCreateShortcutAsync() {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).canCreateShortcutAsync();
            throw new Error("SDK not initialized")
        }
        createShortcutAsync() {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).createShortcutAsync();
            throw new Error("SDK not initialized")
        }
        shareAsync(t) {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).shareAsync(t);
            throw new Error("SDK not initialized")
        }
        getEntryPointData() {
            return this._sdkInstant || this._matchInstant ? (this._matchInstant || this._sdkInstant).getEntryPointData() : "SDK not initialized"
        }
        getLocale() {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).getLocale();
            throw new Error("SDK not initialized")
        }
        getPlatform() {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).getPlatform();
            throw new Error("SDK not initialized")
        }
        getSDKVersion() {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).getSDKVersion();
            throw new Error("SDK not initialized")
        }
        setSessionData(t) {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).setSessionData(t);
            throw new Error("SDK not initialized")
        }
        updateAsync(t) {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).updateAsync(t);
            throw new Error("SDK not initialized")
        }
        switchGameAsync(t, e) {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).switchGameAsync(t, e);
            throw new Error("SDK not initialized")
        }
        quit() {
            if (!this._sdkInstant && !this._matchInstant)
                throw new Error("SDK not initialized");
            this._matchInstant && this._matchInstant.quit(),
                this._sdkInstant.quit()
        }
        onPause(t) {
            if (!this._sdkInstant && !this._matchInstant)
                throw new Error("SDK not initialized");
            this._matchInstant && this._matchInstant.onPause(t),
                this._sdkInstant.onPause(t)
        }
        getTournamentAsync() {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).getTournamentAsync();
            throw new Error("SDK not initialized")
        }
        postSessionScoreAsync(t) {
            if (!this._sdkInstant && !this._matchInstant)
                throw new Error("SDK not initialized");
            this._matchInstant && this._matchInstant.postSessionScoreAsync(t),
                this._sdkInstant.postSessionScoreAsync(t)
        }
        inviteAsync() {
            if (!this._sdkInstant && !this._matchInstant)
                throw new Error("SDK not initialized");
            this._matchInstant && this._matchInstant.inviteAsync(),
                this._sdkInstant.inviteAsync()
        }
        loadBannerAdAsync(t) {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).loadBannerAdAsync(t);
            throw new Error("SDK not initialized")
        }
        hideBannerAdAsync() {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).hideBannerAdAsync();
            throw new Error("SDK not initialized")
        }
        getRewardedInterstitialAsync(t) {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).getRewardedInterstitialAsync(t);
            throw new Error("SDK not initialized")
        }
        matchPlayerAsync(t, e, n) {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).matchPlayerAsync(t, e, n);
            throw new Error("SDK not initialized")
        }
        checkCanPlayerMatchAsync() {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).checkCanPlayerMatchAsync();
            throw new Error("SDK not initialized")
        }
        getLeaderboardAsync(t) {
            if (this._sdkInstant || this._matchInstant)
                return (this._matchInstant || this._sdkInstant).getLeaderboardAsync(t);
            throw new Error("SDK not initialized")
        }
        postSessionScore(t) {
            if (!this._sdkInstant && !this._matchInstant)
                throw new Error("SDK not initialized");
            this._matchInstant && this._matchInstant.postSessionScore(t),
                this._sdkInstant.postSessionScore(t)
        }
        checkInAsync() {
            if (this._matchInstant)
                return this._matchInstant.checkInAsync();
            throw new Error("Match SDK not initialized")
        }
        matchLogAsync(t) {
            if (this._matchInstant)
                return this._matchInstant.matchLogAsync(t);
            throw new Error("Match SDK not initialized")
        }
        submitMatchLogAsync(t) {
            if (this._matchInstant)
                return this._matchInstant.submitMatchLogAsync(t);
            throw new Error("Match SDK not initialized")
        }
        requestMatchInfoAsync(t) {
            if (this._matchInstant)
                return this._matchInstant.requestMatchInfoAsync(t);
            throw new Error("Match SDK not initialized")
        }
        matchInfoAsync(t, e) {
            if (this._matchInstant)
                return this._matchInstant.matchInfoAsync(t, e);
            throw new Error("Match SDK not initialized")
        }
        showMatchInfoAsync(t, e) {
            if (this._matchInstant)
                return this._matchInstant.showMatchInfoAsync(t, e);
            throw new Error("Match SDK not initialized")
        }
        setMatchReadyAsync(t, e) {
            if (this._matchInstant)
                return this._matchInstant.setMatchReadyAsync(t, e);
            throw new Error("Match SDK not initialized")
        }
        matchResultAsync(t) {
            if (this._matchInstant)
                return this._matchInstant.matchResultAsync(t);
            throw new Error("Match SDK not initialized")
        }
        showMatchResultAsync(t) {
            if (this._matchInstant)
                return this._matchInstant.showMatchResultAsync(t);
            throw new Error("Match SDK not initialized")
        }
        submitMatchResultAsync(t) {
            if (this._matchInstant)
                return this._matchInstant.submitMatchResultAsync(t);
            throw new Error("Match SDK not initialized")
        }
        recordReportInfo(t) {
            if (!this._matchInstant)
                throw new Error("Match SDK not initialized");
            this._matchInstant.recordReportInfo(t)
        }
        getRulesInfo() {
            if (this._matchInstant)
                return this._matchInstant.getRulesInfo();
            throw new Error("Match SDK not initialized")
        }
        getTargetsScore() {
            if (this._matchInstant)
                return this._matchInstant.getTargetsScore();
            throw new Error("Match SDK not initialized")
        }
        getTargetsTime() {
            if (this._matchInstant)
                return this._matchInstant.getTargetsTime();
            throw new Error("Match SDK not initialized")
        }
        getCountryCode() {
            if (this._matchInstant)
                return this._matchInstant.getCountryCode();
            throw new Error("Match SDK not initialized")
        }
        isTargetReached(t) {
            if (this._matchInstant)
                return this._matchInstant.isTargetReached(t);
            throw new Error("Match SDK not initialized")
        }
        triggerGameTimeEvent(t) {
            if (this._matchInstant)
                return this._matchInstant.triggerGameTimeEvent(t);
            throw new Error("Match SDK not initialized")
        }
        triggerTargetReachedEvent(t) {
            if (!this._matchInstant)
                throw new Error("Match SDK not initialized");
            this._matchInstant.triggerTargetReachedEvent(t)
        }
        triggerLevelCompleteEvent(t) {
            if (!this._matchInstant)
                throw new Error("Match SDK not initialized");
            this._matchInstant.triggerLevelCompleteEvent(t)
        }
        triggerMatchCompleteEvent(t) {
            if (!this._matchInstant)
                throw new Error("Match SDK not initialized");
            this._matchInstant.triggerMatchCompleteEvent(t)
        }
        triggerScoreChangeEvent(t, e) {
            if (!this._matchInstant)
                throw new Error("Match SDK not initialized");
            this._matchInstant.triggerScoreChangeEvent(t, e)
        }
        consumeItemAsync(t) {
            if (this._matchInstant)
                return this._matchInstant.consumeItemAsync(t);
            throw new Error("Match SDK not initialized")
        }
        getUserInfo() {
            if (this._matchInstant)
                return this._matchInstant.getUserInfo();
            throw new Error("Match SDK not initialized")
        }
    }
    var ee = "1.1 b0001",
        Br = (console.info("minigame sdk version: ", ee),
            new xr);
    window.FBInstant = Br,
        window.minigame = Br,
        window.mwx = Er,
        L.MinigameInstant = xr,
        L.version = ee,
        Object.defineProperty(L, "__esModule", {
            value: !0
        })
});