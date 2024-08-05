"use client";
import React, { useEffect, useRef } from "react";
import { auth } from "@/firebase";
import * as firebaseui from "firebaseui";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import "firebaseui/dist/firebaseui.css";

const FirebaseAuth = () => {
  const uiRef = useRef(null);

  useEffect(() => {
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    const uiConfig = {
      signInSuccessUrl: "/",
      signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        {
            provider : EmailAuthProvider.PROVIDER_ID,
            signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
            requireDisplayName: false
        }
      ],
      signInFlow: 'popup',
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          console.log("Sign in successful with result: ", authResult);
          return true;
        },
        uiShown: () => {
          console.log("FirebaseUI shown");
        },
      },
    };

    ui.start(uiRef.current, uiConfig);

    return () => ui.reset();
  }, []);

  return <div ref={uiRef} id="firebaseui-auth-container"></div>;
};

export default FirebaseAuth;
