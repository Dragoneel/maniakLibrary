
var searchController = angular.module('searchController',['ngRoute','angoose.client']);

	searchController.config(function($routeProvider,$locationProvider) {
		// $locationProvider.html5Mode(true);
	  $routeProvider
	    .when('/', { templateUrl: 'partials/search', controller: 'mainController' })
	    .when('/mybooks', { templateUrl: 'partials/mybooks', controller: 'profileController'})
	    .otherwise({redirectTo:'/'});
	});


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


		// RENDRE ==================================================================
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


	searchController.controller('mainController', ['$scope','$http','BooksFactory', function($scope, $http, BooksFactory,$routeProvider) {

		

		$scope.formData = {};

		// 


		// FIND BOOKS ==================================================================
		$scope.searchBooks = function() {

			if ($scope.formData.text != undefined) {

				BooksFactory.search($scope.formData)

				.success(function(data) {
						// $scope.formData = {}; // clear the form 
						$scope.hits = data;
				});

			}
		};


		// RENT ==================================================================
		$scope.rentBook = function(id) {
			// $routeProvider.reload();
			BooksFactory.rent(id)
				.success(function(data) {
					$scope.hits = data; // assign our new list of todos
					$scope.formData = {};
				});
		};

		// Get rented books
		$scope.rentedBooks = function(id) {
			BooksFactory.rented(id)
				.success(function(data) {
					$scope.books = data; // assign our new list of todos
				});
		};


		


	}]);
