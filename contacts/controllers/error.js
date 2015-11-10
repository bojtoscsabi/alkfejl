var express = require('express');

var router = express.Router();

//Viewmodel réteg
var statusTexts = {
    'new': 'Új',
    'assigned': 'Hozzárendelve',
    'ready': 'Kész',
    'rejected': 'Elutasítva',
    'pending': 'Felfüggesztve',
};
var statusClasses = {
    'new': 'danger',
    'assigned': 'info',
    'ready': 'success',
    'rejected': 'default',
    'pending': 'warning',
};
function decorateErrors(errorContainer) {
    return errorContainer.map(function (e) {
        e.statusText = statusTexts[e.status];
        e.statusClass = statusClasses[e.status];
        return e;
    });
}

router.get('/list', function (req, res) {
    req.app.models.error.find().then(function (errors) {
        console.log(errors);
        //megjelenítés
        res.render('errors/list', {
            errors: decorateErrors(errors),
            messages: req.flash('info'),
        });
    });
    
});
router.get('/new', function (req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('errors/new', {
        validationErrors: validationErrors,
        data: data,
    });
});
router.post('/new', function (req, res) {
    // adatok ellenőrzése
    req.checkBody('helyszin', 'Hibás helyszín').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/errors/new');
    }
    else {
        // adatok elmentése (ld. később) és a hibalista megjelenítése
        req.app.models.error.create({
            status: 'new',
            location: req.body.helyszin,
            description: req.body.leiras
        })
        .then(function (error) {
            //siker
            res.format({
                'text/html': function(){
                    req.flash('info', 'Hiba sikeresen felvéve!');
                    res.redirect('/errors/list');
                },
                'application/json': function () {
                    res.json(error);
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
    req.app.models.error.destroy({id: id})
        .then(function (deletedErrors) {
            res.format({
                'text/html': function(){
                    res.redirect('/errors/list');
                },
                'application/json': function () {
                    res.json({ success: true });
                }
            });
        });
});


module.exports = router;