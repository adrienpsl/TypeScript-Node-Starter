import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/User';

const startRequest = ( url ) =>
  request( app )
    .post( url )
    .expect( 'Content-Type', /json/ );

describe( 'Test sign Up', () => {

  it( 'should return all error inscription', () => {
    const result = {
      errors : [
        {
          msg      : 'Email is not valid',
          param    : 'email',
          location : 'body'
        },
        {
          msg      : 'Password must be at least 4 characters long',
          param    : 'password',
          location : 'body'
        },
        {
          msg      : 'Passwords do not match',
          param    : 'confirmPassword',
          location : 'body'
        }
      ]
    };
    return startRequest( '/signUp' )
      .expect( 401, result );
  } );

  it( 'should respond bad email', () => {
    const body = {
      password        : 'aoeuaoeu',
      confirmPassword : 'aoeuaoeu',
      email           : 'aoeu.rrh'
    };

    const response = {
      errors : [
        {
          value    : 'aoeu.rrh',
          msg      : 'Email is not valid',
          param    : 'email',
          location : 'body'
        }
      ]
    };

    return startRequest( '/signUp' )
      .send( body )
      .expect( 401, response );
  } );

  it( 'should respond bad password', function () {
    const body = {
      password        : 'aoeuaoeu',
      confirmPassword : 'aoeuaoe',
      email           : 'super@gmail.com'
    };

    const response = {
      errors : [
        {
          value    : 'aoeuaoe',
          msg      : 'Passwords do not match',
          param    : 'confirmPassword',
          location : 'body'
        }
      ]
    };
    return startRequest( '/signUp' )
      .send( body )
      .expect( 401, response );
  } );

  it( 'should do the inscription', function () {

    // this code do not run in async version...
    User.deleteOne( { email : 'supertoto@gmail.com' }, () => {} );

    const body = {
      password        : 'supertoto',
      confirmPassword : 'supertoto',
      email           : 'supertoto@gmail.com'
    };

    return startRequest( '/signUp' )
      .send( body )
      .expect( 200 )
      .expect( ( { body } ) => {
        const { data } = body;
        expect( data ).to.haveOwnProperty( 'msg' );
        expect( data.token ).to.be.a( 'string' );
        expect( data.token.length ).to.equal( 141 );
      } );

  } );

  it( 'should say user exits', function () {

    const body = {
      password        : 'supertoto',
      confirmPassword : 'supertoto',
      email           : 'supertoto@gmail.com'
    };

    const response = { errors : [ { msg : 'User exist' } ] };

    return startRequest( '/signUp' )
      .send( body )
      .expect( 401, response );
  } );
} );

describe( 'POST /login', () => {
  const route = '/login';

  beforeAll( cb => {

    User.create( {
          email    : 'supertoto@gmail.com',
          password : 'aoeui'
        } )
        .then( () => cb() )
        .catch( () => cb() );
  } );

  // expect( res.error ).not.to.be.undefined;
  it( 'should say there is not enough param', () => {
    const responseJson = [
      {
        msg      : 'Email is not valid',
        param    : 'email',
        location : 'body'
      },
      {
        msg      : 'Password cannot be blank',
        param    : 'password',
        location : 'body'
      } ];
    return startRequest( route )
      .send( {} )
      .expect( 401, responseJson );
  } );

  it( 'should logging', () => {
    const responseJson = [ { msg : 'User logged' } ];

    return startRequest( route )
      .send( { email : 'supertoto@gmail.com', password : 'aoeui' } )
      .expect( 200, responseJson );
  } );
} );

describe( 'POST /42auth', () => {
  const route = '/auth';

  it( 'should say there is not enough param', () => {
    const responseJson = [
      {
        msg      : 'Email is not valid',
        param    : 'email',
        location : 'body'
      },
      {
        msg      : 'Password cannot be blank',
        param    : 'password',
        location : 'body'
      } ];
    return startRequest( route )
      .send( {} )
      .expect( 401, responseJson );
  } );

  it( 'should logging', () => {
    const responseJson = [ { msg : 'User logged' } ];

    return startRequest( route )
      .send( { email : 'supertoto@gmail.com', password : 'aoeui' } )
      .expect( 200, responseJson );
  } );
} );
