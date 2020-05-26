import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/User';

describe( 'Test sign Up', () => {

  beforeAll( cb => {
    console.log( 'bite' );
    cb();
  } );

  const startRequest = () =>
    request( app )
      .post( '/signUp' )
      .expect( 'Content-Type', /json/ );

  it( 'should return all error inscription', () => {
    const result = [
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
    ];
    return startRequest()
      .expect( 401, result );
  } );

  it( 'should respond bad email', () => {
    const body = {
      password        : 'aoeuaoeu',
      confirmPassword : 'aoeuaoeu',
      email           : 'aoeu.rrh'
    };

    const response = [
      {
        value    : 'aoeu.rrh',
        msg      : 'Email is not valid',
        param    : 'email',
        location : 'body'
      }
    ];

    return startRequest()
      .send( body )
      .expect( 401, response );
  } );

  it( 'should respond bad password', function () {
    const body = {
      password        : 'aoeuaoeu',
      confirmPassword : 'aoeuaoe',
      email           : 'super@gmail.com'
    };

    const response = [
      {
        value    : 'aoeuaoe',
        msg      : 'Passwords do not match',
        param    : 'confirmPassword',
        location : 'body'
      }
    ];
    return startRequest()
      .send( body )
      .expect( 401, response );
  } );

  it( 'should do the inscription', function () {

    // this code do not run in async version...
    User.deleteOne( { email : 'supertoto@gmail.com' },
      err => console.log( err ) );

    const body = {
      password        : 'supertoto',
      confirmPassword : 'supertoto',
      email           : 'supertoto@gmail.com'
    };

    const response = [ { msg : 'User Logged' } ];

    return startRequest()
      .send( body )
      .expect( 200, response )
      .then( response => console.log( response.header ) );
  } );

  it( 'should say user exits', function () {

    const body = {
      password        : 'supertoto',
      confirmPassword : 'supertoto',
      email           : 'supertoto@gmail.com'
    };

    const response = [ { msg : 'User exist' } ];

    return startRequest()
      .send( body )
      .expect( 401, response );
  } );
} );
