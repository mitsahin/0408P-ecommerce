import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
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
    try {
      await axiosClient.delete(`/user/card/${cardId}`)
      setCards((prev) => prev.filter((item) => !idEquals(item.id, cardId)))
      if (idEquals(editingCardId, cardId)) resetCardForm()
      toast.success('Kart silindi.')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Kart silinemedi.')
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-[960px] flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Kullanıcı Bilgilerim
          </h1>
          <p className="text-sm text-slate-500">
            {user?.name || user?.email || 'Hesap'} — kayıtlı adres ve ödeme bilgileriniz
          </p>
        </div>
        <Link
          to="/orders"
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
        >
          Tüm Siparişlerim
        </Link>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 text-sm font-semibold transition ${
            activeTab === 'addresses'
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Kayıtlı Adreslerim
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 text-sm font-semibold transition ${
            activeTab === 'payments'
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Kayıtlı Ödemelerim
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Yükleniyor...</p>
      ) : null}

      {activeTab === 'addresses' ? (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => {
              setEditingAddressId(null)
              setAddressForm(emptyAddress)
              setAddressErrors({})
              setShowAddressForm(true)
            }}
            className="w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
          >
            + Yeni adres ekle
          </button>

          {showAddressForm ? (
            <form
              onSubmit={handleSaveAddress}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-sm font-semibold text-slate-900">
                {editingAddressId ? 'Adresi düzenle' : 'Yeni adres'}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['title', 'Adres başlığı', 'text'],
                  ['name', 'Ad', 'text'],
                  ['surname', 'Soyad', 'text'],
                  ['phone', 'Telefon', 'tel'],
                  ['district', 'İlçe', 'text'],
                  ['neighborhood', 'Mahalle', 'text'],
                ].map(([key, label, type]) => (
                  <label key={key} className="flex flex-col gap-1 text-xs text-slate-600">
                    {label}
                    <input
                      type={type}
                      value={addressForm[key]}
                      onChange={(event) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          [key]: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                    {addressErrors[key] ? (
                      <span className="text-rose-500">{addressErrors[key]}</span>
                    ) : null}
                  </label>
                ))}
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  İl
                  <select
                    value={addressForm.city}
                    onChange={(event) =>
                      setAddressForm((prev) => ({
                        ...prev,
                        city: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="">Seçin</option>
                    {turkishCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {addressErrors.city ? (
                    <span className="text-rose-500">{addressErrors.city}</span>
                  ) : null}
                </label>
              </div>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Açık adres
                <textarea
                  value={addressForm.address}
                  onChange={(event) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }))
                  }
                  rows={3}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
                {addressErrors.neighborhood ? (
                  <span className="text-rose-500">{addressErrors.neighborhood}</span>
                ) : null}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {isSavingAddress ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={resetAddressForm}
                  className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600"
                >
                  Vazgeç
                </button>
              </div>
            </form>
          ) : null}

          {!isLoading && addresses.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Henüz kayıtlı adresiniz yok.
            </p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {addresses.map((address) => {
                const parsed = parseNeighborhood(address.neighborhood)
                return (
                  <div
                    key={address.id}
                    className="flex min-h-[150px] w-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:w-[calc(50%-8px)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {address.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleEditAddress(address)}
                        className="text-xs font-semibold text-sky-600"
                      >
                        Düzenle
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-slate-600">
                      <span>
                        {address.name} {address.surname}
                      </span>
                      <span>{maskPhone(address.phone)}</span>
                      <span className="text-xs text-slate-500">
                        {[parsed.mahalle || parsed.address, address.district, address.city]
                          .filter(Boolean)
                          .join(' / ')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="mt-auto self-start text-xs font-semibold text-rose-500"
                    >
                      Sil
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : null}

      {activeTab === 'payments' ? (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => {
              setEditingCardId(null)
              setCardForm(emptyCard)
              setCardErrors({})
              setShowCardForm(true)
            }}
            className="w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
          >
            + Yeni kart ekle
          </button>

          {showCardForm ? (
            <form
              onSubmit={handleSaveCard}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-sm font-semibold text-slate-900">
                {editingCardId ? 'Kartı düzenle' : 'Yeni kart'}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs text-slate-600 sm:col-span-2">
                  Kart üzerindeki isim
                  <input
                    value={cardForm.name_on_card}
                    onChange={(event) =>
                      setCardForm((prev) => ({
                        ...prev,
                        name_on_card: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                  {cardErrors.name_on_card ? (
                    <span className="text-rose-500">{cardErrors.name_on_card}</span>
                  ) : null}
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-600 sm:col-span-2">
                  Kart numarası
                  <input
                    value={cardForm.card_no}
                    onChange={(event) =>
                      setCardForm((prev) => ({
                        ...prev,
                        card_no: event.target.value,
                      }))
                    }
                    inputMode="numeric"
                    maxLength={19}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                  {cardErrors.card_no ? (
                    <span className="text-rose-500">{cardErrors.card_no}</span>
                  ) : null}
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Ay
                  <input
                    value={cardForm.expire_month}
                    onChange={(event) =>
                      setCardForm((prev) => ({
                        ...prev,
                        expire_month: event.target.value,
                      }))
                    }
                    placeholder="MM"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                  {cardErrors.expire_month ? (
                    <span className="text-rose-500">{cardErrors.expire_month}</span>
                  ) : null}
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Yıl
                  <input
                    value={cardForm.expire_year}
                    onChange={(event) =>
                      setCardForm((prev) => ({
                        ...prev,
                        expire_year: event.target.value,
                      }))
                    }
                    placeholder="YYYY"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                  {cardErrors.expire_year ? (
                    <span className="text-rose-500">{cardErrors.expire_year}</span>
                  ) : null}
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={isSavingCard}
                  className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {isSavingCard ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={resetCardForm}
                  className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600"
                >
                  Vazgeç
                </button>
              </div>
            </form>
          ) : null}

          {!isLoading && cards.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Henüz kayıtlı kartınız yok.
            </p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="flex w-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:w-[calc(50%-8px)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-sm font-semibold tracking-wide text-slate-900">
                      {maskCardNo(card.card_no)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEditCard(card)}
                      className="text-xs font-semibold text-sky-600"
                    >
                      Düzenle
                    </button>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-slate-600">
                    <span>{card.name_on_card}</span>
                    <span className="text-xs text-slate-500">
                      SKT: {String(card.expire_month).padStart(2, '0')}/
                      {card.expire_year}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(card.id)}
                    className="mt-auto self-start text-xs font-semibold text-rose-500"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </section>
  )
}

export default AccountInfoPage
