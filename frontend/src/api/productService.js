import { API_URL } from '../config';
export async function getProduct(productId) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_URL}/api/products/${productId}`, {
    method: 'GET',
    headers: headers,
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}

export async function getProductCategoryNames(productId) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Get category product documents associated with the product
  const response = await fetch(`${API_URL}/api/category-products/product/${productId}`, {
    method: 'GET',
    headers: headers,
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  const categoryProductDocs = await response.json();

  // Extract category names from populated categoryId objects
  const categoryNames = categoryProductDocs.map(doc => {
    // If categoryId is populated (an object with a name property)
    if (doc.categoryId && typeof doc.categoryId === 'object' && doc.categoryId.name) {
      return doc.categoryId.name;
    }
    // Fallback: if it's just a string ID, return it (shouldn't happen with our optimized backend)
    return doc.categoryId;
  }).filter(name => name); // Filter out any null/undefined values

  return categoryNames;
}

export async function getProductAttributes(productId) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/product-attributes/${productId}`, {
    method: 'GET',
    headers: headers,
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}

export async function getProductAttribute(attributeId) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/product-attributes/attribute/${attributeId}`, {
    method: 'GET',
    headers: headers,
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}

export async function getProductAttributePrices(productId) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/product-attribute-prices/${productId}/all`, {
    method: 'GET',
    headers: headers,
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}

export async function getProductAttributePrice(productId, productAttributeId) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/product-attribute-prices/${productId}?productAttributeId=${productAttributeId}`, {
    method: 'GET',
    headers: headers,
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}

export async function getProductAttributesAndPrices(productId, productAttributeId) {  
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Use the optimized combined endpoint
  const response = await fetch(`${API_URL}/api/product-attribute-prices/${productId}/with-attributes`, {
    method: 'GET',
    headers: headers,
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}