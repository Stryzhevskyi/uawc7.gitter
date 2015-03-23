/**
 * Created by Sergei on 23.03.15.
 */

var CalcParser = require('./lib/parser.js');
var parser = new CalcParser('calc');
var assert = require('assert');

assert.equal(parser.onMessage('calc 2*3-4/5'), 5.2, 'is not equal');
assert.equal(parser.onMessage('calc 1.2+1'), 2.2, 'is not equal');
assert.equal(parser.onMessage('calc 1+2*(3/4)'), 2.5, 'is not equal');
assert.throws(function () {
    parser.onMessage('calc 10e5');
}, 'must be error');
assert.throws(function () {
    parser.onMessage('calc 1)+2')
}, Error, 'must be error');
assert.throws(function () {
    parser.onMessage('calc 1+(2');
}, Error, 'must be error');
