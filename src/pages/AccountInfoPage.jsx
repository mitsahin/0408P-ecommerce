import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  CreditCard,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserRound,
} from 'lucide-react'
import axiosClient from '../api/axiosClient'

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

const idEquals = (a, b) => String(a) === String(b)

const normalizeCollection = (data, keys = []) => {
  if (Array.isArray(data)) return data
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key]
  }
  if (Array.isArray(data?.data)) return data.data
  return []
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

const maskPhone = (phone) => {
  const digits = String(phone ?? '').replace(/\D/g, '')
  if (digits.length < 4) return phone || ''
  return `(${digits.slice(0, 3)}) *** ** ${digits.slice(-2)}`
}

const maskCardNo = (cardNo) => {
  const digits = String(cardNo ?? '').replace(/\s+/g, '')
  if (digits.length < 4) return '****'
  return `**** **** **** ${digits.slice(-4)}`
}

const toTitleCase = (value) =>
  String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

const formatAddressTitle = (title) => {
  const raw = String(title ?? '').trim()
  if (!raw) return 'Kayıtlı adres'
  return raw
    .replace(/^shipping\s*[-–:]?\s*/i, '')
    .replace(/^billing\s*[-–:]?\s*/i, '')
    .replace(/^teslimat\s*[-–:]?\s*/i, '')
    .replace(/^fatura\s*[-–:]?\s*/i, '')
    .trim() || raw
}

const getAddressKindLabel = (title) => {
  const raw = String(title ?? '').toLowerCase()
  if (raw.includes('billing') || raw.includes('fatura')) return 'Fatura'
  if (raw.includes('shipping') || raw.includes('teslimat')) return 'Teslimat'
  return 'Adres'
}

