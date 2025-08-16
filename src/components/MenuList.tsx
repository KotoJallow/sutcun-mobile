import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../constants/colors';

interface MenuItem {
  title: string;
  icon: string;
  onPress: () => void;
}

interface MenuListProps {
  items: MenuItem[];
}

const MenuList: React.FC<MenuListProps> = ({ items }) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.title}
          style={[
            styles.menuItem,
            index !== items.length - 1 && styles.borderBottom
          ]}
          onPress={item.onPress}
        >
          <View style={styles.menuContent}>
            <Icon name={item.icon} size={24} color="#666" />
            <Text style={styles.menuText}>{item.title}</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default MenuList;