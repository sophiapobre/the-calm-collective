export async function getProduct(productId) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
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
  const response = await fetch(`http://localhost:4000/api/category-products/product/${productId}`, {
    method: 'GET',
    headers: headers,
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  const categoryProductDocs = await response.json();

  // Get the product's category names
  let categoryNames = [];
  for (const categoryProductDoc of categoryProductDocs) {
    const categoryResponse = await fetch(`http://localhost:4000/api/categories/${categoryProductDoc.categoryId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (categoryResponse.status !== 200) {
      const errorMsg = await categoryResponse.json();
      throw new Error(errorMsg.message);
    }

    const category = await categoryResponse.json();

    categoryNames.push(category.name);
  }

  return categoryNames;
}

export async function getProductAttributes(productId) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`http://localhost:4000/api/product-attributes/${productId}`, {
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

  const response = await fetch(`http://localhost:4000/api/product-attributes/attribute/${attributeId}`, {
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

  const response = await fetch(`http://localhost:4000/api/product-attribute-prices/${productId}/all`, {
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

  const response = await fetch(`http://localhost:4000/api/product-attribute-prices/${productId}?productAttributeId=${productAttributeId}`, {
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
  const attributes = await getProductAttributes(productId);
  const attributePrices = await getProductAttributePrices(productId);

  let attributesWithPrices = [];

  for (const attribute of attributes) {
    for (const price of attributePrices) {
      if (attribute._id === price.productAttributeId) {
        attributesWithPrices.push({
          ...attribute,
          price: price.price
        });
        break;
      }
    }
  }

  return attributesWithPrices;
}