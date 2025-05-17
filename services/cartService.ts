import { db } from '@/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { CartItem } from '@/types';

interface FirestoreCart {
  created_at: string;
  updated_at: string;
  item_list: CartItem[];
  total_amount: number;
  user_id: string;
}

const COLLECTION_NAME = 'carts';

// Create or update cart in Firestore
export const saveCartToFirestore = async (
  email: string,
  items: CartItem[],
  userId: string
): Promise<void> => {
  try {
    if (!email) return;
    
    const cartRef = doc(db, COLLECTION_NAME, email);
    const cartDoc = await getDoc(cartRef);
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const now = new Date().toISOString();
    
    if (!cartDoc.exists()) {
      // Create new cart document
      const newCart: FirestoreCart = {
        created_at: now,
        updated_at: now,
        item_list: items,
        total_amount: totalAmount,
        user_id: userId
      };
      
      await setDoc(cartRef, newCart);
    } else {
      // Update existing cart document
      await updateDoc(cartRef, {
        updated_at: now,
        item_list: items,
        total_amount: totalAmount
      });
    }
  } catch (error) {
    console.error('Error saving cart to Firestore:', error);
    throw error;
  }
};

// Get cart from Firestore
export const getCartFromFirestore = async (email: string): Promise<FirestoreCart | null> => {
  try {
    if (!email) return null;
    
    const cartRef = doc(db, COLLECTION_NAME, email);
    const cartDoc = await getDoc(cartRef);
    
    if (cartDoc.exists()) {
      return cartDoc.data() as FirestoreCart;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cart from Firestore:', error);
    throw error;
  }
};

// Delete cart from Firestore
export const deleteCartFromFirestore = async (email: string): Promise<void> => {
  try {
    if (!email) return;
    
    const cartRef = doc(db, COLLECTION_NAME, email);
    await deleteDoc(cartRef);
  } catch (error) {
    console.error('Error deleting cart from Firestore:', error);
    throw error;
  }
};