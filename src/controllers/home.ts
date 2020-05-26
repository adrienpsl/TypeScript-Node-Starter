import { Request, Response } from 'express';

/**
 * GET /
 * Home page.
 */
export const index = ( req: Request, res: Response ) => {
  const { user } = req;

  //if ( !user ) {
  //  return res.redirect( '/login' );
  //}

  //res.render( 'founderBrowse/start', {
  //  title : 'What do you whant'
  //} );

  res.send( 'bite' );
};

/**
 * GET /
 * Home page.
 */
export const test = ( req: Request, res: Response ) => {
  console.log( req.params );
  res.render( 'airtableForm/founderForm', {
    title : 'Home'
  } );
};

