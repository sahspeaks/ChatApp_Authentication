import {View, Text} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Loading from '../components/Loading';
import {FirebaseContext} from '../services/FirebaseContext';

// Routes
import {AppStack} from './AppStack';
import {AuthStack} from './AuthStack';

export const Router = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {isLoggedIn, user, getCurrentUser, setIsLoggedIn} =
    useContext(FirebaseContext);

  useEffect(() => {
    // Check if the user state has been initialized
    getCurrentUser()
      .then(user => {
        setIsLoading(false);
        if (user) {
          setIsLoggedIn(true);
        }
      })
      .catch(error => {
        console.error('Error getting current user:', error);
        setIsLoggedIn(false);
        setIsLoading(false);
      });
  }, [user, setIsLoggedIn]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
