import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';

interface CategoryItemProps {
  name: string;
  icon: string;
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
  categories: any[];
  selectedCategory?: string;
  onSelectCategory: (category: string, id: number) => void;
  loading?: boolean;
}

const CategoryList = ({ categories, selectedCategory, onSelectCategory, loading }: CategoryListProps) => {
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }

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
            onPress={() => onSelectCategory(category.name, category.id)}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
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