
var backController = angular.module('backController',['ngRoute','angoose.client','ui.bootstrap']);

	backController.config(function($routeProvider,$locationProvider) {
		// $locationProvider.html5Mode(true);
	  $routeProvider
	    .when('/', { templateUrl: 'partials/rentedBooks', controller: 'bookController' })
	    .when('/manageSearch', { templateUrl: 'partials/manageSearch', controller: 'manageController' })
	    .when('/addBook', { templateUrl: 'partials/addBook', controller: 'addController'})
	    .otherwise({redirectTo:'/'});
	});


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


	backController.controller('manageController', ['$scope','$http','AdminFactory','Book', function($scope, $http, AdminFactory,Book,$routeProvider,$modal, $log) {


		$scope.formData = {};



		// FIND BOOKS ==================================================================
		$scope.searchBooks = function() {


			if ($scope.formData.text != undefined) {

				AdminFactory.search($scope.formData)

				.success(function(data) {
						// $scope.formData = {}; // clear the form 
						$scope.hits = data;
				});

			}

		};


		// DELETE BOOK ==================================================================
		$scope.deleteBook = function(id) {
			AdminFactory.deleted(id)
				.success(function(data) {
					$scope.hits = data; 
					$scope.formData = {};
				});
		};


		// MODIFY BOOK ==================================================================
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

		// MODIFY BOOK ==================================================================
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
			    // $scope.hits = {isUpdated: false};
			  }
			});

				$scope.hits = {isUpdated: true};
		};

		

		// // ADD NEW BOOK ==================================================================
		// $scope.saveBook = function() {


		// 	// var newBook = new Book();


		// 	console.log($scope.newBookData.title);
		// 	// newBook.title= $scope.newBookData.title;
		// 	// newBook.isbn= $scope.newBookData.isbn;
		// 	// newBook.author= $scope.newBookData.author;
		// 	// newBook.published= $scope.newBookData.published;
		// 	// newBook.pages= $scope.newBookData.pages;
		// 	// newBook.nb_copy= $scope.newBookData.nb_copy;
		// 	// newBook.resume= $scope.newBookData.resume;
		// 	// newBook.genre= $scope.newBookData.genre;


		// 	// newBook.save(function(err) {
  //  //                          if (err)
  //  //                              console.log(err);
  //  //                      });


		// 	$scope.hits = {isSaved: true};

		// };






	}]);



// MODAL CONTROLLER
backController.controller('addController',['$scope','Book', function ($scope,Book) {

  

		// ADD NEW BOOK ==================================================================
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
