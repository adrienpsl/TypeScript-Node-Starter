import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import passportFacebook from 'passport-facebook';
import passportJwt from 'passport-jwt';
//import { ExtractJWT, JwtStrategy } from 'passport-jwt';
import passportLocal from 'passport-local';
// import passportOAuth                    from "passport-oauth"
// import { User, UserType } from '../models/User';
import { User } from '../models/User';
import { CLIENT_ID, CLIENT_SECRET } from '../util/secrets';

const OAuth2Strategy = require( 'passport-oauth' ).OAuth2Strategy;

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

passport.serializeUser<any, any>( ( user, done ) => {
  done( undefined, user.id );
} );

passport.deserializeUser( ( id, done ) => {
  User.findById( id, ( err, user ) => {
    done( err, user );
  } );
} );

/**
 * Sign in using Email and Password.
 */
passport.use( 'local', new LocalStrategy( { usernameField : 'email', session : false }, ( email, password, done ) => {
  User.findOne( { email : email.toLowerCase() }, ( err, user: any ) => {
    if ( err ) { return done( err ); }
    if ( !user ) {
      return done( undefined, false, { message : `Email ${ email } not found.` } );
    }
    user.comparePassword( password, ( err: Error, isMatch: boolean ) => {
      if ( err ) { return done( err ); }
      if ( isMatch ) {
        return done( undefined, user );
      }
      return done( undefined, false, { message : 'Invalid email or password.' } );
    } );
  } );
} ) );

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use( 'jwt', new JwtStrategy( {
  jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey    : 'secret'
}, function ( jwt_payload, done ) {
  console.log( 'payload ', jwt_payload );
  User.findOne( { email : jwt_payload.sub }, function ( err, user ) {
    if ( err ) {
      return done( err, false );
    }
    if ( user ) {
      return done( null, user );
    } else {
      return done( null, false );
      // or you could create a new account
    }
  } );
} ) );

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with 42.
 */
passport.use( '42OAuth', new OAuth2Strategy( {
    clientID         : CLIENT_ID,
    clientSecret     : CLIENT_SECRET,
    callbackURL      : 'http://localhost:3000/42auth',
    authorizationURL : 'https://api.intra.42.fr/oauth/authorize',
    tokenURL         : 'https://api.intra.42.fr/oauth/token'
  },
  async function ( accessToken, refreshToken, profile, done ) {

    try {
      const getMe = await axios( {
        url     : 'https://api.intra.42.fr/v2/me',
        method  : 'GET',
        headers : { Authorization : `Bearer ${ accessToken }` }
      } );

      User.findOne( { email : getMe.data.email.toLowerCase() },
        async ( err, existingUser ) => {
          if ( err ) {return done( err );}

          if ( existingUser ) {
            return done( undefined, existingUser );
          }
          const newUser = new User( {
            email  : getMe.data.email,
            tokens : [ { kind : '42OAuth', accessToken : accessToken } ]
          } );

          await newUser.save( ( err ) => {
            if ( err ) {
              return done( err );
            }
            done( err, newUser );
            // req.login(newUser)
          } );
        } );
      // search if there is user with that:

      // search if that user is :

    } catch ( e ) {

    }

    // done();
  } ) );

///**
// * Sign in with Facebook.
// */
//passport.use( new FacebookStrategy( {
//  clientID          : process.env.FACEBOOK_ID,
//  clientSecret      : process.env.FACEBOOK_SECRET,
//  callbackURL       : '/auth/facebook/callback',
//  profileFields     : [ 'name', 'email', 'link', 'locale', 'timezone' ],
//  passReqToCallback : true
//}, ( req: any, accessToken, refreshToken, profile, done ) => {
//  if ( req.user ) {
//    User.findOne( { facebook : profile.id }, ( err, existingUser ) => {
//      if ( err ) { return done( err ); }
//      if ( existingUser ) {
//        req.flash( 'errors',
//          { msg : 'There is already a Facebook account that belongs to you. Sign in with that account or delete it,
// then link it with your current account.' } ); done( err ); } else { User.findById( req.user.id, ( err, user: any )
// => { if ( err ) { return done( err ); } user.facebook = profile.id; user.tokens.push( { kind : 'facebook',
// accessToken } ); user.profile.name = user.profile.name || `${ profile.name.givenName } ${ profile.name.familyName
// }`; user.profile.gender = user.profile.gender || profile._json.gender; user.profile.picture = user.profile.picture
// || `https://graph.facebook.com/${ profile.id }/picture?type=large`; user.save( ( err: Error ) => { req.flash(
// 'info', { msg : 'Facebook account has been linked.' } ); done( err, user ); } ); } ); } } ); } else { User.findOne(
// { facebook : profile.id }, ( err, existingUser ) => { if ( err ) { return done( err ); } if ( existingUser ) {
// return done( undefined, existingUser ); } User.findOne( { email : profile._json.email }, ( err, existingEmailUser )
// => { if ( err ) { return done( err ); } if ( existingEmailUser ) { req.flash( 'errors', { msg : 'There is already an
// account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.'
// } ); done( err ); } else { const user: any = new User(); user.email = profile._json.email; user.facebook =
// profile.id; user.tokens.push( { kind : 'facebook', accessToken } ); user.profile.name = `${ profile.name.givenName }
// ${ profile.name.familyName }`; user.profile.gender = profile._json.gender; user.profile.picture =
// `https://graph.facebook.com/${ profile.id }/picture?type=large`; user.profile.location = ( profile._json.location )
// ? profile._json.location.name : ''; user.save( ( err: Error ) => { done( err, user ); } ); } } ); } ); } } ) );

/**
 * Login Required middleware.
 */
export const isAuthenticated = ( req: Request, res: Response, next: NextFunction ) => {

  passport.authenticate( 'jwt', { session : false }, function ( err, user, info ) {
    console.log(req.body)
    console.log( { info, user } );
    if ( err ) {
      console.log( 'error' );
      next();
    }
    next()
  } )( req, res, next );

  //if ( req.isAuthenticated() ) {
  //  return next();
  //}
  //res.redirect( '/login' );
};

/**
 * Authorization Required middleware.
 */
export const isAuthorized = ( req: Request, res: Response, next: NextFunction ) => {
  //const provider = req.path.split( '/' ).slice( -1 )[ 0 ];
  //
  //const user = req.user as UserDocument;
  //if ( _.find( user.tokens, { kind : provider } ) ) {
  //  next();
  //} else {
  //  res.redirect( `/auth/${ provider }` );
  //}
  next();
};
