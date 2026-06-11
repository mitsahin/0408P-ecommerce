export function normalizeImages(images) {
  if (!images) return []
  if (typeof images === 'string') {
    try {
      return normalizeImages(JSON.parse(images))
    } catch {
      return []
    }
  }
  if (!Array.isArray(images)) return []
  if (images.length === 0) return []
  if (typeof images[0] === 'string') {
    return images.map((url, index) => ({ url, index }))
  }
  return images.map((item, index) => ({
    url: item?.url ?? '',
    index: item?.index ?? index,
  }))
}

export function formatProduct(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name ?? row.title,
    description: row.description ?? '',
    price: Number(row.price ?? 0),
    stock: Number(row.stock ?? 0),
    store_id: row.store_id ?? null,
    category_id: row.category_id ?? null,
    rating: Number(row.rating ?? 0),
    sell_count: Number(row.sell_count ?? 0),
    images: normalizeImages(row.images),
  }
}

export function formatCategory(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    img: row.img ?? '',
    code: row.code ?? '',
    rating: Number(row.rating ?? 0),
    gender: row.gender ?? '',
  }
}
