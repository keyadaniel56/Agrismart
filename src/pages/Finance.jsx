import { useState } from 'react'
import { fmt, fmtDate } from '../utils/data'
import { useDerivedFinancials, useLocalData } from '../hooks'
import { Panel, PanelHeader, Table, Badge, Button, Modal, FormGroup, Input, Select, FormRow } from '../components/UI'
import { IconPlus } from '../components/Icons'
import styles from './Finance.module.css'

const CATEGORIES = ['Fertilizer', 'Pesticide', 'Seeds', 'Labour', 'Water / Irrigation', 'Transport', 'Equipment', 'Other']

export default function Finance() {
  const { data: transactions, add: addTx } = useLocalData('transactions')
  const { data: crops } = useLocalData('crops')
  const { totalIncome, totalExpense, netProfit, roi } = useDerivedFinancials(transactions)
  const [saleOpen, setSaleOpen]       = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)

  return (
    <div className={styles.page}>

      {/* Summary cards */}
      <div className={`${styles.summaryGrid} stagger`}>
        <SummaryCard label="Total Income"   value={fmt(totalIncome)}  sub="+18% from last month" type="income" />
        <SummaryCard label="Total Expenses" value={fmt(totalExpense)} sub="+5% from last month"  type="expense" />
        <SummaryCard label="Net Profit"     value={fmt(netProfit)}    sub={`ROI: ${roi}%`}        type="profit" />
      </div>

      <Panel className="animate-fadeUp" style={{ animationDelay: '100ms' }}>
        <PanelHeader
          title="Transaction History"
          action={
            <div className={styles.actions}>
              <Button variant="outline" size="sm" onClick={() => setExpenseOpen(true)}>
                <IconPlus size={13} /> Expense
              </Button>
              <Button variant="primary" size="sm" onClick={() => setSaleOpen(true)}>
                <IconPlus size={13} /> Sale
              </Button>
            </div>
          }
        />
        <Table headers={['Description', 'Category', 'Crop', 'Date', 'Amount']}>
          {[...transactions].sort((a,b) => new Date(b.date) - new Date(a.date)).map((tx) => (
            <tr key={tx.id}>
              <td className={styles.tdDesc}>{tx.description}</td>
              <td><span className={styles.catTag}>{tx.category}</span></td>
              <td className={styles.tdMeta}>{tx.crop}</td>
              <td className={styles.tdMeta}>{fmtDate(tx.date)}</td>
              <td className={`${styles.tdAmount} ${tx.type === 'income' ? styles['tdAmount--income'] : styles['tdAmount--expense']}`}>
                {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
              </td>
            </tr>
          ))}
        </Table>
      </Panel>

      {saleOpen    && <RecordSaleModal    onClose={() => setSaleOpen(false)} onAdd={addTx} crops={crops} />}
      {expenseOpen && <RecordExpenseModal onClose={() => setExpenseOpen(false)} onAdd={addTx} crops={crops} />}
    </div>
  )
}

function SummaryCard({ label, value, sub, type }) {
  return (
    <div className={`${styles.summaryCard} ${styles[`summaryCard--${type}`]}`}>
      <div className={styles.summaryLabel}>{label}</div>
      <div className={styles.summaryValue}>{value}</div>
      <div className={styles.summarySub}>{sub}</div>
    </div>
  )
}

function RecordSaleModal({ onClose, onAdd, crops }) {
  const [form, setForm] = useState({ crop: '', qty: '', price: '', buyer: '', date: new Date().toISOString().split('T')[0] })

  const handleSubmit = async () => {
    const amount = parseFloat(form.qty) * parseFloat(form.price)
    await onAdd({
      id: Date.now(),
      type: 'income',
      description: `${form.crop} sale — ${form.buyer}`,
      category: 'Sale',
      amount,
      date: form.date,
      crop: form.crop
    })
    onClose()
  }

  return (
    <Modal title="Record Sale" onClose={onClose}>
      <FormGroup label="Crop">
        <Select value={form.crop} onChange={e => setForm({...form, crop: e.target.value})}>
          <option value="" disabled>Select crop</option>
          {crops.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </Select>
      </FormGroup>
      <FormRow>
        <FormGroup label="Quantity (kg)">
          <Input 
            placeholder="e.g. 200" type="number" min="0" 
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
      <FormGroup label="Buyer Name / Market">
        <Input 
          placeholder="e.g. Nairobi Wholesale" 
          value={form.buyer} onChange={e => setForm({...form, buyer: e.target.value})}
        />
      </FormGroup>
      <FormGroup label="Date">
        <Input 
          type="date" 
          value={form.date} onChange={e => setForm({...form, date: e.target.value})}
        />
      </FormGroup>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <Button variant="outline" style={{ flex: 1 }} onClick={onClose}>Cancel</Button>
        <Button variant="primary" style={{ flex: 1 }} onClick={handleSubmit}>Record Sale</Button>
      </div>
    </Modal>
  )
}

function RecordExpenseModal({ onClose, onAdd, crops }) {
  const [form, setForm] = useState({ category: '', crop: 'General Farm', amount: '', date: new Date().toISOString().split('T')[0], desc: '' })

  const handleSubmit = async () => {
    await onAdd({
      id: Date.now(),
      type: 'expense',
      description: form.desc || `${form.category} — ${form.crop}`,
      category: form.category,
      amount: parseFloat(form.amount),
      date: form.date,
      crop: form.crop
    })
    onClose()
  }

  return (
    <Modal title="Record Expense" onClose={onClose}>
      <FormGroup label="Category">
        <Select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
          <option value="" disabled>Select category</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
      </FormGroup>
      <FormGroup label="Linked Crop">
        <Select value={form.crop} onChange={e => setForm({...form, crop: e.target.value})}>
          <option value="General Farm">General Farm</option>
          {crops.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </Select>
      </FormGroup>
      <FormRow>
        <FormGroup label="Amount (KSh)">
          <Input 
            placeholder="e.g. 3500" type="number" min="0" 
            value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
          />
        </FormGroup>
        <FormGroup label="Date">
          <Input 
            type="date" 
            value={form.date} onChange={e => setForm({...form, date: e.target.value})}
          />
        </FormGroup>
      </FormRow>
      <FormGroup label="Description">
        <Input 
          placeholder="Brief description" 
          value={form.desc} onChange={e => setForm({...form, desc: e.target.value})}
        />
      </FormGroup>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <Button variant="outline" style={{ flex: 1 }} onClick={onClose}>Cancel</Button>
        <Button variant="primary" style={{ flex: 1 }} onClick={handleSubmit}>Record Expense</Button>
      </div>
    </Modal>
  )
}
