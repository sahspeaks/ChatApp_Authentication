import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

const Loading = () => {
  return (
    <View style={styles.container}>
      <View style={styles.glassBackground}>
        <View style={styles.glassInner}>
          <ActivityIndicator size="large" color="#667BC6" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  glassInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Loading;
