import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export const index = ( req: Request, res: Response ) => {
  const { user } = req;

  //@ts-ignore
  if ( !user.founderForm ) {
    return res.redirect( "/founderForm" );
  }

  res.render( "founderBrowse/start", {
    title : "Home"
  } );
};

/**
 * GET /
 * Home page.
 */
export const test = ( req: Request, res: Response ) => {
  console.log( req.params );
  res.render( "airtableForm/founderForm", {
    title : "Home"
  } );
};
