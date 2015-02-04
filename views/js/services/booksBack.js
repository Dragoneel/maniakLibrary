var searchService = angular.module('backService', []);

	// super simple service
	// each function returns a promise object 
	searchService.factory('AdminFactory', ['$http',function($http) {
		return {
			search : function(bookData) {
				return $http.post('/manage/books', bookData);
			},
			deleted : function(bookId) {
				return $http.delete('/delete/book/'+bookId);
			},
			modify : function(bookId) {
				return $http.delete('/modify/book/'+bookId);
			},
			searchUsers : function(bookData) {
				return $http.post('/search/users', bookData);
			}
			
		}

	}]);