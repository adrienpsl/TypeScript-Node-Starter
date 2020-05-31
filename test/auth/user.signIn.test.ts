import { expect } from 'chai';
import { User } from '../../src/models/User';
import { startRequest } from '../test.utils';

const route = '/login';

describe( 'Test sign In', () => {

  beforeAll( cb => {
    User.create( {
          email    : 'bitebite@gmail.com',
          password : 'bitebite'
        } )
        .then( ( res ) => {
          console.log( 'create res', res );
          cb();
        } )
        .catch( ( err ) => {
          console.log( 'create err', err );
          cb();
        } );
  } );

  it( 'Should ask for more parameter', () => {
    const responseJson = {
      errors : [
        {
          msg      : 'Email is not valid',
          param    : 'email',
          location : 'body'
        },
        {
          msg      : 'Password cannot be blank',
          param    : 'password',
          location : 'body'
        } ]
    };

    return startRequest( route )
      .send( {} )
      .expect( 401, responseJson );
  } );

  it( 'should logging', () => {

    return startRequest( route )
      .send( { email : 'bitebite@gmail.com', password : 'bitebite' } )
      .expect( 200 )
      .expect( ( { body } ) => {
        const { data } = body;
        expect( data ).to.haveOwnProperty( 'msg' );
        expect( data.token ).to.be.a( 'string' );
        expect( data.token.length ).to.equal( 140 );
      } );
  } );
} );

describe( 'Test if I can auth with the token', function () {
  let token;

  beforeAll( cb => {
    return startRequest( route )
      .send( { email : 'bitebite@gmail.com', password : 'bitebite' } )
      .end( ( err, res ) => {
        token = res.body.data.token;
        cb();
      } );
  } );

  it( 'should be auth', function () {
    return startRequest( '/isLogged' )
      .send( { auth_token : token } )
      .expect( 200 );
  } );

  it( 'should not be auth', function () {
    return startRequest( '/isLogged' )
      .send( { auth_token : token + 'a' } )
      .expect( 401 );
  } );

} );