import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Order } from '@/types';
import { clearCart } from './cartSlice';
import { saveOrderToFirestore, getOrderHistoryFromFirestore, updateOrderStatusInFirestore } from '@/services/orderService';

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null
};

// Async thunk for creating an order and saving to Firestore
export const createOrderWithFirestore = createAsyncThunk(
  'orders/createOrderWithFirestore',
  async (orderData: { order: Order, email: string }, { rejectWithValue }) => {
    try {
      const { order, email } = orderData;
      await saveOrderToFirestore(email, order);
      return order;
    } catch (error) {
      return rejectWithValue('Failed to create order: ' + error);
    }
  }
);

// Async thunk for fetching orders from Firestore
export const fetchOrdersFromFirestore = createAsyncThunk(
  'orders/fetchOrdersFromFirestore',
  async (email: string, { rejectWithValue }) => {
    try {
      const orderHistory = await getOrderHistoryFromFirestore(email);
      if (!orderHistory) return [];
      
      // Convert Firestore order history format to app Order format
      const orders = orderHistory.order_history.map(item => ({
        id: `ord-${item.date_time}`,
        userId: orderHistory.user_id,
        items: item.items,
        status: item.status,
        total: item.total_amount,
        createdAt: item.date_time
      }));
      
      return orders;
    } catch (error) {
      return rejectWithValue('Failed to fetch orders: ' + error);
    }
  }
);

// Async thunk for updating order status in Firestore
export const updateOrderStatusInStore = createAsyncThunk(
  'orders/updateOrderStatusInStore',
  async (data: { email: string, orderId: string, status: string }, { rejectWithValue }) => {
    try {
      const { email, orderId, status } = data;
      // Extract date_time from orderId (format: ord-{date_time})
      const orderDateTime = orderId.substring(4);
      await updateOrderStatusInFirestore(email, orderDateTime, status);
      return { orderId, status };
    } catch (error) {
      return rejectWithValue('Failed to update order status: ' + error);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: string }>) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      
      if (order) {
        order.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    // Clear cart when an order is created
    builder.addCase(clearCart, (state) => {
      // No additional state changes needed here
    });
    
    // Handle createOrderWithFirestore
    builder.addCase(createOrderWithFirestore.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrderWithFirestore.fulfilled, (state, action) => {
      state.loading = false;
      state.orders.push(action.payload);
    });
    builder.addCase(createOrderWithFirestore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Handle fetchOrdersFromFirestore
    builder.addCase(fetchOrdersFromFirestore.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrdersFromFirestore.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchOrdersFromFirestore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Handle updateOrderStatusInStore
    builder.addCase(updateOrderStatusInStore.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateOrderStatusInStore.fulfilled, (state, action) => {
      state.loading = false;
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.status = status;
      }
    });
    builder.addCase(updateOrderStatusInStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },

});

export const { createOrder, updateOrderStatus } = ordersSlice.actions;

export default ordersSlice.reducer;

