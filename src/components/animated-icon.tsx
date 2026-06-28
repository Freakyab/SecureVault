import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";

const INITIAL_SCALE_FACTOR = Dimensions.get("screen").height / 90;
const DURATION = 600;
const SPLASH_DURATION = 1200;

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(INITIAL_SCALE_FACTOR)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: SPLASH_DURATION,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(SPLASH_DURATION * 0.4),
        Animated.timing(opacity, {
          toValue: 0,
          duration: SPLASH_DURATION * 0.6,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setVisible(false);
    });
  }, [opacity, scale]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.backgroundSolidColor,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

export function AnimatedIcon() {
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(INITIAL_SCALE_FACTOR)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(1.3)).current;

  useEffect(() => {
    // Continuous rotation for the glow
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Entry scale for background
    Animated.timing(scale, {
      toValue: 1,
      duration: DURATION,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }).start();

    // Entry animation for logo
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: DURATION,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '7200deg'],
  });

  return (
    <View style={styles.iconContainer}>
      <Animated.View
        style={[
          styles.glow,
          {
            transform: [{ rotateZ: rotateInterpolate }],
          },
        ]}>
        <Image
          style={styles.glow}
          source={require("@/assets/images/logo-glow.png")}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.background,
          {
            transform: [{ scale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}>
        <Image
          style={styles.image}
          source={require("@/assets/images/expo-logo.png")}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  glow: {
    width: 201,
    height: 201,
    position: "absolute",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 128,
    height: 128,
    zIndex: 100,
  },
  image: {
    position: "absolute",
    width: 76,
    height: 71,
  },
  background: {
    borderRadius: 40,
    backgroundColor: "#208AEF",
    width: 128,
    height: 128,
    position: "absolute",
  },
  backgroundSolidColor: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: "#208AEF",
    zIndex: 1000,
  },
});
