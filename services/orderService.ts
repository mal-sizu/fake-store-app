import { db } from '@/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { Order, CartItem } from '@/types';

interface FirestoreOrderHistory {
  created_at: string;
  updated_at: string;
  order_history: {
    date_time: string;
    status: string;
    items: CartItem[];
    total_amount: number;
  }[];
  total_amount: number;
  user_id: string;
}

// Create or update order history document for a user
export const saveOrderToFirestore = async (email: string, order: Order) => {
  try {
    const orderRef = doc(db, 'orders', email);
    const orderDoc = await getDoc(orderRef);
    
    const newOrderHistoryItem = {
      date_time: order.createdAt,
      status: order.status,
      items: order.items,
      total_amount: order.total
    };
    
    const now = new Date().toISOString();
    
    if (orderDoc.exists()) {
      // Update existing order history
      const existingData = orderDoc.data() as FirestoreOrderHistory;
      const updatedOrderHistory = [...existingData.order_history, newOrderHistoryItem];
      const newTotalAmount = existingData.total_amount + order.total;
      
      await updateDoc(orderRef, {
        updated_at: now,
        order_history: updatedOrderHistory,
        total_amount: newTotalAmount
      });
    } else {
      // Create new order history document
      const newOrderHistory: FirestoreOrderHistory = {
        created_at: now,
        updated_at: now,
        order_history: [newOrderHistoryItem],
        total_amount: order.total,
        user_id: order.userId
      };
      
      await setDoc(orderRef, newOrderHistory);
    }
    
    return true;
  } catch (error) {
    console.error('Error saving order to Firestore:', error);
    throw error;
  }
};

// Get order history for a user
export const getOrderHistoryFromFirestore = async (email: string) => {
  try {
    const orderRef = doc(db, 'orders', email);
    const orderDoc = await getDoc(orderRef);
    
    if (orderDoc.exists()) {
      return orderDoc.data() as FirestoreOrderHistory;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting order history from Firestore:', error);
    throw error;
  }
};

// Update order status in order history
export const updateOrderStatusInFirestore = async (email: string, orderDateTime: string, newStatus: string) => {
  try {
    const orderRef = doc(db, 'orders', email);
    const orderDoc = await getDoc(orderRef);
    
    if (orderDoc.exists()) {
      const data = orderDoc.data() as FirestoreOrderHistory;
      const updatedOrderHistory = data.order_history.map(order => {
        if (order.date_time === orderDateTime) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      
      await updateDoc(orderRef, {
        updated_at: new Date().toISOString(),
        order_history: updatedOrderHistory
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating order status in Firestore:', error);
    throw error;
  }
};

// Delete order history document for a user
export const deleteOrderHistoryFromFirestore = async (email: string) => {
  try {
    const orderRef = doc(db, 'orders', email);
    await deleteDoc(orderRef);
    return true;
  } catch (error) {
    console.error('Error deleting order history from Firestore:', error);
    throw error;
  }
};