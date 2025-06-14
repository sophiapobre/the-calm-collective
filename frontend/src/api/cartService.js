export async function createNewCart() {
  const response = await fetch('http://localhost:4000/api/shopping-cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  const data = await response.json();
  localStorage.setItem('cartId', data.cartId); // Store cartId in localStorage

  return data.cartId;
}

export async function addItemToCart(cartId, productId, productAttributeId) {
  const response = await fetch(`http://localhost:4000/api/shopping-cart/${cartId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, productAttributeId })
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}

export async function getCart(cartId) {
  const response = await fetch(`http://localhost:4000/api/shopping-cart/${cartId}/items`, {
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
  const response = await fetch(`http://localhost:4000/api/shopping-cart/${cartId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}