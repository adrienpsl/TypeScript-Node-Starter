import request from 'supertest';
import app from '../src/app';

export const startRequest = ( url ) =>
  request( app )
    .post( url )
    .expect( 'Content-Type', /json/ );

