var searchService = angular.module('searchService', []);

	// super simple service
	// each function returns a promise object 
	searchService.factory('BooksFactory', ['$http',function($http) {
		return {
			search : function(bookData) {
				return $http.post('/search/books', bookData);
			},
			rent : function(bookId) {
				return $http.delete('/rent/book/'+bookId);
			},
			rendre : function(bookId) {
				return $http.delete('/rendre/book/'+bookId);
			},
			rented : function(userId){
				return $http.delete('/rented/book/'+userId);
			}
		}
	}]);