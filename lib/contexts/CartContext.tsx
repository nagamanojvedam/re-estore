'use client';

import React, { createContext, useReducer, useEffect, useContext, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Reusable action types
export type AddItemAction = (product: CartItemType) => void;
export type RemoveItemAction = (id: CartItemType['id']) => void;
export type UpdateQuantityAction = (
  id: CartItemType['id'],
  quantity: CartItemType['quantity']
) => void;
export type GetItemQuantityAction = (id: CartItemType['id']) => number;

export interface CartContextState {
  items: CartItemType[];
  total: number;
  itemCount: number;
  isOpen: boolean;

  addItem: AddItemAction;
  removeItem: RemoveItemAction;
  updateQuantity: UpdateQuantityAction;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  getItemQuantity: GetItemQuantityAction;
}

const CartContext = createContext<CartContextState | null>(null);

interface CartState {
  items: CartItemType[];
  total: number;
  itemCount: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
};

type Action =
  | { type: 'ADD_ITEM'; payload: CartItemType }
  | { type: 'REMOVE_ITEM'; payload: CartItemType['id'] }
  | {
      type: 'UPDATE_QUANTITY';
      payload: { id: CartItemType['id']; quantity: CartItemType['quantity'] };
    }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'CALCULATE_TOTALS' }
  | { type: 'LOAD_CART'; payload: CartItemType[] };

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return { ...state, items: updatedItems };
      }

      return { ...state, items: [...state.items, action.payload] };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
        .filter((item) => item.quantity > 0);

      return { ...state, items: updatedItems };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload };

    case 'CALCULATE_TOTALS': {
      const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return {
        ...state,
        itemCount,
        total: Math.round(total * 100) / 100,
      };
    }

    case 'LOAD_CART':
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      }
    }
  }, []);

  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTALS' });
  }, [state.items]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    }
  }, [state.items]);

  const addItem: AddItemAction = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${product.name} added to cart`);
  };

  const removeItem: RemoveItemAction = (id) => {
    const item = state.items.find((item) => item.id === id);
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    if (item) toast.success(`${item.name} removed`);
  };

  const updateQuantity: UpdateQuantityAction = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });

  const setCartOpen = (isOpen: boolean) => dispatch({ type: 'SET_CART_OPEN', payload: isOpen });

  const getItemQuantity: GetItemQuantityAction = (id) => {
    const item = state.items.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const value: CartContextState = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
