import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem } from '@/types';
import { saveCartToFirestore, getCartFromFirestore, deleteCartFromFirestore } from '@/services/cartService';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks for Firestore operations
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (email: string, { rejectWithValue }) => {
    try {
      const cart = await getCartFromFirestore(email);
      return cart?.item_list || [];
    } catch (error) {
      return rejectWithValue('Failed to fetch cart');
    }
  }
);

export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async ({ email, userId }: { email: string; userId: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { cart: CartState };
      await saveCartToFirestore(email, state.cart.items, userId);
      return true;
    } catch (error) {
      return rejectWithValue('Failed to sync cart');
    }
  }
);

export const clearFirestoreCart = createAsyncThunk(
  'cart/clearFirestoreCart',
  async (email: string, { rejectWithValue }) => {
    try {
      await deleteCartFromFirestore(email);
      return true;
    } catch (error) {
      return rejectWithValue('Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push(action.payload);
      }
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(item => item.id !== action.payload);
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { 
  addToCart, 
  incrementQuantity, 
  decrementQuantity, 
  removeFromCart,
  clearCart
} = cartSlice.actions;

// Handle async thunks
cartSlice.extraReducers = (builder) => {
  // Fetch cart
  builder.addCase(fetchCart.pending, (state) => {
    state.loading = true;
    state.error = null;
  });
  builder.addCase(fetchCart.fulfilled, (state, action) => {
    state.items = action.payload;
    state.loading = false;
  });
  builder.addCase(fetchCart.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });

  // Sync cart
  builder.addCase(syncCart.rejected, (state, action) => {
    state.error = action.payload as string;
  });

  // Clear Firestore cart
  builder.addCase(clearFirestoreCart.rejected, (state, action) => {
    state.error = action.payload as string;
  });
};

export default cartSlice.reducer;