import { onIdTokenChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../configs/firebase";

export const useAuthToken = (setLoading) => {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("token") || null
  );

  // TODO: Remove logs
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      try {
        if (user) {
          const newToken = await user.getIdToken();
          sessionStorage.setItem("token", newToken);
          console.log(newToken);
          setToken(newToken);
        } else {
          sessionStorage.removeItem("token");
          setToken(null);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        sessionStorage.removeItem("token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setLoading]);

  return token;
};
