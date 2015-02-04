var Book       = require('./models/book');
var User       = require('./models/user');
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
 * Get user profiles according to the user input
 * @param {string} input - The searched word
 * @param {Object} res - Body object
 */
function getUsers(res,input){


		User.find({
			$and: [
			  { name: { $regex: ".*"+input+".*" } },
			  { profile: "normal" },
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

  		 res.render('partials/' + name,{user : user});		

};




/**
 * Route middleware to ensure user is logged in (Admin User)
 * @param {Object} req - request object
 * @param {Object} res - result object
 * @param {Object} next - next object
 */
function isLoggedInAdmin(req, res, next) {


	if (req.isAuthenticated() && req.user.profile == "admin")
		return next();

	res.redirect('/login');

}


/** @module BackOffice */
module.exports = function(app, passport) {




	/**
	 * Admin route
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.get('/admin',isLoggedInAdmin, function(req, res) {

        var gravatar = getGravatarImage(req.user.email, ".jpg?s=100");

        Book.where({
		 	"users_id" : {$exists:true}, $where:'this.users_id.length>0'
		}).count(function (err, count) {
			  if (err) return handleError(err);
				  res.render('admin.ejs', {
						user : req.user, avatar: gravatar, bookNumber: count
					});
			})

	});


	/**
	 * Route for managing the books
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.post('/manage/books', function(req, res) {

		var input = req.body.text;
		var user = req.user;

		getBooks(res,input,user);

	});

	/**
	 * Route for searching users
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.post('/search/users', function(req, res) {

		var input = req.body.text;
		getUsers(res,input);

	});


	/**
	 * Route for deleting one book
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.delete('/delete/book/:book_id', function(req, res) {

		var currentBookID = req.params.book_id;
		var userid = req.user._id;


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


	/**
	 * Route to modify a book
	 * @param {Object} req - request object
	 * @param {Object} res - result object
	 */
	app.delete('/modify/book/:book_id', function(req, res) {

		var currentBookID = req.params.book_id;
		var userid = req.user._id;

		res.json({inUpdate: true});

	});



	// PARTIAL ROUTE
	// take a look on frontOffice routes




};


