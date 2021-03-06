_.mixin({
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
    }
});