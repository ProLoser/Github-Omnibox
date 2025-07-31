(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,d=e.filter,g=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?(this._wrapped=n,void 0):new w(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.4";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:g&&n.every===g?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2),e=w.isFunction(t);return w.map(n,function(n){return(e?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t,r){return w.isEmpty(t)?r?null:[]:w[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.findWhere=function(n,t){return w.where(n,t,!0)},w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var k=function(n){return w.isFunction(n)?n:function(t){return t[n]}};w.sortBy=function(n,t,r){var e=k(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index<t.index?-1:1}),"value")};var F=function(n,t,r,e){var u={},i=k(t||w.identity);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return F(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return F(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})},w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i},w.bind=function(n,t){if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));var r=o.call(arguments,2);return function(){return n.apply(t,r.concat(o.call(arguments)))}},w.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},w.bindAll=function(n){var t=o.call(arguments,1);return 0===t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i}},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return 1>--n?t.apply(this,arguments):void 0}},w.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t},w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n},w.tap=function(n,t){return t(n),n};var I=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=I(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&I(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return I(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=x||function(n){return"[object Array]"==l.call(n)},w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),"function"!=typeof/./&&(w.isFunction=function(n){return"function"==typeof n}),w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return n===void 0},w.has=function(n,t){return f.call(n,t)},w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var M={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};M.unescape=w.invert(M.escape);var S={escape:RegExp("["+w.keys(M.escape).join("")+"]","g"),unescape:RegExp("("+w.keys(M.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(S[n],function(t){return M[n][t]})}}),w.result=function(n,t){if(null==n)return null;var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),D.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=++N+"";return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var T=/(.)^/,q={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},B=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){var e;r=w.defaults({},r,w.templateSettings);var u=RegExp([(r.escape||T).source,(r.interpolate||T).source,(r.evaluate||T).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(B,function(n){return"\\"+q[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,w);var c=function(n){return e.call(this,n,w)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},w.chain=function(n){return w(n).chain()};var D=function(n){return this._chain?w(n).chain():n};w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],D.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return D.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
OAuth2.adapter('github', {
  /**
   * @return {URL} URL to the page that returns the authorization code
   */
  authorizationCodeURL: function(config) {
    return ('https://github.com/login/oauth/authorize?' +
      'client_id={{CLIENT_ID}}&' +
      'scope={{API_SCOPE}}&' +
      'redirect_uri={{REDIRECT_URI}}')
        .replace('{{CLIENT_ID}}', config.clientId)
        .replace('{{API_SCOPE}}', config.apiScope)
        .replace('{{REDIRECT_URI}}', this.redirectURL(config));
  },

  /**
   * @return {URL} URL to the page that we use to inject the content
   * script into
   */
  redirectURL: function(config) {
    return 'https://github.com/robots.txt';
  },

  /**
   * @return {String} Authorization code for fetching the access token
   */
  parseAuthorizationCode: function(url) {
    var error = url.match(/[&\?]error=([^&]+)/);
    if (error) {
      throw 'Error getting authorization code: ' + error[1];
    }
    return url.match(/[&\?]code=([\w\/\-]+)/)[1];
  },

  /**
   * @return {URL} URL to the access token providing endpoint
   */
  accessTokenURL: function() {
    return 'https://github.com/login/oauth/access_token';
  },

  /**
   * @return {String} HTTP method to use to get access tokens
   */
  accessTokenMethod: function() {
    return 'POST';
  },

  /**
   * @return {Object} The payload to use when getting the access token
   */
  accessTokenParams: function(authorizationCode, config) {
    return {
      code: authorizationCode,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: this.redirectURL(config),
      grant_type: 'authorization_code'
    };
  },

  /**
   * @return {Object} Object containing accessToken {String},
   * refreshToken {String} and expiresIn {Int}
   */
  parseAccessToken: function(response) {
    return {
      accessToken: response.match(/access_token=([^&]*)/)[1],
      expiresIn: Number.MAX_VALUE
    };
  }
});
/*
 * Copyright 2011 Google Inc. All Rights Reserved.

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Constructor
 *
 * @param {String} adapterName  name of the adapter to use for this OAuth 2
 * @param {Object} config Containing clientId, clientSecret and apiScope
 * @param {String} config Alternatively, OAuth2.FINISH for the finish flow
 */
var OAuth2 = function(adapterName, config) {
  this.adapterName = adapterName;
  var that = this;
  that.adapter = OAuth2.adapters[adapterName];
  if (config) {
    that.updateLocalStorage();

    var data = that.get();
    data.clientId = config.client_id;
    data.clientSecret = config.client_secret;
    data.apiScope = config.api_scope;
    that.setSource(data);
  }
};

/**
 * Pass instead of config to specify the finishing OAuth flow.
 */
OAuth2.FINISH = 'finish';

/**
 * OAuth 2.0 endpoint adapters known to the library
 */
OAuth2.adapters = {};
OAuth2.adapterReverse = {};


/**
 * Opens up an authorization popup window. This starts the OAuth 2.0 flow.
 *
 * @param {Function} callback Method to call when the user finished auth.
 */
OAuth2.prototype.openAuthorizationCodePopup = function(callback) {
    var that = this;
    chrome.identity.launchWebAuthFlow({
        'url': that.adapter.authorizationCodeURL(that.getConfig()),
        'interactive': true
    }, function(redirect_url) {
        if (chrome.runtime.lastError) {
            callback(chrome.runtime.lastError);
            return;
        }
        that.finishAuth(redirect_url, callback);
    });
};

/**
 * Gets access and refresh (if provided by endpoint) tokens
 *
 * @param {String} authorizationCode Retrieved from the first step in the process
 * @param {Function} callback Called back with 3 params:
 *                            access token, refresh token and expiry time
 */
OAuth2.prototype.getAccessAndRefreshTokens = function(authorizationCode, callback) {
  var that = this;
  // Make an XHR to get the token
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('readystatechange', function(event) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        // Callback with the data (incl. tokens).
        callback(that.adapter.parseAccessToken(xhr.responseText));
      }
    }
  });

  var method = that.adapter.accessTokenMethod();
  var items = that.adapter.accessTokenParams(authorizationCode, that.getConfig());
  var key = null;
  if (method == 'POST') {
    var formData = new FormData();
    for (key in items) {
      formData.append(key, items[key]);
    }
    xhr.open(method, that.adapter.accessTokenURL(), true);
    xhr.send(formData);
  } else if (method == 'GET') {
    var url = that.adapter.accessTokenURL();
    var params = '?';
    for (key in items) {
      params += encodeURIComponent(key) + '=' +
                encodeURIComponent(items[key]) + '&';
    }
    xhr.open(method, url + params, true);
    xhr.send();
  } else {
    throw method + ' is an unknown method';
  }
};

