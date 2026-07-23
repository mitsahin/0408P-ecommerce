import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosClient, { setAuthToken } from '../api/axiosClient'
import {
  setAddress,
  setAppliedCoupon,
  setCart,
  setCouponCode,
  setPayment,
} from '../store/actions/shoppingCartActions'

const emptyAddress = {
  title: '',
  name: '',
  surname: '',
  phone: '',
  city: '',
  district: '',
  neighborhood: '',
  address: '',
}

const emptyCard = {
  card_no: '',
  expire_month: '',
  expire_year: '',
  name_on_card: '',
}

const turkishCities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara',
  'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman',
  'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
  'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne',
  'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun',
  'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir',
  'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri',
  'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya',
  'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde',
  'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt',
  'Sinop', 'Şırnak', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli',
  'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
]

const formatPrice = (value) =>
  `${Number(value).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TL`

const maskPhone = (phone) => {
  const digits = String(phone ?? '').replace(/\D/g, '')
  if (digits.length < 4) return phone || ''
  const last2 = digits.slice(-2)
  const prefix = digits.slice(0, 3)
  return `(${prefix}) *** ** ${last2}`
}

const buildNeighborhood = (mahalle, addressDetail) =>
  [mahalle, addressDetail].map((part) => String(part ?? '').trim()).filter(Boolean).join('\n')

const parseNeighborhood = (value) => {
  const text = String(value ?? '')
  const [first, ...rest] = text.split('\n')
  if (rest.length) {
    return { mahalle: first.trim(), address: rest.join('\n').trim() }
  }
  return { mahalle: '', address: text.trim() }
}

