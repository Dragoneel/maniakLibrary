var Book       = require('./models/book');
var newBook            = new Book();
var crypto = require("crypto");



/**
 * Gets a gravatar image for the specified email address and optional arguments.
 */
function getGravatarImage(email, args) {
    args = args || "";
    var BASE_URL = "//www.gravatar.com/avatar/";
    return (BASE_URL + md5(email) + args).trim();
}


/**
 * MD5 hashes the specified string.
 */
function md5(str) {
    str = str.toLowerCase().trim();
    var hash = crypto.createHash("md5");
    hash.update(str);
    return hash.digest("hex");
}


/**
 * Get list of available books from the user input
 */
function getBooks(res,input,user){

    	// console.log("####### Current User ID >>>  "+user._id);

		Book.find({
			$and: [
			  { author: { $regex: ".*"+input+".*" } },
			  { "users_id.id": {$ne:user._id.toString()} },
			  { nb_copy: { $gt: 0 }	}
			]
		 // author: input 
		}, function foundBooks(err, items) {
				 // getRentedBooks(res,user,"name");
				 // console.log(items);
	     		 res.json(items);
    	});

};

/**
 * Inject the user informations to the profile partial
 */
function getRentedBooks(res,user,name){

    	console.log("####### Current User ID >>>  "+user._id);

    	Book.find({
			   "users_id.id": user._id 
		 // author: input 
		}, function foundBooks(err, items) {
	     		 res.render('partials/' + name,{user : user});
    	});
		

};


module.exports = function(app, passport) {

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.ejs');
		// res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.get('/partials/:name', function (req, res) {
	  var name = req.params.name;
	  if(name == 'search'){
	  	res.render('partials/'+name);
	  }
	  if(name == 'mybooks'){
	  	// var items = getRentedBooks(req.user);
	  	// console.log("mybooks");
	  	getRentedBooks(res,req.user,name);
	  }
	  if(name == 'rentedBooks'){
	  	// console.log("rentedBooks");
	  	res.render('partials/'+name);
	  }
	  if(name == 'manageSearch'){
	  	res.render('partials/' + name);
	  }
	  if(name == 'addBook'){
	  	// getRentedBooks(res,req.user,name);
	  	res.render('partials/' + name);
	  }
	});

	// get search view
	// app.get('/get/search', function(req, res) {
	// 	// console.log(req.params.search); 
	// 	res.json({isSearch:true});
	// });

	// // get profile view
	// app.get('/get/profile', function(req, res) {
	// 	res.json({isProfile:true});
	// });
	
	app.post('/search/books', function(req, res) {

		var input = req.body.text;
		var user = req.user;

		getBooks(res,input,user);

	});

	app.delete('/rented/book/:user_id', function(req, res) {

		res.json({isTrue:true});
	});

	// rent a book
	app.delete('/rent/book/:book_id', function(req, res) {

		var currentBookID = req.params.book_id;
		var userid = req.user._id;

		console.log("####### Current Book ID >>>  "+currentBookID);

		var query = { 
			// "users_id": { "id" : user._id }
			// $and: [ 
			 _id: currentBookID
			//  // { users_id:{ id: { $ne: user._id } }  }
			// ]
		};

   						// PULL AN ELEMENT FROM THE ARRAY
						var update = {  $push: 
											{
												 users_id: {
												 	"id": userid.toString(),
												 	"email": req.user.local.email
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

		// Update the profile view
		// Book.find({
		// 	  "users_id.id": userid.toString()
		// }, function foundBooks(err, items) {
		// 		 // getRentedBooks(res,user,"name");
		// 		 // console.log(items);
	 //     		 res.json(items);
  //   	});

		// res.render('profile.ejs', {
		// 	user : req.user, message : 'Added successfully'
		// });
		res.json({isMessage: true});

	});

// delete a todo
	app.delete('/rendre/book/:book_id', function(req, res) {

		var currentBookID = req.params.book_id;
		var userid = req.user._id;

		var query = { 
			// "users_id": { "id" : user._id }
			// $and: [ 
			 _id: currentBookID
			//  // { users_id:{ id: { $ne: user._id } }  }
			// ]
		};

   						// PULL AN ELEMENT FROM THE ARRAY
						var update = {  $pull: 
											{
												 users_id: {
												 	"id": userid.toString(),
												 	"email": req.user.local.email
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

	// PROFILE SECTION =========================
	app.get('/profile',isLoggedIn, function(req, res) {





						// create new book
                        

      //                   Book.remove({}, function(err) { 
						//    console.log('collection removed') 
						// });

						// newBook.title    = 'Data Mining';
      //                   newBook.isbn    = 'isbn xyz';
      //                   newBook.author    = 'imane';
      //                   newBook.published    = new Date();
      //                   newBook.pages    = 300;
                        

      //                   newBook.save(function(err) {
      //                       if (err)
      //                           return done(err);
      //                   });


//////////////////
		// var update = { $push : {
		// 	// 					    users_id :  {
		// 	// 					             "id": "three"
		// 	// 					           }
		// 	// 					  }
   // };
//////////////////

                        // var query = {"_id": "54bcf4b85d3a3cb318b135f4","isbn":"isbn xyz"};

                        // ADD AN OBJECT ARRAY
						// var update = { users_id: [{id: 'two'}] };

						// ADD AN ELEMENT TO THE ARRAY
						// var update = { 
						// 	$push : {
						// 		    users_id :  {
						// 		             "id": "three"
						// 		           }
						// 		  }
   			// 			};

   						// PULL AN ELEMENT FROM THE ARRAY
						// var update = {  $push: 
						// 					{
						// 						 users_id: {
						// 						 	"id": req.user._id
						// 						 }
						// 					}	
						// };

						// var options = {new: true};
						// Book.findOneAndUpdate(query, update, options, function(err, book) {
						//   if (err) {
						//     console.log('got an error');
						//   }
						// });


		


        var gravatar = getGravatarImage(req.user.local.email, ".jpg?s=100");
		
        console.log(req.user.local.email+" ===> "+gravatar);

		res.render('profile.ejs', {
			user : req.user, avatar: gravatar
		});

	});


	// PROFILE SECTION =========================
	app.get('/admin',isLoggedIn, function(req, res) {
		

        console.log("Admin section");

         var gravatar = getGravatarImage(req.user.local.email, ".jpg?s=100");

		res.render('admin.ejs', {
			user : req.user, avatar: gravatar
		});

	});





	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			// successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}),
		function(req, res) {
	  
			if (req.user.local.email == "contact@dchar.co") { 
				res.redirect('/admin');
			}
			else{

				res.redirect('/profile');
			}

		});

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('signupMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));



// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	
// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', isLoggedIn, function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/');
		});
	});

// =============================================================================
// RENT BOOKS =============================================================
// =============================================================================

	// Rent one book
	// app.get('/rent/book', isLoggedIn, function(req, res) {
	// 	var user            = req.user;
	// 	console.log("===============> "+user._id);
	// });




};




// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}
