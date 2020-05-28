import { User } from '../src/models/User';
import { startRequest } from './test.utils';


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
