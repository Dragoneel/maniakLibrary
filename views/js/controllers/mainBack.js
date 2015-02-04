
var backController = angular.module('backController',['ngRoute','angoose.client','ui.bootstrap']);

	backController.config(function($routeProvider,$locationProvider) {
		// $locationProvider.html5Mode(true);
	  $routeProvider
	    .when('/', { templateUrl: 'partials/rentedBooks', controller: 'bookController' })
	    .when('/manageSearch', { templateUrl: 'partials/manageSearch', controller: 'manageController' })
	    .when('/addBook', { templateUrl: 'partials/addBook', controller: 'addController'})
	    .when('/manageUser', { templateUrl: 'partials/manageUser', controller: 'userController'})
	    .otherwise({redirectTo:'/'});
	});


	/**
	 * Highlight for searched words
	 */
	backController.filter('highlight', function($sce) {
		return function(text, phrase) {
		if (phrase) text = text.replace(new RegExp(phrase, 'gi'),

		'<span class="highlighted">$&</span>');

		return $sce.trustAsHtml(text)
		  }
	});


	/**
	 * Find rented books and change the scope
	 */
	backController.controller('bookController', ['$scope','$http','Book','AdminFactory', function($scope, $http, Book,BooksFactory) {



			Book.find({
				users_id: {$exists: true, $not: {$size: 0}} 
			}, function foundRentedBooks(err, items) {
								$scope.rentedBooks = items;
								if (err){
									console.log("Error rised: "+err);
								} 
			});




	}]);


	/**
	 * Manage books
	 */
	backController.controller('manageController', ['$scope','$http','AdminFactory','Book', function($scope, $http, AdminFactory,Book,$routeProvider,$modal, $log) {


		$scope.formData = {};



		/**
		 * Find a book according to user input and change the scope
		 */
		$scope.searchBooks = function() {


			if ($scope.formData.text != undefined) {

				AdminFactory.search($scope.formData)

				.success(function(data) {
						// $scope.formData = {}; // clear the form 
						$scope.hits = data;
				});

			}

		};


		/**
		 * Delete a book when user fire the deleteBook button
		 */
		$scope.deleteBook = function(id) {
			AdminFactory.deleted(id)
				.success(function(data) {
					$scope.hits = data; 
					$scope.formData = {};
				});
		};


		/**
		 * Fetch for a book and populate the form when user fire the modifyBook button
		 */
		$scope.modifyBook = function(id) {
			AdminFactory.modify(id)
				.success(function(data) {
					$scope.hits = data; 
					$scope.formData = {};
					


					Book.find({
						  "_id": id
					}, function foundBooks(err, items) {
							 // getRentedBooks(res,user,"name");
							 // console.log(items);
							 var newDate = new Date(items[0].published);
							 // console.log(;
							 $scope.bookData = {
							 	id: items[0]._id,
							 	title: items[0].title,
							 	isbn: items[0].isbn,
							 	author: items[0].author,
							 	published: newDate.toJSON().slice(0,10),
							 	pages: items[0].pages,
							 	nb_copy: items[0].nb_copy,
							 	resume: items[0].resume,
							 	genre: items[0].genre
							 };
			    	});


				});
		};

		/**
		 * Modify a book when user fire the saveModifiedBook button
		 */
		$scope.saveModifiedBook = function(valid,bookData) {

			console.log("==========BOOK_ID===========>>>>>"+bookData.title);

			var title = bookData.title.toString();

			var query = { 
				 _id: bookData.id
			};

   			// Update the current book
			var update = {  	
				title: bookData.title,
				isbn: bookData.isbn,
				author: bookData.author,
				published: bookData.published,
				pages: bookData.pages,
				nb_copy: bookData.nb_copy,
				resume: bookData.resume,
				genre: bookData.genre,
			};

			Book.update(query, update, function(err) {
			  if (err) {
			    console.log('Book update error');
			  }
			});

				$scope.hits = {isUpdated: true};
		};




	}]);



/**
* Books add controller
*/
backController.controller('addController',['$scope','Book', function ($scope,Book) {

  

		/**
		 * Save the form when the user click on saveBook
		 */
		$scope.saveBook = function(isValid,book) {

			if (isValid) {


				var newBook = new Book();


				newBook.title= book.title;
				newBook.isbn= book.isbn;
				newBook.author= book.author;
				newBook.published= book.published;
				newBook.pages= book.pages;
				newBook.nb_copy= book.nb_copy;
				newBook.resume= book.resume;
				newBook.genre= book.genre;


				newBook.save(function(err) {
	                            if (err)
	                                console.log(err);
	                        });

				$scope.hits = {isSaved: true};
            }

		};

}]);



/**
* User controller ( search and update privilege )
*/
backController.controller('userController', ['$scope','$http','User','Book','AdminFactory', function($scope, $http, User,Book,AdminFactory) {



		$scope.formData = {};



		/**
		* Search for user profile according to user input
		*/
		$scope.searchUsers = function() {


			if ($scope.formData.text != undefined) {

				AdminFactory.searchUsers($scope.formData)

				.success(function(data) {
						// $scope.formData = {}; // clear the form 
						$scope.hits = data;
				});

			}

		};


		/**
		* Change the user privilege ( admin ) and delete user id from the users_id array
		*/
		$scope.addPrivilege = function (userID,userName) {
	

			// Add the admin privilege to the current selected user
			var query = { 
			 	_id: userID.toString()
			};

			var update = { 
				profile: "admin"
			};

			var options = {new: true};

			User.update(query, update, options, function(err, user) {
			  if (err) {
			    console.log('User update privilege error');
			  }
			});


			// Delete all rented books
			var query = { 
			 	"users_id.id": userID.toString()
			};

			var update = { 
										$pull: 
											{
												 users_id: {
												 	"id": userID.toString(),
												 	"name": userName
												 }
											},
										$inc:
											{
												nb_copy: 1
											}
			};

			var options = {new: true};

			Book.update(query, update, options, function(err, user) {
			  if (err) {
			    console.log('Book rented book error');
			  }
			});


			// Refresh the view after update
			$scope.hits = {isUserUpdated:true};	


		}



	}]);
