import React, {createContext, useContext, useEffect, useState} from 'react';
import {auth, firestore, usersCollection} from './FirebaseConfig';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {doc, getDoc, setDoc} from 'firebase/firestore';

export const FirebaseContext = createContext();

export const FirebaseContextProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        setUserData(user.uid);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });
    return unsubscribe;
  }, [setIsLoggedIn]);

  const setUserData = async userId => {
    try {
      const userDocRef = doc(usersCollection, userId);
      // console.log('userDocRef', userDocRef);
      const userDocSnap = await getDoc(userDocRef);
      // console.log('userDocSnap.exists()', userDocSnap);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        // console.log('userData', userData);
        setUser({
          ...user,
          name: userData.name,
          email: userData.email,
          userId: userData.userId,
          profileUrl: userData.profileUrl,
        });
        console.log('user', user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setImagePreviewUrl(defaultImage);
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // setUser(userCredential?.user);
      setIsLoggedIn(true);
      return {success: true, data: userCredential?.user};
    } catch (error) {
      let msg = error.message;
      if (msg.includes(' (auth/invalid-email)')) msg = 'Invalid email';
      if (msg.includes(' (auth/invalid-credential)'))
        msg = 'Invalid Credentials';
      return {success: false, msg};
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsLoggedIn(false);
      return {success: true, msgg: 'Logged out successfully'};
    } catch (error) {
      return {success: false, msg: error.message};
    }
  };

  const register = async (email, password, name, profileUrl) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Add user data to Firestore
      await setDoc(doc(usersCollection, userCredential?.user?.uid), {
        userId: userCredential.user.uid,
        name,
        email,
        profileUrl,
      });
      console.log('User data added to Firestore', userCredential.user.uid);
      // setUser(userCredential?.user);
      setIsLoggedIn(true);
      return {success: true, data: userCredential?.user};
    } catch (error) {
      let msg = error.message;
      if (msg.includes(' (auth/invalid-email)')) msg = 'Invalid email';
      if (msg.includes('(auth/email-already-in-use)'))
        msg = 'User already exists';
      if (msg.includes('(auth/weak-password)')) msg = 'Password too weak';
      return {success: false, msg};
    }
  };

  const getCurrentUser = async () => {
    return auth.currentUser;
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        isLoggedIn,
        setIsLoggedIn,
        login,
        logout,
        register,
        getCurrentUser,
      }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error(
      'useFirebaseContext must be used within a FirebaseContextProvider',
    );
  }
  return context;
};

export default FirebaseContextProvider;
