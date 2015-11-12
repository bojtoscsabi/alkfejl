var Browser = require('zombie');

Browser.localhost(process.env.IP, process.env.PORT);


describe('User visits new contact page', function (argument) {

    var browser = new Browser();
    
    before(function() {
        return browser.visit('/contacts/new');
    });
    
    it('should go to the authentication page', function () {
        browser.assert.redirected();
        browser.assert.success();
        browser.assert.url({ pathname: '/login' });
    });
    
    it('should be able to login with correct credentials', function (done) {
        browser
            .fill('username', 'k')
            .fill('password', 'k')
            .pressButton('button[type=submit]')
            .then(function () {
                browser.assert.redirected();
                done();
            });
    });
        
    it('should go the error page', function () {
        return browser.visit('/contacts/new')
        .then(function () {
            browser.assert.success();
        });
    });
});