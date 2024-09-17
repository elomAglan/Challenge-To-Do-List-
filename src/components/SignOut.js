// src/components/SignOut.js
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const SignOut = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur de déconnexion', error.message);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
    >
      Déconnexion
    </button>
  );
};

export default SignOut;
