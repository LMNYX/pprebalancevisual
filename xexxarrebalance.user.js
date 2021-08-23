// ==UserScript==
// @name         Xexxar Rebalance Visual
// @version      0.1.2
// @description  try to take over the world!
// @author       mishashto
// @match        https://osu.ppy.sh/*
// @icon         https://www.google.com/s2/favicons?domain=osu.ppy.sh
// @noframes
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// ==/UserScript==

(async ()=>{
    "use strict";
    waitForKeyElements(".osu-page.osu-page--users", profileDisplay);
    $(document).ready(function(){
        //
    });
    const userIDTitles = {
        "6704950": "visualisation extension dev!",
        "2773526": "rebalance author"
    };
    function profileDisplay()
    {
        let hehe = document.getElementsByClassName("hidden-xs page-extra-tabs page-extra-tabs--profile-page js-switchable-mode-page--scrollspy-offset");
        if(hehe.length < 1)
            return;
        let _isInit = false;
        var _userId = document.URL.split("/");
        if(document.URL.split("/").length > 5)
            _userId = _userId[_userId.length-2];
        else
            _userId = _userId[_userId.length-1];
        var _userName = document.getElementsByClassName("profile-info__name")[0];
        var _userIconGroup = document.getElementsByClassName("profile-info__icon-group")[0];
        if(document.getElementsByClassName("profile-info__title").length < 1 && _userId.toString() in userIDTitles)
        {
            var _fakeGroup = document.createElement("span");
            _fakeGroup.class = "profile-info__title";
            _fakeGroup.innerText = userIDTitles[_userId.toString()];
            _fakeGroup.setAttribute("data-html-title", "this is added by extension! (not real (fake))");
            _fakeGroup.setAttribute("data-orig-title", "this is added by extension! (not real (fake))");
            _fakeGroup.setAttribute("title", "this is added by extension! (not real (fake))");
            _fakeGroup.setAttribute("data-hasqtip", "qtip-4");
            _fakeGroup.setAttribute("aria-describedby", "qtip-4");
            _userName.parentNode.insertBefore(_fakeGroup, _userIconGroup);
        }
        function numberWithCommas(x) {
            if ( x == undefined )
                return "0";
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        async function addPPrebToProfile()
        {
            var _lv = await fetch(`https://pp-api.huismetbenen.nl/player/${_userId}/xexxar-skills?_=f${Math.random()}`, {
                "credentials": "omit",
                "headers": {
                    "User-Agent": "Needle/2.6.0 (Node.js ; undefined undefined)",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "content-type": "application/x-www-form-urlencoded",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "cross-site",
                    "Cache-Control": "max-age=0"
                },
                "referrer": "https://osu.ppy.sh/",
                "method": "GET",
                "mode": "cors"
            });
            _lv = await _lv.json();
            var _acpHols = document.getElementsByClassName("profile-detail__col profile-detail__col--top-left")[0];
            var newPPh = document.createElement("div");
            newPPh.className = "profile-detail__top-left-item";
            newPPh.innerHTML = `<div class="value-display value-display--pp"><div class="value-display__label">pp rebalance</div><div class="value-display__value"><div data-html-title="pp change: ${numberWithCommas(_lv['pp_change'])}<br><br>new pp incl. bonus: ${numberWithCommas(_lv['new_pp_incl_bonus'])}<br>new pp excl. bonus: ${numberWithCommas(_lv['new_pp_excl_bonus'])}<br><br>weighted acc pp: ${numberWithCommas(_lv['weighted_acc_pp'])}<br>weighted aim pp: ${numberWithCommas(_lv['weighted_aim_pp'])}<br>weighted tap pp: ${numberWithCommas(_lv['weighted_tap_pp'])}" data-orig-title="" title="" data-hasqtip="5" aria-describedby="qtip-5">${numberWithCommas(_lv['new_pp_incl_bonus'])}</div></div></div>`;
            _acpHols.append(newPPh);
        }
        addPPrebToProfile().then(()=>{}).catch(()=>{});
        async function reqReb()
        {
            let _data = await fetch("https://pp-api.huismetbenen.nl/add-to-queue?_=f${Math.random()}", {
                "credentials": "omit",
                "headers": {
                    "User-Agent": "Needle/2.6.0 (Node.js ; undefined undefined)",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "content-type": "application/x-www-form-urlencoded",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-site"
                },
                "referrer": "https://pp.huismetbenen.nl/",
                "body": `user_id=${_userId}&algorithm=xexxar-skills`,
                "method": "PATCH",
                "mode": "cors"
            });
            let _x = await _data.json();
            if( 'error' in _x )
            { alert(_x['error']); }
            else { alert("Added to queue! Please refresh page in a minute.."); }
        }
        if(_isInit)
            return;
        if(document.getElementsByClassName("btn-circle btn-circle--page-toggle btn-circle--page-toggle-detail js-click-menu").length > 0)
        {
            var _hasAddedRebalanceBtn = false;
            document.getElementsByClassName("btn-circle btn-circle--page-toggle btn-circle--page-toggle-detail js-click-menu")[0].onclick = function()
            {
                if(_hasAddedRebalanceBtn) { return; }
                let _rebBtn = document.createElement("button");
                _rebBtn.className = "simple-menu__item";
                _rebBtn.innerText = "Update PP rebalance";
                _rebBtn.onclick = async function()
                {
                    await reqReb();
                }
                setTimeout(function(){ document.getElementsByClassName("simple-menu simple-menu--profile-page-bar js-click-menu js-click-menu--active")[0].append(_rebBtn); }, 111);
                _hasAddedRebalanceBtn = true;
            }
        }
        else
        {
            let _btnsHolstr = document.getElementsByClassName("profile-detail-bar__column profile-detail-bar__column--left")[0];
            let _ppMeBtn = document.createElement("div");
            _ppMeBtn.className = "profile-detail-bar__entry";
            let _qtipBlock = document.createElement("div");
            _qtipBlock.setAttribute("data-orig-title", "rebalance pp");
            _qtipBlock.setAttribute("data-hasqtip", "4");
            let _actualButtonReb = document.createElement("button");
            _actualButtonReb.className = "user-action-button user-action-button--profile-page user-action-button--friend";
            _actualButtonReb.innerText = "rpp!";
            _actualButtonReb.setAttribute("data-html-title", "update pp rebalance data");
            _actualButtonReb.setAttribute("data-orig-title", "update pp rebalance data");
            _actualButtonReb.setAttribute("title", "update pp rebalance data");
            _actualButtonReb.setAttribute("data-hasqtip", "qtip-4");
            _actualButtonReb.setAttribute("aria-describedby", "qtip-4");
            _actualButtonReb.onclick = async function() { await reqReb(); }
            _qtipBlock.append(_actualButtonReb);
            _ppMeBtn.append(_qtipBlock);
            _btnsHolstr.append(_ppMeBtn);
        }
    }
})();
