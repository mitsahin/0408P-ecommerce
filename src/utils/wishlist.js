export const WISHLIST_STORAGE_KEY = 'wishlistProductIds'
export const WISHLIST_ITEMS_STORAGE_KEY = 'wishlistProductItems'
export const WISHLIST_CHANGED_EVENT = 'wishlist:changed'

export const readWishlistIds = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export const readWishlistItemsMap = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(WISHLIST_ITEMS_STORAGE_KEY) || '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export const emitWishlistChanged = () => {
  window.dispatchEvent(new Event(WISHLIST_CHANGED_EVENT))
}

const normalizeWishlistProduct = (product = {}) => {
  const id = String(product?.id ?? product?.resolvedId ?? '')
  if (!id) return null
  const existingAddedAt = product?.addedAt
  const parsedAddedAt =
    existingAddedAt && !Number.isNaN(new Date(existingAddedAt).getTime())
      ? existingAddedAt
      : null
  return {
    id,
    title: product?.title ?? product?.name ?? product?.resolvedName ?? 'Product',
    image:
      product?.image ??
      product?.resolvedImage ??
      product?.thumbnail ??
      product?.img ??
      product?.images?.[0]?.url ??
      '',
    price: Number(product?.price ?? product?.resolvedPrice ?? product?.list_price ?? 0),
    department:
      product?.department ??
      product?.resolvedDepartment ??
      product?.brand ??
      product?.category?.name ??
      '',
    inStock:
      typeof product?.inStock === 'boolean'
        ? product.inStock
        : typeof product?.resolvedInStock === 'boolean'
          ? product.resolvedInStock
          : typeof product?.in_stock === 'boolean'
            ? product.in_stock
            : Number(product?.stock ?? product?.stock_count ?? 1) > 0,
    addedAt: parsedAddedAt ?? new Date().toISOString(),
  }
}

const writeWishlistState = (ids, itemsMap) => {
  const nextIds = Array.from(new Set((ids ?? []).map(String)))
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextIds))
  localStorage.setItem(WISHLIST_ITEMS_STORAGE_KEY, JSON.stringify(itemsMap ?? {}))
  emitWishlistChanged()
  return nextIds
}

export const writeWishlistIds = (ids) => {
  const currentMap = readWishlistItemsMap()
  const allowedIds = new Set((ids ?? []).map(String))
  const nextMap = Object.fromEntries(
    Object.entries(currentMap).filter(([id]) => allowedIds.has(id))
  )
  return writeWishlistState(ids, nextMap)
}

export const addWishlistId = (id) => {
  const normalizedId = String(id)
  const current = readWishlistIds()
  if (current.includes(normalizedId)) return current
  const currentMap = readWishlistItemsMap()
  return writeWishlistState([...current, normalizedId], currentMap)
}

export const addWishlistItem = (product) => {
  const normalized = normalizeWishlistProduct(product)
  if (!normalized?.id) return readWishlistIds()
  const currentIds = readWishlistIds()
  const currentMap = readWishlistItemsMap()
  const nextMap = {
    ...currentMap,
    [normalized.id]: {
      ...normalized,
      // Re-adding updates "addedAt" so latest selection is reflected in list order.
      addedAt: new Date().toISOString(),
    },
  }
  const nextIds = currentIds.includes(normalized.id)
    ? currentIds
    : [...currentIds, normalized.id]
  return writeWishlistState(nextIds, nextMap)
}

export const removeWishlistId = (id) => {
  const normalizedId = String(id)
  const current = readWishlistIds()
  const currentMap = readWishlistItemsMap()
  const nextMap = { ...currentMap }
  delete nextMap[normalizedId]
  return writeWishlistState(
    current.filter((item) => item !== normalizedId),
    nextMap
  )
}

export const clearWishlistIds = () => writeWishlistState([], {})
