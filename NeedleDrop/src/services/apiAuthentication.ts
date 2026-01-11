import supabase from './supabase';

const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;

export const signInWithGoogle = async (): Promise<void> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: REDIRECT_URL,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return data?.user;
}

export const logout = async (): Promise<void>  => {
  const {error} = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}