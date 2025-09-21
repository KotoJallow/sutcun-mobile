import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../constants/colors';

interface ProfileCardProps {
  name: string;
  phone: string;
  initials: string;
  isVerified?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, phone, initials, isVerified = false }) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
          {isVerified && (
            <Icon name="check-circle" size={20} color={Colors.primary} style={styles.verifiedIcon} />
          )}
        </View>
        <Text style={styles.phone}>{phone}</Text>
        {isVerified && (
          <Text style={styles.verifiedText}>Verified Account</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginLeft: 16,
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  phone: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
    fontWeight: '500',
  },
});

export default ProfileCard;