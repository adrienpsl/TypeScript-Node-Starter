import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { UserDocument, userSchema } from '../models/User';

//
//

export const founderForm = ( req: Request, res: Response ) => {
  res.render( 'airtableForm/founderForm', {
    title : 'Founder form'
  } );
};

export const startupForm = ( req: Request, res: Response ) => {
  res.render( 'airtableForm/startupForm', {
    title : 'Founder form'
  } );
};

// valide formerForm
export const formDirection = ( req: Request, res: Response, next: NextFunction ) => {
  const user = req.user as UserDocument;
  User.findById( user.id, ( err, user: UserDocument ) => {
    if ( err ) {return next;}
    user.founderForm = true;

    // todo do that better

    user.save().then();
  } );

  res.render( 'airtableForm/formDirection', {
    title : 'What are you looking for'
  } );
};

export const formValidateStartup = ( req: Request, res: Response, next: NextFunction ) => {
  const user = req.user as UserDocument;
  User.findById( user.id, ( err, user: UserDocument ) => {
    if ( err ) {return next;}
    user.startupForm = true;

    // todo do that better

    user.save().then();
  } );

  return res.redirect("/")

};

export const User = mongoose.model<UserDocument>( 'User', userSchema );
