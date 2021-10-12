if (self.CavalryLogger) { CavalryLogger.start_js(["J8wnv"]); }

__d("ResetScrollOnUnload",["Run"],(function(a,b,c,d,e,f){a={disableScrollRestoration:function(){b("Run").onUnload(function(){window.history.scrollRestoration="manual"})},init:function(a){b("Run").onUnload(function(){window.history.scrollRestoration="manual",a.style.opacity="0",window.scrollTo(0,0)})}};e.exports=a}),null);
__d("cometExtraRouteBuilder",["cometRouteBuilder","unrecoverableViolation"],(function(a,b,c,d,e,f){"use strict";function a(a,c,d,e){var f=b("cometRouteBuilder")(a,c,e),g=d.reduce(function(a,d){a===void 0&&(a={});typeof d==="string"&&(a[d]=b("cometRouteBuilder")(d,c,e).buildURL);return a},{});return{buildExtraURL:function(a,c){if(typeof a!=="string"||g[a]==null)throw b("unrecoverableViolation")("Route builder for extra path does not exist","comet_infra");return g[a](c)},buildURL:function(a){return f.buildURL(a)}}}e.exports=a}),null);
__d("XUpdateTimezoneControllerRouteBuilder",["cometExtraRouteBuilder"],(function(a,b,c,d,e,f){a=b("cometExtraRouteBuilder")("/ajax/autoset_timezone_ajax/",Object.freeze({is_forced:!1}),["/ajax/autoset_timezone_ajax.php","/ajax/timezone/update/","/ajax/timezone/update.php"],void 0);e.exports=a}),null);
__d("getBrowserGMTOffsetAdjustedForSkew",["DateConsts","FBLogger"],(function(a,b,c,d,e,f){"use strict";var g=(c=b("DateConsts")).HOUR_PER_DAY,h=c.MIN_PER_HOUR,i=c.MS_PER_SEC,j=c.SEC_PER_MIN;function a(a){var c=h*g,d=new Date(),e=d.getTimezoneOffset();d=d.getTime()/i;var f=15;a=a-d;d=Math.round(a/(f*j))*f;d!=0&&b("FBLogger")("TimezoneAutoset").warn("Adjusting timezone offset for clock skew. Browser offset: %s. Raw skew %s. Rounded skew %s",e,a,d);f=Math.round(e+d)%c;f>12*h?f-=c:f<-14*h&&(f+=c);return f}e.exports=a}),null);
__d("getBrowserTimezone",["FBLogger"],(function(a,b,c,d,e,f){"use strict";function a(){try{var a;a=((a=window.Intl)==null?void 0:a.DateTimeFormat)&&Intl.DateTimeFormat();a=(a==null?void 0:a.resolvedOptions)&&a.resolvedOptions();return a==null?void 0:a.timeZone}catch(a){b("FBLogger")("TimezoneAutoset").catching(a).warn("Could not read IANA timezone from browser");return null}}e.exports=a}),null);
__d("TimezoneAutoset",["AsyncRequest","XUpdateTimezoneControllerRouteBuilder","emptyFunction","getBrowserGMTOffsetAdjustedForSkew","getBrowserTimezone","killswitch"],(function(a,b,c,d,e,f){var g=!1;function a(a,b,c){h({serverTimestamp:a,serverTimezone:null,serverGmtOffset:b,forceUpdate:c})}function h(a){var c=a.serverTimestamp,d=a.serverTimezone,e=a.serverGmtOffset;a=a.forceUpdate;if(!c||e==null)return;if(g)return;g=!0;c=-b("getBrowserGMTOffsetAdjustedForSkew")(c);var f=b("killswitch")("TIMEZONE_SET_IANA_ZONE_NAME")?null:b("getBrowserTimezone")();if(a||c!=e||f!=null&&f!=d){e=b("XUpdateTimezoneControllerRouteBuilder").buildExtraURL("/ajax/timezone/update.php",{});new(b("AsyncRequest"))().setURI(e).setData({tz:f,gmt_off:c,is_forced:a}).setErrorHandler(b("emptyFunction")).setTransportErrorHandler(b("emptyFunction")).setOption("suppressErrorAlerts",!0).send()}}c={setInputValue:function(a,c){a.value=b("getBrowserGMTOffsetAdjustedForSkew")(c).toString()},setTimezone:a,getBrowserTimezone:b("getBrowserTimezone"),setTimezoneAndOffset:h};e.exports=c}),null);
__d("KeyboardActivityTypedLogger",["Banzai","GeneratedLoggerUtils","nullthrows"],(function(a,b,c,d,e,f){"use strict";a=function(){function a(){this.$1={}}var c=a.prototype;c.log=function(){b("GeneratedLoggerUtils").log("logger:KeyboardActivityLoggerConfig",this.$1,b("Banzai").BASIC)};c.logVital=function(){b("GeneratedLoggerUtils").log("logger:KeyboardActivityLoggerConfig",this.$1,b("Banzai").VITAL)};c.logImmediately=function(){b("GeneratedLoggerUtils").log("logger:KeyboardActivityLoggerConfig",this.$1,{signal:!0})};c.clear=function(){this.$1={};return this};c.getData=function(){return babelHelpers["extends"]({},this.$1)};c.updateData=function(a){this.$1=babelHelpers["extends"]({},this.$1,a);return this};c.setDuration=function(a){this.$1.duration=a;return this};c.setKey=function(a){this.$1.key=a;return this};c.setVC=function(a){this.$1.vc=a;return this};return a}();c={duration:!0,key:!0,vc:!0};e.exports=a}),null);
__d("KeyboardActivityLogger",["Event","KeyboardActivityTypedLogger","Keys","isElementInteractive"],(function(a,b,c,d,e,f){a=["tab","right","left","up","down","enter"];var g=a.reduce(function(a,b){a[b]={count:0,startTS:0};return a},{}),h=20;c={init:function(){document.addEventListener("keydown",this._listenForKey.bind(this))},_listenForKey:function(a){var c=a.getTarget();if(b("isElementInteractive")(c))return;switch(b("Event").getKeyCode(a)){case b("Keys").TAB:this._checkKeyActivity("tab");break;case b("Keys").RIGHT:this._checkKeyActivity("right");break;case b("Keys").LEFT:this._checkKeyActivity("left");break;case b("Keys").UP:this._checkKeyActivity("up");break;case b("Keys").DOWN:this._checkKeyActivity("down");break;case b("Keys").RETURN:this._checkKeyActivity("enter");break}},_checkKeyActivity:function(a){var b=g[a];b.count++;b.startTS===0&&(b.startTS=Date.now());b.count===h&&(this._log(a),b.count=0,b.startTS=0)},_log:function(a){var c=g[a];c=Date.now()-c.startTS;new(b("KeyboardActivityTypedLogger"))().setKey(a).setDuration(c).log()}};e.exports=c}),null);
__d("NavigationMenubarInteractionsTypedLogger",["Banzai","GeneratedLoggerUtils","nullthrows"],(function(a,b,c,d,e,f){"use strict";a=function(){function a(){this.$1={}}var c=a.prototype;c.log=function(){b("GeneratedLoggerUtils").log("logger:NavigationMenubarInteractionsLoggerConfig",this.$1,b("Banzai").BASIC)};c.logVital=function(){b("GeneratedLoggerUtils").log("logger:NavigationMenubarInteractionsLoggerConfig",this.$1,b("Banzai").VITAL)};c.logImmediately=function(){b("GeneratedLoggerUtils").log("logger:NavigationMenubarInteractionsLoggerConfig",this.$1,{signal:!0})};c.clear=function(){this.$1={};return this};c.getData=function(){return babelHelpers["extends"]({},this.$1)};c.updateData=function(a){this.$1=babelHelpers["extends"]({},this.$1,a);return this};c.setAction=function(a){this.$1.action=a;return this};c.setTargetItem=function(a){this.$1.target_item=a;return this};c.updateExtraData=function(a){a=b("nullthrows")(b("GeneratedLoggerUtils").serializeMap(a));b("GeneratedLoggerUtils").checkExtraDataFieldNames(a,g);this.$1=babelHelpers["extends"]({},this.$1,a);return this};c.addToExtraData=function(a,b){var c={};c[a]=b;return this.updateExtraData(c)};return a}();var g={action:!0,target_item:!0};e.exports=a}),null);
__d("NavigationAssistantController",["csx","cx","fbt","requireCond","Arbiter","AsyncRequest","CSS","DOM","DOMEventListener","DOMQuery","DOMTraverser","Event","Focus","KeyboardShortcuts","KeyEventController","Menu","MenuItem","NavigationMenubarInteractionsTypedLogger","PageTransitions","RTLKeys","TabbableElements","cr:1269707","cr:1269708","cr:1269709","debounce","ge","getActiveElement","getOrCreateDOMID","gkx","setImmediate","setTimeout"],(function(a,b,c,d,e,f,g,h,i){"use strict";var j=["main","banner","search","navigation","region","complementary","form","contentinfo"],k={main:function(a){return a?i._("Principal: {section name}",[i._param("section name",a)]):i._("Secci\u00f3n principal")},banner:function(a){return i._("Banner de {section name}",[i._param("section name",a)])},search:function(a){return i._("Busca en {section name}",[i._param("section name",a)])},navigation:function(a){return a?i._("Navegar por {section name}",[i._param("section name",a)]):i._("Navegaci\u00f3n")},region:function(a){return a},complementary:function(a){return a?a:i._("Informaci\u00f3n complementaria")},form:function(a){return i._("Formulario de {section name}",[i._param("section name",a)])},contentinfo:function(a){return i._("Pie de p\u00e1gina de {section name}",[i._param("section name",a)])}},l=500;a={init:function(a,c,d,e,f,g){var h=this;this._banner=a;this._menubar=c;this._sectionsMenu=d;this._accessibilityMenu=e;this._globalMenu=f;this._shortcutMenuItem=this._accessibilityMenu&&this._accessibilityMenu.getItemAt(0);this._menubarMenus=[{menu:this._sectionsMenu,logName:"page_sections"}];this._accessibilityMenu&&this._menubarMenus.push({menu:this._accessibilityMenu,logName:"accessibility"});this._globalMenu&&this._menubarMenus.push({menu:this._globalMenu,logName:"global"});document.body&&b("CSS").addClass(document.body,"hasAXNavMenubar");this._hasBanner=document.body&&b("CSS").hasClass(document.body,"hasBanner");this._shown=!1;this._items=[];this._hotKeyTrigger=null;this._menubarMenuItems=b("DOMQuery").scry(this._menubar,'[role="button"]');this._menubarMenuItems.forEach(function(a){a.setAttribute("role","menuitem")});this._activeItem=this._menubarMenuItems[0];this._activeItemIndex=0;if(g!=null)for(var i in g)Object.prototype.hasOwnProperty.call(g,i)&&g[i]!=null&&g[i].disableTypeaheadActivation();this._setupEvents();this._keysSoFar="";this._clearKeysSoFarAfterDelay=b("debounce")(function(){h._keysSoFar=""},l);this._handlePageLoad()},_setupEvents:function(){var a=this;this._menubarMenuItems[0].addEventListener("focus",this._showMenubar.bind(this));this._menubar.addEventListener("keydown",this._checkHide.bind(this));this._menubar.addEventListener("keyup",this._checkMenuSwitch.bind(this));this._menubarMenus.forEach(function(b){b.menu.subscribe("show",a._menuShown.bind(a,b)),b.menu.subscribe("hide",a._menuHidden.bind(a,b)),b.menu.subscribe("done",a._checkBlur.bind(a)),b.menu.getRoot().addEventListener("keyup",a._checkMenuSwitch.bind(a))});b("DOMEventListener").add(document,"click",this._checkClickBlur.bind(this));this._sectionsMenu.subscribe("focus",this._highlightFocused.bind(this));this._sectionsMenu.subscribe("blur",this._unhighlightFocused.bind(this));this._accessibilityMenu&&this._accessibilityMenu.subscribe("itemclick",this._checkShortcutsShow.bind(this));this._globalMenu&&this._globalMenu.subscribe("itemclick",this._globalMenuPress.bind(this));b("gkx")("677762")&&(b("DOMEventListener").add(document,"keydown",this._checkHotKey.bind(this)),b("DOMEventListener").add(document,"keypress",this._trackHotKeyPress.bind(this)),b("DOMEventListener").add(document,"keyup",this._unsetHotKey.bind(this)))},_globalMenuPress:function(a,c){this._checkLogEvent(a,c);if(b("cr:1269709")!=null&&b("cr:1269708")!=null&&b("cr:1269707")!=null){a=null;switch((c=c.item)==null?void 0:(c=c._data)==null?void 0:c.value){case"newsfeed":a={entityKey:b("cr:1269708").forFeed(),appTabId:b("cr:1269707").HOME};break;case"notifications":a={entityKey:b("cr:1269708").forNotif(),appTabId:b("cr:1269707").NOTIFICATIONS};break;case"messenger":a={entityKey:b("cr:1269708").forChat(),appTabId:b("cr:1269707").CHATS};break;case"admin-panel":a={entityKey:b("cr:1269708").forAdminPanelSection(),appTabId:b("cr:1269707").ADMIN_PANEL};break}a!=null&&(b("cr:1269709").setActiveEntityKeys([a.entityKey]),b("cr:1269709").selectAppTabID(a.appTabId))}},_checkHide:function(a){var c=this;a=b("Event").getKeyCode(a);if(a===b("RTLKeys").ESC){this._hideMenubar();this._returnFocus();return}a===b("RTLKeys").TAB&&b("setImmediate")(function(){c._hideMenubar()})},_returnFocus:function(){if(this._hotKeyTrigger)b("Focus").set(this._hotKeyTrigger,!0),this._hotKeyTrigger=null;else{var a=this._banner.nextElementSibling;b("TabbableElements").isTabbable(a)||(a=b("DOMTraverser").nextFilteredNode(document.body,a,b("TabbableElements").isTabbable));b("Focus").set(a)}},_setActiveItem:function(a){if(a<0||a>=this._menubarMenuItems.length)return;this._activeItem.setAttribute("tabindex","-1");this._activeItem=this._menubarMenuItems[a];this._activeItemIndex=a;this._activeItem.setAttribute("tabindex","0")},_checkMenuSwitch:function(a){var c=this;a=b("Event").getKeyCode(a);var d=this._menubarMenus.length,e=this._activeItemIndex;switch(a){case b("RTLKeys").getLeft():e=this._activeItemIndex===0?d-1:this._activeItemIndex-1;break;case b("RTLKeys").getRight():e=this._activeItemIndex===d-1?0:this._activeItemIndex+1;break;default:e=this._findItemToFocus(a);if(e<0)return!1}this._isShowingMenu&&this._isShowingMenu.done();this._setActiveItem(e);b("setTimeout")(function(){b("Focus").set(c._activeItem,!0)},0);return!0},_findItemToFocus:function(a){if(this._isShowingMenu)return-1;a=String.fromCharCode(a).toLowerCase();this._keysSoFar||(this._searchIndex=this._activeItemIndex);this._keysSoFar+=a;this._clearKeysSoFarAfterDelay();a=this._findMatchInRange(this._searchIndex+1,this._menubarMenuItems.length);a<0&&(a=this._findMatchInRange(0,this._searchIndex));return a<0?this._searchIndex:a},_findMatchInRange:function(a,b){for(var a=a;a<b;a++){var c=this._menubarMenuItems[a].innerText;if(c.toLowerCase().indexOf(this._keysSoFar)===0)return a}return-1},_menuShown:function(a){this._ignoreBlur=!0,this._isShowingMenu=a.menu,this._logEvent("menu_shown",a.logName)},_menuHidden:function(a){this._ignoreBlur=!1,this._isShowingMenu===a.menu&&(this._isShowingMenu=null)},_checkClickBlur:function(){this._ignoreBlur||this._checkBlur()},_checkBlur:function(){var a=this,c=b("getActiveElement")();this._shown&&c&&!b("DOM").contains(this._menubar,c)&&!this._ignoreBlur&&b("setImmediate")(function(){a._hideMenubar()});this._highlighted&&(b("CSS").removeClass(this._highlighted,"_1toc"),this._highlighted=null)},_highlightFocused:function(a,c){this._highlighted&&b("CSS").removeClass(this._highlighted,"_1toc"),this._highlighted=b("ge")(c.item.getValue()),this._highlighted&&b("CSS").addClass(this._highlighted,"_1toc")},_unhighlightFocused:function(a,c){this._highlighted&&b("CSS").removeClass(this._highlighted,"_1toc")},_checkHotKey:function(a){var c=this,d=b("Event").getKeyCode(a),e=a.altKey;if(!b("KeyEventController").filterEventTargets(a,"keydown"))return;if(d===b("RTLKeys").FORWARD_SLASH&&e){d=b("getActiveElement")();this._listenHotKeyPress=!0;if(this._shown){this._menubarMenus.forEach(function(a){a.menu.done()});b("setTimeout")(function(){c._returnFocus(),c._hideMenubar()},0);return}if(d&&this._isInDialog(d))return;this._hotKeyTrigger=d;this._showMenubar();b("Focus").set(this._activeItem,!0);this._logEvent("hotkey_triggered","menubar");return}this._listenHotKeyPress=!1;this._shown&&this._checkHide(a)},_unsetHotKey:function(a){this._listenHotKeyPress=!1},_trackHotKeyPress:function(a){if(this._listenHotKeyPress){a=b("Event").getKeyCode(a);this._logEvent("hotkey_char",""+a)}},_handlePageLoad:function(){var a=this;this._validateMainSection();this._setupSectionsMenu();this._setupAccessibilityMenu();b("PageTransitions").registerCompletionCallback(function(){a._handlePageLoad()})},_validateMainSection:function(){var a=document.getElementById("content");if(!a)return;var c=b("DOMQuery").scry(a,'[role="main"]'),d=a.getAttribute("role")==="main";c.length&&d?a.setAttribute("role",""):!c.length&&!d&&a.setAttribute("role","main")},_isInDialog:function(a){a=a;while(a&&a!==document&&a.getAttribute("role")!=="dialog")a=a.parentNode;return a!==document},_hideMenubar:function(){if(!this._shown)return;this._shown=!1;b("KeyboardShortcuts").popLayer();b("CSS").addClass(this._banner,"_1toe");this._setActiveItem(0);!this._hasBanner&&document.body&&b("CSS").removeClass(document.body,"hasBanner");b("setTimeout")(function(){b("Event").fire(window,"scroll")},350)},_showMenubar:function(){if(this._shown)return;this._shown=!0;this._ignoreBlur=!1;this._validateMainSection();this._setupSectionsMenu();this._setupAccessibilityMenu();b("KeyboardShortcuts").pushLayer();this._banner.nextElementSibling&&b("CSS").matchesSelector(this._banner.nextElementSibling,"._73y_")?b("CSS").addClass(this._banner,"_1tof"):b("CSS").removeClass(this._banner,"_1tof");b("CSS").removeClass(this._banner,"_1toe");!this._hasBanner&&document.body&&b("CSS").addClass(document.body,"hasBanner");b("setTimeout")(function(){b("Event").fire(window,"scroll"),b("Arbiter").inform("banner/shown",null,"state")},50);this._logEvent("shown","menubar")},_addMenuItem:function(a,c,d){var e=this;c=b("Menu").buildItemFromData({ctor:b("MenuItem"),label:a,selected:!1,value:c,onclick:function(c){b("setTimeout")(function(){b("Focus").set(b("ge")(d),!0),e._hideMenubar()},0),e._logEvent("selected_item",a),e._ignoreBlur=!1}});this._sectionsMenu.addItem(c);this._items.push(c)},_getLandmarkSections:function(a){var b=[],c=[];a.forEach(function(a){var d=a.getAttribute("role");d==="main"?b.push(a):j.indexOf(d)>-1&&c.push(a)});return b.concat(c)},_computeElementLabel:function(a,b,c){var d=this,e=a.getAttribute("id");c=c||[];var f=c.includes(e);!f&&e&&c.push(e);e=a.getAttribute("aria-labelledby");if(!f&&e){f=e.split(" ");var g="";f.forEach(function(a){a=document.getElementById(a);if(!a)return;g+=d._computeElementLabel(a,!1,c)});return g}e=a.getAttribute("aria-label");if(e)return e;return b?"":a.innerText?a.innerText.substring(0,100):""},_addSectionItems:function(a){var c=this;a.forEach(function(a){if(!b("TabbableElements").isVisible(a)||!a.offsetHeight||!a.offsetWidth)return;var d=a.getAttribute("role");if(!d||!Object.prototype.hasOwnProperty.call(k,d))return;var e=k[d](c._computeElementLabel(a,!0)),f=a;if(d==="search"||d==="region"||d==="form"){d=b("DOMQuery").scry(a,".navigationFocus");d.length&&(f=d[0],!b("TabbableElements").isTabbable(f)&&b("TabbableElements").find(f).length&&(f=b("TabbableElements").find(f)[0]))}e&&c._addMenuItem(e,b("getOrCreateDOMID")(a),b("getOrCreateDOMID")(f))})},_setupSectionsMenu:function(){var a=b("DOMQuery").scry(document.body,"[role]");a=this._getLandmarkSections(a);this._cleanupSectionsMenu();this._addSectionItems(a)},_cleanupSectionsMenu:function(){while(this._items.length)this._sectionsMenu.removeItem(this._items.pop())},_setupAccessibilityMenu:function(){if(!this._accessibilityMenu)return;if(b("KeyboardShortcuts").hasFlyoutToShow()){var a=this._accessibilityMenu.getItemAt(0);a!==this._shortcutMenuItem&&this._accessibilityMenu.addItemBefore(this._shortcutMenuItem,a)}else this._accessibilityMenu.removeItem(this._shortcutMenuItem)},_logEvent:function(a,c){new(b("NavigationMenubarInteractionsTypedLogger"))().setAction(a).setTargetItem(c).log()},_checkShortcutsShow:function(a,c){c.item.getValue()==="key_shortcuts"&&(this._ignoreBlur=!1,this._hideMenubar(),b("setTimeout")(function(){b("KeyboardShortcuts").showShortcutFlyout()},0)),this._logEvent("selected_item_ax",c.item.getValue())},_checkLogEvent:function(a,b){a=b.item.getValue();this._logEvent("selected_item_global",a);this._ignoreBlur=!1},_getHelpDialogRequest:function(){if(!this._dialogRequest)this._dialogRequest=new(b("AsyncRequest"))("/ajax/keyboard_shortcuts"),this._dialogRequest.setReadOnly(!0);else if(this._dialogRequest.transport)return null;return this._dialogRequest}};e.exports=a}),null);
__d("LoggedOutSwitchingLocaleTypedLogger",["Banzai","GeneratedLoggerUtils","nullthrows"],(function(a,b,c,d,e,f){"use strict";a=function(){function a(){this.$1={}}var c=a.prototype;c.log=function(){b("GeneratedLoggerUtils").log("logger:LoggedOutSwitchingLocaleLoggerConfig",this.$1,b("Banzai").BASIC)};c.logVital=function(){b("GeneratedLoggerUtils").log("logger:LoggedOutSwitchingLocaleLoggerConfig",this.$1,b("Banzai").VITAL)};c.logImmediately=function(){b("GeneratedLoggerUtils").log("logger:LoggedOutSwitchingLocaleLoggerConfig",this.$1,{signal:!0})};c.clear=function(){this.$1={};return this};c.getData=function(){return babelHelpers["extends"]({},this.$1)};c.updateData=function(a){this.$1=babelHelpers["extends"]({},this.$1,a);return this};c.setIndex=function(a){this.$1.index=a;return this};c.setNewLocale=function(a){this.$1.new_locale=a;return this};c.setOldLocale=function(a){this.$1.old_locale=a;return this};c.setReferrer=function(a){this.$1.referrer=a;return this};c.setTime=function(a){this.$1.time=a;return this};c.setWeight=function(a){this.$1.weight=a;return this};return a}();c={index:!0,new_locale:!0,old_locale:!0,referrer:!0,time:!0,weight:!0};e.exports=a}),null);
__d("XIntlAccountSetLocaleAsyncController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/intl/ajax/save_locale/",{loc:{type:"String"},href:{type:"String"},index:{type:"Int"},ref:{type:"String"},ls_ref:{type:"Enum",defaultValue:"unknown",enumType:1},should_redirect:{type:"Bool",defaultValue:!0}})}),null);
__d("IntlUtils",["invariant","AsyncRequest","Cookie","LoggedOutSwitchingLocaleTypedLogger","ReloadPage","XIntlAccountSetLocaleAsyncController","goURI"],(function(a,b,c,d,e,f,g){a={setXmode:function(a){new(b("AsyncRequest"))().setURI("/ajax/intl/save_xmode.php").setData({xmode:a}).setHandler(function(){b("ReloadPage").now()}).send()},encodeSpecialCharsForXController:function(a){return a.replace(new RegExp("\xa0","g"),"&nbsp;")},decodeSpecialCharsFromXController:function(a){return a.replace(new RegExp("&nbsp;","g"),"\xa0")},setAmode:function(a){new(b("AsyncRequest"))().setURI("/ajax/intl/save_xmode.php").setData({amode:a,app:!1}).setHandler(function(){b("ReloadPage").now()}).send()},setRmode:function(a){new(b("AsyncRequest"))().setURI("/ajax/intl/save_xmode.php").setData({rmode:a}).setHandler(function(){b("ReloadPage").now()}).send()},setLocale:function(a,c,d,e){e=d;e||(a!=null||g(0,19476),e=a.options[a.selectedIndex].value);d=b("XIntlAccountSetLocaleAsyncController").getURIBuilder().getURI();new(b("AsyncRequest"))().setURI(d).setData({loc:e,ref:c,should_redirect:!1}).setHandler(function(a){b("ReloadPage").now()}).send()},appendCookieLocaleHistory:function(a){var c="lh",d=b("Cookie").get(c),e=[],f=5;if(d!==null&&d!==void 0&&d!=""){e=d.split(",");e.push(a);for(var d=0;d<e.length-1;d++)e[d]==e[d+1]&&e.splice(d,1);e.length>=f&&e.slice(1,f)}else e.push(a);b("Cookie").set(c,e.toString())},setCookieLocale:function(a,c,d,e,f){e===void 0&&(e="unknown"),f===void 0&&(f=null),b("Cookie").setWithoutCheckingUserConsent_DANGEROUS("locale",a),this.appendCookieLocaleHistory(a),new(b("LoggedOutSwitchingLocaleTypedLogger"))().setNewLocale(a).setOldLocale(c).setIndex(f).setReferrer(e).log(),b("goURI")(d)}};e.exports=a}),null);
__d("legacy:intl-base",["IntlUtils"],(function(a,b,c,d,e,f){a.intl_set_xmode=(c=b("IntlUtils")).setXmode;a.intl_set_amode=c.setAmode;a.intl_set_rmode=c.setRmode;a.intl_set_locale=c.setLocale}),3);
__d("RequiredFormListener",["Event","Input"],(function(a,b,c,d,e,f){b("Event").listen(document.documentElement,"submit",function(a){a=a.getTarget();if(a.getAttribute("novalidate"))return!0;a=a.getElementsByTagName("*");for(var c=0;c<a.length;c++)if(a[c].getAttribute("required")&&b("Input").isEmpty(a[c])){a[c].focus();return!1}},b("Event").Priority.URGENT)}),null);
__d("AccessibilityWebAssistiveTechTypedLogger",["Banzai","GeneratedLoggerUtils","nullthrows"],(function(a,b,c,d,e,f){"use strict";a=function(){function a(){this.$1={}}var c=a.prototype;c.log=function(){b("GeneratedLoggerUtils").log("logger:AccessibilityWebAssistiveTechLoggerConfig",this.$1,b("Banzai").BASIC)};c.logVital=function(){b("GeneratedLoggerUtils").log("logger:AccessibilityWebAssistiveTechLoggerConfig",this.$1,b("Banzai").VITAL)};c.logImmediately=function(){b("GeneratedLoggerUtils").log("logger:AccessibilityWebAssistiveTechLoggerConfig",this.$1,{signal:!0})};c.clear=function(){this.$1={};return this};c.getData=function(){return babelHelpers["extends"]({},this.$1)};c.updateData=function(a){this.$1=babelHelpers["extends"]({},this.$1,a);return this};c.setIndicatedBrowsers=function(a){this.$1.indicated_browsers=b("GeneratedLoggerUtils").serializeVector(a);return this};c.setIsVirtualCursorAction=function(a){this.$1.is_virtual_cursor_action=a;return this};c.setTime=function(a){this.$1.time=a;return this};c.setVC=function(a){this.$1.vc=a;return this};c.setWeight=function(a){this.$1.weight=a;return this};c.updateExtraData=function(a){a=b("nullthrows")(b("GeneratedLoggerUtils").serializeMap(a));b("GeneratedLoggerUtils").checkExtraDataFieldNames(a,g);this.$1=babelHelpers["extends"]({},this.$1,a);return this};c.addToExtraData=function(a,b){var c={};c[a]=b;return this.updateExtraData(c)};return a}();var g={indicated_browsers:!0,is_virtual_cursor_action:!0,time:!0,vc:!0,weight:!0};e.exports=a}),null);
__d("FourOhFourJSTypedLogger",["Banzai","GeneratedLoggerUtils","nullthrows"],(function(a,b,c,d,e,f){"use strict";a=function(){function a(){this.$1={}}var c=a.prototype;c.log=function(){b("GeneratedLoggerUtils").log("logger:FourOhFourJSLoggerConfig",this.$1,b("Banzai").BASIC)};c.logVital=function(){b("GeneratedLoggerUtils").log("logger:FourOhFourJSLoggerConfig",this.$1,b("Banzai").VITAL)};c.logImmediately=function(){b("GeneratedLoggerUtils").log("logger:FourOhFourJSLoggerConfig",this.$1,{signal:!0})};c.clear=function(){this.$1={};return this};c.getData=function(){return babelHelpers["extends"]({},this.$1)};c.updateData=function(a){this.$1=babelHelpers["extends"]({},this.$1,a);return this};c.setFbid=function(a){this.$1.fbid=a;return this};c.setOriginalURI=function(a){this.$1.original_uri=a;return this};c.setScriptPath=function(a){this.$1.script_path=a;return this};c.setTime=function(a){this.$1.time=a;return this};c.setWeight=function(a){this.$1.weight=a;return this};c.updateExtraData=function(a){a=b("nullthrows")(b("GeneratedLoggerUtils").serializeMap(a));b("GeneratedLoggerUtils").checkExtraDataFieldNames(a,g);this.$1=babelHelpers["extends"]({},this.$1,a);return this};c.addToExtraData=function(a,b){var c={};c[a]=b;return this.updateExtraData(c)};return a}();var g={fbid:!0,original_uri:!0,script_path:!0,time:!0,weight:!0};e.exports=a}),null);
__d("FocusRing",["cx","CSS","Event","KeyEventController","Keys","VirtualCursorStatus","emptyFunction"],(function(a,b,c,d,e,f,g){var h=["mousedown","mouseup"];c={KEY_CODES:[(a=b("Keys")).UP,a.RIGHT,a.DOWN,a.LEFT,a.TAB,a.RETURN,a.SPACE,a.ESC],init:function(){if(this._initialized)return;this._userInteractingWithKeyboard=!1;this._attachVirtualCursorListener();this._attachKeyDownListener();document.body&&b("CSS").addClass(document.body,"_19_u");this._initialized=!0},usingKeyboardNavigation:function(){return this._userInteractingWithKeyboard},_attachVirtualCursorListener:function(){document.documentElement&&(this._onClickListener=b("VirtualCursorStatus").add(document.documentElement,this._onClick.bind(this)))},_attachMouseListeners:function(){var a=this;this._onMouseListeners=h.map(function(c){return b("Event").listen(document.documentElement,c,a._onMouseEvent.bind(a))})},_attachKeyDownListener:function(){this._onKeyDownListener=b("Event").listen(document.documentElement,"keydown",this._onKeyDown.bind(this))},_initialized:!1,_userInteractingWithKeyboard:!0,_onMouseEvent:function(){this._hideFocusRing()},_onMouseListeners:h.map(function(a){return{remove:b("emptyFunction")}}),_removeMouseListeners:function(){this._onMouseListeners.forEach(function(a){return a.remove()})},_onClick:function(a,b,c){a&&this._showFocusRing()},_onKeyDown:function(a){this.KEY_CODES.indexOf(b("Event").getKeyCode(a))>-1&&b("KeyEventController").filterEventTargets(a,"keydown")&&this._showFocusRing()},_showFocusRing:function(){this._onKeyDownListener.remove(),this._attachMouseListeners(),this._userInteractingWithKeyboard=!0,document.body&&b("CSS").removeClass(document.body,"_19_u")},_hideFocusRing:function(){this._removeMouseListeners(),this._attachKeyDownListener(),this._userInteractingWithKeyboard=!1,document.body&&b("CSS").addClass(document.body,"_19_u")},_onKeyDownListener:{remove:b("emptyFunction")},_onClickListener:{remove:b("emptyFunction")}};e.exports=c}),null);
__d("FourOhFourJSLogger",["FourOhFourJSTypedLogger","ScriptPath"],(function(a,b,c,d,e,f){a={log:function(){window.onload=function(){var a=new(b("FourOhFourJSTypedLogger"))();a.setOriginalURI(window.location.href);a.setScriptPath(b("ScriptPath").getScriptPath());a.logVital()}}};e.exports=a}),null);
__d("AccessibilityWebVirtualCursorClickLogger",["AccessibilityWebAssistiveTechTypedLogger","VirtualCursorStatus"],(function(a,b,c,d,e,f){a={init:function(a){var c=this;a.forEach(function(a){b("VirtualCursorStatus").add(a,c._log)},this)},_log:function(a,c,d){d===void 0&&(d=!1),a&&new(b("AccessibilityWebAssistiveTechTypedLogger"))().setIndicatedBrowsers(c).setIsVirtualCursorAction(d).log()}};e.exports=a}),null);
__d("VisualCompletionInst",["VisibilityListener","getElementRect","gkx","performance","performanceAbsoluteNow"],(function(a,b,c,d,e,f){"use strict";var g,h,i=/url\(.*(http.*)\)/gi,j=1,k=0;a=function(){function a(a){this.$4=0,this.$8=0,this.$9=0,this.$10=0,this.markerPoints=new Map(),this.annotations=new Map(),this.$5=new Map(),this.$3=new Map(),this.$1=[],this.$2=[],this.$7=0,this.$11=a,this.$6={width:window.innerWidth,height:window.innerHeight}}var c=a.prototype;c.addMarkerPoint=function(a,b){this.markerPoints.set(a,b)};c.addNavigationTiming=function(){var a=((g||(g=b("performance")))==null?void 0:(g||(g=b("performance"))).timing)||{};for(var c in a)typeof a[c]==="number"&&a[c]>=this.$4&&this.addMarkerPoint(c,a[c]-this.$4)};c.calculate=function(a,c,d){var e=this;if(!this.$11.size)return null;k++;var f=(h||(h=b("performanceAbsoluteNow")))();this.$4=a;this.$7=0;this.$9=0;this.$10=0;this.setResourceTimingMap();this.setViewportSize();this.initTree();this.getImages();b("gkx")("676838")&&this.getBackgroundImages();this.$8=this.traverseTree(this.$1,this.$6.width*this.$6.height);var g={annotations:this.annotations,viewport:this.$6,totalPixels:this.$8,paintedPixels:this.$9,bgNum:0,imgNum:0,compNum:0,bgPixels:0,imgPixels:0,compPixels:0,elements:this.$2,calcLatency:0,bgChecked:this.$7,bgCheckLatency:this.$10,markerPoints:this.markerPoints,speedIndex:0,startTime:a,visuallyComplete:0,scrollY:window.scrollY,navSequence:k,pageType:c,page:d};this.$2.length&&(this.$2=this.$2.sort(function(a,b){return b.latency-a.latency}),g.visuallyComplete=this.$2[0].latency,this.addMarkerPoint("FP",this.$2[this.$2.length-1].latency),this.$2.forEach(function(a){!e.markerPoints.has("vcWithoutImage")&&a.type==="component"&&e.addMarkerPoint("vcWithoutImage",a.latency);g.speedIndex+=a.pixels/e.$9*a.latency;switch(a.type){case"component":g.compNum++;g.compPixels+=a.pixels;break;case"img":g.imgNum++;g.imgPixels+=a.pixels;break;case"bg":g.bgNum++;g.bgPixels+=a.pixels;break}}));g.calcLatency=h()-f;this.logPixelProgress();this.setMetadata(g);k===1&&this.addNavigationTiming();return g};c.findParent=function(a){a=a.parentElement;while(a){var b=a.getAttribute("data-veid");if(b!=null&&b!==""&&this.$3.has(b))return this.$3.get(b);a=a.parentElement}return null};c.getBackgroundImages=function(){var a=this,c=(h||(h=b("performanceAbsoluteNow")))();this.$1.forEach(function(c){c=c.element.querySelectorAll(":not(img)");Array.prototype.forEach.call(c,function(c){var d=a.findParent(c);if(!d)return;var e=a.getRectangle(c,d.rectangle),f=a.getPixels(e);if(!f)return;var h=a.trimHash(a.getStyleBackground(c));if(h!=null&&h!==""){var i=a.$5.get(h);if(i!=null){c={veid:String(j++),element:c,rectangle:e,pixels:f,children:[],parent:d,type:"bg",latency:i+(g||(g=b("performance"))).timing.navigationStart-a.$4,timestamp:i+g.timing.navigationStart,url:h};d.children.push(c)}}})});this.$10=h()-c};c.getImages=function(){var a=this,c=document.querySelectorAll("img");Array.prototype.forEach.call(c,function(c){var d=a.findParent(c);if(!d)return;var e=a.getRectangle(c,d.rectangle);if(c.parentElement){var f=a.getRectangle(c.parentElement,d.rectangle);e=a.getRectIntersection(e,f)}f=a.getPixels(e);if(!f)return;var h=a.trimHash(c.getAttribute("src"));if(h!=null&&h!==""&&a.$5.has(h)){var i=a.$5.get(h);if(i!=null){c={veid:String(j++),element:c,rectangle:e,pixels:f,children:[],parent:d,type:"img",latency:i+(g||(g=b("performance"))).timing.navigationStart-a.$4,timestamp:i+g.timing.navigationStart,url:h};d.children.push(c)}}})};c.getPixels=function(a){return(a.right-a.left)*(a.bottom-a.top)};c.getRectangle=function(a,c){a=b("getElementRect")(a);return this.getRectIntersection(a,c)};c.getRectIntersection=function(a,b){return{top:Math.min(Math.max(a.top,b.top),b.bottom),bottom:Math.max(Math.min(a.bottom,b.bottom),b.top),left:Math.min(Math.max(a.left,b.left),b.right),right:Math.max(Math.min(a.right,b.right),b.left)}};c.getStyleBackground=function(a){if(typeof window.getComputedStyle!=="function")return null;this.$7++;a=window.getComputedStyle(a);var b=a["background-image"];if(a.visibility!=="hidden"&&b&&b!=="none"){i.lastIndex=0;a=i.exec(b);if(a&&a.length>1)return a[1].replace('"',"")}return null};c.logPixelProgress=function(){var a=this,b=new Map([["vc98",.02],["vc95",.05]]),c=0,d=0,e=function(e){var f=a.$2[e];c+=f.pixels;if(b.size===0)return"break";b.forEach(function(b,d){!a.markerPoints.has(d)&&c/a.$9>=b&&a.addMarkerPoint(d,f.latency)});f.type==="component"&&(d+=f.pixels,f.children.forEach(function(a){a.type!=="component"&&(d+=a.pixels)}),b.forEach(function(c,e){!a.markerPoints.has(e+"WithoutImage")&&d/a.$9>=c&&(a.addMarkerPoint(e+"WithoutImage",f.latency),b["delete"](e))}))};for(var f=0;f<this.$2.length;f++){var g=e(f);if(g==="break")break}};c.initTree=function(){var a=this,b={top:0,left:0,bottom:this.$6.height,right:this.$6.width};this.$11.forEach(function(c){var d=c[0],e=c[1];c=c[2];var f=a.getRectangle(e,b);if(a.getPixels(f)===0)e.removeAttribute("data-veid"),a.$11["delete"](d);else{e={veid:d,element:e,rectangle:f,pixels:a.getPixels(f),children:[],parent:null,type:"component",latency:c-a.$4,timestamp:c};a.$3.set(d,e)}});this.$3.forEach(function(b){var c=a.findParent(b.element);c?(b.rectangle=a.getRectIntersection(b.rectangle,c.rectangle),b.pixels=a.getPixels(b.rectangle),c.children.push(b),b.parent=c):(a.$1.forEach(function(c){c=a.getRectIntersection(b.rectangle,c.rectangle);a.getPixels(c)>0&&(b.rectangle.top=c.bottom,b.pixels=a.getPixels(b.rectangle))}),a.$1.push(b))})};c.setMetadata=function(a){var c=b("VisibilityListener").getHiddenTime(a.startTime,a.startTime+a.visuallyComplete);c=c!=null&&c>0?1:0;this.annotations.set("height",a.viewport.height);this.annotations.set("width",a.viewport.width);this.annotations.set("page",a.page);this.annotations.set("scrollY",a.scrollY);this.annotations.set("overhead",a.calcLatency);this.annotations.set("navSequence",a.navSequence);this.annotations.set("hidden",c);a.navSequence===1&&(g||(g=b("performance")))&&(g||(g=b("performance"))).timing&&((g||(g=b("performance"))).timing.responseStart&&this.addMarkerPoint("TTFB",(g||(g=b("performance"))).timing.responseStart-a.startTime));a.speedIndex>0&&this.addMarkerPoint("speedIndex",a.speedIndex)};c.setResourceTimingMap=function(){var a=this;if(window.performance&&typeof window.performance.getEntriesByType==="function"){var b=window.performance.getEntriesByType("resource");b.forEach(function(b){var c=a.trimHash(b.name);c!=null&&c!==""&&a.$5.set(c,b.responseEnd)})}};c.setViewportSize=function(){this.$6={width:window.innerWidth,height:window.innerHeight}};c.traverseTree=function(a,b){var c=this,d=b,e=0;a.sort(function(a,b){return b.timestamp-a.timestamp}).forEach(function(a){a.pixels=Math.min(d,a.pixels),e+=a.pixels,d-=a.pixels,a.pixels-=c.traverseTree(a.children,a.pixels),a.timestamp>c.$4&&(a.type!=="component"&&a.parent&&a.parent.timestamp>a.timestamp&&(a.latency=a.parent.latency),c.$9+=a.pixels,c.$2.push(a))});return e};c.trimHash=function(a){return a!=null&&a!==""&&a.indexOf("#")>=0?a.substring(0,a.indexOf("#")):a};return a}();e.exports=a}),null);
__d("VisualCompletionQPL",["QuickPerformanceLogger"],(function(a,b,c,d,e,f){"use strict";a={log:function(a){b("QuickPerformanceLogger").markerStartFromNavStart(27983875),a.markerPoints.forEach(function(c,d){b("QuickPerformanceLogger").markerPoint(27983875,d,{timestamp:c+a.startTime})}),a.annotations.forEach(function(a,c){typeof a==="number"?b("QuickPerformanceLogger").annotateMarkerInt(27983875,c,a,0):b("QuickPerformanceLogger").annotateMarkerString(27983875,c,a,0)}),b("QuickPerformanceLogger").markerEnd(27983875,2,0,a.visuallyComplete+a.startTime)}};e.exports=a}),null);
__d("VisualCompletion",["csx","NavigationMetrics","VisualCompletionInst","VisualCompletionQPL"],(function(a,b,c,d,e,f,g){"use strict";var h=!1,i,j=[],k=new Set(),l=new Map(),m=1;function n(a,b){if(!a)return;var c="vc_"+m++,d=a.getAttribute("data-veid");d!=null&&d!==""&&l["delete"](d);a.setAttribute("data-veid",c);l.set(c,[c,a,b])}function o(){j.forEach(function(a){a(i)}),i&&b("VisualCompletionQPL").log(i)}var p={addElements:function(a,b,c){h||p.init();b&&b.forEach(function(a){n(a,c)});if(a==="first_response"){if(k.has(a))return;b=document.getElementById("pagelet_bluebar");if(b!=null){b=b.querySelector("._2s1y");b&&n(b,c)}k.add(a)}else if(a==="pagelet_sidebar"){if(k.has(a))return;b=document.getElementById("pagelet_sidebar");if(b!=null){b=b.querySelector("._51x_");b&&n(b,c)}k.add(a)}},getReport:function(){return i},init:function(){b("NavigationMetrics").addRetroactiveListener(b("NavigationMetrics").Events.NAVIGATION_DONE,function(a,c){if(c.pageType!=="normal"&&c.pageType!=="quickling")return;a=new(b("VisualCompletionInst"))(l);i=a.calculate(c.start,c.pageType,c.page);o()}),h=!0},subscribe:function(a){j.push(a)},unsubscribe:function(a){j=j.filter(function(b){return b!==a})}};e.exports=p}),null);