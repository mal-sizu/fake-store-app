import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@/types';
import { clearCart } from './cartSlice';

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

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
  },
});

export const { createOrder, updateOrderStatus } = ordersSlice.actions;

export default ordersSlice.reducer;