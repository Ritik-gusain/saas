import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://lbinyquyfxdfcckcyskl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiaW55cXV5ZnhkZmNja2N5c2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTEyMDAsImV4cCI6MjA5MTY2NzIwMH0.htb_yJJtFXq-L8fdkjbpX8_sRrXPpwoIhKMExmLRYlw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const email = 'test_verify_' + Date.now() + '@gmail.com';
  console.log('Signing up:', email);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password: 'Password123!' });
  console.log('Signup session exists:', !!signUpData?.session);
  
  console.log('Attempting login immediately...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password: 'Password123!' });
  if (loginError) console.error('Login Error:', loginError.message);
  else console.log('Login success');
}
test();
