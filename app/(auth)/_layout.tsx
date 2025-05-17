import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" options={{ headerShown: false, title: 'SplashScreen' }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false, title: 'SignInScreen' }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false, title: 'SignUpScreen' }} />
    </Stack> 
  );
}