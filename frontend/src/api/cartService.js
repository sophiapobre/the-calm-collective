import API_URL from '../config';
export async function createNewCart() {
  const headers = { 'Content-Type': 'application/json' };
  
  // Add auth token if user is logged in
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('${API_URL}/api/shopping-cart', {
    method: 'POST',
    headers: headers
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  const data = await response.json();
  localStorage.setItem('cartId', data.cartId); // Store cartId in localStorage

  return data.cartId;
}

export async function addItemToCart(cartId, productId, productAttributeId, quantity) {
  const response = await fetch(`${API_URL}/api/shopping-cart/${cartId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' }
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
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}