// Sparql stuffs
var SparqlClient = require('sparql-client');
var util = require('util');


// Mongodb connector
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/maniak');

// load up the book model
var Book = require('./app/models/book');

// load up the user model
var User = require('./app/models/user');


// Query dbpedia for some books
var endpoint = 'http://dbpedia.org/sparql';

var query = "SELECT   ?title ?pages ?published ?genreName ?isbn ?resume  (SAMPLE(?authorName) AS ?authorName) WHERE {?book a dbpedia-owl:Book . ?book dbpedia-owl:abstract ?resume . ?book dbpedia-owl:isbn ?isbn . ?book dbpedia-owl:numberOfPages ?pages. ?book dbpprop:releaseDate ?published. ?book dbpedia-owl:literaryGenre ?genre . ?genre dbpprop:name ?genreName. ?book dbpprop:name ?title. ?book dbpedia-owl:author ?author. ?author dbpprop:name ?authorName filter(langMatches(lang(?resume),'en')) } group by ?title ?pages ?published ?genreName ?isbn ?resume ";

var client = new SparqlClient(endpoint);
	client.query(query)
	  .execute(function(error, results) {
	  	// console.log(results.results.bindings[i]);


	  	for (i in results.results.bindings)
		{

			 var newBook = new Book();
			 // console.log(results.results.bindings[i][i].title.value);
			 newBook.title = results.results.bindings[i].title.value;
		  	 newBook.isbn = results.results.bindings[i].isbn.value;
		  	 newBook.author = results.results.bindings[i].authorName.value;
		  	 newBook.published = results.results.bindings[i].published.value;
		  	 newBook.pages = results.results.bindings[i].pages.value;
		  	 newBook.nb_copy = Math.floor(Math.random() * 15) + 1;
		  	 newBook.resume = results.results.bindings[i].resume.value;
		  	 newBook.genre = results.results.bindings[i].genreName.value;


		  	 newBook.save(function(err) {
	                            if (err)
	                               console.log(err);
	         });
		}





		console.log("=========================================");
		console.log("==                DONE                 ==");
		console.log("=========================================");



	  	});


// Create an admin account
var newUser = new User()

newUser.name  = "Infomaniak";
newUser.email = "devs@infomaniak.ch";
newUser.password = "maniak";

newUser.save(
		function  (err) {
			if (err) {console.log(err);};
		}
	);

console.log("=========================================");
console.log("==           Admin Account             ==");
console.log("=========================================");
console.log("==      Email: devs@infomaniak.ch      ==");
console.log("==      password: maniak               ==");
console.log("=========================================");
