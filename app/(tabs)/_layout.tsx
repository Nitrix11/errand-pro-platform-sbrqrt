
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Platform, View, Pressable, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '@/styles/commonStyles';
import { useRouter, usePathname } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      title: 'Home',
      icon: 'house.fill',
      route: '/(tabs)/(home)',
    },
    {
      name: 'profile',
      title: 'Profile',
      icon: 'person.fill',
      route: '/(tabs)/profile',
    },
  ];

  if (Platform.OS === 'web') {
    return (
      <>
        <Stack screenOptions={{ headerShown: false }} />
        <View style={webStyles.tabBar}>
          {tabs.map((tab) => {
            const isActive = pathname.includes(tab.name);
            return (
              <Pressable
                key={tab.name}
                style={[webStyles.tabButton, isActive && webStyles.tabButtonActive]}
                onPress={() => router.push(tab.route as any)}
              >
                <IconSymbol 
                  name={tab.icon as any} 
                  size={24} 
                  color={isActive ? colors.primary : colors.textSecondary} 
                />
                <Text style={[
                  webStyles.tabLabel,
                  isActive && webStyles.tabLabelActive
                ]}>
                  {tab.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </>
    );
  }

  if (Platform.OS === 'ios') {
    return (
      <>
        <Stack screenOptions={{ headerShown: false }} />
        <FloatingTabBar tabs={tabs} />
      </>
    );
  }

  return (
    <NativeTabs>
      <NativeTabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon name="house.fill" color={color} />,
          tabBarLabel: ({ color }) => <Label color={color}>Home</Label>,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
        }}
      />
      <NativeTabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="person.fill" color={color} />,
          tabBarLabel: ({ color }) => <Label color={color}>Profile</Label>,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
        }}
      />
    </NativeTabs>
  );
}

const webStyles = StyleSheet.create({
  tabBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 20,
    boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: colors.highlight,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.primary,
  },
});
