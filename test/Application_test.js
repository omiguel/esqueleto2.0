'use strict';
/**
 * Created by udesc on 20/06/2016.
 */
const path = require('path');
const chai = require('chai');
const chaihttp = require('chai-http');

chai.use(chaihttp);

let should = chai.should();
let expect = chai.expect;

//const App = require('../aplicacao.js');

//let app = new App(path.join(__dirname,'/confing.json'));


describe('Teste da aplicacao', function () {
  before(function (done) {
    console.log('executei antes do teste');
    done();
  });


  it('meu primeiro teste', function (done) {

    var x = "texto";

    x.should.be.a('string');
    expect(x).to.be.equal('texto');


    chai.request('http://google.com')
      .get('/').end(function(req, res){

      expect(res).to.have.status(200); //hhttp.OK
      expect(res.text).to.have.string('button');

      done();
    });



  });







  after(function (done) {
    console.log('executei depois do teste');

    done();
  });
});



