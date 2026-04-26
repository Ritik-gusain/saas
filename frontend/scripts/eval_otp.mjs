/**
 * NOTE: OTP evaluation via Supabase has been removed.
 * Firebase uses email/password auth by default.
 * 
 * For email verification with Firebase:
 * - After registration, call: sendEmailVerification(user)
 * - This sends a verification link (not OTP) to the user's email.
 * 
 * Firebase does NOT support email OTP natively in the free tier.
 * Use Firebase Phone Auth for OTP (requires phone number).
 * 
 * See: https://firebase.google.com/docs/auth/web/email-link-auth
 */

console.log('OTP via Supabase has been replaced with Firebase email/password auth.');
console.log('For email link auth, see: https://firebase.google.com/docs/auth/web/email-link-auth');
