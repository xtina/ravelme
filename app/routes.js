// app/routes.js
module.exports = function(app, rav) {

    //set up one page app routing
    app.get('/partials/:filename', function(req, res) {
        if (req.params.filename) {
            console.log('rendering ' + req.params.filename + '...');
            res.render('../partials/' + req.params.filename);
        } else
            res.redirect('/protected/profile');
    });

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs', {
            error: req.session.error
        }); // load the index.ejs file
        delete req.session.error;
    });

    // =====================================
    // AUTHENTICATION SECTION ==============
    // =====================================
    app.get('/auth/rav', function(req, res) {
        rav.signInUrl(function(err, url) { //get oauth token
            res.writeHead(302, {
                'Location': url
            });
            res.end();
        })
    });

    app.get('/callback', function(req, res) {
        rav.authorize(req, res); //get access token
    });

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/protected/profile',
        function(req, res) {
            res.render('profile.ejs', {
                user: req.session.user,
            });
        });

    // =====================================
    // BACK END API SECTION ================
    // =====================================

    app.get('/protected/favorites', function(req, res) {
        console.log('getting favs using api');
        rav.favorites.list(req.session, {
                page_size: 5
            },
            function(err, data) {
                if (err) {
                    /*res.writeHead(err.statusCode, {
                        'Message': err.data
                    });*/
                    console.log(err);
                    res.send(err);
                } else {
                    res.json(data);
                }
            });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================


    // route for logging out
    app.get('/logout', function(req, res) {
        //req.logout();
        req.session.destroy(function(err) {
            if (err) console.log("could not destroy session\n" + err);
        });
        res.redirect('/');
    });

    app.get('/protected/favoritesView', function(req, res) {
        res.sendFile('views/favorites.html', {
            root: 'public'
        });
    });

    app.get('*', function(req, res) {
        //if the user isn't logged in, they'll be auto redirected to /
        res.redirect('/protected/profile');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req) {
    if (req.session.user) {
        return true;
    }
    return false;
};
