import { expect } from 'chai';
import { startRequest } from '../test.utils';

const route = '/getFields';

describe( 'Test getFields/founder', () => {

  it( 'Should return all select fields for founder form', () => {

    return startRequest( route )
      .send( { type : 'founderForm' } )
      .expect( 200 )
      .expect( ( { body } ) => {
        const { sectors, yourSkills, searchedSkills } = body;
        expect( sectors ).to.be.a( 'array' );
        expect( sectors[ 0 ] ).to.be.a( 'string' );

        expect( yourSkills ).to.be.a( 'array' );
        expect( yourSkills[ 0 ] ).to.be.a( 'string' );

        expect( searchedSkills ).to.be.a( 'array' );
        expect( searchedSkills[ 0 ] ).to.be.a( 'string' );
      } );
  } );

  it( 'should test what are the rendered field', function () {
    return startRequest( "/formBuilder" )
      .send( { type : 'founderForm' } )

  } );

} );

