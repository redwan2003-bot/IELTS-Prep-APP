import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5 bg-white">
        <Text className="text-2xl font-bold mb-4">This screen doesn't exist.</Text>
        <Link href="/tabs" className="mt-4 py-3 px-6 rounded-lg bg-blue-600">
          <Text className="text-white font-semibold">Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}
