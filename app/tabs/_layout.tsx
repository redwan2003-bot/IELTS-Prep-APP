import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { AuthProvider } from '../../contexts/AuthContext';

export default function TabsLayout() {
  return (
    <AuthProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <TabIcon name="home" color={color as string} />,
          }}
        />
        <Tabs.Screen
          name="plans"
          options={{
            title: 'Plans',
            tabBarIcon: ({ color }) => <TabIcon name="calendar" color={color as string} />,
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            title: 'Notes',
            tabBarIcon: ({ color }) => <TabIcon name="book" color={color as string} />,
          }}
        />
        <Tabs.Screen
          name="reminders"
          options={{
            title: 'Reminders',
            tabBarIcon: ({ color }) => <TabIcon name="bell" color={color as string} />,
          }}
        />
        <Tabs.Screen
          name="roadmaps"
          options={{
            title: 'Roadmaps',
            tabBarIcon: ({ color }) => <TabIcon name="file" color={color as string} />,
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}

function TabIcon({ name, color }: { name: string; color: string }) {
  return (
    <Text style={{ fontSize: 20, color }}>
      {name === 'home' ? '🏠' : name === 'calendar' ? '📅' : name === 'book' ? '📝' : name === 'bell' ? '🔔' : '📄'}
    </Text>
  );
}
