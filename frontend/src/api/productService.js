export async function getProduct(productId) {
  const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}

export async function getProductAttributes(productId) {
  const response = await fetch(`http://localhost:4000/api/product-attributes/${productId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}

export async function getProductAttribute(attributeId) {
  const response = await fetch(`http://localhost:4000/api/product-attributes/attribute/${attributeId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}

export async function getProductAttributePrices(productId) {
  const response = await fetch(`http://localhost:4000/api/product-attribute-prices/${productId}/all`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.status !== 200) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message);
  }

  return response.json();
}

export async function getProductAttributePrice(productId, productAttributeId) {
  const response = await fetch(`http://localhost:4000/api/product-attribute-prices/${productId}?productAttributeId=${productAttributeId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
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