import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import OrderCard from '../components/OrderCard';
import colors from '../constants/colors';
import { RootState } from '../redux/store';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { setOrders } from '../redux/orderSlice';
import { simpleDataService } from '../services/dataServiceSimple';

export default function OrdersScreen({ navigation, route }: any) {
	const dispatch = useDispatch();
	const orders = useSelector((state: RootState) => state.orders.orders);
	const user = useSelector((state: RootState) => state.user);
	
	console.log('📋 OrdersScreen - Redux Orders:', orders?.length || 0, 'User ID:', user.id);
	console.log('📋 OrdersScreen - Orders data:', orders);

	// Load orders from Firestore when component mounts (if not already loaded)
	useEffect(() => {
		const loadOrders = async () => {
			if (user.id && orders.length === 0) {
				try {
					console.log('📋 [ORDERS] Loading orders for user:', user.id);
					const userOrders = await simpleDataService.getUserOrders(user.id);
					dispatch(setOrders(userOrders));
					console.log('📋 [ORDERS] Orders loaded from Firestore:', userOrders.length);
				} catch (error) {
					console.error('❌ [ORDERS] Error loading orders:', error);
				}
			}
		};
		
		loadOrders();
	}, [user.id, dispatch, orders.length]);

	const formatOrderDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const getOrderItemsText = (items: any[]) => {
		if (!items || !Array.isArray(items)) {
			console.warn('📋 [ORDERS] Invalid items array:', items);
			return 'No items';
		}
		
		try {
			return items.map(item => {
				// Handle different item structures
				if (item && typeof item === 'object') {
					// Check for nested product structure
					if (item.product && item.product.product_name) {
						return item.product.product_name;
					}
					// Check for direct product_name
					if (item.product_name) {
						return item.product_name;
					}
					// Check for productName
					if (item.productName) {
						return item.productName;
					}
					// Check for name field
					if (item.name) {
						return item.name;
					}
				}
				
				// Handle string items
				if (typeof item === 'string') {
					return item;
				}
				
				console.warn('📋 [ORDERS] Unknown item structure:', item);
				return 'Unknown item';
			}).filter(Boolean).join(', ');
		} catch (error) {
			console.error('📋 [ORDERS] Error processing items:', error);
			return 'Error loading items';
		}
	};

	// Safety check for orders
	if (!orders || !Array.isArray(orders)) {
		console.error('📋 [ORDERS] Invalid orders data:', orders);
		return (
			<View style={styles.container}>
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>Error loading orders</Text>
					<Text style={styles.emptySubtext}>Please try again later</Text>
				</View>
			</View>
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
					orders.map((order) => {
						try {
							console.log('📋 [ORDERS] Rendering order:', {
								id: order.id,
								orderNumber: order.orderNumber,
								itemsCount: order.items?.length || 0,
								items: order.items
							});
							
							return (
								<OrderCard
									key={order.id || Math.random().toString()}
									orderNumber={order.orderNumber || 'N/A'}
									date={formatOrderDate(order.date || new Date().toISOString())}
									itemCount={order.items?.length || 0}
									items={getOrderItemsText(order.items || [])}
									total={order.total || 0}
									status={order.status || 'pending'}
								/>
							);
						} catch (error) {
							console.error('📋 [ORDERS] Error rendering order:', error, order);
							return (
								<View key={order.id || Math.random().toString()} style={styles.errorCard}>
									<Text style={styles.errorText}>Error loading order</Text>
								</View>
							);
						}
					})
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
	errorCard: {
		backgroundColor: '#ffebee',
		borderRadius: 12,
		padding: 16,
		marginHorizontal: 16,
		marginVertical: 8,
		borderLeftWidth: 4,
		borderLeftColor: '#f44336',
	},
	errorText: {
		fontSize: 14,
		color: '#d32f2f',
		fontWeight: '500',
	},
});
