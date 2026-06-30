import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";
import AnimatedReanimated, {
  Keyframe,
  Easing as ReanimatedEasing,
} from "react-native-reanimated";

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

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: INITIAL_SCALE_FACTOR }],
  },
  100: {
    transform: [{ scale: 1 }],
    easing: ReanimatedEasing.elastic(0.7),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
  },
  40: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
    easing: ReanimatedEasing.elastic(0.7),
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: ReanimatedEasing.elastic(0.7),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: "0deg" }],
  },
  100: {
    transform: [{ rotateZ: "7200deg" }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <AnimatedReanimated.View
        entering={glowKeyframe.duration(60 * 1000 * 4)}
        style={styles.glow}>
        <Image
          style={styles.glow}
          source={require("@/assets/images/logo-glow.png")}
        />
      </AnimatedReanimated.View>

      <AnimatedReanimated.View
        entering={keyframe.duration(DURATION)}
        style={styles.background}
      />
      <AnimatedReanimated.View
        style={styles.imageContainer}
        entering={logoKeyframe.duration(DURATION)}>
        <Image
          style={styles.image}
          source={require("@/assets/images/expo-logo.png")}
        />
      </AnimatedReanimated.View>
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
