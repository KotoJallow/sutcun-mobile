import React, { useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import OrderCard from '../components/OrderCard';
import colors from '../constants/colors';
import { RootState } from '../redux/store';
import { setOrders } from '../redux/orderSlice';
import { simpleDataService } from '../services/dataServiceSimple';
import Strings from '../constants/strings';

export default function OrdersScreen({ navigation, route }: any) {
	const dispatch = useDispatch();
	const orders = useSelector((state: RootState) => state.orders.orders);
	const user = useSelector((state: RootState) => state.user);
	const hasOrdersForCurrentUser = useMemo(
		() => {
			if (!user.id || !Array.isArray(orders) || orders.length === 0) {
				return false;
			}
			return orders.some(order => order?.userId === user.id);
		},
		[orders, user.id]
	);
	
	console.log('📋 OrdersScreen - Redux Orders:', orders?.length || 0, 'User ID:', user.id);
	console.log('📋 OrdersScreen - Orders data:', orders);

	// Load orders from Firestore when component mounts (if not already loaded)
	useEffect(() => {
		const loadOrders = async () => {
			if (user.id && !hasOrdersForCurrentUser) {
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
	}, [user.id, dispatch, hasOrdersForCurrentUser]);

	const formatOrderDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('tr-TR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const mapLabelToStartTime = (label?: string) => {
		if (!label) return undefined;
		const normalized = label.toLowerCase();
		if (normalized.includes('sabah') || normalized.includes('morning')) {
			return '09:00';
		}
		if (normalized.includes('öğleden') || normalized.includes('afternoon')) {
			return '13:00';
		}
		if (normalized.includes('akşam') || normalized.includes('evening')) {
			return '18:00';
		}
		if (normalized.includes('gece') || normalized.includes('night')) {
			return '21:00';
		}
		return undefined;
	};

	const parseDeliveryDateTime = (deliveryTime: any, fallbackDate?: string) => {
		try {
			let datePart: string | undefined;
			let timeRange: string | undefined;

			if (deliveryTime && typeof deliveryTime === 'object') {
				datePart = deliveryTime.date || fallbackDate;
				timeRange = deliveryTime.timeRange || deliveryTime.timerange || deliveryTime.time_range;
				if (!timeRange) {
					timeRange = mapLabelToStartTime(deliveryTime.label);
				}
			} else if (typeof deliveryTime === 'string') {
				datePart = fallbackDate;
				timeRange = mapLabelToStartTime(deliveryTime) || deliveryTime;
			} else {
				datePart = fallbackDate;
			}

			if (!datePart) {
				return null;
			}

			let targetDate: Date;
			if (datePart.includes('.')) {
				const [dayStr, monthStr, yearStr] = datePart.split('.');
				const day = parseInt(dayStr, 10);
				const month = parseInt(monthStr, 10);
				const year = parseInt(yearStr, 10);
				if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
					return null;
				}
				targetDate = new Date(year, month - 1, day);
			} else {
				const parsed = new Date(datePart);
				if (Number.isNaN(parsed.getTime())) {
					return null;
				}
				targetDate = parsed;
			}

			let hours = 0;
			let minutes = 0;

			if (timeRange) {
				const normalizedRange = timeRange.replace('–', '-');
				const [start] = normalizedRange.split('-').map(part => part.trim());
				if (start && start.includes(':')) {
					const [hourStr, minuteStr] = start.split(':');
					const parsedHours = parseInt(hourStr, 10);
					const parsedMinutes = parseInt(minuteStr, 10);
					if (!Number.isNaN(parsedHours)) {
						hours = parsedHours;
					}
					if (!Number.isNaN(parsedMinutes)) {
						minutes = parsedMinutes;
					}
				}
			}

			return new Date(
				targetDate.getFullYear(),
				targetDate.getMonth(),
				targetDate.getDate(),
				hours,
				minutes
			);
		} catch (error) {
			console.error('📋 [ORDERS] Failed to parse delivery time:', error, deliveryTime, fallbackDate);
			return null;
		}
	};

	const getOrderItems = (items: any[]) => {
		if (!items || !Array.isArray(items)) {
			console.warn('📋 [ORDERS] Invalid items array:', items);
			return [];
		}
		
		try {
			return items.map(item => {
				let productName = '';
				let quantity = 1;

				// Handle different item structures
				if (item && typeof item === 'object') {
					// Get quantity (check different possible field names)
					quantity = item.quantity || item.qty || item.count || 1;

					// Check for nested product structure
					if (item.product && item.product.product_name) {
						productName = item.product.product_name;
					}
					// Check for direct product_name
					else if (item.product_name) {
						productName = item.product_name;
					}
					// Check for productName
					else if (item.productName) {
						productName = item.productName;
					}
					// Check for name field
					else if (item.name) {
						productName = item.name;
					}
				}
				// Handle string items
				else if (typeof item === 'string') {
					productName = item;
				}

				if (!productName) {
					console.warn('📋 [ORDERS] Unknown item structure:', item);
					return null;
				}

				return {
					name: productName,
					quantity,
				};
			})
			.filter(Boolean)
			.map(value => value as { name: string; quantity: number });
		} catch (error) {
			console.error('📋 [ORDERS] Error processing items:', error);
			return [];
		}
	};

	const timeSensitiveStatuses: Array<'pending' | 'confirmed' | 'preparing' | 'out_for_delivery'> = [
		'pending',
		'confirmed',
		'preparing',
		'out_for_delivery'
	];

	const statusLabelMap: Record<string, string> = {
		pending: Strings.orderStatusPending,
		confirmed: Strings.orderStatusConfirmed,
		preparing: Strings.orderStatusPreparing,
		out_for_delivery: Strings.orderStatusOutForDelivery,
		delivered: Strings.orderStatusDelivered,
		cancelled: Strings.orderStatusCancelled,
	};

	const { visibleOrders, filteredOutCount } = useMemo(() => {
		let filteredCount = 0;
		const ordersArray = Array.isArray(orders) ? orders : [];
		const filteredOrders = ordersArray.filter((order) => {
			if (!order) return false;
			const isTimeSensitive = timeSensitiveStatuses.includes(order.status);
			if (!isTimeSensitive) {
				return true;
			}

			const deliveryDate = parseDeliveryDateTime(order.deliveryTime, order.date || order.createdAt);
			if (!deliveryDate) {
				return true;
			}

			const isUpcoming = deliveryDate.getTime() >= Date.now();
			if (!isUpcoming) {
				filteredCount += 1;
			}
			return isUpcoming;
		});

		return {
			visibleOrders: filteredOrders,
			filteredOutCount: filteredCount,
		};
	}, [orders]);

	if (!user.id) {
		return (
			<View style={styles.container}>
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>{Strings.errorUserNotFound}</Text>
				</View>
			</View>
		);
	}

	// Safety check for orders
	if (!visibleOrders || !Array.isArray(visibleOrders)) {
		console.error('📋 [ORDERS] Invalid orders data:', visibleOrders);
		return (
			<View style={styles.container}>
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>{Strings.errorLoadingOrders}</Text>
					<Text style={styles.emptySubtext}>{Strings.tryAgainLater}</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				{filteredOutCount > 0 && (
					<View style={styles.infoBanner}>
						<Text style={styles.infoBannerText}>{Strings.ordersFilteredByTime}</Text>
					</View>
				)}
				{visibleOrders.length === 0 ? (
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>{Strings.noUpcomingOrders}</Text>
						<Text style={styles.emptySubtext}>{Strings.ordersWillAppear}</Text>
					</View>
				) : (
					visibleOrders.map((order) => {
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
									items={getOrderItems(order.items || [])}
									total={order.total || 0}
									status={order.status || 'pending'}
									statusLabel={statusLabelMap[order.status] || order.status}
								/>
							);
						} catch (error) {
							console.error('📋 [ORDERS] Error rendering order:', error, order);
							return (
								<View key={order.id || Math.random().toString()} style={styles.errorCard}>
									<Text style={styles.errorText}>{Strings.errorLoadingOrder}</Text>
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
