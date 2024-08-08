import React, { useEffect, useState } from 'react';
import { Text, View, Button, Image } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '413883453520-jk2mg2egpbkd8p08kb7fuudbidvm72ee.apps.googleusercontent.com',
    androidClientId: '413883453520-jk2mg2egpbkd8p08kb7fuudbidvm72ee.apps.googleusercontent.com',
  });

  useEffect(() => {
    handleSignIn();
  }, [response]);

  const handleSignIn = async () => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const userInfo = await fetchUserInfo(authentication.accessToken);
      setUserInfo(userInfo);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  };

  const fetchUserInfo = async (token) => {
    const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {userInfo ? (
        <View>
          <Text>Welcome {userInfo.name}</Text>
          <Image source={{ uri: userInfo.picture }} style={{ width: 100, height: 100 }} />
          <Button title="Sign Out" onPress={handleSignOut} />
        </View>
      ) : (
        <Button
          disabled={!request}
          title="Sign In with Google"
          onPress={() => {
            promptAsync();
          }}
        />
      )}
    </View>
  );
}
