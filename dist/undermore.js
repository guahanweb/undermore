/*! undermore - v1.7.0 - 2014-06-25
* https://github.com/atomantic/undermore
* Copyright (c) 2014 Adam Eivy (@antic); Licensed MIT */
/*global exports,Buffer,atob,btoa,escape,unescape*/
/*jslint browser:true*/

/**
 * NOTE: DO NOT EDIT THIS FILE
 * THIS FILE IS GENERATED VIA GRUNT
 * PLEASE ADD NEW UNDERMORE MIXINS TO
 * src/_source/
 * ONE MIXIN PER FILE (to allow custom builds)
 */

 /**
 * The ecmascript String prototype
 * @module String
 * @see {@link http://www.ecma-international.org/ecma-262/5.1/#sec-15.5.3.1 ECMASCript 5.1 String.prototype}
 */

/**
 * undermore fills in the gaps where standards lag behind by providing a lot of tiny functions
 * that really should just already be there--these are tiny, unit tested additions to underscore.js, which
 * reside in _.* -- e.g. _.uuid()
 *
 * @module undermore
 * @link https://github.com/atomantic/undermore.js
 * @copyright 2013 Adam Eivy (@antic)
 * @license MIT
 *
 * @param {object} exports The location of the underscore library to mixin all of the undermore methods
 */
