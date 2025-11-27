import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

// Animation constants
const ANIMATION_DURATION = 700;
const ANIMATION_EASING = Easing.out(Easing.cubic);

export default function UserRegister() {
  const { register } = useAuth();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animation values - start from "exited" state
  const topCardTranslateX = useSharedValue(100);
  const topCardOpacity = useSharedValue(0);
  const topCardRotation = useSharedValue(3);
  const topCardScale = useSharedValue(0.85);

  const bottomCardTranslateY = useSharedValue(10);
  const bottomCardOpacity = useSharedValue(0.3);
  const bottomCardRotation = useSharedValue(-2.5);

  const backgroundTranslateY = useSharedValue(-20);

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

  const handleRegister = async () => {
    if (!name || !email || !userId || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, userId, password);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToWelcome = () => {
    // Exit animation (reverse of entrance)
    topCardTranslateX.value = withTiming(100, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    topCardOpacity.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    topCardRotation.value = withTiming(3, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
    topCardScale.value = withTiming(0.85, {
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
      navigation.navigate("Welcome" as never);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.heroWrapper}>
              {/* Animated Top Card */}
              <Animated.View style={[styles.topCard, topCardAnimatedStyle]}>
                <View style={styles.logoCircle}>
                  <Feather name="user-plus" size={40} color="#03045E" />
                </View>
                <Text style={styles.title}>Create Account</Text>
              </Animated.View>
            </View>

            {/* Animated Background Circle */}
            <Animated.View style={[styles.bigCircle, backgroundAnimatedStyle]} />

            {/* Animated Bottom Card */}
            <Animated.View style={[styles.bottomCard, bottomCardAnimatedStyle]}>
              {/* Username */}
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.inputField}
                  value={userId}
                  onChangeText={setUserId}
                  placeholder="Pick a username"
                  placeholderTextColor="#5b8aa6"
                  autoCapitalize="none"
                />
                <Feather name="user" size={20} color="#0096C7" />
              </View>

              {/* Full Name */}
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.inputField}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#5b8aa6"
                />
                <Feather name="smile" size={20} color="#0096C7" />
              </View>

              {/* Email */}
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
                <Feather name="mail" size={20} color="#0096C7" />
              </View>

              {/* Password */}
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.inputField}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Create a password"
                  placeholderTextColor="#5b8aa6"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#023E8A"
                  />
                </TouchableOpacity>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.registerText}>
                  {loading ? "Creating..." : "REGISTER"}
                </Text>
              </TouchableOpacity>

              {/* Login Link */}
              <TouchableOpacity
                onPress={handleNavigateToWelcome}
                style={{ marginTop: 15 }}
              >
                <Text style={styles.loginLink}>
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CAF0F8",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingTop: 60,
    position: "relative",
  },
  heroWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: -30,
    zIndex: 1,
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
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
    shadowColor: "#023E8A",
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  logoCircle: {
    width: 80,
    height: 80,
    backgroundColor: "#00B4D8",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  bottomCard: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 30,
    paddingTop: 50,
    shadowColor: "#0096C7",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 0,
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
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  inputField: {
    flex: 1,
    color: "#023E8A",
    fontWeight: "700",
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 8,
  },
  registerButton: {
    backgroundColor: "#0077B6",
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  loginLink: {
    fontSize: 14,
    color: "#0077B6",
    fontWeight: "700",
    textAlign: "center",
  },
});