const AccountInfoPage = () => {
  const user = useSelector((state) => state.client?.user ?? {})
  const [activeTab, setActiveTab] = useState('addresses')

  const [addresses, setAddresses] = useState([])
  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [addressForm, setAddressForm] = useState(emptyAddress)
  const [addressErrors, setAddressErrors] = useState({})
  const [isSavingAddress, setIsSavingAddress] = useState(false)

  const [showCardForm, setShowCardForm] = useState(false)
  const [editingCardId, setEditingCardId] = useState(null)
  const [cardForm, setCardForm] = useState(emptyCard)
  const [cardErrors, setCardErrors] = useState({})
  const [isSavingCard, setIsSavingCard] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const [addressRes, cardRes] = await Promise.all([
          axiosClient.get('/user/address'),
          axiosClient.get('/user/card'),
        ])
        setAddresses(normalizeCollection(addressRes?.data, ['addresses']))
        setCards(normalizeCollection(cardRes?.data, ['cards']))
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Bilgiler yüklenemedi.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const resetAddressForm = () => {
    setAddressForm(emptyAddress)
    setAddressErrors({})
    setEditingAddressId(null)
    setShowAddressForm(false)
  }

  const resetCardForm = () => {
    setCardForm(emptyCard)
    setCardErrors({})
    setEditingCardId(null)
    setShowCardForm(false)
  }

  const handleEditAddress = (address) => {
    const parsed = parseNeighborhood(address.neighborhood)
    setEditingAddressId(address.id)
    setAddressForm({
      title: address.title ?? '',
      name: address.name ?? '',
      surname: address.surname ?? '',
      phone: address.phone ?? '',
      city: address.city ?? '',
      district: address.district ?? '',
      neighborhood: parsed.mahalle,
      address: parsed.address,
    })
    setShowAddressForm(true)
    setActiveTab('addresses')
  }

  const validateAddress = () => {
    const next = {}
    if (!addressForm.title.trim()) next.title = 'Adres başlığı zorunlu'
    if (!addressForm.name.trim()) next.name = 'Ad zorunlu'
    if (!addressForm.surname.trim()) next.surname = 'Soyad zorunlu'
    if (!addressForm.phone.trim()) next.phone = 'Telefon zorunlu'
    else if (!/^(\+90|0)?5\d{9}$/.test(addressForm.phone.replace(/\s/g, ''))) {
      next.phone = 'Geçerli bir cep telefonu girin'
    }
    if (!addressForm.city.trim()) next.city = 'İl zorunlu'
    if (!addressForm.district.trim()) next.district = 'İlçe zorunlu'
    if (!addressForm.neighborhood.trim() && !addressForm.address.trim()) {
      next.neighborhood = 'Mahalle / adres zorunlu'
    }
    setAddressErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSaveAddress = async (event) => {
    event.preventDefault()
    if (!validateAddress()) return

    const payloadBase = {
      title: addressForm.title.trim(),
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
      setIsSavingAddress(true)
      if (editingAddressId) {
        const response = await axiosClient.put('/user/address', {
          ...payloadBase,
          id: editingAddressId,
        })
        const saved = response?.data ?? { ...payloadBase, id: editingAddressId }
        setAddresses((prev) =>
          prev.map((item) =>
            idEquals(item.id, editingAddressId) ? { ...item, ...saved } : item
          )
        )
        toast.success('Adres güncellendi.')
      } else {
        const response = await axiosClient.post('/user/address', payloadBase)
        setAddresses((prev) => [...prev, response?.data ?? payloadBase])
        toast.success('Adres kaydedildi.')
      }
      resetAddressForm()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Adres kaydedilemedi.')
    } finally {
      setIsSavingAddress(false)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Bu adresi silmek istediğinize emin misiniz?')) return
    try {
      await axiosClient.delete(`/user/address/${addressId}`)
      setAddresses((prev) => prev.filter((item) => !idEquals(item.id, addressId)))
      if (idEquals(editingAddressId, addressId)) resetAddressForm()
      toast.success('Adres silindi.')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Adres silinemedi.')
    }
  }

  const handleEditCard = (card) => {
    setEditingCardId(card.id)
    setCardForm({
      card_no: card.card_no ?? '',
      expire_month: String(card.expire_month ?? ''),
      expire_year: String(card.expire_year ?? ''),
      name_on_card: card.name_on_card ?? '',
    })
    setShowCardForm(true)
    setActiveTab('payments')
  }

  const validateCard = () => {
    const next = {}
    const digits = String(cardForm.card_no ?? '').replace(/\D/g, '')
    if (!cardForm.name_on_card.trim()) next.name_on_card = 'İsim zorunlu'
    if (digits.length !== 16) next.card_no = 'Kart numarası 16 haneli olmalı'
    if (!/^(0?[1-9]|1[0-2])$/.test(String(cardForm.expire_month))) {
      next.expire_month = 'Geçerli ay girin (1-12)'
    }
    if (!/^\d{4}$/.test(String(cardForm.expire_year))) {
      next.expire_year = 'Yıl 4 haneli olmalı'
    }
    setCardErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSaveCard = async (event) => {
    event.preventDefault()
    if (!validateCard()) return

    const payloadBase = {
      card_no: String(cardForm.card_no ?? '').replace(/\D/g, ''),
      name_on_card: cardForm.name_on_card.trim(),
      expire_month: Number(cardForm.expire_month),
      expire_year: Number(cardForm.expire_year),
    }

    try {
      setIsSavingCard(true)
      if (editingCardId) {
        const response = await axiosClient.put('/user/card', {
          ...payloadBase,
          id: editingCardId,
        })
        const saved = response?.data ?? { ...payloadBase, id: editingCardId }
        setCards((prev) =>
          prev.map((item) =>
            idEquals(item.id, editingCardId) ? { ...item, ...saved } : item
          )
        )
        toast.success('Kart güncellendi.')
      } else {
        const response = await axiosClient.post('/user/card', payloadBase)
        setCards((prev) => [...prev, response?.data ?? payloadBase])
        toast.success('Kart kaydedildi.')
      }
      resetCardForm()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Kart kaydedilemedi.')
    } finally {
      setIsSavingCard(false)
    }
  }

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Bu kartı silmek istediğinize emin misiniz?')) return
    try {
      await axiosClient.delete(`/user/card/${cardId}`)
      setCards((prev) => prev.filter((item) => !idEquals(item.id, cardId)))
      if (idEquals(editingCardId, cardId)) resetCardForm()
      toast.success('Kart silindi.')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Kart silinemedi.')
    }
  }

  const displayName = toTitleCase(user?.name || user?.email?.split('@')[0] || 'Müşteri')

  return (
    <section className="mx-auto flex w-full max-w-[1000px] flex-col gap-8">
      <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
            <UserRound className="h-5 w-5" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Hesabım
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Kullanıcı Bilgilerim
            </h1>
            <p className="text-sm text-slate-500">
              Merhaba <span className="font-medium text-slate-700">{displayName}</span>
              {' — '}
              kayıtlı adres ve ödeme bilgilerinizi buradan yönetebilirsiniz.
            </p>
          </div>
        </div>
        <Link
          to="/orders"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-slate-300 hover:bg-white"
        >
          Tüm Siparişlerim
        </Link>
      </div>

      <div className="flex w-full gap-2 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('addresses')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === 'addresses'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="h-4 w-4" />
          Kayıtlı Adreslerim
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === 'payments'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Kayıtlı Ödemelerim
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
          Bilgileriniz yükleniyor...
        </div>
      ) : null}

      {activeTab === 'addresses' ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Teslimat adresleri</h2>
              <p className="text-sm text-slate-500">
                Siparişlerinizde kullanılacak kayıtlı adreslerinizi düzenleyin.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingAddressId(null)
                setAddressForm(emptyAddress)
                setAddressErrors({})
                setShowAddressForm(true)
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Yeni adres
            </button>
          </div>

          {showAddressForm ? (
            <form
              onSubmit={handleSaveAddress}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
                <h3 className="text-base font-semibold text-slate-900">
                  {editingAddressId ? 'Adresi düzenle' : 'Yeni adres ekle'}
                </h3>
                <p className="text-xs text-slate-500">
                  Tüm alanları eksiksiz doldurmanız teslimatı hızlandırır.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['title', 'Adres başlığı', 'text', 'Ev, iş yeri...'],
                  ['name', 'Ad', 'text', ''],
                  ['surname', 'Soyad', 'text', ''],
                  ['phone', 'Telefon', 'tel', '05XXXXXXXXX'],
                  ['district', 'İlçe', 'text', ''],
                  ['neighborhood', 'Mahalle', 'text', ''],
                ].map(([key, label, type, placeholder]) => (
                  <label key={key} className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
                    {label}
                    <input
                      type={type}
                      value={addressForm[key]}
                      placeholder={placeholder}
                      onChange={(event) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          [key]: event.target.value,
                        }))
                      }
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                    />
                    {addressErrors[key] ? (
                      <span className="font-normal text-rose-500">{addressErrors[key]}</span>
                    ) : null}
                  </label>
                ))}
                <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
                  İl
                  <select
                    value={addressForm.city}
                    onChange={(event) =>
                      setAddressForm((prev) => ({
                        ...prev,
                        city: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                  >
                    <option value="">İl seçin</option>
                    {turkishCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {addressErrors.city ? (
                    <span className="font-normal text-rose-500">{addressErrors.city}</span>
                  ) : null}
                </label>
              </div>
              <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
                Açık adres
                <textarea
                  value={addressForm.address}
                  placeholder="Sokak, bina no, daire..."
                  onChange={(event) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }))
                  }
                  rows={3}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                />
                {addressErrors.neighborhood ? (
                  <span className="font-normal text-rose-500">{addressErrors.neighborhood}</span>
                ) : null}
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-60"
                >
                  {isSavingAddress ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={resetAddressForm}
                  className="rounded-full border border-slate-200 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600"
                >
                  Vazgeç
                </button>
              </div>
            </form>
          ) : null}

          {!isLoading && addresses.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <MapPin className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Henüz kayıtlı adresiniz yok</p>
              <p className="max-w-sm text-xs text-slate-500">
                Sipariş sürecini hızlandırmak için teslimat adresinizi ekleyin.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {addresses.map((address) => {
                const parsed = parseNeighborhood(address.neighborhood)
                const kind = getAddressKindLabel(address.title)
                const title = formatAddressTitle(address.title)
                const cityLine = [
                  parsed.mahalle || null,
                  toTitleCase(address.district),
                  toTitleCase(address.city),
                ]
                  .filter(Boolean)
                  .join(', ')
                return (
                  <article
                    key={address.id}
                    className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 sm:w-[calc(50%-8px)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          <MapPin className="h-4 w-4" />
                        </span>
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            {kind}
                          </span>
                          <h3 className="truncate text-base font-semibold text-slate-900">
                            {title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm">
                      <p className="font-medium text-slate-800">
                        {toTitleCase(address.name)} {toTitleCase(address.surname)}
                      </p>
                      <p className="flex items-center gap-2 text-slate-500">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                        {maskPhone(address.phone)}
                      </p>
                      <p className="leading-relaxed text-slate-500">
                        {cityLine}
                        {parsed.mahalle && parsed.address ? (
                          <>
                            <br />
                            <span className="text-slate-600">{parsed.address}</span>
                          </>
                        ) : null}
                        {!parsed.mahalle && parsed.address ? (
                          <>
                            <br />
                            <span className="text-slate-600">{parsed.address}</span>
                          </>
                        ) : null}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => handleEditAddress(address)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-rose-100 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Sil
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      ) : null}

      {activeTab === 'payments' ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Kayıtlı kartlar</h2>
              <p className="text-sm text-slate-500">
                Ödeme için kaydettiğiniz kartları güvenli şekilde yönetin.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingCardId(null)
                setCardForm(emptyCard)
                setCardErrors({})
                setShowCardForm(true)
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Yeni kart
            </button>
          </div>

          {showCardForm ? (
            <form
              onSubmit={handleSaveCard}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
                <h3 className="text-base font-semibold text-slate-900">
                  {editingCardId ? 'Kartı düzenle' : 'Yeni kart ekle'}
                </h3>
                <p className="text-xs text-slate-500">
                  Kart bilgileriniz yalnızca sipariş ödemesi için kullanılır.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 sm:col-span-2">
                  Kart üzerindeki isim
                  <input
                    value={cardForm.name_on_card}
                    placeholder="Ad Soyad"
                    onChange={(event) =>
                      setCardForm((prev) => ({
                        ...prev,
                        name_on_card: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                  {cardErrors.name_on_card ? (
                    <span className="font-normal text-rose-500">{cardErrors.name_on_card}</span>
                  ) : null}
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 sm:col-span-2">
                  Kart numarası
                  <input
                    value={cardForm.card_no}
                    placeholder="16 haneli kart numarası"
                    onChange={(event) =>
                      setCardForm((prev) => ({
                        ...prev,
                        card_no: event.target.value,
                      }))
                    }
                    inputMode="numeric"
                    maxLength={19}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                  {cardErrors.card_no ? (
                    <span className="font-normal text-rose-500">{cardErrors.card_no}</span>
                  ) : null}
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
                  Son kullanma ayı
                  <input
                    value={cardForm.expire_month}
                    onChange={(event) =>
                      setCardForm((prev) => ({
                        ...prev,
                        expire_month: event.target.value,
                      }))
                    }
                    placeholder="MM"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                  {cardErrors.expire_month ? (
                    <span className="font-normal text-rose-500">{cardErrors.expire_month}</span>
                  ) : null}
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
                  Son kullanma yılı
                  <input
                    value={cardForm.expire_year}
                    onChange={(event) =>
                      setCardForm((prev) => ({
                        ...prev,
                        expire_year: event.target.value,
                      }))
                    }
                    placeholder="YYYY"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                  {cardErrors.expire_year ? (
                    <span className="font-normal text-rose-500">{cardErrors.expire_year}</span>
                  ) : null}
                </label>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSavingCard}
                  className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-60"
                >
                  {isSavingCard ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={resetCardForm}
                  className="rounded-full border border-slate-200 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600"
                >
                  Vazgeç
                </button>
              </div>
            </form>
          ) : null}

          {!isLoading && cards.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <CreditCard className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Henüz kayıtlı kartınız yok</p>
              <p className="max-w-sm text-xs text-slate-500">
                Ödemeyi hızlandırmak için bir kart ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {cards.map((card) => (
                <article
                  key={card.id}
                  className="flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:w-[calc(50%-8px)]"
                >
                  <div className="flex flex-col gap-6 bg-gradient-to-br from-slate-800 to-slate-950 px-5 py-6 text-white">
                    <div className="flex items-center justify-between">
                      <CreditCard className="h-5 w-5 text-white/80" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                        Kayıtlı kart
                      </span>
                    </div>
                    <p className="font-mono text-lg tracking-[0.2em]">
                      {maskCardNo(card.card_no)}
                    </p>
                    <div className="flex items-end justify-between gap-3">
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-[0.16em] text-white/50">
                          Kart sahibi
                        </span>
                        <span className="truncate text-sm font-medium">
                          {toTitleCase(card.name_on_card)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5 text-right">
                        <span className="text-[10px] uppercase tracking-[0.16em] text-white/50">
                          Son kul.
                        </span>
                        <span className="text-sm font-medium">
                          {String(card.expire_month).padStart(2, '0')}/{card.expire_year}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-4">
                    <button
                      type="button"
                      onClick={() => handleEditCard(card)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(card.id)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-rose-100 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Sil
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </section>
  )
}

export default AccountInfoPage
