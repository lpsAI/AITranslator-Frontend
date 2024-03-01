import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../SupabaseClient";

const AuthContext = createContext({

});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
          setUser(session ? session?.user : null);
          localStorage.setItem('user', session ? JSON.stringify(session?.user) : null);
          setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session ? session?.user : null);
        localStorage.setItem('user', session ? JSON.stringify(session?.user) : null);
        setLoading(false)
      })

   

      return () => {
        subscription.unsubscribe();
      }
  }, [])

  const authValues = useMemo(() => ({
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    user,
  }), [user])

  return <AuthContext.Provider value={authValues}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}