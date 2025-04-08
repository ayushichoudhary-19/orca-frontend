export const getFirebaseAuthErrorMessage = (code: string): string => {
    switch (code) {
        case "auth/user-not-found":
            return "No user found with this email address.";
          case "auth/invalid-credential":
            return "Invalid credentials. Please verify your email and password.";
          case "auth/wrong-password":
            return "Incorrect password. Please try again.";
          case "auth/email-already-in-use":
            return "This email is already registered. Please sign in or use a different email.";
          case "auth/weak-password":
            return "Password is too weak. Please use a stronger password.";
          case "auth/invalid-email":
            return "Invalid email address. Please check and try again.";
          case "auth/network-request-failed":
            return "Network error. Please check your internet connection and try again.";
          case "auth/too-many-requests":
            return "Too many unsuccessful attempts. Please try again later.";
          case "auth/popup-closed-by-user":
            return "Google sign-in was cancelled. Please try again.";
          default:
            return "An unexpected error occurred. Please try again.";
    }
  };
  