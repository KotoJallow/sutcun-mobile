import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import OrderCard from '../components/OrderCard';
import colors from '../constants/colors';
import { RootState } from '../redux/store';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useOrders } from '../hooks/useApi';

export default function OrdersScreen({ navigation, route }: any) {
	const { data: orders, loading, error, refetch } = useOrders();
	
	console.log('📋 OrdersScreen - Orders:', orders?.length || 0, 'Loading:', loading, 'Error:', error);

	const formatOrderDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const getOrderItemsText = (items: any[]) => {
		return items.map(item => item.product.product_name).join(', ');
	};

	if (loading) {
		return <LoadingSpinner text="Loading orders..." />;
	}

	if (error) {
		return (
			<ErrorMessage 
				message={error} 
				onRetry={refetch}
				retryText="Retry"
			/>
		);
	}

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				{orders.length === 0 ? (
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>No orders yet</Text>
						<Text style={styles.emptySubtext}>Your orders will appear here</Text>
					</View>
				) : (
					orders.map((order) => (
						<OrderCard
							key={order.id}
							orderNumber={order.orderNumber}
							date={formatOrderDate(order.date)}
							itemCount={order.items.length}
							items={getOrderItemsText(order.items)}
							total={order.total}
							status={order.status}
						/>
					))
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white
	},
	scrollContent: {
		paddingVertical: 16,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 60,
	},
	emptyText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 8,
	},
	emptySubtext: {
		fontSize: 14,
		color: '#6B7280',
		textAlign: 'center',
	},
});
