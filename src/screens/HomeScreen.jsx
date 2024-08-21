import {Button, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFirebaseContext} from '../services/FirebaseContext';
import {usersCollection} from '../services/FirebaseConfig';
import {getDoc, doc} from 'firebase/firestore';
import {getStorage, ref, getDownloadURL} from 'firebase/storage';
import Snackbar from 'react-native-snackbar';
const HomeScreen = () => {
  const {user, logout} = useFirebaseContext();
  const defaultImage =
    'https://www.pngitem.com/pimgs/m/22-220721_circled-user-male-type-user-colorful-icon-png.png';
  const [imagePreviewUrl, setImagePreviewUrl] = useState(defaultImage);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to login screen or handle UI update
      Snackbar.show({
        text: 'Logout success',
        duration: Snackbar.LENGTH_SHORT,
        textColor: 'white',
        backgroundColor: 'green',
      });
    } catch (error) {
      Snackbar.show({
        text: `Logout failed: ${error.message}`,
        duration: Snackbar.LENGTH_SHORT,
        textColor: 'white',
        backgroundColor: 'red',
      });
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    if (!user?.profileUrl) {
      setImagePreviewUrl(defaultImage);
    } else {
      setImagePreviewUrl(user.profileUrl);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomeScreen</Text>
      {/* Profile Image Preview */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{uri: imagePreviewUrl}}
          style={styles.profileImage}
          onError={() => setImagePreviewUrl(defaultImage)}
        />
      </View>
      <View>
        <Text style={styles.welcomeText}>Welcome, {user?.email}</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  welcomeText: {
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 16,
  },
});
