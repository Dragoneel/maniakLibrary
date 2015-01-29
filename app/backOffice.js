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

  //   	Book.find({
		// 	   "users_id.id": user._id 
		//  // author: input 
		// }, function foundBooks(err, items) {
	     		 res.render('partials/' + name,{user : user});
    	// });
		

};


module.exports = function(app, passport) {




	// ADMIN SECTION =========================
	app.get('/admin',isLoggedIn, function(req, res) {
		

        console.log("Admin section");

        var gravatar = getGravatarImage(req.user.local.email, ".jpg?s=100");

		res.render('admin.ejs', {
			user : req.user, avatar: gravatar
		});

	});


	app.post('/manage/books', function(req, res) {

		var input = req.body.text;
		var user = req.user;

		getBooks(res,input,user);
		// console.log("manage books");

	});


	app.delete('/delete/book/:book_id', function(req, res) {

		var currentBookID = req.params.book_id;
		var userid = req.user._id;

		console.log("####### Current Book ID >>>  "+currentBookID);

		var query = {
			 _id: currentBookID
		};

						Book.remove(query, function(err, book) {
						  if (err) {
						    console.log('Book deletion error');
						  }
						});

		res.json({isDeleted: true});

	});


	app.delete('/modify/book/:book_id', function(req, res) {

		var currentBookID = req.params.book_id;
		var userid = req.user._id;

		console.log("####### Current Book ID >>>  "+currentBookID);

		// Update the current book
		// Book.find({
		// 	  "_id": currentBookID
		// }, function foundBooks(err, items) {
		// 		 // getRentedBooks(res,user,"name");
		// 		 // console.log(items);
	 //     		 // res.json(items);
  //   	});

		// res.json({bookid: currentBookID});
		// res.json({isUpdated: true});
		res.json({inUpdate: true});

	});



	// PARTIAL ROUTE
	// take a look on frontOffice route




};




// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}
