import { supabase } from './supabase';

export async function signUpUser({
  email,
  password,
  username,
  firstName,
  lastName,
  phone,
  institute
}: {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  institute: string;
}) {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password
  });

  if (signUpError) {
    console.error("🚫 Signup failed:", signUpError.message);
    return { success: false, error: signUpError.message };
  }

  const userId = signUpData?.user?.id;

  if (!userId) {
    return { success: false, error: "User ID missing after signup" };
  }

  const { error: insertError } = await supabase.from('users').insert([
    {
      id: userId,
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      institute
    }
  ]);

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  return { success: true, userId };
}
