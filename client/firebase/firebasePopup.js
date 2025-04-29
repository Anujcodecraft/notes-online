import { getAuth, signInWithPopup, GoogleAuthProvider, getRedirectResult, signInWithRedirect } from "firebase/auth";
import { app } from "./firebaseConfig";

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const authenticationPopup = async() => {
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken;
        // console.log("authentic with popup ", result, credential, token)
        return token;
    } catch (error) {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // // The email of the user's account used.
        // const email = error.customData.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(error);
    }
}

export const getGoogleToken = async () => {
    const user = auth.currentUser; 
    if (user) {
        try {
            const token = await user.getIdToken(true);
            return token; 
        } catch (error) {
            console.error("Error retrieving ID token:", error);
            return null;
        }
    }
    return null; 
};

export const authenticationRedirect = async () => {
    try {
      await signInWithRedirect(auth, provider); 
    } catch (error) {
      console.error("Error during sign-in redirect:", error);
    }
  };

export const handleRedirectResult = async() => {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
    
          const user = result.user;
    
          // console.log("User signed in:", user);
          // console.log("Access Token:", token);
        } 
      } catch (error) {
        console.error("Error during redirect result:", error);
        const errorCode = error.code;
        const errorMessage = error.message;
    
        const email = error.customData?.email;
    
        const credential = GoogleAuthProvider.credentialFromError(error);
    
        console.error("Error details:", { errorCode, errorMessage, email, credential });
      }
}