/**
 * Refreshes the access token using the currently stored refresh token
 * Note: this only happens for the Google adapter since all other OAuth 2.0
 * endpoints don't implement refresh tokens.
 *
 * @param {String} refreshToken A valid refresh token
 * @param {Function} callback On success, called with access token and expiry time and refresh token
 */
OAuth2.prototype.refreshAccessToken = function(refreshToken, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(event) {
    if (xhr.readyState == 4) {
      if(xhr.status == 200) {
        console.log(xhr.responseText);
        // Parse response with JSON
        var obj = JSON.parse(xhr.responseText);
        // Callback with the tokens
        callback(obj.access_token, obj.expires_in, obj.refresh_token);
      }
    }
  };

  var data = this.get();
  var formData = new FormData();
  formData.append('client_id', data.clientId);
  formData.append('client_secret', data.clientSecret);
  formData.append('refresh_token', refreshToken);
  formData.append('grant_type', 'refresh_token');
  xhr.open('POST', this.adapter.accessTokenURL(), true);
  xhr.send(formData);
};

/**
 * Extracts authorizationCode from the URL and makes a request to the last
 * leg of the OAuth 2.0 process.
*/
OAuth2.prototype.finishAuth = function(redirect_url, callback) {
  var authorizationCode = null;
  var that = this;

  try {
    authorizationCode = that.adapter.parseAuthorizationCode(redirect_url);
    console.log(authorizationCode);
  } catch (e) {
    console.error(e);
    callback(e);
  }

  that.getAccessAndRefreshTokens(authorizationCode, function(response) {
    that.get().then(function(data) {
        data.accessTokenDate = new Date().valueOf();

        // Set all data returned by the OAuth 2.0 provider.
        for (var name in response) {
          if (response.hasOwnProperty(name) && response[name]) {
            data[name] = response[name];
          }
        }

        that.setSource(data).then(function() {
            callback();
        });
    });
  });
};

/**
 * @return True iff the current access token has expired
 */
OAuth2.prototype.isAccessTokenExpired = function() {
  var data = this.get();
  return (new Date().valueOf() - data.accessTokenDate) > data.expiresIn * 1000;
};

/**
 * Get the persisted adapter data in chrome.storage.local. Optionally, provide a
 * property name to only retrieve its value.
 *
 * @param {String} [name] The name of the property to be retrieved.
 * @return The data object or property value if name was specified.
 */
OAuth2.prototype.get = function(name) {
    var that = this;
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get('oauth2_' + that.adapterName, function(storage) {
            var src = storage['oauth2_' + that.adapterName];
            var obj = src ? JSON.parse(src) : {};
            resolve(name ? obj[name] : obj);
        });
    });
};

/**
 * Set the value of a named property on the persisted adapter data in
 * chrome.storage.local.
 *
 * @param {String} name The name of the property to change.
 * @param value The value to be set.
 */
OAuth2.prototype.set = function(name, value) {
    var that = this;
    return that.get().then(function(obj) {
        obj[name] = value;
        return that.setSource(obj);
    });
};

/**
 * Clear all persisted adapter data in chrome.storage.local. Optionally, provide a
 * property name to only clear its value.
 *
 * @param {String} [name] The name of the property to clear.
 */
OAuth2.prototype.clear = function(name) {
    var that = this;
    if (name) {
        return that.get().then(function(obj) {
            delete obj[name];
            return that.setSource(obj);
        });
    } else {
        return new Promise(function(resolve, reject) {
            chrome.storage.local.remove('oauth2_' + that.adapterName, function() {
                resolve();
            });
        });
    }
};

/**
 * Set the JSON string for the object stored in chrome.storage.local.
 *
 * @param {Object|String} source The new JSON string/object to be set.
 */
OAuth2.prototype.setSource = function(source) {
    if (!source) {
        return;
    }
    var that = this;
    return new Promise(function(resolve, reject) {
        if (typeof source !== 'string') {
            source = JSON.stringify(source);
        }
        var toSet = {};
        toSet['oauth2_' + that.adapterName] = source;
        chrome.storage.local.set(toSet, function() {
            resolve();
        });
    });
};


/**
 * Get the configuration parameters to be passed to the adapter.
 *
 * @returns {Object} Contains clientId, clientSecret and apiScope.
 */
OAuth2.prototype.getConfig = function() {
  var data = this.get();
  return {
    clientId: data.clientId,
    clientSecret: data.clientSecret,
    apiScope: data.apiScope
  };
};

/***********************************
 *
 * STATIC ADAPTER RELATED METHODS
 *
 ***********************************/

/**
 * Registers an adapter with the library. This call is used by each adapter
 *
 * @param {String} name The adapter name
 * @param {Object} impl The adapter implementation
 *
 * @throws {String} If the specified adapter is invalid
 */
OAuth2.adapter = function(name, impl) {
  var implementing = 'authorizationCodeURL redirectURL accessTokenURL ' +
    'accessTokenMethod accessTokenParams accessToken';

  // Check for missing methods
  implementing.split(' ').forEach(function(method, index) {
    if (!method in impl) {
      throw 'Invalid adapter! Missing method: ' + method;
    }
  });

  // Save the adapter in the adapter registry
  OAuth2.adapters[name] = impl;
  // Make an entry in the adapter lookup table
  OAuth2.adapterReverse[impl.redirectURL()] = name;
};

/***********************************
 *
 * PUBLIC API
 *
 ***********************************/