(function(exports) {

    'use strict';

    // Establish the root object, `window` in the browser, or `global` on the server.
    var _ = exports._,
        // chars for base64 methods
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';


    // add the mixins to underscore
    _.mixin({/**
 * base64_decode decode a string. This is not a strict polyfill for window.atob
 * because it handles unicode characters
 *
 * @function module:undermore.base64_decode
 * @link https://github.com/davidchambers/Base64.js
 * @param {string} str The string to decode
 * @return {string}
 * @example _.base64_decode('4pyI') => '✈'
 */
base64_decode: function(str) {

    // allow browser implementation if it exists
    // https://developer.mozilla.org/en-US/docs/Web/API/window.btoa
    if (atob) {
        // utf8 decode after the fact to make sure we convert > 0xFF to ascii
        return _.utf8_decode(atob(str));
    }
    // allow node.js Buffer implementation if it exists
    if (Buffer) {
        return new Buffer(str, 'base64').toString('binary');
    }
    // now roll our own
    // decoder
    // [https://gist.github.com/1020396] by [https://github.com/atk]
    str = str.replace(/=+$/, '');
    for (
        // initialize result and counters
        var bc = 0, bs, buffer, idx = 0, output = '';
        // get next character
        buffer = str.charAt(idx++);
        // character found in table? initialize bit storage and add its ascii value;
        ~ buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            // and if not first of each 4 characters,
            // convert the first 8 bits to one ascii character
            bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
    }
    return output;
}, 
 /**
 * base64_encode encode a string. This is not a strict window.btoa polyfill
 * because it handles utf8 strings (unlike the window.btoa spec)
 *
 * Note: it might be work including an urlsafe flag
 * (see https://github.com/knowledgecode/base64.js)
 *
 * @function module:undermore.base64_encode
 * @link https://github.com/davidchambers/Base64.js
 * @param {string} str The string to encode
 * @return {string}
 * @example _.base64_decode('✈') => '4pyI'
 */
base64_encode: function(str) {
    // allow browser implementation if it exists
    // https://developer.mozilla.org/en-US/docs/Web/API/window.btoa
    if (btoa) {
        // first utf8 encode to keep from throwing an error if we are out of 0xFF
        return btoa(_.utf8_encode(str));
    }
    // allow node.js Buffer implementation if it exists
    if (Buffer) {
        var buffer = (str instanceof Buffer) ? str : new Buffer(str.toString(), 'binary');
        return buffer.toString('base64');
    }
    // now roll our own
    // [https://gist.github.com/999166] by [https://github.com/nignag]
    for (
        // initialize result and counter
        var block, charCode, idx = 0, map = chars, output = '';
        // if the next input index does not exist:
        //   change the mapping table to "="
        //   check if d has no fractional digits
        str.charAt(idx | 0) || (map = '=', idx % 1);
        // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
        output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
        charCode = str.charCodeAt(idx += 3 / 4);
        block = block << 8 | charCode;
    }
    return output;
}, 
 /**
 * empty event handler function, which simply prevents default handling
 *
 * @function module:undermore.eFn
 * @example
 *  $('#thing').on('click',this.conf.onClick||_.eFn)
 */
eFn: function(e) {
    e.preventDefault();
}, 
 /**
 * Generic empty function to speed up supplying anon empty functions.
 * If you are using jQuery, you could use $.noop if returning undefined is desireable
 * but this one is useful for anything requiring a boolean true return
 *
 * @function module:undermore.fn
 *
 * @return {boolean} true
 * @example
 *  this.onComplete = conf.onComplete||_.fn;
 */
fn: function() {
    return true;
}, 
 /**
 * get a new function, which runs two functions serially within a given context
 *
 * @function module:undermore.fnMore
 * @param {function} originalFn The original function to run
 * @param {function} moreFn The extra function to run in the same context after the first
 * @param {object} scope The context in which to run the fn
 * @return {function} the new function which will serially call the given functions in the given scope
 * @example
 *   var fn = _.fnMore(oldFn,newFn,someObj);
 *   fn();
 *   // runs oldFn, then newFn in the context of someObj
 */
fnMore: function(originalFn, moreFn, scope) {
    return scope ?
        function() {
            originalFn.apply(scope, arguments);
            moreFn.apply(scope, arguments);
    } : function() {
        originalFn();
        moreFn();
    };
}, 
 /**
 * Get a deep value on an Object safely (optionally with a default value).
 * {@link http://jsperf.com/deepget-vs-steeltoe/3|Run jsperf test}
 *
 * @function module:undermore.get
 * @param {object} obj The object to traverse
 * @param {mixed} chain A string/array path to use for finding the end item (e.g. 'prop.child.end' or ['prop','child','end'])
 * @param {mixed} defaultValue The object to traverse
 * @return {mixed} the last item in the ks or the defaultValue
 * @example
 *  var obj = {
 *     prop: 1
 *  };
 *  _.get(obj,'prop','blarg') === 1
 *  _.get(obj,'prop.child','blarg') === 'blarg'
 *  _.get(obj,'thing','blarg') === 'blarg'
 *  _.get(obj) === obj
 */
get: function (obj, chain, defaultValue) {
    if (typeof chain === 'string') {
        chain = chain.split('.');
    }

    // end of the line (found nothing)
    if (obj === undefined) {
        return defaultValue;
    }

    // end of the line (found self)
    if (chain.length === 0) {
        return obj;
    }

    // can't continue down the line any further (non-traversable)
    if (obj === null) {
        return defaultValue;
    }

    // keep traversing
    return _.get(obj[_.first(chain)], _.rest(chain), defaultValue);
}, 
 /**
 * Get the requested key from the query string.
 * If no key is provided, return a map of all
 * query string values.
 *
 * @param {string} key The key to retrieve from the query string
 * @param {*} defaultValue The default value to return if key does not exist
 * @example:
 *  // URL: http://foo.com?a=b&foo=bar
 *  _.getQuery() === { a: 'b', foo: 'bar' }
 *  _.getQuery('a') === 'b'
 *  _.getQuery('b') === undefined
 *  _.getQuery('c', 'd') === 'd'
 *  _.getQuery('a', 'baz') === 'b'
 */
getQuery: (function () {
    var o;
    var parseIt = function () {
        o = {};
        var query = (function (query) {
            if (query && query.length > 0) {
                return query.replace(/^\?/, '').split('&');
            }
            return [];
        })(window.location.search);

        _.map(query, function (item) {
            var param = item.split('=');
            if (param.length === 2) {
                o[param[0]] = param[1];
            }
        });
    };

    return function (key, defaultValue) {
        if (typeof o === 'undefined') {
            parseIt();
        }

        return typeof key === 'undefined' ? o : (typeof o[key] === 'undefined' ? defaultValue : o[key]);
    };
})(), 
 /**
 * test if a value is a valid Date instance, with a valid date
 *
 * @function module:undermore.isValidDate
 * @param {object} value Something to test
 * @return {bool} Whether or not the date is valid
 * @example
 *   var d = new Date('foobar') => Invalid Date
 *   d.getTime() => NaN 
 *   _.isDate(d) => true
 *   // even though this is a Date object instance, 
 *   // it isn't a valid date... so:
 *   _.isValidDate(d) => false
 */
isValidDate: function (value) {
    return _.isDate(value) && !(_.isNaN(value.valueOf()));
}, 
 /**
 * Get the english ordinal suffix for any number
 *
 * @function module:undermore.ord
 * @param {number} n number The number to evaluate
 * @return {string} The ordinal for that number
 * @example
 *  _.ord(1) === 'st'
 *  _.ord(345) === 'th'
 */
ord: function(n) {
    var sfx = ['th', 'st', 'nd', 'rd'],
        v = n % 100;
    return sfx[(v - 20) % 10] || sfx[v] || sfx[0];
}, 
 /**
 * Set a deep value on an object (even if the key path doesn't exist)
 * this is a shorthand for _.extend(), which is useful in cases where you can't easily build the extension object
 * e.g. if you are building a path from variable names:
 * _.set(obj, 'prop.'+varName+'.key', value); // 1 line vs: 3 lines with _.extend
 * var extendObj = {prop:{}};
 * extendObj.prop[varName] = {key:value};
 * _.extend(obj, extendObj);
 *
 * @function module:undermore.set
 * @param {object} obj The object to traverse
 * @param {mixed} chain A string/array path to use for finding the end item (e.g. 'prop.child.end' or ['prop','child','end'])
 * @param {mixed} value The value to set the end key to
 * @return {mixed} The full new extended object
 * @example
 *  var data = {
 *          prop: {}
 *      };
 *
 *  deepEqual(_.set(data, 'prop', 1), _.extend(data, {prop:1}) );
 *  deepEqual(_.set(data, 'prop.foo', 'fooVal'),  _.extend(data, {prop:{foo:'fooVal'}}) );
 *  deepEqual(_.set(data, 'newKey', 'newVal'),  _.extend(data, {newKey:'newVal'}) );
 *  deepEqual(_.set(data, 'deep.key.that.does.not.exist', 'deepVal'),  _.extend(data, {
 *      deep: {
 *           key:{
 *               that:{
 *                   does:{
 *                       not:{
 *                           exist:'deepVal'
 *                       }
 *                   }
 *               }
 *           }
 *       }
 *  }));
 */
set: function(obj, chain, value) {
    if (typeof chain === 'string') {
        chain = chain.split('.');
    }
    var key = obj,
        length = chain.length - 1;

    for (var i = 0; i < length; i++) {
        if (typeof key[chain[i]] === 'undefined' || key[chain[i]] === null) {
            key[chain[i]] = {};
        }

        key = key[chain[i]];
    }

    key[chain[length]] = value;

    return obj;
}, 
 /*jshint -W100*/
/**
 * utf8 decode a string
 *
 * @function module:undermore.utf8_decode
 * @link http://monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
 * @param {string} str The string to decode
 * @return {string}
 * @example
 *  _.utf8_decode('asdf') === 'asdf';
 *  _.utf8_decode('è¤é') === '複雜';
 *  _.utf8_decode('â') === '✈';
 */
/*jshint +W100*/
utf8_decode: function(str) {
	return decodeURIComponent(escape(str));
}, 
 /*jshint -W100*/
/**
 * utf8 encode a string
 *
 * @function module:undermore.utf8_encode
 * @link http://monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
 * @param {string} str The string to encode
 * @return {string}
 * @example
 *  _.utf8_encode('asdf') === 'asdf';
 *  _.utf8_encode('✈') === 'â';
 *  _.utf8_encode('複雜') === 'è¤é';
 */
/*jshint +W100*/
utf8_encode: function(str) {
	return unescape(encodeURIComponent(str));
}, 
 /**
 * generate a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
 * where each x is replaced with a random hexadecimal digit from 0 to f,
 * and y is replaced with a random hexadecimal digit from 8 to b.
 *
 * @function module:undermore.uuid
 * @link http://www.ietf.org/rfc/rfc4122.txt
 * @return {string} random uuid
 * @example
 *  var uuid = _.uuid();
 */
uuid: function() {
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}, 
 /**
 * Compare a semantic version number string to another:
 * 
 * 1.2.3-alpha < 1.2.3-alpha.1 < 1.2.3-alpha.beta < 1.2.3-beta < 1.2.3-beta.2 < 1.2.3-beta.11 < 1.2.3-rc.1 < 1.2.3
 *
 * @function module:undermore.version
 * @see {@link http://semver.org/ Semantic Versioning Standard}
 * @param {string} left The left version
 * @param {string} oper The operator to use for comparison ('==','>=','<=','<','>')
 * @param {string} right The right version
 * @return {bool} whether or not the versions resolved true with the comparitor
 * @example
 *  ok(_.version('1.2.3','<','2.0.0'), 'major version is smaller');
 *  ok(_.version('1.1.0','<','1.2.0'), 'minor version is smaller');
 *  ok(!_.version('1.1.0','>','1.2.0'), 'minor version is smaller');
 *  ok(_.version('1.0.10','>=','1.0.2'), 'patch version 10 is greater than or equal to 2');
 *  ok(_.version('1.2.3-alpha','<','1.2.3-alpha.1'));
 *  ok(_.version('1.2.3-alpha.1','<','1.2.3-alpha.beta'));
 *  ok(_.version('1.2.3-alpha.beta','<','1.2.3-beta'));
 *  ok(_.version('1.2.3-beta','<','1.2.3-beta.2'));
 *  ok(_.version('1.2.3-beta.2','<','1.2.3-beta.11'));
 *  ok(_.version('1.2.3-beta.11','<','1.2.3-rc.1'));
 *  ok(_.version('1.2.3-rc.1','<','1.2.3'));
 */
version: function(left, oper, right) {

    // is equal acceptable?
    var equal = oper.indexOf('=')!==-1,
        // we will remove all build metadata
        regMeta = /\+.*$/;

    // strip build metadata (not to be used for comparison)
    // e.g. '1.2.3+20140101081413' => '1.2.3'
    left = left.replace(regMeta);
    right = right.replace(regMeta);

    // see if we can bail early
    if(equal && left===right){
        // versions are exactly the same and that's good enough for us
        return true;
    }

    // use regex here instead of a series of splits since .match will return a
    // consistent array length and let use more easily parse out the results
    // 
    /*
     /^                     // start of the line
     (\d+).(\d+).(\d+)      // 1.2.3
     (?:-([a-z0-9.]+))?     // possible -pre.alpha.numeric.1.2.thing.and.such
                            // NOTE: we don't require termination of the string here with "$"
                            // so that we can gracefullly handle version strings that don't comply
                            // fully with SemVer (e.g. 2.0.2.rc1)
     /i,                    // case insensitive
     */
    var regSemVer = /^(\d+).(\d+).(\d+)(?:-([a-z0-9.]+))?/i,
        // produces a match array of [full, major, minor, patch, pre]
        // ["1.2.3-rc.1", "1", "2", "3", "rc.1"]
        // or
        // ["1.2.3", "1", "2", "3", undefined]
        arrLeft = left.match(regSemVer),
        arrRight = right.match(regSemVer),
        preLeft = arrLeft[4],
        preRight = arrRight[4],
        i,
        l,
        r,
        // have we hit a difference?
        hit;

    // skip full SemVer match (index 0) and loop to compare major.minor.patch
    for(i=1; i<4; i++){
        // 1.2.1 is greater than 1.2
        // attempt to parseInt on it, but if it's undefined:
        // e.g. 1.2.1 vs 1.2 (and we are comparing patch)
        // we will end up with l=1 and r=NaN, which won't compare right
        // so use 0 as a non-existent patch is < any existing patch
        l = parseInt(arrLeft[i],10) || 0;
        r = parseInt(arrRight[i],10) || 0;

        if(l!==r){ // there's a difference
            hit = true; // we don't need to check anything else
            break;
        }
    }
    if(!hit){
        // all the same so far
        // test pre-release version
        // at this point the rule of placement existence 
        // causing higher version shifts temporarily
        // 1.2 < 1.2.3 but 1.2.3 > 1.2.3-pre

        // if there is no pre-release on one side, that side is greater
        // 1.2.3-pre is an earlier version than 1.2.3 (1.2.3.112 < 1.2.3.Infinity)
        if(!preLeft){
            l = Infinity;
            if(preRight){
                // left > right by not existing
                r = 0; // kill the value
                hit = true;
            }
        }
        if(!preRight){
            r = Infinity;
            if(preLeft){
                // right > left by not existing
                l = 0;
                hit = true;
            }
        }
        if(!preLeft && !preRight){
            hit = true; // both are Infinity, no reason to try to split and compare parts
        }
    }
    if(!hit){
        // split the pre-release version and compare each part ([0-9a-zA-Z.]+)
        var pl = preLeft.split('.'),
            pr = preRight.split('.'),
            lenL = pl.length,
            lenR = pr.length,
            // we need to set the iteration limit to the longest one
            // (but we will stop 1 after the shortest)
            iters = lenL > lenR ? lenL : lenR;
        for(i=0; i<iters; i++){
            // pre-release part either won't exist, in which case
            // we will use -1 as the value (to mark non-existence as lower priority than existence)
            // if it's a number, we can parseInt to get an int for comparison
            // else it will become NaN
            // and we try to charCodeAt to convert the [a-zA-Z] to a number
            // e.g. 'alpha' => 97, 'beta' => 98, 'rc' => 114
            l = (i >= lenL) ? -1 : parseInt(pl[i],10) || pl[i].charCodeAt();
            r = (i >= lenR) ? -1 : parseInt(pr[i],10) || pr[i].charCodeAt();
            if(l!==r){
                break;
            }
        }
    }

    // at this point, l and r will be the first number in position that was not the same
    // or we will have made it through the loop and all were identical

    if(
        // equal
        (equal && l===r) ||
        // left is greater
        (oper.indexOf('>')!==-1 && l > r) ||
        // right is greater
        (oper.indexOf('<')!==-1 && l < r)
    ){
        return true;
    }

    // not the droid we are looking for
    return false;
}
    }); // mixin

}(typeof exports === 'object' && exports || this));
