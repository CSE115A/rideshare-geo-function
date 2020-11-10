/* test/index.test.js*/

const { expect } = require('chai');
var getGeo = require('functions/index.js');
var assert = require('chai').expect;

describe('#getGeo()', function{
    context('with arguments', function() {
        it('should return 200', function() {
            expect(getGeo().to.equal(200)
        })
    })
})

