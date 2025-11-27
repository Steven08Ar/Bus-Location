import { Easing } from 'react-native-reanimated';

// Animation constants
export const ANIMATION_DURATION = 700;
export const ANIMATION_EASING = Easing.out(Easing.cubic);

// Animation configurations
export const TRANSITION_CONFIG = {
    duration: ANIMATION_DURATION,
    easing: ANIMATION_EASING,
};

// Rotation values (in degrees)
export const ROTATION = {
    LOGIN_TOP_CARD: -4,
    REGISTER_TOP_CARD: -4,
    LOGIN_BOTTOM_CARD: 2.5,
    REGISTER_BOTTOM_CARD: 2.5,
};

// Animation ranges
export const ANIMATION_RANGES = {
    // Top card exit (Login → Register)
    topCardExit: {
        translateX: -100,
        opacity: 0,
        rotation: 0,
    },
    // Top card enter (Register appearing)
    topCardEnter: {
        translateX: 100,
        opacity: 0,
        scale: 0.85,
        rotation: 3,
    },
    // Bottom card transition
    bottomCard: {
        translateY: 10,
        minOpacity: 0.3,
    },
    // Background parallax
    background: {
        translateY: -20,
    },
};
