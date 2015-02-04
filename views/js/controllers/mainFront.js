
var searchController = angular.module('searchController',['ngRoute','angoose.client']);

	searchController.config(function($routeProvider,$locationProvider) {
	  $routeProvider
	    .when('/', { templateUrl: 'partials/search', controller: 'mainController' })
	    .when('/mybooks', { templateUrl: 'partials/mybooks', controller: 'profileController'})
	    .otherwise({redirectTo:'/'});
	});


	/**
	 * Highlight for searched words
	 */
	searchController.filter('highlight', function($sce) {
		return function(text, phrase) {
		if (phrase) text = text.replace(new RegExp(phrase, 'gi'),

		'<span class="highlighted">$&</span>');

		return $sce.trustAsHtml(text)
		  }
	});


	/**
	 * Profile controller ( find and give back)
	 */
	searchController.controller('profileController', ['$scope','$http','Book','BooksFactory', function($scope, $http, Book,BooksFactory) {


		$scope.userID = window.x;
		var userID = $scope.userID;

		Book.find({
			"users_id.id": userID
		}, function foundRentedBooks(err, items) {
							$scope.books = items;
							if (err){
								console.log("Error rised: "+err);
							} 
		});


		/**
		 * Give back a book when the rendreBook button is fired
		 */
		$scope.rendreBook = function(id) {
			// $routeProvider.reload();
			BooksFactory.rendre(id)
				.success(function(data) {
					Book.find({
						"users_id.id": userID
					}, function foundRentedBooks(err, items) {
										$scope.books = items;
										if (err){
											console.log("Error rised: "+err);
										} 
					});
				});
		};


	}]);


	/**
	* Main controller ( searh book, rent book, display rented books)
	*/
	searchController.controller('mainController', ['$scope','$http','BooksFactory', function($scope, $http, BooksFactory,$routeProvider) {

		

		$scope.formData = {};



		/**
		 * Find a book according to the user input
		 */
		$scope.searchBooks = function() {

			if ($scope.formData.text != undefined) {

				BooksFactory.search($scope.formData)

				.success(function(data) {
						// $scope.formData = {}; // clear the form 
						$scope.hits = data;
				});

			}
		};


		/**
		 * Rent a book when the rentBook button is fired
		 */
		$scope.rentBook = function(id) {
			// $routeProvider.reload();
			BooksFactory.rent(id)
				.success(function(data) {
					$scope.hits = data; // assign our new list of todos
					$scope.formData = {};
				});
		};

		/**
		 * Display rented books when the rentedBooks partial view is displayed
		 */
		$scope.rentedBooks = function(id) {
			BooksFactory.rented(id)
				.success(function(data) {
					$scope.books = data; // assign our new list of todos
				});
		};


		


	}]);
