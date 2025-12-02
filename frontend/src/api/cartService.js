import { API_URL } from '../config';

// Helper to get headers with optional auth token
const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export async function createNewCart() {
  const response = await fetch(`${API_URL}/api/shopping-cart`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include' // Include cookies for refresh token if logged in
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  const data = await response.json();
  localStorage.setItem('cartId', data.cartId);

  return data.cartId;
}

export async function addItemToCart(cartId, productId, productAttributeId, quantity) {
  const response = await fetch(`${API_URL}/api/shopping-cart/${cartId}/items`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify({ productId, productAttributeId, quantity })
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}

export async function getCart(cartId) {
  const response = await fetch(`${API_URL}/api/shopping-cart/${cartId}/items`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include'
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}

export async function deleteCart(cartId) {
  const response = await fetch(`${API_URL}/api/shopping-cart/${cartId}`, {
    method: 'DELETE',
    headers: getHeaders(),
    credentials: 'include'
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}