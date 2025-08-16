import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import OrderCard from '../components/OrderCard';
import CustomToolbar from '../components/CustomToolbar';

const DUMMY_ORDERS = [
	{
		orderNumber: 'ORD-8756',
		date: 'July 18, 2023',
		itemCount: 3,
		items: 'Milk, Yogurt, Cheese',
		total: 145.5,
		status: 'delivered' as const,
	},
	{
		orderNumber: 'ORD-8755',
		date: 'July 17, 2023',
		itemCount: 5,
		items: 'Bread, Eggs, Butter, Jam, Coffee',
		total: 234.75,
		status: 'pending' as const,
	},
	{
		orderNumber: 'ORD-8754',
		date: 'July 16, 2023',
		itemCount: 2,
		items: 'Water, Juice',
		total: 45.9,
		status: 'delivered' as const,
	},
];

export default function OrdersScreen() {
	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				{DUMMY_ORDERS.map((order) => (
					<OrderCard
						key={order.orderNumber}
						orderNumber={order.orderNumber}
						date={order.date}
						itemCount={order.itemCount}
						items={order.items}
						total={order.total}
						status={order.status}
					/>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	scrollContent: {
		paddingVertical: 16,
	},
});
