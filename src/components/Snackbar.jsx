import React, {useEffect, useRef} from 'react';
import {Animated, Text, StyleSheet, View} from 'react-native';

const Snackbar = ({visible, message, duration = 3000, onDismiss}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log(visible);
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss();
      });
    }
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, {opacity}]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: 'black',
  },
});

export default Snackbar;
