/*! undermore - v1.5.1 - 2014-06-13
* https://github.com/atomantic/undermore
* Copyright (c) 2014 Adam Eivy (@antic); Licensed MIT */
/*jslint browser:true*/
/*global console*/

/**
* console safety
* @module core
* @see {@link http://patik.com/blog/complete-cross-browser-console-log/ Console.log}
*/

/**
 * make it safe to use console.log always
 * 
 * @function module:core.console
 */
(function(a) {
    function b() {}
    for (
        var c = 'assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn'.split(','), 
        d; !! (d = c.pop());
    ) {
        a[d] = a[d] || b;
    }
})((function() {
    try {
        console.log();
        return window.console;
    } catch (a) {
        return (window.console = {});
    }
}()));
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
 * {@link http://jsperf.com/deepget-vs-steeltoe/2|Run jsperf test}
 *
 * @function module:undermore.get
 * @param {object} obj The object to traverse
 * @param {string} ks A string path to use for finding the end item (e.g. 'prop.child.end')
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
get: function (obj, ks, defaultValue) {
    if (typeof ks === 'string') {
        ks = ks.split('.');
    }

    // end of the line (found nothing)
    if (obj === undefined) {
        return defaultValue;
    }

    // end of the line (found self)
    if (ks.length === 0) {
        return obj;
    }

    // can't continue down the line any further (non-traversable)
    if (obj === null) {
        return defaultValue;
    }

    // keep traversing
    return _.get(obj[_.first(ks)], _.rest(ks), defaultValue);
}, 
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
 * Compare a semantic version number string to another (e.g. "2.0.10" > "2.0.2")
 * Note: does not differentiate "1.0.1-pre" and "1.0.1"
 *
 * @function module:undermore.version
 * @param {string} left The left version
 * @param {string} oper The operator to use for comparison ('==','>=','<=','<','>')
 * @param {string} right The right version
 * @return {bool} whether or not the versions resolved true with the comparitor
 * @example)
 *  ok(_.version('1.0.0','<','2.0.0', 'major version is smaller');
 *  ok(_.version('1.0.10','>=','1.0.2'), 'patch version 10 is greater than or equal to 2');
 */
version: function(left, oper, right) {

	// is equal acceptable?
	var equal = oper.indexOf('=')!==-1;
	// see if we can bail early
	if(equal && left===right){
		// versions are exactly the same and that's good enough for us
		return true;
	}

	var leftArray = left.split('.'),
		rightArray = right.split('.'),
		// how much do we need to loop (only need to compare to least specific)
		// "1.0.2" > "2" doesn't need to run 3 loop actions (just one)
		maxLen = Math.max(leftArray.length, rightArray.length),
		// 
		l,
		r,
		// once we hit a difference, kill the loop
		hit;

	for(var i=0;i<maxLen && !hit;i++){
		l = parseInt(leftArray[i],10);
		r = parseInt(rightArray[i],10);
		if(l!==r){
			hit = true;
			break;
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
/*jslint jquery:true*/
/*global define*/
/**
 * The jQuery plugin namespace.
 * a set of standard mini jquery plugins and extensions
 * This set of extensions adds functionality to the jQuery.fn external library
 * @module jQuery
 * @see {@link http://docs.jquery.com/Plugins/Authoring The jQuery Plugin Guide}
 * @copyright 2013 Adam Eivy (@antic)
 * @license MIT
 */
 
(function(){
    'use strict';
    var plugin = function($) {
    /**
 * allows the query of elements containing case-insensitive text
 * works just like $(':contains(text)') but as $(':containsI(text)')
 * Additionally, allows regex searches:
 * 
 * @function module:jQuery.containsI
 * @example
 *  $("p:containsI('\\bup\\b')") (Matches "Up" or "up", but not "upper", "wakeup", etc.)
 *  $("p:containsCI('(?:Red|Blue) state')") (Matches "red state" or "blue state", but not "up state", etc.)
 *  $("p:containsCI('^\\s*Stocks?')") (Matches "stock" or "stocks", but only at the start of the paragraph (ignoring any leading whitespace).)
 * @return selection of elements containing string (insensitively)
 */
$.expr[":"].containsI = function(elem, i, match) {
    return (new RegExp (match[3], 'i')).test(elem.textContent || elem.innerText || '');
};

/**
 * finds elements that contain text starting with string
 * 
 * @function module:jQuery.startsWith
 * @example
 *  $(':startsWith(text)')
 * @return {object} selection of elements that have text starting with given string
 */
$.expr[":"].startsWith = function(elem, i, match) {
    return ( elem.textContent || elem.innerText || '' ).indexOf( match[3] ) === 0;
};

/**
 * convert a form's name/value pairs to a json object
 * 
 * @function module:jQuery.formToObject
 * @example 
 *  // captures the field/value set from #myform
 *  var formData = $('#myform').formToObject();
 * 
 * @return {object} a json representation of the form
 */
$.fn.formToObject = function() {
   var o = {},
       a = this.serializeArray(),
       name;
   $.each(a, function() {
     name = this.name;
       if (o[name] !== undefined) {
           if (!o[name].push) {
               o[name] = [o[name]];
           }
           o[name].push(this.value || '');
       } else {
           o[name] = this.value || '';
       }
   });
   return o;
};
    };
    // support for requirejs
    if ( typeof define === 'function' && define.amd ) {
        define(['jquery'], function ($) { 
            return plugin($); 
        } );
    } else {
        plugin(jQuery);
    } 
}());
/**
 * Capitalizes the first letter of a string and downcases all the others.
 *
 * @function module:String.prototype.capitalize
 * @return {string}
 * @example
 *  'hello'.capitalize() === 'Hello'
 *  'HELLO WORLD!'.capitalize() === 'Hello world!'
 */
String.prototype.capitalize = String.prototype.capitalize || function() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
};
/**
 * determines whether one string may be found within another string
 * 
 * Once ecmascript adds this natively, you should build core.js without this method:
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/contains
 * @function module:String.prototype.contains
 * @param {string} searchString A string to be searched for within this string.
 * @param {number} position The position in this string at which to begin searching for searchString; defaults to 0.
 * @return {boolean}
  * @example
  *  var str = "To be, or not to be, that is the question.";
  *  console.log(str.contains("To be"));       // true
  *  console.log(str.contains("question"));    // true
  *  console.log(str.contains("nonexistent")); // false
  *  console.log(str.contains("To be", 1));    // false
  *  console.log(str.contains("TO BE"));       // false
 */
String.prototype.contains = String.prototype.contains || function() {
    return String.prototype.indexOf.apply( this, arguments ) !== -1;
};
/**
 * see if a string ends with a given string
 * 
 * Once ecmascript adds this natively, you should build core.js without this method:
 * @link http://wiki.ecmascript.org/doku.php?id=harmony%3astring_extras
 * @link http://jsperf.com/string-prototype-endswith/3
 * @function module:String.prototype.endsWith
 * @param {string} A substring expected to be in the beginning of this string
 * @return {boolean}
  * @example
  *  'some string'.endsWith('g') === true;
  *  'some string'.endsWith('string') === true;
  *  'some string'.endsWith('!') === false;
 */
String.prototype.endsWith = String.prototype.endsWith || function (suffix){ 
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
/**
 * get a substring of a particular length from the left
 * 
 * @function module:String.prototype.left
 * @param {number}     n     The lenth of the string to return
 * @return {string}
 * @example
 *  'foobar'.left(3) === 'foo'
 */
String.prototype.left = String.prototype.left || function(n) {
	return this.substr(0,n);
};
/**
 * get a substring of a particular length from the right
 * 
 * @function module:String.prototype.right
 * @param {number}     n     The lenth of the string to return
 * @return {string}
 * @example
 *  'foobar'.right(3) === 'bar'
 */
String.prototype.right = String.prototype.right || function(n) {
	return this.substr((this.length-n),this.length);
};
/**
 * see if a string begins with a given string
 * 
 * Once ecmascript adds this natively, you should build core.js without this method:
 * @link http://wiki.ecmascript.org/doku.php?id=harmony%3astring_extras
 * @function module:String.prototype.startsWith
 * @param {string} A substring expected to be in the beginning of this string
 * @return {boolean}
  * @example
  *  'some string'.startsWith('s') === true;
 */
String.prototype.startsWith = String.prototype.startsWith || function (prefix){
    return this.slice(0, prefix.length) === prefix;
};
/**
 * shorten a string, adding a suffix in place of excessive characters
 * default suffix is an html encoded ellipsis '&hellip;'
 * 
 * @function module:String.prototype.trunc
 * @param {number}     len     The lenth of the string to keep (not counting suffix)
 * @param {string}  suffix  The suffix to append (e.g. '...<a>read more</a>')
 * @return {string}
 * @example
 *  'this is a description that is too detailed'.trunc(10) === 'this is a &hellip;'
 */
String.prototype.trunc = String.prototype.trunc || function(len,suffix) {
    return this.length > len ? this.slice(0, len) + (suffix||'&hellip;') : this;
};
