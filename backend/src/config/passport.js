import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

/**
 * Passport Configuration - Google OAuth 2.0
 * Configuración de estrategia de autenticación con Google
 */

/**
 * Configurar estrategia de Google OAuth 2.0
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('📧 Google OAuth - Perfil recibido:', {
          id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        });

        // Buscar usuario existente por googleId o email
        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value.toLowerCase() },
          ],
        });

        if (user) {
          // Usuario ya existe

          // Si existe pero no tiene googleId, actualizarlo
          if (!user.googleId) {
            user.googleId = profile.id;
            user.authProvider = 'google';

            // Si no tiene foto de perfil, agregar la de Google
            if (!user.profileImage && profile.photos && profile.photos.length > 0) {
              user.profileImage = profile.photos[0].value;
            }

            await user.save();
            console.log('✅ Usuario existente actualizado con Google ID');
          }

          return done(null, user);
        }

        // Usuario no existe - Crear nuevo usuario con datos de Google
        const newUser = await User.create({
          fullName: profile.displayName,
          preferredName: profile.name.givenName || profile.displayName.split(' ')[0],
          email: profile.emails[0].value.toLowerCase(),
          googleId: profile.id,
          authProvider: 'google',
          profileImage: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
          isVerified: true, // Email ya verificado por Google
          // phone, birthday, city se pedirán después en modal
        });

        console.log('✅ Nuevo usuario creado con Google OAuth:', newUser.email);

        return done(null, newUser);
      } catch (error) {
        console.error('❌ Error en Google OAuth strategy:', error);
        return done(error, null);
      }
    }
  )
);

/**
 * Serializar usuario para la sesión
 * (Guardar solo el ID en la sesión)
 */
passport.serializeUser((user, done) => {
  done(null, user._id);
});

/**
 * Deserializar usuario desde la sesión
 * (Recuperar usuario completo desde el ID)
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
