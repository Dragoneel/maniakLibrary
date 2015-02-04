// Assert
var request = require('superagent');
var chai = require("chai");
var expect = chai.expect;


describe('FrontOffice Route', function(){

  describe('.get(\'/\')', function(){

    it('Show the home view', function(){
      
       request.get('http://localhost:8080').end(function(res){
		    expect(res).to.exist;
		    expect(res.status).to.equal(200);
		    // done();
	     });
    })
  });

  describe('.get(\'/login\')', function(){

    it('Show the login view', function(){
      
       request.get('http://localhost:8080/login').end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        // done();
       });
    })
  });

  describe('.get(\'/signup\')', function(){

    it('Show the signup view', function(){
      
       request.get('http://localhost:8080/signup').end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        // done();
       });
    })
  });

  describe('.get(\'/partials/search\')', function(){

    it('Show the partial search view', function(){
      
       request.get('http://localhost:8080/profile#/').end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(200);
       });
    })
  });

  describe('.get(\'/partials/mybooks\')', function(){

    it('Show the partial search view', function(){
      
       request.get('http://localhost:8080/profile#/mybooks').end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(200);
       });
    })
  });

});


describe('BackOffice Route', function(){


  describe('.get(\'/partials/rentedBooks\')', function(){

    it('Show the partial rentedBooks view', function(){
      
       request.get('http://localhost:8080/admin#/').end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(200);
       });
    })
  });

  describe('.get(\'/partials/manageSearch\')', function(){

    it('Show the partial manageSearch view', function(){
      
       request.get('http://localhost:8080/admin#/manageSearch').end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(200);
       });
    })
  });

  describe('.get(\'/partials/rentedBooks\')', function(){

    it('Show the partial rentedBooks view', function(){
      
       request.get('http://localhost:8080/admin#/').end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(200);
       });
    })
    
  });

  describe('.get(\'/partials/manageSearch\')', function(){

    it('Show the partial manageSearch view', function(){
      
       request.get('http://localhost:8080/admin#/manageSearch').end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(200);
       });
    })

  });

  describe('.get(\'/partials/addBook\')', function(){

    it('Show the partial addBook view', function(){
      
       request.get('http://localhost:8080/admin#/addBook').end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(200);
       });
    })

  });

  describe('.get(\'/partials/manageUser\')', function(){

    it('Show the partial manageUser view', function(){
      
       request.get('http://localhost:8080/admin#/manageUser').end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(200);
       });
    })

  });

});