/**
 * Authorizes the OAuth authenticator instance.
 *
 * @param {Function} callback Tries to callback when auth is successful
 *                            Note: does not callback if grant popup required
 */
OAuth2.prototype.authorize = function(callback) {
  var that = this;
  that.adapter = OAuth2.adapters[that.adapterName];
  that.get().then(function(data) {
    if (!data.accessToken) {
      // There's no access token yet. Start the authorizationCode flow
      that.openAuthorizationCodePopup(callback);
    } else if (that.isAccessTokenExpired()) {
      // There's an existing access token but it's expired
      if (data.refreshToken) {
        that.refreshAccessToken(data.refreshToken, function(at, exp, re) {
          that.get().then(function(newData) {
              newData.accessTokenDate = new Date().valueOf();
              newData.accessToken = at;
              newData.expiresIn = exp;
              newData.refreshToken = re;
              that.setSource(newData).then(function() {
                  // Callback when we finish refreshing
                  if (callback) {
                    callback();
                  }
              });
          });
        });
      } else {
        // No refresh token... just do the popup thing again
        that.openAuthorizationCodePopup(callback);
      }
    } else {
      // We have an access token, and it's not expired yet
      if (callback) {
        callback();
      }
    }
  });
};

/**
 * @returns A valid access token.
 */
OAuth2.prototype.getAccessToken = function() {
    return this.get('accessToken');
};

/**
 * Indicate whether or not a valid access token exists.
 *
 * @returns {Boolean} True if an access token exists; otherwise false.
 */
OAuth2.prototype.hasAccessToken = function() {
    return this.get('accessToken').then(function(token) {
        return !!token;
    });
};

/**
 * Clears an access token, effectively "logging out" of the service.
 */
OAuth2.prototype.clearAccessToken = function() {
  this.clear('accessToken');
};
function Defer() {
    if (!(this instanceof Defer)) {
        return new Defer();
    }
    this.resolved = false;
    this.resolveValue = null;
    this.cb = null;
}

Defer.prototype = {
    resolve: function (value) {
        this.resolved = true;
        this.resolveValue = value;
        if (this.cb) {
            _.forEach(this.cb, function (cb) {
                this.resolveValue = cb(this.resolveValue) || this.resolveValue;
            }, this);
        }
        return this;
    },
    //could be synchronous if already resolved!
    done: function (cb) {
        if (this.resolved) {
            this.resolveValue = cb(this.resolveValue) || this.resolveValue;
        } else {
            if (!this.cb) {
                this.cb = [cb];
            } else {
                this.cb.push(cb);
            }
        }
        return this;
    }
};

Defer.allDone = function (values, eachDone) {
    var startingIndex;
    values = values.slice();
    if (_.isArray(values)) {
        startingIndex = values.length;
        for (var i = values.length - 1; i >= 0; i--) {
            if (values[i] instanceof Defer) {
                if (values[i].resolved) {
                    startingIndex = i;
                    if (_.isArray(values[i].resolveValue)) {
                        values.splice.apply(values, [i, 1].concat(values[i].resolveValue));
                    } else {
                        values[i] = values[i].resolveValue
                    }
                } else {
                    (function (startingIndex) {
                        values.splice(i, 1)[0].done(function (val) {
                            val = _.isArray(val) ? val : [val];
                            eachDone(val, startingIndex);
                        });
                    }(i));
                }
            } else {
                startingIndex = i;
            }
        }
        eachDone(values, startingIndex);

    } else {
        if (values instanceof Defer) {
            values.done(eachDone);
        } else {
            eachDone(values);
        }
    }
};

Defer.eachDone = function (value, eachDone) {
    if (_.isArray(value)) {
        _.forEach(value, function (value, index) {
            if (value instanceof Defer) {
                value.done(function (value) {
                    if (_.isArray(value)) {
                        _.each(value, function (value, i, list) {
                            var addedIndex = (i + 1) / (list.length + 2);
                            eachDone(value, index + addedIndex);
                        });
                    } else {
                        eachDone(value, index);
                    }
                });
            } else {
                eachDone(value, index);
            }
        });
    } else {
        if (value instanceof Defer) {
            value.done(eachDone);
        } else {
            eachDone(value);
        }
    }
};/**
 * What a "Step" is:
 *
 * imagine in our patterns, there is "my issues",
 * then "my" is represented as a Step, with "issues" as a child Step
 *
 * Each Step know it's label (can be "my" or "issues" here), it also knows about
 * - it's parent
 * - it's children
 * - it's level (issues' level is 1 here)
 * - it's pattern (regex or string)
 * - it's value (which is the original object that is specified in the patterns object up there)
 *      I use the value to get the "suggest" and "decide" function for example
 *      Also, any "match" or "startsWith" function on the value overwrites the default ones
 *
 */
