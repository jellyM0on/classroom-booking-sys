import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../configs/firebase";

// TODO: Replace placeholder home page

export default function Home() {
  const navigate = useNavigate();

  // TODO: Remove logs

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <main>
      <p>Hello</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </main>
  );
}
