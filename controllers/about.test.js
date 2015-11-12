var Browser = require('zombie');

Browser.localhost(process.env.IP, process.env.PORT);

describe('User visits about page', function() {
    var browser = new Browser();
    
    before(function() {
        return browser.visit('/about');
    });
    
    it('should be successful', function() {
        browser.assert.success();
    });
});