const CreateOrderPage = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const cartItems = useSelector((state) => state.shoppingCart?.cart ?? [])
  const appliedCoupon = useSelector(
    (state) => state.shoppingCart?.appliedCoupon ?? ''
  )

  const [step, setStep] = useState(1)
  const [addresses, setAddresses] = useState([])
  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selectedShippingId, setSelectedShippingId] = useState(null)
  const [selectedBillingId, setSelectedBillingId] = useState(null)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState(emptyAddress)
  const [addressType, setAddressType] = useState('shipping')
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [addressErrors, setAddressErrors] = useState({})
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [cardForm, setCardForm] = useState(emptyCard)
  const [editingCardId, setEditingCardId] = useState(null)
  const [paymentMode, setPaymentMode] = useState('saved')
  const [cardErrors, setCardErrors] = useState({})
  const [ccv, setCcv] = useState('')
  const [ccvError, setCcvError] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const ccvInputRef = useRef(null)

  const selectedItems = cartItems.filter((item) => item.checked !== false)
  const orderSubtotal = selectedItems.reduce(
    (sum, item) => sum + (item.count ?? 0) * Number(item.product?.price ?? 0),
    0
  )
  const shipping = selectedItems.length > 0 ? 29.99 : 0
  const freeShippingDiscount = orderSubtotal >= 150 ? shipping : 0
  const couponRate = appliedCoupon === 'SAVE10' ? 0.1 : 0
  const couponDiscount = orderSubtotal * couponRate
  const orderGrandTotal =
    orderSubtotal + shipping - freeShippingDiscount - couponDiscount

  const months = Array.from({ length: 12 }, (_, i) => String(i + 1))
  const years = Array.from({ length: 12 }, (_, i) =>
    String(new Date().getFullYear() + i)
  )
  const idEquals = (left, right) => String(left) === String(right)

  const normalizeCollection = (value) => {
    if (Array.isArray(value)) return value
    if (Array.isArray(value?.data)) return value.data
    if (value && typeof value === 'object') {
      const values = Object.values(value)
      if (values.length && values.every((item) => item && typeof item === 'object')) {
        return values
      }
    }
    return []
  }

  const getAddressKind = (title) => {
    const value = String(title ?? '').toLowerCase()
    if (value.startsWith('billing -') || value.startsWith('fatura -')) return 'billing'
    if (value.startsWith('shipping -') || value.startsWith('teslimat -')) return 'shipping'
    return 'shipping'
  }

  const stripAddressPrefix = (title) =>
    String(title ?? '')
      .replace(/^(shipping|billing|teslimat|fatura)\s*-\s*/i, '')
      .trim()

  const formatAddressTitle = (title, type) => {
    const clean = stripAddressPrefix(title) || 'Adres'
    return type === 'billing' ? `Billing - ${clean}` : `Shipping - ${clean}`
  }

  const shippingAddresses = useMemo(
    () => addresses.filter((item) => getAddressKind(item.title) === 'shipping'),
    [addresses]
  )
  const billingAddresses = useMemo(
    () => addresses.filter((item) => getAddressKind(item.title) === 'billing'),
    [addresses]
  )

  const selectedShipping =
    shippingAddresses.find((item) => idEquals(item.id, selectedShippingId)) ?? null
  const selectedBilling = sameAsShipping
    ? selectedShipping
    : billingAddresses.find((item) => idEquals(item.id, selectedBillingId)) ?? null
  const selectedAddressId = selectedShipping?.id ?? null

  const maskCardNo = (cardNo) => {
    const digits = String(cardNo ?? '').replace(/\s+/g, '')
    if (!digits) return ''
    return `**** **** **** ${digits.slice(-4)}`
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setAuthToken(token)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setLoadError('')
      try {
        const [addressRes, cardRes] = await Promise.all([
          axiosClient.get('/user/address'),
          axiosClient.get('/user/card'),
        ])
        const nextAddresses = normalizeCollection(addressRes?.data)
        const nextCards = normalizeCollection(cardRes?.data)
        setAddresses(nextAddresses)
        setCards(nextCards)
        if (nextCards.length > 0) {
          setSelectedCardId(nextCards[0].id)
          setPaymentMode('saved')
        } else {
          setPaymentMode('new')
        }

        const firstShipping =
          nextAddresses.find((item) => getAddressKind(item.title) === 'shipping') ??
          nextAddresses[0]
        if (firstShipping) setSelectedShippingId(firstShipping.id)

        const firstBilling = nextAddresses.find(
          (item) => getAddressKind(item.title) === 'billing'
        )
        if (firstBilling) setSelectedBillingId(firstBilling.id)
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Adres veya kart bilgileri yüklenemedi.'
        setLoadError(message)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    dispatch(setAddress(selectedShipping ?? {}))
  }, [selectedShipping, dispatch])

  useEffect(() => {
    const selectedCard =
      cards.find((card) => idEquals(card.id, selectedCardId)) ?? {}
    dispatch(setPayment(selectedCard))
  }, [cards, selectedCardId, dispatch])

  const openAddAddressForm = (type = 'shipping') => {
    setEditingAddressId(null)
    setAddressType(type)
    setAddressForm(emptyAddress)
    setAddressErrors({})
    setShowAddressForm(true)
  }

  const handleAddressEdit = (address) => {
    const parsed = parseNeighborhood(address.neighborhood)
    setEditingAddressId(address.id)
    setAddressType(getAddressKind(address.title))
    setAddressForm({
      title: stripAddressPrefix(address.title ?? ''),
      name: address.name ?? '',
      surname: address.surname ?? '',
      phone: address.phone ?? '',
      city: address.city ?? '',
      district: address.district ?? '',
      neighborhood: parsed.mahalle,
      address: parsed.address,
    })
    setAddressErrors({})
    setShowAddressForm(true)
  }

  const validateAddressForm = () => {
    const nextErrors = {}
    if (!addressForm.title.trim()) nextErrors.title = 'Adres başlığı zorunlu'
    if (!addressForm.name.trim()) nextErrors.name = 'Ad zorunlu'
    if (!addressForm.surname.trim()) nextErrors.surname = 'Soyad zorunlu'
    if (!addressForm.phone.trim()) {
      nextErrors.phone = 'Telefon zorunlu'
    } else if (!/^(\+90|0)?5\d{9}$/.test(addressForm.phone.replace(/\s/g, ''))) {
      nextErrors.phone = 'Geçerli bir telefon girin'
    }
    if (!addressForm.city.trim()) nextErrors.city = 'İl zorunlu'
    if (!addressForm.district.trim()) nextErrors.district = 'İlçe zorunlu'
    if (!addressForm.neighborhood.trim() && !addressForm.address.trim()) {
      nextErrors.neighborhood = 'Mahalle / adres zorunlu'
    }
    setAddressErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleAddressSubmit = async (event) => {
    event.preventDefault()
    if (!validateAddressForm()) return

    const payloadBase = {
      title: formatAddressTitle(addressForm.title, addressType),
      name: addressForm.name.trim(),
      surname: addressForm.surname.trim(),
      phone: addressForm.phone.trim(),
      city: addressForm.city.trim().toLowerCase(),
      district: addressForm.district.trim().toLowerCase(),
      neighborhood: buildNeighborhood(
        addressForm.neighborhood,
        addressForm.address
      ),
    }

    try {
      if (editingAddressId) {
        const payload = { id: editingAddressId, ...payloadBase }
        const response = await axiosClient.put('/user/address', payload)
        const saved = response?.data ?? payload
        setAddresses((prev) =>
          prev.map((item) => (idEquals(item.id, editingAddressId) ? saved : item))
        )
        toast.success('Adres güncellendi')
      } else {
        const response = await axiosClient.post('/user/address', payloadBase)
        const saved = response?.data ?? payloadBase
        setAddresses((prev) => [...prev, saved])
        if (addressType === 'shipping') setSelectedShippingId(saved.id)
        if (addressType === 'billing') setSelectedBillingId(saved.id)
        toast.success('Adres eklendi')
      }

      setAddressForm(emptyAddress)
      setEditingAddressId(null)
      setShowAddressForm(false)
      setAddressErrors({})
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Adres kaydedilemedi.'
      )
    }
  }

  const handleAddressDelete = async (addressId) => {
    try {
      await axiosClient.delete(`/user/address/${addressId}`)
      setAddresses((prev) => prev.filter((item) => !idEquals(item.id, addressId)))
      setSelectedShippingId((prev) => (idEquals(prev, addressId) ? null : prev))
      setSelectedBillingId((prev) => (idEquals(prev, addressId) ? null : prev))
      toast.success('Adres silindi')
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Adres silinemedi.'
      )
    }
  }

  const validateCardForm = () => {
    const nextErrors = {}
    const digits = String(cardForm.card_no ?? '').replace(/\D/g, '')
    if (!cardForm.name_on_card.trim()) nextErrors.name_on_card = 'İsim zorunlu'
    if (!/^\d{16}$/.test(digits)) {
      nextErrors.card_no = 'Kart numarası 16 haneli olmalı'
    }
    if (!/^(0?[1-9]|1[0-2])$/.test(String(cardForm.expire_month))) {
      nextErrors.expire_month = 'Ay 1-12 olmalı'
    }
    if (!/^\d{4}$/.test(String(cardForm.expire_year))) {
      nextErrors.expire_year = 'Yıl 4 haneli olmalı'
    }
    setCardErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleCardSubmit = async (event) => {
    event.preventDefault()
    if (!validateCardForm()) return
    try {
      const payloadBase = {
        card_no: String(cardForm.card_no ?? '').replace(/\D/g, ''),
        name_on_card: cardForm.name_on_card.trim(),
        expire_month: Number(cardForm.expire_month),
        expire_year: Number(cardForm.expire_year),
      }
      if (editingCardId) {
        const payload = { id: editingCardId, ...payloadBase }
        const response = await axiosClient.put('/user/card', payload)
        const saved = normalizeCollection(response?.data)[0] ?? response?.data ?? payload
        setCards((prev) =>
          prev.map((item) => (idEquals(item.id, editingCardId) ? saved : item))
        )
        toast.success('Kayıtlı kart güncellendi')
      } else {
        const response = await axiosClient.post('/user/card', payloadBase)
        const saved =
          normalizeCollection(response?.data)[0] ??
          (response?.data?.id ? response.data : null) ??
          { ...payloadBase, id: Date.now() }
        setCards((prev) => [...prev, saved])
        setSelectedCardId(saved.id)
        toast.success('Kart kayıtlı kart olarak eklendi')
      }
      setCardForm(emptyCard)
      setEditingCardId(null)
      setCardErrors({})
      setPaymentMode('saved')
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Kart kaydedilemedi.'
      )
    }
  }

  const handleCardEdit = (card) => {
    setEditingCardId(card.id)
    setPaymentMode('new')
    setCardForm({
      card_no: card.card_no ?? '',
      expire_month: String(card.expire_month ?? ''),
      expire_year: String(card.expire_year ?? ''),
      name_on_card: card.name_on_card ?? '',
    })
  }

  const handleCardDelete = async (cardId) => {
    try {
      await axiosClient.delete(`/user/card/${cardId}`)
      setCards((prev) => prev.filter((item) => !idEquals(item.id, cardId)))
      setSelectedCardId((prev) => (idEquals(prev, cardId) ? null : prev))
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Kart silinemedi.'
      )
    }
  }

  const handlePayWithSavedCard = () => {
    if (cards.length === 0) {
      toast.info('Kayıtlı kart bulunamadı. Yeni kart ekleyin.')
      setPaymentMode('new')
      return
    }
    setPaymentMode('saved')
    setEditingCardId(null)
    setCardForm(emptyCard)
    setCardErrors({})
    const nextId = selectedCardId || cards[0].id
    setSelectedCardId(nextId)
    setTimeout(() => ccvInputRef.current?.focus(), 50)
    toast.success('Kayıtlı kart seçildi. CVV girin (örn. 321).')
  }

  const handleContinueToPayment = () => {
    if (!selectedShippingId) {
      toast.error('Lütfen bir teslimat adresi seçin.')
      return
    }
    if (!sameAsShipping && !selectedBillingId) {
      toast.error('Lütfen bir fatura adresi seçin.')
      return
    }
    setStep(2)
    if (cards.length > 0) {
      setPaymentMode('saved')
      setTimeout(() => ccvInputRef.current?.focus(), 100)
    } else {
      setPaymentMode('new')
    }
  }

  const orderBlockers = []
  if (selectedItems.length === 0) orderBlockers.push('Sepette seçili ürün yok')
  if (!selectedAddressId) orderBlockers.push('Teslimat adresi seçilmedi')
  if (!selectedCardId) orderBlockers.push('Kayıtlı kart seçilmedi')
  if (!termsAccepted) orderBlockers.push('Sözleşmeyi onaylayın')
  if (!/^\d{3,4}$/.test(ccv)) orderBlockers.push('CVV girin (3-4 hane)')

  const canSubmitOrder = orderBlockers.length === 0 && !isSubmitting

  const handleCreateOrder = async () => {
    if (orderBlockers.length) {
      toast.error(orderBlockers[0])
      if (!/^\d{3,4}$/.test(ccv)) {
        setPaymentMode('saved')
        setCcvError('CVV 3 veya 4 haneli olmalı')
        setTimeout(() => ccvInputRef.current?.focus(), 50)
      }
      return
    }
    setCcvError('')

    const selectedCard = cards.find((card) => idEquals(card.id, selectedCardId))
    if (!selectedCard) {
      toast.error('Lütfen bir kart seçin.')
      return
    }

    const payload = {
      address_id: Number(selectedAddressId),
      order_date: new Date().toISOString(),
      card_no: String(selectedCard.card_no),
      card_name: selectedCard.name_on_card,
      card_expire_month: Number(selectedCard.expire_month),
      card_expire_year: Number(selectedCard.expire_year),
      card_ccv: Number(ccv),
      price: Math.round(Math.max(0, orderGrandTotal)),
      products: selectedItems.map((item) => {
        const rawId = item.product?.id
        const numericId = Number(rawId)
        const snapshot = {
          id: rawId,
          name: item.product?.name ?? item.product?.title ?? 'Ürün',
          image:
            item.product?.images?.[0]?.url ??
            item.product?.image ??
            item.product?.thumbnail ??
            item.product?.img ??
            '',
          price: Number(item.product?.price ?? 0),
          detail: item.product?.detail ?? '',
        }
        return {
          product_id: Number.isFinite(numericId) ? numericId : 0,
          count: item.count,
          detail: JSON.stringify(snapshot),
        }
      }),
    }

    try {
      setIsSubmitting(true)
      const response = await axiosClient.post('/order', payload)
      const createdOrderId = response?.data?.id
      toast.success(
        createdOrderId
          ? `Tebrikler! Siparişiniz oluşturuldu (#${createdOrderId})`
          : 'Tebrikler! Siparişiniz oluşturuldu'
      )
      dispatch(setCart([]))
      dispatch(setCouponCode(''))
      dispatch(setAppliedCoupon(''))
      dispatch(setAddress({}))
      dispatch(setPayment({}))
      history.push('/orders', { createdOrderId })
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Sipariş oluşturulamadı.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderAddressCard = (address, selectedId, onSelect) => {
    const isSelected = idEquals(selectedId, address.id)
    const displayTitle = stripAddressPrefix(address.title) || address.title
    const parsed = parseNeighborhood(address.neighborhood)

    return (
      <div
        key={address.id}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(address.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelect(address.id)
          }
        }}
        className={`flex min-h-[160px] w-full flex-col gap-2 rounded-xl border bg-white p-4 text-left shadow-sm transition sm:w-[calc(50%-8px)] ${
          isSelected ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                isSelected
                  ? 'border-orange-500 bg-orange-500'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {isSelected ? (
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              ) : null}
            </span>
            <span className="text-sm font-semibold text-slate-900">{displayTitle}</span>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              handleAddressEdit(address)
            }}
            className="text-xs font-semibold text-orange-500 hover:text-orange-600"
          >
            Düzenle
          </button>
        </div>

        <div className="flex flex-col gap-1 text-sm text-slate-600">
          <span>
            {address.name} {address.surname}
          </span>
          <span>{maskPhone(address.phone)}</span>
          <span className="text-xs leading-relaxed text-slate-500">
            {[parsed.mahalle || parsed.address, address.district, address.city]
              .filter(Boolean)
              .join(' / ')}
          </span>
          {parsed.mahalle && parsed.address ? (
            <span className="text-xs text-slate-500">{parsed.address}</span>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              handleAddressDelete(address.id)
            }}
            className="text-xs font-semibold text-rose-500"
          >
            Sil
          </button>
          {getAddressKind(address.title) === 'billing' ? (
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Kurumsal
            </span>
          ) : null}
        </div>
      </div>
    )
  }

  const OrderSummaryAside = ({ primaryAction, primaryLabel }) => (
    <aside className="flex w-full flex-col gap-3 lg:sticky lg:top-6 lg:w-[30%] lg:self-start">
      <button
        type="button"
        onClick={primaryAction}
        className="w-full rounded-xl bg-orange-500 px-6 py-3.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
      >
        {primaryLabel}
      </button>

      <label className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(event) => setTermsAccepted(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-orange-500"
        />
        <span>
          <Link to="/pages" className="font-semibold text-sky-600 underline">
            Ön Bilgilendirme Koşulları
          </Link>{' '}
          ve{' '}
          <Link to="/pages" className="font-semibold text-sky-600 underline">
            Mesafeli Satış Sözleşmesi
          </Link>{' '}
          &apos;ni okudum ve kabul ediyorum.
        </span>
      </label>

      <div className="flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Sipariş Özeti</h2>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Ürünün Toplamı</span>
          <span>{formatPrice(orderSubtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Kargo Toplamı</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        {freeShippingDiscount > 0 ? (
          <div className="flex items-start justify-between gap-3 text-sm text-orange-500">
            <span className="leading-snug">
              150 TL ve Üzeri Kargo Bedava (Satıcı Karşılar)
            </span>
            <span className="shrink-0 font-semibold">
              -{formatPrice(freeShippingDiscount)}
            </span>
          </div>
        ) : null}
        {couponDiscount > 0 ? (
          <div className="flex items-center justify-between text-sm text-orange-500">
            <span>İndirim ({appliedCoupon})</span>
            <span className="font-semibold">-{formatPrice(couponDiscount)}</span>
          </div>
        ) : null}
        <div className="h-px w-full bg-slate-100" />
        <div className="flex items-center justify-between text-base font-semibold">
          <span className="text-slate-900">Toplam</span>
          <span className="text-orange-500">{formatPrice(orderGrandTotal)}</span>
        </div>
      </div>

      {step === 2 && orderBlockers.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Eksik: {orderBlockers.join(' · ')}
        </div>
      ) : null}

      <button
        type="button"
        onClick={primaryAction}
        className="w-full rounded-xl bg-orange-500 px-6 py-3.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
      >
        {isSubmitting ? 'Gönderiliyor...' : primaryLabel}
      </button>
    </aside>
  )

  return (
    <section className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Sipariş Oluştur</h1>

      {loadError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {loadError}
        </div>
      ) : null}

      {/* Step tabs */}
      <div className="flex w-full flex-col gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:flex-row">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`flex flex-1 flex-col gap-1 border-b-2 px-4 py-3 text-left sm:border-b-0 sm:border-r ${
            step === 1
              ? 'border-orange-500 bg-white'
              : 'border-transparent bg-slate-50 text-slate-400'
          }`}
        >
          <span
            className={`text-sm font-semibold ${
              step === 1 ? 'text-orange-500' : 'text-slate-400'
            }`}
          >
            1. Adres Bilgileri
          </span>
          {selectedShipping ? (
            <span className="text-xs text-slate-500">
              {stripAddressPrefix(selectedShipping.title)} · {selectedShipping.city}/
              {selectedShipping.district}
            </span>
          ) : (
            <span className="text-xs text-slate-400">Teslimat adresi seçin</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            if (selectedShippingId) setStep(2)
            else toast.error('Önce teslimat adresi seçin.')
          }}
          className={`flex flex-1 flex-col gap-1 border-b-2 px-4 py-3 text-left ${
            step === 2
              ? 'border-orange-500 bg-white'
              : 'border-transparent bg-slate-50 text-slate-400'
          }`}
        >
          <span
            className={`text-sm font-semibold ${
              step === 2 ? 'text-orange-500' : 'text-slate-400'
            }`}
          >
            2. Ödeme Seçenekleri
          </span>
        </button>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-xs text-slate-600">
        <span className="mt-0.5 text-orange-500">ℹ</span>
        <span>
          Kurumsal faturalı alışveriş yapmak için &quot;Faturamı Aynı Adrese Gönder&quot;
          seçeneğini kaldırın ve fatura adresi olarak kayıtlı kurumsal fatura
          adresinizi seçin.
        </span>
      </div>

      {step === 1 ? (
        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <div className="flex w-full flex-col gap-5 lg:w-[70%]">
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Teslimat Adresi</h2>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(event) => setSameAsShipping(event.target.checked)}
                  className="h-4 w-4 accent-orange-500"
                />
                Faturamı Aynı Adrese Gönder
              </label>
            </div>

            {isLoading ? (
              <span className="text-sm text-slate-400">Adresler yükleniyor...</span>
            ) : null}

            <div className="flex w-full flex-wrap gap-4">
              <button
                type="button"
                onClick={() => openAddAddressForm('shipping')}
                className="flex min-h-[160px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-slate-500 transition hover:border-orange-400 hover:text-orange-500 sm:w-[calc(50%-8px)]"
              >
                <span className="text-3xl font-light leading-none">+</span>
                <span className="text-sm font-semibold">Yeni Adres Ekle</span>
              </button>

              {shippingAddresses.map((address) =>
                renderAddressCard(address, selectedShippingId, setSelectedShippingId)
              )}
            </div>

            {!sameAsShipping ? (
              <div className="flex w-full flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">Fatura Adresi</h2>
                  <button
                    type="button"
                    onClick={() => openAddAddressForm('billing')}
                    className="text-sm font-semibold text-orange-500"
                  >
                    + Fatura Adresi Ekle
                  </button>
                </div>
                <div className="flex w-full flex-wrap gap-4">
                  {billingAddresses.length === 0 ? (
                    <span className="text-sm text-slate-400">
                      Kayıtlı fatura adresi yok.
                    </span>
                  ) : (
                    billingAddresses.map((address) =>
                      renderAddressCard(
                        address,
                        selectedBillingId,
                        setSelectedBillingId
                      )
                    )
                  )}
                </div>
              </div>
            ) : null}

            {showAddressForm ? (
              <form
                onSubmit={handleAddressSubmit}
                className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-900">
                    {editingAddressId ? 'Adresi Güncelle' : 'Yeni Adres Ekle'}
                  </h3>
                  <div className="flex gap-2 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setAddressType('shipping')}
                      className={`rounded-full px-3 py-1.5 ${
                        addressType === 'shipping'
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Teslimat
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressType('billing')}
                      className={`rounded-full px-3 py-1.5 ${
                        addressType === 'billing'
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Fatura
                    </button>
                  </div>
                </div>

                <div className="grid w-full gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500">
                      Address Title
                    </label>
                    <input
                      name="title"
                      value={addressForm.title}
                      onChange={(e) =>
                        setAddressForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="ev adresi"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                    />
                    {addressErrors.title ? (
                      <span className="text-xs text-rose-500">{addressErrors.title}</span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500">Phone</label>
                    <input
                      name="phone"
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="05376845834"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                    />
                    {addressErrors.phone ? (
                      <span className="text-xs text-rose-500">{addressErrors.phone}</span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500">Name</label>
                    <input
                      name="name"
                      value={addressForm.name}
                      onChange={(e) =>
                        setAddressForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Alişan"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                    />
                    {addressErrors.name ? (
                      <span className="text-xs text-rose-500">{addressErrors.name}</span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500">
                      Surname
                    </label>
                    <input
                      name="surname"
                      value={addressForm.surname}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          surname: e.target.value,
                        }))
                      }
                      placeholder="Karababa"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                    />
                    {addressErrors.surname ? (
                      <span className="text-xs text-rose-500">
                        {addressErrors.surname}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500">
                      City (İl)
                    </label>
                    <select
                      name="city"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm((prev) => ({ ...prev, city: e.target.value }))
                      }
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400"
                    >
                      <option value="">Seçiniz</option>
                      {turkishCities.map((city) => (
                        <option key={city} value={city.toLowerCase()}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {addressErrors.city ? (
                      <span className="text-xs text-rose-500">{addressErrors.city}</span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500">
                      District (İlçe)
                    </label>
                    <input
                      name="district"
                      value={addressForm.district}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          district: e.target.value,
                        }))
                      }
                      placeholder="esenler"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                    />
                    {addressErrors.district ? (
                      <span className="text-xs text-rose-500">
                        {addressErrors.district}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">
                      Neighborhood (Mahalle)
                    </label>
                    <input
                      name="neighborhood"
                      value={addressForm.neighborhood}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          neighborhood: e.target.value,
                        }))
                      }
                      placeholder="Mahalle"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">
                      Address (Sokak, bina, kapı no)
                    </label>
                    <textarea
                      name="address"
                      value={addressForm.address}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="adres detayları"
                      className="min-h-[90px] rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                    />
                    {addressErrors.neighborhood ? (
                      <span className="text-xs text-rose-500">
                        {addressErrors.neighborhood}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                  >
                    {editingAddressId ? 'Update Address' : 'Add Address'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressForm(false)
                      setEditingAddressId(null)
                      setAddressForm(emptyAddress)
                      setAddressErrors({})
                    }}
                    className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
                  >
                    İptal
                  </button>
                </div>
              </form>
            ) : null}
          </div>

          <OrderSummaryAside
            primaryAction={handleContinueToPayment}
            primaryLabel="Kaydet ve Devam Et"
          />
        </div>
      ) : null}

      {step === 2 ? (
        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <div className="flex w-full flex-col gap-5 lg:w-[70%]">
            <div className="flex w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={handlePayWithSavedCard}
                className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
                  paymentMode === 'saved'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Kayıtlı kartımla ödeme yap
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentMode('new')
                  setEditingCardId(null)
                  setCardForm(emptyCard)
                  setCardErrors({})
                }}
                className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
                  paymentMode === 'new'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Yeni kart ekle
              </button>
            </div>

            {paymentMode === 'saved' ? (
              <div className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">Kayıtlı Kartlar</h2>
                  <span className="text-xs text-slate-400">{cards.length} kart</span>
                </div>

                {cards.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center">
                    <p className="text-sm text-slate-500">Kayıtlı kart bulunamadı.</p>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('new')}
                      className="mt-3 text-sm font-semibold text-orange-500"
                    >
                      Yeni kart ekle
                    </button>
                  </div>
                ) : (
                  <div className="flex w-full flex-col gap-3">
                    {cards.map((card) => {
                      const selected = idEquals(selectedCardId, card.id)
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => {
                            setSelectedCardId(card.id)
                            setTimeout(() => ccvInputRef.current?.focus(), 50)
                          }}
                          className={`flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition ${
                            selected
                              ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border ${
                                selected
                                  ? 'border-orange-500 bg-orange-500'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {selected ? (
                                <span className="h-2 w-2 rounded-full bg-white" />
                              ) : null}
                            </span>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-semibold text-slate-900">
                                {card.name_on_card}
                              </span>
                              <span className="font-mono text-sm text-slate-600">
                                {maskCardNo(card.card_no)}
                              </span>
                              <span className="text-xs text-slate-500">
                                SKT {card.expire_month}/{card.expire_year}
                              </span>
                            </div>
                          </div>
                          <div
                            className="flex gap-3 text-xs"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            role="presentation"
                          >
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={() => handleCardEdit(card)}
                              onKeyDown={(e) => e.key === 'Enter' && handleCardEdit(card)}
                              className="cursor-pointer font-semibold text-orange-500"
                            >
                              Düzenle
                            </span>
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={() => handleCardDelete(card.id)}
                              onKeyDown={(e) =>
                                e.key === 'Enter' && handleCardDelete(card.id)
                              }
                              className="cursor-pointer font-semibold text-rose-500"
                            >
                              Sil
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {selectedCardId ? (
                  <div className="flex w-full flex-col gap-2 rounded-xl border border-orange-200 bg-orange-50 p-4 sm:max-w-sm">
                    <label className="text-sm font-semibold text-slate-800">
                      Güvenlik kodu (CVV)
                    </label>
                    <input
                      ref={ccvInputRef}
                      value={ccv}
                      onChange={(e) => {
                        setCcv(e.target.value.replace(/\D/g, '').slice(0, 4))
                        if (ccvError) setCcvError('')
                      }}
                      placeholder="321"
                      inputMode="numeric"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base tracking-widest outline-none focus:border-orange-400"
                    />
                    {ccvError ? (
                      <span className="text-xs text-rose-500">{ccvError}</span>
                    ) : (
                      <span className="text-xs text-slate-500">
                        Test için CVV: <strong>321</strong>
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
            ) : (
              <form
                className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                onSubmit={handleCardSubmit}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-900">
                    {editingCardId ? 'Kartı Güncelle' : 'Yeni Kart Bilgileri'}
                  </h3>
                  <button
                    type="button"
                    onClick={handlePayWithSavedCard}
                    className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700"
                  >
                    Kayıtlı kartımla ödeme yap
                  </button>
                </div>

                <div className="flex w-full flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Kart Numarası</label>
                  <input
                    value={cardForm.card_no}
                    onChange={(e) =>
                      setCardForm((prev) => ({ ...prev, card_no: e.target.value }))
                    }
                    placeholder="1234123412341234"
                    className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
                  />
                  {cardErrors.card_no ? (
                    <span className="text-xs text-rose-500">{cardErrors.card_no}</span>
                  ) : null}
                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row">
                  <div className="flex w-full flex-col gap-2 sm:w-[45%]">
                    <label className="text-sm font-semibold text-slate-700">
                      Son Kullanma Tarihi
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={cardForm.expire_month}
                        onChange={(e) =>
                          setCardForm((prev) => ({
                            ...prev,
                            expire_month: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                      >
                        <option value="">Ay</option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <select
                        value={cardForm.expire_year}
                        onChange={(e) =>
                          setCardForm((prev) => ({
                            ...prev,
                            expire_year: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                      >
                        <option value="">Yıl</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-[30%]">
                    <label className="text-sm font-semibold text-slate-700">CVV</label>
                    <input
                      ref={ccvInputRef}
                      value={ccv}
                      onChange={(e) => {
                        setCcv(e.target.value.replace(/\D/g, '').slice(0, 4))
                        if (ccvError) setCcvError('')
                      }}
                      placeholder="321"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Kart Üzerindeki İsim
                  </label>
                  <input
                    value={cardForm.name_on_card}
                    onChange={(e) =>
                      setCardForm((prev) => ({
                        ...prev,
                        name_on_card: e.target.value,
                      }))
                    }
                    placeholder="Ali Bas"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  {cardErrors.name_on_card ? (
                    <span className="text-xs text-rose-500">{cardErrors.name_on_card}</span>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                  >
                    {editingCardId ? 'Kartı Güncelle' : 'Kayıtlı kart olarak ekle'}
                  </button>
                  <button
                    type="button"
                    onClick={handlePayWithSavedCard}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
                  >
                    İptal
                  </button>
                </div>
              </form>
            )}
          </div>

          <OrderSummaryAside
            primaryAction={handleCreateOrder}
            primaryLabel={isSubmitting ? 'Sipariş Oluşturuluyor...' : 'Sipariş Oluştur'}
          />
        </div>
      ) : null}
    </section>
  )
}

export default CreateOrderPage
