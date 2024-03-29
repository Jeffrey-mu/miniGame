var xmgame = {
    videoFail: null,
    videoSuc: null,
    init: !1,
    bannerAd: null,
    rewardedVideoAd: null,
    canShowBanner: !0,
    platform: "wy",
    openVolume() {
        let e = window.GAudio.musicOn,
            o = window.GAudio.soundOn;
        e && cc.audioEngine.setMusicVolume(1),
            o && cc.audioEngine.setEffectsVolume(1)
    },
    closeVolume() {
        cc.audioEngine.setMusicVolume(0),
            cc.audioEngine.setEffectsVolume(0)
    },
    showVideo(e, o) {
        if (console.log("激励广告入口"),
            this.closeVolume(), !window.MiniGameAds)
            return o && o(),
                void this.openVolume();
        this.closeVolume(),
            MiniGameAds.isRewardvideoReady() ? MiniGameAds.showRewardedVideo().then(() => {
                console.info("\u65b0\u63a5\u53e3\u64ad\u653e\u6fc0\u52b1\u5e7f\u544a: \u6210\u529f"),
                    this.openVolume(),
                    e && e()
            }).catch(e => {
                o && o(),
                    this.openVolume(),
                    console.error("\u65b0\u63a5\u53e3\u64ad\u653e\u6fc0\u52b1\u5e7f\u544a: \u5931\u8d25\uff0c\u539f\u56e0: " + e.message)
            }) : (o && o(),
                this.openVolume(),
                console.info("\u6fc0\u52b1\u89c6\u9891\u6ca1\u6709\u52a0\u8f7d\u6210\u529f\uff0c\u65e0\u6cd5\u64ad\u653e"))
    },
    showInter() {
        console.log("插屏广告入口")
        console.log("XMGAME----------------------------showInter"),
            window.jsb && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AdManager", "showInter", "()V")
    },
    showFloat() {},
    hideFloat() {},
    showBanner() {
        if (!window.MiniGameAds)
            return;
        MiniGameAds.isBannerReady() ? MinigameAds.showBanner().then(() => {
            console.info("\u65b0\u63a5\u53e3\u64ad\u653e\u6a2a\u5e45\u5e7f\u544a: \u6210\u529f"),
                window.xmgame.isShowBanner = !0
        }).catch(e => {
            console.error("\u65b0\u63a5\u53e3\u64ad\u653e\u6a2a\u5e45\u5e7f\u544a: \u5931\u8d25\uff0c\u539f\u56e0: " + e.message)
        }) : console.info("\u6a2a\u5e45\u5e7f\u544a\u6ca1\u6709\u52a0\u8f7d\u6210\u529f\uff0c\u65e0\u6cd5\u64ad\u653e")
    },
    hideBanner() {
        window.MiniGameAds && MiniGameAds.hideBanner().then(() => {
            console.info("\u65b0\u63a5\u53e3\u9690\u85cf\u6fc0\u52b1\u5e7f\u544a: \u6210\u529f")
        }).catch(e => {
            console.error("\u65b0\u63a5\u53e3\u9690\u85cf\u6fc0\u52b1\u5e7f\u544a: \u5931\u8d25\uff0c\u539f\u56e0: " + e.message)
        })
    },
    loadBanner() {},
    loadVideo() {},
    adItemData: null,
    nativeAd: null,
    loadNative() {},
    clickNative() {
        window.xmgame.nativeAd.reportAdClick({
            adId: window.xmgame.adItemData.adId
        })
    },
    showNative(e, o) {
        window.xmgame.adItemData ? e && e(window.xmgame.adItemData) : (o && o(),
            window.xmgame.loadNativeOther())
    },
    loadNativeOther() {
        window.xmgame.loadNative()
    },
    initWindow() {
        window.getVideoSuccess = function() {
                console.log("success"),
                    window.xmgame.videoSuc && window.xmgame.videoSuc(),
                    window.xmgame.videoSuc = null
            },
            window.getVideoFalse = function(e) {
                window.xmgame.videoFail && window.xmgame.videoFail(),
                    window.xmgame.videoFail = null
            }
    },
    showInterByType(e) {},
    showInter() {
        if (!window.MiniGameAds)
            return;
        MiniGameAds.isInterstitialReady() ? MiniGameAds.showInterstitial().then(() => {
            console.info("\u65b0\u63a5\u53e3\u64ad\u653e\u63d2\u5c4f\u5e7f\u544a: \u6210\u529f")
        }).catch(e => {
            console.error("\u65b0\u63a5\u53e3\u64ad\u653e\u63d2\u5c4f\u5e7f\u544a: \u5931\u8d25\uff0c\u539f\u56e0: " + e.message)
        }) : console.info("\u63d2\u5c4f\u5e7f\u544a\u6ca1\u6709\u52a0\u8f7d\u6210\u529f\uff0c\u65e0\u6cd5\u64ad\u653e")
    },
    sendEvent(e) {},
    sendEvents(e, o) {},
    sendCount() {
        let e = new Date,
            o = 0,
            n = `${e.getDate()}-${e.getDay()}`,
            i = cc.sys.localStorage.getItem("lastNow_water"),
            a = cc.sys.localStorage.getItem("firstNow_dog" + this.platform),
            t = 0;
        n != i && (cc.sys.localStorage.setItem("lastNow_water", n),
                t = 1),
            a || (o = 1),
            cc.sys.localStorage.setItem("firstNow_dog" + this.platform, "1");
        let s = new XMLHttpRequest;
        s.onreadystatechange = function() {
                if (4 == s.readyState && s.status >= 200 && s.status < 400) {
                    var e = s.responseText;
                    console.log(e)
                }
            },
            s.open("GET", `https://www.luozhiming.shop:30001/game/count?channel=knife_${this.platform}&dailyCount=${t}&newCount=${o}`, !0),
            s.send()
    },
    initConfig() {
        window.xmgame.init || (this.sendCount(),
            window.xmgame.init = !0)
    }
};
window.xmgame = xmgame;
