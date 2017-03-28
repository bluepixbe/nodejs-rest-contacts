// call the packages we need
var contacts = require('./data/contacts-data.ts');
var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');

// configure app
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

// test route to make sure everything is working (../api)
router.get('/', function (req, res) {
    res.json({message: 'Welcome to the contacts api!'});
});

// on routes that end in /contacts
router.route('/contacts')
    // get all the contacts
    .get(function (req, res) {
        res.json(contacts);
    })
    // create contact
    .post(function (req, res) {
        var name = req.body.name;
        console.log('Contact created ' + name);
        res.status(201).send('Created');
    });

// on routes that end in /contacts/{id}
router.route('/contacts/:id')
    // get the contact with that id
    .get(function (req, res) {
        console.log('Contact id: ' + req.params.id);
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).send('No id');
        }

        var contact = contacts.find(function matchId(contact) {
            return contact.id == this.params.id;
        }, req);
        if (!contact) {
            res.status(404).send('Not found');
        }
        res.json(contact);
    })
    // update contact
    .put(function (req, res) {
        console.log('Contact id: ' + req.params.id);
        var name = req.body.name;
        console.log('Contact updated ' + name);
        res.status(204).send('No Content');
    })
    // delete contact
    .delete(function (req, res) {
        console.log('Contact deleted ' + req.params.id);
        res.status(204).send('No Content');
    });

// register routes (/api)
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Contacts on port ' + port);