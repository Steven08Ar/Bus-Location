import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useAuth } from "../context/AuthContext";

type Props = {
  navigation: NavigationProp<any>;
};

// Animation constants
const ANIMATION_DURATION = 700;
const ANIMATION_EASING = Easing.out(Easing.cubic);

export default function Welcome({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAds, setShowAds] = useState(true);
  const [adIndex, setAdIndex] = useState(0);
  const { loginUser } = useAuth();

  // Animation values
  const topCardTranslateX = useSharedValue(0);
  const topCardOpacity = useSharedValue(1);
  const topCardRotation = useSharedValue(-4);
  const topCardScale = useSharedValue(1);

  const bottomCardTranslateY = useSharedValue(0);
  const bottomCardOpacity = useSharedValue(1);
  const bottomCardRotation = useSharedValue(2.5);

  const backgroundTranslateY = useSharedValue(0);

  const ads = [
    {
      title: "Track your bus",
      subtitle: "Real-time locations at your fingertips.",
    },
    {
      title: "Plan your ride",
      subtitle: "Save favorite routes for quick access.",
    },
    {
      title: "Stay informed",
      subtitle: "Get alerts for delays and schedule changes.",
    },
  ];

  useEffect(() => {
    if (!showAds) return;
    const ticker = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % ads.length);
    }, 3000);
    return () => clearInterval(ticker);
  }, [ads.length, showAds]);

  // Entrance animation on mount
  useEffect(() => {
    topCardTranslateX.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    topCardOpacity.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    topCardRotation.value = withTiming(-4, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    topCardScale.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    bottomCardTranslateY.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    bottomCardOpacity.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    bottomCardRotation.value = withTiming(2.5, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    backgroundTranslateY.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await loginUser(email, password);
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    // Exit animation
    topCardTranslateX.value = withTiming(-100, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    topCardOpacity.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    topCardRotation.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    bottomCardTranslateY.value = withTiming(10, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    bottomCardOpacity.value = withTiming(0.3, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    bottomCardRotation.value = withTiming(-2.5, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    backgroundTranslateY.value = withTiming(-20, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });

    setTimeout(() => {
      navigation.navigate("UserRegister");
    }, 100);
  };

  // Animated styles
  const topCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: topCardTranslateX.value },
      { rotate: `${topCardRotation.value}deg` },
      { scale: topCardScale.value },
    ],
    opacity: topCardOpacity.value,
  }));

  const bottomCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bottomCardTranslateY.value },
      { rotate: `${bottomCardRotation.value}deg` },
    ],
    opacity: bottomCardOpacity.value,
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: backgroundTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroWrapper}>
          {/* Animated background circle */}
          <Animated.View style={[styles.bigCircle, backgroundAnimatedStyle]} />

          {/* Animated top card */}
          <Animated.View style={[styles.topCard, topCardAnimatedStyle]}>
            {showAds ? (
              <View style={styles.adContainer}>
                <Text style={styles.adTitle}>{ads[adIndex].title}</Text>
                <Text style={styles.adSubtitle}>{ads[adIndex].subtitle}</Text>
              </View>
            ) : (
              <>
                <View style={styles.logoCircle}>
                  <Feather name="bus" size={40} color="#03045E" />
                </View>
                <Text style={styles.title}>Welcome Back!</Text>
              </>
            )}

            {showAds && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => setShowAds(false)}
              >
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>

        {/* Animated bottom card */}
        <Animated.View style={[styles.bottomCard, bottomCardAnimatedStyle]}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputField}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor="#5b8aa6"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputField}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter your password"
              placeholderTextColor="#5b8aa6"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeButton}
              accessibilityLabel="Toggle password visibility"
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#023E8A"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              {loading ? "Logging in..." : "LOGIN"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNavigateToRegister}
            style={{ marginTop: 15 }}
          >
            <Text style={styles.driverLink}>New here? Register</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CAF0F8",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    position: "relative",
  },
  heroWrapper: {
    position: "relative",
    width: "100%",
  },
  bigCircle: {
    position: "absolute",
    top: -150,
    left: -70,
    width: 400,
    height: 400,
    backgroundColor: "#ADE8F4",
    borderRadius: 200,
  },
  topCard: {
    backgroundColor: "#03045E",
    borderRadius: 40,
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 240,
    shadowColor: "#023E8A",
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  logoCircle: {
    width: 90,
    height: 90,
    backgroundColor: "#00B4D8",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  adContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  adTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  adSubtitle: {
    color: "#90E0EF",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  skipButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  skipText: {
    color: "#90E0EF",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomCard: {
    marginTop: -20,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 30,
    shadowColor: "#0096C7",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  label: {
    color: "#023E8A",
    fontWeight: "700",
    marginBottom: 4,
    marginTop: 14,
  },
  inputRow: {
    borderBottomWidth: 2,
    borderBottomColor: "#0096C7",
    paddingVertical: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  inputField: {
    flex: 1,
    color: "#023E8A",
    fontWeight: "700",
  },
  eyeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  loginButton: {
    backgroundColor: "#0077B6",
    marginTop: 25,
    paddingVertical: 16,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  driverLink: {
    fontSize: 14,
    color: "#0077B6",
    fontWeight: "700",
    textAlign: "center",
  },
});