var Step = (function () {

    function Step(label, value, level, parent) {
        this.label = label;
        this.value = value;
        this.level = level;
        this.parent = parent || null;

        this.pattern = value.pattern || label;
        this.children = [];
        if (value.match) {
            this.match = value.match;
        }
        if (value.startsWith) {
            this.startsWith = value.startsWith;
        }
        _.forEach(value.children, function (childVal, childKey) {
            this.children.push(new Step(childKey, childVal, this.level + 1, this));
        }, this);
    }

    Step.prototype = {
        // does this Step match those args?
        // only called when parent matches too
        match: function (args, text) {
            if (_.isRegExp(this.pattern)) {
                return this.pattern.test(args[this.level]);
            } else {
                return this.pattern === args[this.level];
            }
        },
        // only called when parent matches too
        startsWith: function (args, text) {
            if (_.isRegExp(this.pattern)) {
                return this.pattern.test(args[this.level]);
            } else {
                return this.pattern.indexOf(args[this.level]) === 0;
            }
        },

        // gives suggestions for self and children (if there are still other args, children come first)
        suggest: function (args, text) {
            var suggestions = [];
            if (this.level === args.size0) {
                if (this.startsWith(args, text) && "suggest" in this.value) {
                    suggestions = suggestions.concat(this.getSuggestValue(args, text));
                }
                suggestions = suggestions.concat(this.getChildSuggest(args, text));
            } else if (this.level < args.size0) {
                if (this.match(args, text)) {
                    suggestions = suggestions.concat(this.getChildSuggest(args, text));
                    if ("suggest" in this.value) {
                        suggestions = suggestions.concat(this.getSuggestValue(args, text));
                    }
                }
            }
            return suggestions;
        },
        //gives the suggestions of children
        getChildSuggest: function (args, text) {
            var suggestions = [];
            _.forEach(this.children, function (childStep) {
                suggestions = suggestions.concat(childStep.suggest(args, text));
            });
            return suggestions;
        },

        //gives the decision of self, or children if there are other args
        decide: function (args, text) {
            var childDecision;
            if (this.match(args, text)) {
                if (this.level === args.size0) {
                    if ("decide" in this.value) {
                        return this.getDecideValue(args, text);
                    }

                } else if (this.level < args.size0) {
                    for (var i = 0; i < this.children.length; i++) {
                        childDecision = this.children[i].decide(args, text);
                        if (!_.isUndefined(childDecision)) {
                            return childDecision;
                        }
                    }
                }
            }
            return undefined;
        },

        //getting the "road" to get to this step (example: "my issues")
        getRoad: function () {
            if (this.road) return this.road;

            var steps = [], aStep = this;
            do {
                steps.unshift(aStep.label);
            } while (aStep = aStep.parent);

            return this.road = steps.join(" ");
        },

        getSuggestValue: function (args, text) {
            if (_.isFunction(this.value.suggest)) {
                return this.value.suggest.call(this, args, text);
            } else {
                return this.value.suggest;
            }
        },
        getDecideValue: function (args, text) {
            if (_.isFunction(this.value.decide)) {
                return this.value.decide.call(this, args, text);
            } else {
                return this.value.decide;
            }
        }
    };

    return Step;

}());var StepsManager = (function () {
    var steps = [];

    return {
        steps: steps,
        loadPatterns: function (patterns) {
            _.forEach(patterns, function (value, key) {
                steps.push(new Step(key, value, 0));
            });
        },
        suggest: function (text) {
            var args = text.split(" ");
            args.size0 = args.length - 1;

            var suggestions = [];
            _.forEach(steps, function (aStep) {
                suggestions = suggestions.concat(aStep.suggest(args, text));
            });
            return suggestions;
        },
        decide: function (text) {
            var args = text.split(" ");
            args.size0 = args.length - 1;

            var decision;
            for (var i = 0; i < steps.length; i++) {
                decision = steps[i].decide(args, text);
                if (!_.isUndefined(decision)) {
                    return decision;
                }
            }
            return null;
        }
    }
}());StepsManager.loadPatterns({
    help: {
        suggest: function () {
            return [
                { content: '', description: '<dim>jump to </dim> <url>user</url><match>/</match><url>repo</url>' },
                { content: '/', description: '<dim>search for my</dim> <match>/</match><url>repo</url>' },
                { content: '!', description: '<dim>this repo</dim> <match>!</match><url>action</url>' },
                { content: 'my ', description: '<dim>my account</dim> <match>my</match> <url>action</url>' },
                { content: 'gist ', description: '<dim>gists</dim> <match>gist</match> <url>id</url>' },
                { content: '@', description: '<dim>user actions</dim> <match>@</match><url>user</url>' },
                { content: '*', description: '<dim>favorite repo</dim> <match>*</match><url>repo</url>' }
            ];
        },
        decide: function () {
            return chrome.extension.getURL("help.html");
        }
    }
});(function () {
    StepsManager.loadPatterns({
        my: {
            suggest: function () {
                var suggestions = [
                    { content: 'my dash', description: '<dim>my</dim> <url>dash</url>'},
                    { content: 'my new repo', description: '<dim>my</dim> <url>new repo</url>'},
                    { content: 'my issues', description: '<dim>my</dim> <url>issues</url>'},
                    { content: 'my pulls', description: '<dim>my</dim> <url>pulls</url>'},
                    { content: 'my stars', description: '<dim>my</dim> <url>stars</url>'},
                    { content: 'my starred', description: '<dim>my</dim> <url>starred</url>'},
                    { content: 'my notifications', description: '<dim>my</dim> <url>notifications</url>'},
                    { content: 'my settings', description: '<dim>my</dim> <url>settings</url>'},
                    { content: 'my followers', description: '<dim>my</dim> <url>followers</url>'},
                    { content: 'my following', description: '<dim>my</dim> <url>following</url>'},
                    { content: 'my repositories', description: '<dim>my</dim> <url>repositories</url>'},
                    { content: 'my activities', description: '<dim>my</dim> <url>activities</url>'},
                    { content: 'my reset', description: '<dim>github omnibox</dim> <url>reset cache</url>' }
                ];
                if (omni.authorized)
                    suggestions.push({ content: 'my unauth', description: '<dim>github omnibox</dim> <url>unauthorize from github</url>' });
                else
                    suggestions.push({ content: 'my auth', description: '<dim>github omnibox</dim> <url>authorize with github</url>' });
                return suggestions;
            },
            children: {
                issues: {
                    suggest: suggestOwnRoad,
                    decide: "dashboard/issues"
                },
                dash: {
                    suggest: suggestOwnRoad,
                    decide: ""
                },
                pulls: {
                    suggest: suggestOwnRoad,
                    decide: "dashboard/pulls"
                },
                stars: {
                    suggest: suggestOwnRoad,
                    decide: "stars"
                },
                starred: {
                    suggest: suggestOwnRoad,
                    decide: "stars"
                },
                notifications: {
                    suggest: suggestOwnRoad,
                    decide: "notifications"
                },
                settings: {
                    suggest: suggestOwnRoad,
                    decide: "dashboard/settings"
                },
                followers: {
                    suggest: suggestOwnRoad,
                    decide: decideWithUser("/followers")
                },
                following: {
                    suggest: suggestOwnRoad,
                    decide: decideWithUser("/following")
                },
                repositories: {
                    suggest: suggestOwnRoad,
                    decide: decideWithUser("?tab=repositories")
                },
                activities: {
                    suggest: suggestOwnRoad,
                    decide: decideWithUser("?tab=activity")
                },
                auth: {
                    suggest: suggestOwnRoad,
                    decide: function () {
                        omni.authorize();
                        return false;
                    }
                },
                login: {
                    suggest: suggestOwnRoad,
                    decide: function () {
                        omni.authorize();
                        return false;
                    }
                },
                unauth: {
                    suggest: suggestOwnRoad,
                    decide: function () {
                        omni.unauthorize();
                        return false;
                    }
                },
                logout: {
                    suggest: suggestOwnRoad,
                    decide: function () {
                        omni.unauthorize();
                        return false;
                    }
                },
                reset: {
                    suggest: suggestOwnRoad,
                    decide: function () {
                        omni.reset();
                        return false;
                    }
                },
                "new" : {
                    children: {
                        repo: {
                            suggest: suggestOwnRoad,
                            decide: 'new'
                        },
                        organization: {
                            suggest: suggestOwnRoad,
                            decide: 'organizations/new'
                        }
                    }
                }
            }
        }
    });

    //suggest's the step's road
    function suggestOwnRoad() {
        return {
            content: this.getRoad(),
            description: this.getRoad().replace(/my (.+)/, "<dim>my</dim> <url>$1</url>")
        };
    }

    function decideWithUser(url) {
        return function () {
            return omni.user + url;
        }
    }

}());
StepsManager.loadPatterns({
    "new": {
        children: {
            issue: {
                suggest: function () {
                    return StepsManager.suggest("!new issue");
                },
                decide: function () {
                    return StepsManager.decide("!new issue");
                }
            },
            repo: {
                suggest: function () {
                    return {
                        content: this.getRoad(),
                        description: this.getRoad()
                    };
                },
                decide: "new"
            },
            collaborator: {
                suggest: function() {
                    return StepsManager.suggest("!new collaborator");
                },
                decide: function() {
                    return StepsManager.decide("!new collaborator");
                }
            }
        }
    }
});(function () {
    var repoActions = {
        io: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return omni.urls.io(fullRepo);
                });
            }
        },
        pages: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return omni.urls.io(fullRepo);
                });
            }
        },
        pulls: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        network: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        pulse: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        settings: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        issues: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        milestones: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return fullRepo + "/issues/milestones";
                });
            }
        },
        contributors: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        compare: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        wiki: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        notifications: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        fork: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        releases: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        graphs: {
            suggest: suggestOwnLabel,
            decide: decideFromLabel
        },
        "#issue": {
            pattern: /#[0-9]+/,
            suggest: function (args) {
                var prefix, issue;
                prefix = this.value.prefix ? "<dim>" + this.value.prefix + "</dim>" : "";
                issue = (args[1] || args[0]).match(/#([0-9]+)/)[1];

                if (args[0][0] === "!") {
                    return {
                        content: "!#" + issue,
                        description: prefix + "issue <url>#" + issue + "</url>"
                    };
                } else {
                    return {
                        content: args[0] + " #" + issue,
                        description: prefix + '<match>' + args[0] + "</match> issue <url>#" + issue + "</url>"
                    };
                }
            },
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    var issue = (args[1] || args[0]).match(/#([0-9]+)/)[1];
                    return fullRepo + "/issues/" + issue;
                });
            }
        },
        "new": {
            children: (function () {
                return {
                    issue: {
                        suggest: suggestNew("issue"),
                        decide: decideNew("issue")
                    },
                    release: {
                        suggest: suggestNew("release"),
                        decide: decideNew("release")
                    },
                    pull: {
                        //TODO don't alias suggestions
                        suggest: function (args) {
                            var alias = args[0][0] === "!" ? "!compare" : args[0] + " compare";
                            return StepsManager.suggest(alias);
                        },
                        decide: function (args) {
                            var alias = args[0][0] === "!" ? "!compare" : args[0] + " compare";
                            return StepsManager.decide(alias);
                        }
                    },
                    collaborator: {
                        suggest: suggestNew("collaborator"),
                        decide: function(args) {
                            return getFullRepo(args).done(function(fullRepo){
                                return fullRepo + '/settings/collaboration';
                            });
                        }
                    }
                };

                function suggestNew(something) {
                    return function (args) {
                        if (args[0][0] === "!") {
                            return {
                                content: "this repo's new " + something,
                                description: "this repo's new " + something
                            };
                        } else {
                            return {
                                content: args[0] + " new " + something,
                                description: args[0] + " new " + something
                            };
                        }
                    }
                }

                function decideNew(something) {
                    return function (args) {
                        return getFullRepo(args).done(function (fullRepo) {
                            return fullRepo + "/" + something + "s/new";
                        });
                    }
                }
            }())
        },
        clone: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return omni.urls.clone + fullRepo;
                });
            }
        },
        travis: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return omni.urls.travis + fullRepo;
                });
            }
        },

        commits: {
            suggest: suggestOwnLabel,
            decide: function (args) {
                return getFullRepo(args).done(function (fullRepo) {
                    return fullRepo + "/commits/master";
                });
            }
            // TODO add @branch for commits
        },
        "?search": {
            pattern: /\?|(search ).*/,
            suggest: suggestOwnLabel,
            decide: function(args) {
                return getFullRepo(args).done(function (fullRepo) {
                    if (args[1] == 'search')
                        args.splice(1,1);
                    if (args[1][0] == '?')
                        args[1] = args[1].substr(1);
                    args = args.slice(1).join('+')
                    return fullRepo + "/search?q=" + args;
                });
            }
        },
        "@branch": {
            pattern: /^@[-\w\.]+/, // This pattern is changed below for "!@branch"
            suggest: suggestOwnRoad,
            decide: decideBranchPath,
            children: {
                "/path": {
                    pattern: /^\/\S*/,
                    suggest: suggestOwnRoad,
                    decide: decideBranchPath
                }
            }
        },
        "/path": {
            pattern: /^\/\S*/, // This pattern is changed below for "!/path"
            suggest: suggestOwnRoad,
            decide: decideBranchPath,
            children: {
                "@branch": {
                    pattern: /^@[-\w\.]+/,
                    suggest: suggestOwnRoad,
                    decide: decideBranchPath
                }
            }
        }
    };

    function suggestOwnRoad(args, text) {
        var prefix = this.value.prefix ? "<dim>" + this.value.prefix + "</dim>" : "";
        if (args[0][0] === "!") {
            return {
                content: text,
                description: prefix + "<url>" + args[0].substring(1) + " " + args.slice(1).join(" ")  + "</url>"
            };
        } else {
            return {
                content: text,
                description: prefix + "<match>" + args[0] + "</match> <url>" + args.slice(1).join(" ") + "</url>"
            };
        }
    }

    function decideBranchPath(args) {
        var branch = "master", path = null;
        _.each(args, function (val) {
            val = val.replace("!", "");
            switch (val[0]) {
                case "@":
                    branch = val.substring(1);
                    break;
                case "/":
                    path = val.substring(1);
                    break;
            }
        });
        return getFullRepo(args).done(function (fullRepo) {
            if (path === null) {
                return fullRepo + "/tree/" + branch;
            } else if (path === "") {
                return fullRepo + "/find/" + branch;
            } else {
                return fullRepo + "/blob/" + branch + "/" + path;
            }
        });
    }

    StepsManager.loadPatterns({
        "user/repo": {
            pattern: /^[\w-]+\/[-\w\.]*/,
            suggest: function (args) {
                if (args.size0 > this.level) return [];

                var repoName = args[0].split('/')[1].toLowerCase();
                return [
                    {
                        content: args[0],
                        description: "<match>" + args[0] + "</match>"
                    },
                    omni.getTheirRepos(args[0].split('/')[0]).done(function (repos) {
                        return filterRepos(repos, repoName);
                    })
                ];
            },
            decide: function (args) {
                return args[0];
            },

            children: repoActions
        },
        "/repo": {
            pattern: /^\/[\-\w\.]*/,
            suggest: function (args) {
                var repoName = args[0].substring(1).toLowerCase(), myRepos;
                myRepos = filterRepos(omni.caches.my.repos, repoName, true);
                if (myRepos[0] && myRepos[0].content.split('/')[0] !== omni.user) {
                    myRepos.unshift({
                        content: args[0],
                        description: omni.user + "<match>" + args[0] + "</match>"
                    });
                }
                return myRepos;
            },
            decide: function (args) {
                var repo,
                    repoName = args[0].substring(1).toLowerCase();
                repo = _.find(omni.caches.my.repos, function (repo) {
                    return repo.name.toLowerCase() === repoName;
                });
                if (repo)
                    return repo.full_name;

                // If no match found, go to `yourName/yourQuery`
                return omni.user + '/' + repoName;
            },

            children: repoActions
        },
        "*starred_repo": {
            pattern: /^\*[\-\w\.]*/,
            suggest: function (args) {
                var repoName = args[0].substring(1).toLowerCase(), myRepos;
                myRepos = filterRepos(omni.caches.starred, repoName, true);
                return myRepos;
            },
            decide: function (args) {
                var repo,
                    repoName = args[0].substring(1).toLowerCase();
                repo = _.find(omni.caches.starred, function (repo) {
                    return repo.name.toLowerCase() === repoName;
                });
                if (repo)
                    return repo.full_name;
                else
                    return omni.urls.search + args[0].substr(1);
            },

            children: repoActions
        },
        "~history": {
            pattern: /^\~[\-\w\.]*/,
            suggest: function (args) {
                var defer = Defer(),
                  repoName = args[0].substring(1).toLowerCase(), myRepos;
                if (!repoName)
                  return;
                chrome.history.search({ text: 'https://github.com/ ' + repoName }, function(results) {
                  var historySuggestions = [];
                  var found = {};
                  results = results.forEach(function(result){
                    var url = result.url.match(/https:\/\/github\.com\/(\w+\/\w+)/i);
                    if (url[1] && !found[url[1]]) {
                      found[url[1]] = true;
                      historySuggestions.push({ content: url[1], description: result.title });
                    };
                  });
                  defer.resolve(historySuggestions);
                });
                return [{ description: 'Searching Browsing History...', content: '' }, defer];
            },
            decide: function (args) {
              return omni.urls.search + args[0].substr(1);
            }
        }
    });

    // !repoAction
    var thisRepoActions = {};
    _.each(repoActions, function (value, key) {
        thisRepoActions["!" + key] = _.extend({
            prefix: "this repo's "
        }, value);
    });
    thisRepoActions["!@branch"].pattern = /^!@\w+/;
    thisRepoActions["!/path"].pattern = /^!\/\w*/;

    StepsManager.loadPatterns(thisRepoActions);


    function suggestOwnLabel(args) {
        var prefix = this.value.prefix ? "<dim>" + this.value.prefix + "</dim>" : "";
        if (args[0][0] === "!") {
            return {
                content: this.label,
                description: prefix + "<url>" + this.label.substring(1) + "</url>"
            };
        } else {
            return {
                content: args[0] + " " + this.label,
                description: prefix + "<match>" + args[0] + "</match> <url>" + this.label + "</url>"
            };
        }
    }

    function decideFromLabel(args) {
        var label = this.label;
        if (label[0] === "!") {
            label = label.substring(1);
        }
        return getFullRepo(args).done(function (fullRepo) {
            return fullRepo + "/" + label;
        });
    }

    function getFullRepo(args) {
        var defer = Defer(), firstArg = args[0];
        if (firstArg[0] === "!") { // !
            chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
                var match, repo, user, tab = tabs[0];
                if (match = tab.url.match(/github\.com\/(([\w-]+)\/([\-\w\.]+))/)) {
                    user = match[2];
                    repo = match[3];
                } else if (match = tab.url.match(/([\w-]+)\.github\.io\/([\-\w\.]+)/)) {
                    user = match[1];
                    repo = match[2];
                }
                return defer.resolve(user + "/" + repo);
            });
        } else if (firstArg[0] === "/") { // /repo
            defer.resolve(omni.user + "/" + firstArg.substring(1));
        } else if (firstArg[0] === "*") { // *starred_repo
            var repoName = firstArg.substring(1).toLowerCase();
            var repo = _.find(omni.caches.starred, function (repo) {
                return repo.name.toLowerCase() === repoName;
            });
            if (repo)
                defer.resolve(repo.full_name);
            else
                defer.resolve();
        } else { // user/repo
            defer.resolve(firstArg);
        }
        return defer;
    }

    function filterRepos(repos, text, inclusive) {
        var filteredRepos = [];
        _.each(repos, function (repo) {
            if (!inclusive && repo.name.toLowerCase() === text.toLowerCase()) return;
            var findName = repo.name.toLowerCase().indexOf(text);
            if (!!~findName) {
                // If it's the first letters, push (prepend), otherwise unshift (append)
                filteredRepos[findName&&'push'||'unshift']({
                    content: repo.full_name,
                    description: repo.full_name.replace( new RegExp( text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'ig' ), '<match>$&</match>')
                });
            }
        });
        return filteredRepos;
    }
}());
(function () {
    StepsManager.loadPatterns({
        "@user": {
            pattern: /^@[\w-]*$/, // accepts @user
            suggest: function (args) {
                var user = getUser(args);
                var suggestions = [
                    {
                        content: "@" + user,
                        description: "<match>@" + user + "</match>"
                    }
                ];
                user = user.toLowerCase();
                _.each(omni.caches.my.following, function (followedUser) {
                    var login = followedUser.login.toLowerCase();
                    if (!user || (login.indexOf(user) === 0 && login !== user)) {
                        suggestions.push({
                            content: "@" + followedUser.login,
                            description: "<match>@" + followedUser.login + "</match>"
                        });
                    }
                });
                return suggestions;
            },
            decide: decideUrlForUser(""),

            children: {
                followers: {
                    suggest: suggestOwnLabel,
                    decide: decideUrlForUser("/followers")
                },
                following: {
                    suggest: suggestOwnLabel,
                    decide: decideUrlForUser("/following")
                },
                starred: {
                    suggest: suggestOwnLabel,
                    decide: decideUrlForUser("/following#starred")
                },
                repositories: {
                    suggest: suggestOwnLabel,
                    decide: decideUrlForUser("?tab=repositories")
                },
                activities: {
                    suggest: suggestOwnLabel,
                    decide: decideUrlForUser("?tab=activities")
                },
                help: {
                    suggest: function(args){
                        return [
                            { content: args[0] + ' starred',      description: '<match>' + args[0] + '</match> <url>starred</url>'},
                            { content: args[0] + ' followers',    description: '<match>' + args[0] + '</match> <url>followers</url>'},
                            { content: args[0] + ' following',    description: '<match>' + args[0] + '</match> <url>following</url>'},
                            { content: args[0] + ' repositories', description: '<match>' + args[0] + '</match> <url>repositories</url>'},
                            { content: args[0] + ' activities',   description: '<match>' + args[0] + '</match> <url>activities</url>'}
                        ];
                    }
                }
            }
        }
    });

    function getUser(args) {
        return args[0].substring(1);
    }

    function suggestOwnLabel(args) {
        return {
            content: args[0] + " " + this.label,
            description: '<matched>' + args[0] + '</matched> <url>' + this.label + '</url>'
        }
    }

    //generates a decide fn
    function decideUrlForUser(url) {
        return function (args) {
            return getUser(args) + url;
        }
    }
}());(function () {
    StepsManager.loadPatterns({
        gist: {
            suggest: function () {
                return {
                    content: "gist",
                    description: "gist"
                }
            },
            decide: function () {
                return omni.urls.gist + omni.user;
            },
            children: {
                id: {
                    pattern: /^[a-z0-9]+$/,
                    suggest: function (args) {
                        return suggestGist(omni.user, args[1]);
                    },
                    decide: function(args) {
                        return omni.urls.gist + args[1];
                    }
                },
                "/id": {
                    pattern: /^\/[a-z0-9]+$/,
                    suggest: function (args) {
                        return suggestGist(omni.user, args[1]);
                    },
                    decide: function(args) {
                        return omni.urls.gist + omni.user + '/' + args[1];
                    }
                },
                "user/id": {
                    pattern: /^[\w-]+\/[a-z0-9]+$/,
                    suggest: function (args) {
                        var info = args[1].split("/");
                        return suggestGist(info[0], info[1]);
                    },
                    decide: function(args) {
                        return omni.urls.gist + args[1];
                    }
                },
                "user/": {
                    pattern: /^[\w-]+\/?$/,
                    suggest: function (args) {
                        return [
                            {
                                content: args.join(" ").replace("/", "") + "/",
                                description: "<dim>gist</dim> <url>" + args[1].replace("/", "") + "/</url>"
                            }
                        ].concat(suggestGist(args[1].replace("/", ""), null));
                    },
                    decide: function (args) {
                        return omni.urls.gist + args[1].replace("/", "");
                    }
                }
            }
        }
    });

    function suggestGist(user, id) {
        var suggestions = [];
        user = user.toLowerCase();
        _.each(omni.caches.my.gists, function (gist) {
            if (gist.user.login.toLowerCase() === user && (!id || gist.id.indexOf(id) === 0)) {
                var url = gist.user.login + "/" + gist.id;
                suggestions.push({
                    content: "gist " + url,
                    description: "<dim>gist</dim> <url>" + url + "</url>: <dim>" + gist.description.split('&').join('&amp;') + "</dim>"
                });
            }
        });
        return suggestions;
    }
}());var Omni = (function () {
    Omni.prototype.debug = false;

    Omni.prototype.urls = {
        github: 'https://github.com/',
        gist: 'https://gist.github.com/',
        api: 'https://api.github.com/',
        travis: 'https://travis-ci.org/',
        clone: 'github-mac://openRepo/https://github.com/',
        search: 'search?q=',
        io: function (repo) {
            repo = repo.split('/');
            return "http://" + repo[0] + ".github.io/" + repo[1];
        }
    };

    Omni.prototype.api = null;

    Omni.prototype.user = null;

    Omni.prototype.caches = null;

    function Omni(authorized) {
        this.api = new OAuth2('github', {
            client_id: '9b3a55174a275a8b56ce',
            client_secret: 'aea80effa00cc2b98c1cc590ade40ba05cbeea1e',
            api_scope: 'repo'
        });
        if (authorized) {
            this.authorize();
        }
        this.clearCache();
    }

    Omni.prototype.redirect = function (url, fullPath) {
        if (!fullPath && url.indexOf("://") == -1) {
            url = this.urls.github + url;
        }
        if (this.debug) {
        } else {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.update(tabs[0].id, { url: url });
            });
        }
    };

    Omni.prototype.suggest = function (text, suggester) {
        var suggestions, defaultSuggestionIndex = Infinity;
        if (this.caches.suggestions[text]) {
            suggestions = this.caches.suggestions[text];
        } else {
            suggestions = StepsManager.suggest(text);
            this.caches.suggestions[text] = suggestions;
        }
        Defer.allDone(suggestions, function (values, startingIndex) {
            if (startingIndex < defaultSuggestionIndex && values[0]) {
                defaultSuggestionIndex = startingIndex;
                chrome.omnibox.setDefaultSuggestion({ description: values[0].description });
                suggester(values.slice(1));
            } else {
                suggester(values);
            }
        });

        if (defaultSuggestionIndex === Infinity) {
            chrome.omnibox.setDefaultSuggestion({description: "<dim>search for %s</dim>"});
        }
    };

    Omni.prototype.decide = function (text, dontTrySuggestions) {
        var _this = this, decision = StepsManager.decide(text);
        Defer.eachDone(decision, function (url) {
            if (url === false) return;

            if (url === null && text) {
                if (!dontTrySuggestions && _this.caches.suggestions[text] && _this.caches.suggestions[text][0]) {
                    Defer.eachDone(_this.caches.suggestions[text][0], function (suggestion) {
                        omni.decide(suggestion.content, true);
                    });
                    return; // stop
                }
                url = omni.urls.search + text;
            }
            _this.redirect(url);
        });
    };

    Omni.prototype.authorize = function (callback) {
        var _this = this;
        this.api.authorize(function () {
            _this.reset();
            _this.authorized = true;
            callback && callback();
        });
    };

    Omni.prototype.unauthorize = function () {
        if (this.api) {
            this.api.clearAccessToken();
        }
        this.reset();
        this.authorized = false;
    };

    Omni.prototype.query = function (options, callback) {
        var xhr;
		if (_.isString(options)) {
			options = {
				url: options
			};
		}
		_.defaults(options, {
			params: {},
			method: 'GET'
		});
		_.defaults(options.params, {
			per_page: 1000
		});
        this.api.getAccessToken().then(function(token) {
            if (token) {
                options.params.access_token = token;
            }
            options.params = _.map(options.params, function (value, key) {
                return key + '=' + value;
            }).join('&');
            options.url = this.urls.api + options.url + "?" + options.params;

            xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (event) {
                var data, err;
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        data = JSON.parse(xhr.responseText);
                    } else {
                        err = xhr;
                    }
                    callback(err, data);
                }
            };
            xhr.open(options.method.toUpperCase(), options.url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
        }.bind(this));
    };

    Omni.prototype.getMyRepos = function () {
        var _this = this;
        this.query('user/repos', function (err, repos) {
            if (!err) Array.prototype.push.apply(_this.caches.my.repos, repos);
        });
        this.query('user/orgs', function (err, orgs) {
            if (!err) {
                _this.caches.my.orgs = orgs;
                _(orgs).each(function (org) {
                    _this.query("orgs/" + org.login + "/repos", function (err, repos) {
                        if (!err) Array.prototype.push.apply(_this.caches.my.repos, repos);
                    });
                });
            }
        });
    };

    Omni.prototype.getTheirRepos = function (user) {
        var _this = this,
            defer = Defer();
        //this.caches.their.user = user; TODO why?
        if (this.caches.their.repos[user]) {
            defer.resolve(this.caches.their.repos[user]);
        } else {
            this.query("users/" + user + "/repos", function (err, repos) {
                if (!err) {
                    _this.caches.their.repos[user] = repos;
                    defer.resolve(repos);
                } else {
                    defer.resolve([]);
                }
            });
        }
        return defer;
    };

    Omni.prototype.clearCache = function () {
        this.caches = {
            suggestions: {},
            my: {
                repos: [],
                orgs: [],
                following: [],
                gists: [],
				starred: []
            },
            their: {
                repos: {},
                        user: null
            }
        };
    };

    Omni.prototype.reset = function () {
        var _this = this;
        this.clearCache();

		if (!this.api) return;

        this.getMyRepos();
        this.query('gists', function (err, gists) {
            if (!err ) Array.prototype.push.apply(_this.caches.my.gists, gists);
        });
        this.query('gists/starred', function (err, gists) {
            if (!err) Array.prototype.push.apply(_this.caches.my.gists, gists);
        });
        this.query('user/following', function (err, users) {
            if (!err) _this.caches.my.following = users;
        });
        this.query({ url:'user/starred', params: { sort: 'updated' } }, function (err, repos) {
            if (!err) _this.caches.starred = repos;
        });
        this.query('user', function (err, data) {
            if (!err) _this.user = data.login;
        });
    };

    return Omni;

})();

chrome.storage.local.get('setup', function(storage) {
    var omni = new Omni(storage.setup === 'true');

    chrome.runtime.onMessage.addListener(function (message) {
        switch (message) {
            case 'authorize':
                omni.authorize();
                break;
            case 'decorate':
                chrome.storage.local.get(null, function(data) {
                    chrome.extension.sendMessage(data);
                });
                break;
            case 'reset':
                omni.reset();
                break;
            case 'login':
                omni.authorize(function(){
                });
                break;
            case 'logout':
                omni.unauthorize();
                break;
        }
    });

    chrome.omnibox.onInputChanged.addListener(omni.suggest.bind(omni));

    chrome.omnibox.onInputStarted.addListener(function () {
        chrome.storage.local.get('setup', function(storage) {
            if (_.isUndefined(storage.setup)) {
                omni.authorize();
                chrome.storage.local.set({setup: true});
            }
        });
    });

    chrome.omnibox.onInputEntered.addListener(function (text) {
        if (text) omni.decide(text);
    });
});
