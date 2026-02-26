import { useState } from 'react'
import { fmt, fmtDate } from '../utils/data'
import { Tabs, Button, Panel, Table, ProgressBar, Modal, FormGroup, Input, Select, FormRow } from '../components/UI'
import { IconPlus, IconMapPin } from '../components/Icons'
import { useLocalData } from '../hooks'
import { useNotifications } from '../contexts/NotificationContext'
import { useAuth } from '../contexts/AuthContext'
import styles from './Marketplace.module.css'

export default function Marketplace() {
  const { data: listings, add: addListing } = useLocalData('listings')
  const { data: orders, add: addOrder } = useLocalData('orders')
  const { data: crops } = useLocalData('crops')
  const { addNotification } = useNotifications()
  const { user } = useAuth()
  
  const [tab, setTab]         = useState('listings')
  const [listOpen, setListOpen] = useState(false)
  const [orderModal, setOrderModal] = useState(null)

  const TABS = [
    { value: 'listings',    label: 'All Listings',  count: listings.length },
    { value: 'my-listings', label: 'My Listings',   count: listings.filter(l => l.isOwner).length },
    { value: 'orders',      label: 'Orders',        count: orders.length },
  ]

  const handlePlaceOrder = async (listing, qty) => {
    const total = listing.pricePerKg * qty
    const orderId = `ORD-${Math.floor(Math.random() * 900) + 100}`
    
    await addOrder({
      id: orderId,
      crop: listing.crop,
      buyer: user ? user.name : 'Guest User',
      qty: parseFloat(qty),
      totalKsh: total,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    })

    addNotification({
      title: 'Order Placed',
      message: `You have successfully placed an order for ${qty}kg of ${listing.crop} (${orderId}).`
    })

    setOrderModal(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
        {(tab === 'my-listings') && (
          <Button variant="harvest" onClick={() => setListOpen(true)}>
            <IconPlus size={14} /> New Listing
          </Button>
        )}
      </div>

      {tab === 'listings' && (
        <div className={`${styles.grid} stagger`}>
          {listings.map(l => (
            <ListingCard 
              key={l.id} 
              listing={l} 
              onOrder={() => setOrderModal(l)}
            />
          ))}
        </div>
      )}

      {tab === 'my-listings' && (
        <div className={`${styles.grid} stagger`}>
          {listings.filter(l => l.isOwner).map(l => (
            <ListingCard key={l.id} listing={l} isOwner />
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <Panel className="animate-fadeUp">
          <Table headers={['Order ID', 'Produce', 'Buyer', 'Qty', 'Total', 'Status', 'Date']}>
            {orders.map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: 13 }}>{o.id}</td>
                <td>{o.crop}</td>
                <td style={{ color: 'var(--clay)' }}>{o.buyer}</td>
                <td style={{ color: 'var(--clay)' }}>{o.qty} kg</td>
                <td style={{ fontWeight: 600, color: 'var(--leaf)' }}>{fmt(o.totalKsh)}</td>
                <td><StatusBadge status={o.status} /></td>
                <td style={{ color: 'var(--clay)' }}>{fmtDate(o.date)}</td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}

      {listOpen && <NewListingModal onClose={() => setListOpen(false)} onAdd={addListing} crops={crops} user={user} />}
      
      {orderModal && (
        <OrderConfirmationModal 
          listing={orderModal} 
          onClose={() => setOrderModal(null)} 
          onConfirm={handlePlaceOrder}
        />
      )}
    </div>
  )
}

function ListingCard({ listing, isOwner, onOrder }) {
  const pct = Math.round((listing.qtyAvail / listing.qtyTotal) * 100)
  return (
    <div className={`${styles.card} animate-fadeUp`}>
      <div className={styles.cardTop}>
        <div>
          <h3 className={styles.cropName}>{listing.crop}</h3>
          <div className={styles.farmerRow}>
            <IconMapPin size={11} color="var(--clay)" />
            <span>{listing.farmer} &mdash; {listing.location}</span>
          </div>
        </div>
        <div className={styles.priceBlock}>
          <div className={styles.price}>{fmt(listing.pricePerKg)}</div>
          <div className={styles.priceUnit}>per kg</div>
        </div>
      </div>

      <div className={styles.stockRow}>
        <span>{listing.qtyAvail} kg available of {listing.qtyTotal} kg</span>
        <span className={styles.postedAgo}>{listing.postedAgo}</span>
      </div>
      <ProgressBar value={listing.qtyAvail} max={listing.qtyTotal} />

      <div className={styles.cardActions}>
        {isOwner ? (
          <>
            <Button variant="outline" size="sm" style={{ flex: 1 }}>Edit Listing</Button>
            <Button variant="danger"  size="sm" style={{ flex: 1 }}>Remove</Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" style={{ flex: 1 }}>Contact Seller</Button>
            <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={onOrder}>Place Order</Button>
          </>
        )}
      </div>
    </div>
  )
}

function OrderConfirmationModal({ listing, onClose, onConfirm }) {
  const [qty, setQty] = useState(10)
  const total = listing.pricePerKg * qty

  return (
    <Modal title={`Confirm Order: ${listing.crop}`} onClose={onClose}>
      <div style={{ marginBottom: '1.5rem' }}>
        <p>You are ordering <strong>{listing.crop}</strong> from <strong>{listing.farmer}</strong>.</p>
        <FormGroup label="Quantity (kg)">
          <Input 
            type="number" 
            value={qty} 
            onChange={e => setQty(Math.min(listing.qtyAvail, Math.max(1, e.target.value)))} 
            max={listing.qtyAvail}
            min={1}
          />
        </FormGroup>
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface)', borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Price per kg:</span>
            <span>{fmt(listing.pricePerKg)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.1rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
            <span>Total:</span>
            <span style={{ color: 'var(--leaf)' }}>{fmt(total)}</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="outline" style={{ flex: 1 }} onClick={onClose}>Cancel</Button>
        <Button variant="primary" style={{ flex: 1 }} onClick={() => onConfirm(listing, qty)}>Confirm Order</Button>
      </div>
    </Modal>
  )
}

function StatusBadge({ status }) {
  const labels = {
    pending:   'Pending',
    approved:  'Approved',
    transit:   'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }
  return <span className={`${styles.status} ${styles[`status--${status}`]}`}>{labels[status] || status}</span>
}

function NewListingModal({ onClose, onAdd, crops, user }) {
  const [form, setForm] = useState({ crop: '', qty: '', price: '', location: '', date: '', notes: '' })

  const handleSubmit = async () => {
    await onAdd({
      id: Date.now(),
      crop: form.crop,
      farmer: user ? user.name : "Guest Farmer",
      location: form.location,
      pricePerKg: parseFloat(form.price),
      qtyTotal: parseFloat(form.qty),
      qtyAvail: parseFloat(form.qty),
      postedAgo: 'Just now',
      isOwner: true
    })
    onClose()
  }

  return (
    <Modal title="New Marketplace Listing" onClose={onClose}>
      <FormGroup label="Produce">
        <Select value={form.crop} onChange={e => setForm({...form, crop: e.target.value})}>
          <option value="" disabled>Select crop</option>
          {crops.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </Select>
      </FormGroup>
      <FormRow>
        <FormGroup label="Quantity (kg)">
          <Input 
            placeholder="e.g. 500" type="number" min="0" 
            value={form.qty} onChange={e => setForm({...form, qty: e.target.value})}
          />
        </FormGroup>
        <FormGroup label="Price per kg (KSh)">
          <Input 
            placeholder="e.g. 45" type="number" min="0" 
            value={form.price} onChange={e => setForm({...form, price: e.target.value})}
          />
        </FormGroup>
      </FormRow>
      <FormGroup label="Pickup Location">
        <Input 
          placeholder="e.g. Kiambu Town" 
          value={form.location} onChange={e => setForm({...form, location: e.target.value})}
        />
      </FormGroup>
      <FormGroup label="Available Until">
        <Input 
          type="date" 
          value={form.date} onChange={e => setForm({...form, date: e.target.value})}
        />
      </FormGroup>
      <FormGroup label="Additional Notes">
        <Input 
          placeholder="Freshness, transport available, packaging…" 
          value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
        />
      </FormGroup>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <Button variant="outline" style={{ flex: 1 }} onClick={onClose}>Cancel</Button>
        <Button variant="harvest" style={{ flex: 1 }} onClick={handleSubmit}>Post Listing</Button>
      </div>
    </Modal>
  )
}
