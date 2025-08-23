import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import colors from '../constants/colors';

const WelcomeScreen = ({ navigation }: any) => {
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
      <Text style={styles.subtitle}>Fresh dairy delivered to your doorstep</Text>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        {/* Login Button */}
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('login')}
        >
          <FontAwesome name="sign-in" size={18} color="#fff" />
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Feather name="user-plus" size={18} color="#14b8a6" />
          <Text style={styles.registerText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>© 2025 Sütçün. All rights reserved.</Text>
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
    marginBottom: 32,
  },
  logoBackground: {
    backgroundColor: '#ccfbf1',
    padding: 28,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 300,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14b8a6',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#14b8a6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#14b8a6',
    backgroundColor: '#f0fdfa',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  registerText: {
    color: '#14b8a6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
