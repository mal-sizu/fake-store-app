import { Tabs } from 'expo-router';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import { ShoppingCart, Package, User } from 'lucide-react-native';
import { RootState } from '@/store';
import { usePathname } from 'expo-router';

export default function TabLayout() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const orders = useSelector((state: RootState) => state.orders.orders);
  const pathname = usePathname();
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const newOrdersCount = orders.filter(order => order.status === 'new').length;

  return (
    <Tabs
      screenOptions={({ route }) => {
        
        return {
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          height: 100,
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#F1F5F9',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
        }
      };
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Categories',
          tabBarLabel: 'Products',
          tabBarIcon: ({ color, size }) => (
            <Package size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Shopping Cart',
          tabBarIcon: ({ color, size }) => (
            <View>
              <ShoppingCart size={size} color={color} />
              {cartItemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItemCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'My Orders',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Package size={size} color={color} />
              {newOrdersCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{newOrdersCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products/[category]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="products/product/[id]"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#F97316',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});