var Browser = require('zombie');

Browser.localhost(process.env.IP, process.env.PORT);

describe('User visits login page', function() {
    var browser = new Browser();
    
    before(function() {
        return browser.visit('/login');
    });
    
    it('should be successful', function() {
        browser.assert.success();
    });

});