'use client';

import React, { createContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems,
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
        .filter((item) => item.quantity > 0);

      return {
        ...state,
        items: updatedItems,
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
      };
    }

    case 'TOGGLE_CART': {
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    }

    case 'SET_CART_OPEN': {
      return {
        ...state,
        isOpen: action.payload,
      };
    }

    case 'CALCULATE_TOTALS': {
      const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      const total = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

      return {
        ...state,
        itemCount,
        total: Math.round(total * 100) / 100,
      };
    }

    case 'LOAD_CART': {
      return {
        ...state,
        items: action.payload,
      };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      }
    }
  }, []);

  // Calculate totals when items change
  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTALS' });
  }, [state.items]);

  // Save to localStorage when items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    }
  }, [state.items]);

  const addItem = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${product.name} added to cart`);
  };

  const removeItem = (id) => {
    const item = state.items.find((item) => item.id === id);
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    if (item) {
      toast.success(`${item.name} removed from cart`);
    }
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const setCartOpen = (isOpen) => {
    dispatch({ type: 'SET_CART_OPEN', payload: isOpen });
  };

  const getItemQuantity = (id) => {
    const item = state.items.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const value = {
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

export { CartContext };
