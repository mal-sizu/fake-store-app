import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { ChevronDown, ChevronUp, Package } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updateOrderStatus } from '@/store/ordersSlice';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function OrdersScreen() {
  const { orders } = useSelector((state: RootState) => state.orders);
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/sign-in');
    }
  }, [isAuthenticated]);

  // Filter orders for the current user
  const userOrders = user?.id 
    ? orders.filter(order => order.userId === user.id)
    : [];

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderIds(prevIds => 
      prevIds.includes(orderId)
        ? prevIds.filter(id => id !== orderId)
        : [...prevIds, orderId]
    );
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const isExpanded = expandedOrderIds.includes(item.id);
    const totalItems = item.items.reduce((sum: number, i: any) => sum + i.quantity, 0);
    
    return (
      <View style={styles.orderCard}>
        <TouchableOpacity 
          style={styles.orderHeader}
          onPress={() => toggleOrderExpansion(item.id)}
        >
          <View>
            <Text style={styles.orderId}>Order #{item.id.slice(-6)}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.orderSummary}>
            <View style={[styles.statusBadge, styles[`status${item.status}`]]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
            {isExpanded ? (
              <ChevronUp size={20} color="#64748b" />
            ) : (
              <ChevronDown size={20} color="#64748b" />
            )}
          </View>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.orderDetails}>
            <View style={styles.orderItems}>
              {item.items.map((orderItem: any) => (
                <View key={orderItem.id} style={styles.orderItem}>
                  <Image source={{ uri: orderItem.image }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{orderItem.title}</Text>
                    <Text style={styles.itemPrice}>${orderItem.price.toFixed(2)} x {orderItem.quantity}</Text>
                  </View>
                </View>
              ))}
            </View>
            
            <View style={styles.actionsContainer}>
              {item.status === 'new' && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.payButton]}
                  onPress={() => handleUpdateStatus(item.id, 'paid')}
                >
                  <Text style={styles.actionButtonText}>Pay Now</Text>
                </TouchableOpacity>
              )}
              
              {item.status === 'paid' && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.receiveButton]}
                  onPress={() => handleUpdateStatus(item.id, 'delivered')}
                >
                  <Text style={styles.actionButtonText}>Mark as Received</Text>
                </TouchableOpacity>
              )}
              
              {item.status === 'delivered' && (
                <View style={styles.deliveredContainer}>
                  <Text style={styles.deliveredText}>Order completed</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  if (userOrders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Package size={80} color="#cbd5e1" />
        <Text style={styles.emptyText}>You don't have any orders yet</Text>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>
      
      <FlatList
        data={userOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#64748b',
  },
  orderSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  statusnew: {
    backgroundColor: '#bfdbfe',
  },
  statuspaid: {
    backgroundColor: '#bbf7d0',
  },
  statusdelivered: {
    backgroundColor: '#cbd5e1',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1e293b',
    textTransform: 'capitalize',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 8,
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    padding: 16,
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#64748b',
  },
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#2563EB',
  },
  receiveButton: {
    backgroundColor: '#059669',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  deliveredContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  deliveredText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});