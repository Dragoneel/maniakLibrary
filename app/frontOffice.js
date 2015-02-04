var Book       = require('./models/book');
var newBook            = new Book();
var crypto = require("crypto");

/**
 * Gets a gravatar image for the specified email address and optional arguments.
 * @param {string} email - user mail
 * @param {string} args - additionnal argument for the image size
 */
function getGravatarImage(email, args) {
    args = args || "";
    var BASE_URL = "//www.gravatar.com/avatar/";
    return (BASE_URL + md5(email) + args).trim();
}


/**
 * MD5 hashes the specified string.
 * @param {string} srt - string to be hashed
 */
function md5(str) {
    str = str.toLowerCase().trim();
    var hash = crypto.createHash("md5");
    hash.update(str);
    return hash.digest("hex");
}


/**
 * Get list of available books from the user input
 * @param {string} input - The searched word.
 * @param {Object} res - Body object
 * @param {User} user - User object
 */
function getBooks(res,input,user){

    	// console.log("####### Current User ID >>>  "+user._id);
    	var regexSearch = new RegExp([input].join(""),"i");

		Book.find({
			$or: [ 
			  {
			  			$and: [
			  { author: { $regex: regexSearch } },
			  { "users_id.id": {$ne:user._id.toString()} },
			  { nb_copy: { $gt: 0 }	}
			  			]
			  		},
			  		{
			  			$and: [
			  { title: { $regex: regexSearch } },
			  { "users_id.id": {$ne:user._id.toString()} },
			  { nb_copy: { $gt: 0 }	}
			  			]
			  		}
			  		
			  	]
		}, function foundBooks(err, items) {
	     		 res.json(items);
    	});

};

/**
 * Inject the user informations to the profile partial
 * @param {string} input - The searched word
 * @param {Object} res - Body object
 * @param {User} user - User object
 */
function getRentedBooks(res,user,name){

    	Book.find({
			   "users_id.id": user._id 
		}, function foundBooks(err, items) {
	     		 res.render('partials/' + name,{user : user});
    	});
		
};

/**
 * Route middleware to ensure user is logged in (Normal User)
 * @param {Object} req - request object
 * @param {Object} res - result object
 * @param {Object} next - next object
 */
function isLoggedInNormal(req, res, next) {

	if (req.isAuthenticated() && req.user.profile == "normal")
		return next();

	res.redirect('/login');

}

/** @module FrontOffice */
module.exports = function(app, passport) {


	/**
	 * Show the home page
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});


	/**
	 * Partial route for frontOffice and backOffice
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.get('/partials/:name', function (req, res) {
	  var name = req.params.name;
	  if(name == 'search'){
	  	res.render('partials/'+name);
	  }
	  if(name == 'mybooks'){
	  	getRentedBooks(res,req.user,name);
	  }
	  if(name == 'rentedBooks'){
	  	res.render('partials/'+name);
	  }
	  if(name == 'manageSearch'){
	  	res.render('partials/' + name);
	  }
	  if(name == 'addBook'){
	  	res.render('partials/' + name);
	  }
	  if(name == 'manageUser'){
	  	res.render('partials/' + name);
	  }
	});

	
	/**
	 * Search books route
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.post('/search/books', function(req, res) {

		var input = req.body.text;
		var user = req.user;

		getBooks(res,input,user);

	});

	/**
	 * Rented book route
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.delete('/rented/book/:user_id', function(req, res) {

		res.json({isTrue:true});
	});

	/**
	 * Rent book
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.delete('/rent/book/:book_id', function(req, res) {

		var currentBookID = req.params.book_id;
		var userid = req.user._id;

		console.log("####### Current Book ID >>>  "+currentBookID);

		var query = { 
			 _id: currentBookID
		};

   						// PULL AN ELEMENT FROM THE ARRAY
						var update = {  $push: 
											{
												 users_id: {
												 	"id": userid.toString(),
												 	"name": req.user.name
												 }
											},
										$inc:
											{
												nb_copy: -1
											}	
						};

						var options = {new: true};

						Book.findOneAndUpdate(query, update, options, function(err, book) {
						  if (err) {
						    console.log('Book update error');
						  }
						});

		res.json({isMessage: true});

	});

	/**
	 * Give back books route
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.delete('/rendre/book/:book_id', function(req, res) {

		var currentBookID = req.params.book_id;
		var userid = req.user._id;

		var query = { 
			 _id: currentBookID
		};

   						// PULL AN ELEMENT FROM THE ARRAY
						var update = {  $pull: 
											{
												 users_id: {
												 	"id": userid.toString(),
												 	"name": req.user.name
												 }
											},
										$inc:
											{
												nb_copy: 1
											}	
						};

						var options = {new: true};

						Book.findOneAndUpdate(query, update, options, function(err, book) {
						  if (err) {
						    console.log('Book update error');
						  }
						});

		res.json({isMessage: true});

	});

	/**
	 * Profile route
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.get('/profile',isLoggedInNormal, function(req, res) {


        var gravatar = getGravatarImage(req.user.email, ".jpg?s=100");
        console.log(req.user._id);

        Book.where({
		 	"users_id.name": req.user.name
		}).count(function (err, count) {
			  if (err) return handleError(err);
				  res.render('profile.ejs', {
						user : req.user, avatar: gravatar, bookNumber: count
					});
			})


		
		

	});


	/**
	 * Logout route
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	/**
	 * Show the login form
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	/**
	 * Process the login form
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.post('/login', passport.authenticate('local-login', {
		// successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}),
	function(req, res) {
	 
		if (req.user.profile == "admin") { 
			res.redirect('/admin');
		}
		else{

				res.redirect('/profile');
			}

	});

	/**
	 * Show the signup form
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

		
	/**
	 * Process the signup form
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	/**
	 * Route when already loged
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.get('/connect/local', function(req, res) {
		res.render('connect-local.ejs', { message: req.flash('loginMessage') });
	});

	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	

	/**
	 * Unlik account (delete account)
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.get('/unlink/local', isLoggedInNormal, function(req, res) {
		var user            = req.user;
		user.email    = undefined;
		user.password = undefined;
		user.save(function(err) {
			res.redirect('/');
		});
	});


};





