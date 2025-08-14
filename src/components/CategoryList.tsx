import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // MaterialCommunityIcons yerine Ionicons
import Colors from '../constants/colors';
import { categories } from '../constants/dummyData';

interface CategoryItemProps {
  name: string;
  icon: string; // Update icon type
  isSelected?: boolean;
  onPress?: () => void;
}

const CategoryItem = ({ name, icon, isSelected, onPress }: CategoryItemProps) => (
  <TouchableOpacity 
    style={[styles.categoryItem, isSelected && styles.selectedItem]} 
    onPress={onPress}
  >
    <View style={[
      styles.iconContainer,
      isSelected && styles.selectedIconContainer
    ]}>
      <Ionicons 
        name={icon as keyof typeof Ionicons.glyphMap}
        size={24}
        color={isSelected ? Colors.white : Colors.primary}
      />
    </View>
    <Text style={[
      styles.categoryText,
      isSelected && styles.selectedText
    ]}>{name}</Text>
  </TouchableOpacity>
);

interface CategoryListProps {
  selectedCategory?: string;
  onSelectCategory: (category: string, id: number) => void; // Tip güncellemesi
}

const CategoryList = ({ selectedCategory, onSelectCategory }: CategoryListProps) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            name={category.name}
            icon={category.icon}
            isSelected={category.name === selectedCategory}
            onPress={() => onSelectCategory(category.name, category.id)} // İki parametre gönderiyoruz
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: 70,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedIconContainer: {
    backgroundColor: Colors.primary,
  },
  selectedItem: {
    opacity: 1,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: 'center',
  },
  selectedText: {
    color: Colors.primary,
    fontWeight: '500',
  },
});

export default CategoryList;