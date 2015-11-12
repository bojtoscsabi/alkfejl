var express = require('express');

var router = express.Router();

//Viewmodel réteg
var statusTexts = {
        'Összes': 'Összes',
        'Család': 'Család',
        'Barátok': 'Barátok',
        'Kollégák': 'Kollégák',
};
var statusClasses = {
        'Összes': 'default',
        'Család': 'default',
        'Barátok': 'default',
        'Kollégák': 'default',
};
function decoratecontacts(contactContainer) {
    return contactContainer.map(function (e) {
        e.statusText = statusTexts[e.status];
        e.statusClass = statusClasses[e.status];
        return e;
    });
}

router.get('/list', function (req, res) {
    req.app.models.contact.find().then(function (contacts) {
        console.log(contacts);
        //megjelenítés
        res.render('contacts/list', {
            contacts: decoratecontacts(contacts),
            messages: req.flash('info'),
        });
    });
    
});
router.get('/new', function (req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('contacts/new', {
        validationErrors: validationErrors,
        data: data,
    });
});
router.post('/new', function (req, res) {
    // adatok ellenőrzése
    req.checkBody('name', 'Hibás név').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('phonenumber', 'Hibás telefonszám').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('email', 'Hibás e-mail cím').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('address', 'Hibás cím').notEmpty().withMessage('Kötelező megadni!');
  // req.sanitizeBody('leiras').escape();
    
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/contacts/new');
    }
    else {
        // adatok elmentése (ld. később) és a hibalista megjelenítése
        req.app.models.contact.create({
            name: req.body.name,
            phonenumber: req.body.phonenumber,
            email: req.body.email,
            address: req.body.address,
            category: 'Összes' 
        })
        .then(function (contact) {
            //siker
            res.format({
                'text/html': function(){
                    req.flash('info', 'Névjegy sikeresen felvéve!');
                    res.redirect('/contacts/list');
                },
                'application/json': function () {
                    res.json(contact);
                }
            });
        })
        .catch(function (err) {
            //hiba
            console.log(err);
        });
      
    }
});
router.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    req.app.models.contact.destroy({id: id})
        .then(function (deletedcontacts) {
            res.format({
                'text/html': function(){
                    res.redirect('/contacts/list');
                },
                'application/json': function () {
                    res.json({ success: true });
                }
            });
        });
});


module.exports = router;