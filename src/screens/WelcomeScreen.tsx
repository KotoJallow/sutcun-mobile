import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import colors from '../constants/colors';


const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Placeholder Logo */}
      <View style={styles.logoWrapper}>
        <View style={styles.logoBackground}>
          <Text style={styles.logoEmoji}>🥛</Text>
        </View>
      </View>

      {/* App Title */}
      <Text style={styles.title}>Sütçün</Text>
      <Text style={styles.subtitle}>Fresh dairy at your doorstep</Text>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <FontAwesome name="sign-in" size={18} color="#fff" />
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton}>
        <Feather name="user-plus" size={18} color="#14b8a6" />
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>© 2023 Sütçün. All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoWrapper: {
    marginBottom: 24,
  },
  logoBackground: {
    backgroundColor: '#ccfbf1', // teal-100
    padding: 24,
    borderRadius: 999,
  },
  logoEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827', // text-gray-900
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280', // text-gray-600
    marginBottom: 32,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14b8a6', // teal-500
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 8,
    marginBottom: 16,
  },
  loginText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#14b8a6',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  registerText: {
    color: '#14b8a6',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    fontSize: 12,
    color: '#9ca3af', // text-gray-400
  },
});

export default WelcomeScreen;
