import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { UserDocument, userSchema } from '../models/User';

var Airtable = require( 'airtable' );
var base = new Airtable( { apiKey : 'key8EKlpBqSNuNdUU' } ).base( 'appbotRNHtnfDI7o9' );

const User = mongoose.model<UserDocument>( 'User', userSchema );

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

  return res.redirect( '/' );
};

export const searchFounder = ( req: Request, res: Response, next: NextFunction ) => {

  const data: any[] = [];

  base( 'FOUNDERS' ).select().eachPage( function page( records, fetchNextPage ) {

    // This function (`page`) will get called for each page of records.

    records.forEach( function ( record ) {
      data.push( {
        name  : record.get( 'Describe yourself in a few words' ),
        email : record.get( 'email' )
      } );
    } );

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

    res.render( 'founderBrowse/coFounder', { cards : data } );

  }, function done( err ) {
    if ( err ) {
      console.error( err );
      return;
    }
  } );

};

export const getFields = async ( req: Request, res: Response, next: NextFunction ) => {
  const { type } = req.body;

  if ( type === 'founderForm' ) {
    try {
      const sectorsRecords = await base( 'SECTORS' ).select( { fields : [ 'Name' ] } ).all();
      const sectors = sectorsRecords.map( data => data.fields[ 'Name' ] );

      const yourSkillsRecords = await base( 'What are your skills?' ).select( { fields : [ 'Name' ] } ).all();
      const yourSkills = yourSkillsRecords.map( data => data.fields[ 'Name' ] );

      const searchedSkillsRecords = await base( 'What are your skills?' ).select( { fields : [ 'Name' ] } ).all();
      const searchedSkills = searchedSkillsRecords.map( data => data.fields[ 'Name' ] );

      res.json( { sectors, yourSkills, searchedSkills } );
    } catch ( e ) {
      res.json( [ { msg : e.toString() } ] );
    }
  }
};

export const formBuilder = async ( req: Request, res: Response, next: NextFunction ) => {
  const { type } = req.body;

  if ( type === 'founderForm' ) {
    try {
      const searchedSkillsRecords = await base( 'FOUNDERS' ).select().all();
      const searchedSkills = searchedSkillsRecords.map( data => data.fields );
      const res = searchedSkills.filter( ( { Name } ) => Name === 'first_line' );

      res.json( { searchedSkills } );
    } catch ( e ) {
      res.json( [ { msg : e.toString() } ] );
    }
  }
};
