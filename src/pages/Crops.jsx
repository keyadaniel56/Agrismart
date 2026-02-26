import { useState } from 'react'
import { STAGES, fmt, fmtDate } from '../utils/data'
import { Tabs, Button, Badge, Panel, ProgressBar, Modal, FormGroup, Input, Select, FormRow, Table } from '../components/UI'
import { IconPlus } from '../components/Icons'
import { useLocalData } from '../hooks'
import { useNotifications } from '../contexts/NotificationContext'
import styles from './Crops.module.css'

export default function Crops() {
  const { data: crops, add: addCrop, update: updateCrop } = useLocalData('crops')
  const { addNotification } = useNotifications()
  const [filter, setFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [updateModal, setUpdateModal] = useState(null)
  const [detailsModal, setDetailsModal] = useState(null)

  const FILTER_TABS = [
    { value: 'all',       label: 'All',       count: crops.length },
    { value: 'Seedling',  label: 'Seedling',  count: crops.filter(c => c.status === 'Seedling').length },
    { value: 'Growing',   label: 'Growing',   count: crops.filter(c => c.status === 'Growing').length },
    { value: 'Flowering', label: 'Flowering', count: crops.filter(c => c.status === 'Flowering').length },
    { value: 'Harvest',   label: 'Harvest',   count: crops.filter(c => c.status === 'Harvest').length },
  ]

  const visible = filter === 'all' ? crops : crops.filter(c => c.status === filter)

  const handleAddCrop = async (newCrop) => {
    await addCrop(newCrop)
    addNotification({
      title: 'Crop Added',
      message: `${newCrop.name} has been added to your farm.`
    })
  }

  const handleUpdateCrop = async (crop, newStage) => {
    const stageIndex = STAGES.indexOf(newStage)
    const updatedCrop = { ...crop, status: newStage, stageIndex }
    await updateCrop(updatedCrop)
    
    addNotification({
      title: 'Crop Updated',
      message: `${crop.name} stage updated to ${newStage}.`
    })
    setUpdateModal(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Tabs tabs={FILTER_TABS} active={filter} onChange={setFilter} />
        <Button variant="primary" onClick={() => setAddOpen(true)}>
          <IconPlus size={14} /> Add Crop
        </Button>
      </div>

      <div className={`${styles.grid} stagger`}>
        {visible.map((crop) => (
          <CropCard 
            key={crop.id} 
            crop={crop} 
            onUpdate={() => setUpdateModal(crop)}
            onViewDetails={() => setDetailsModal(crop)}
          />
        ))}
      </div>

      {addOpen && <AddCropModal onClose={() => setAddOpen(false)} onAdd={handleAddCrop} />}
      
      {updateModal && (
        <UpdateStageModal 
          crop={updateModal} 
          onClose={() => setUpdateModal(null)} 
          onConfirm={handleUpdateCrop} 
        />
      )}

      {detailsModal && (
        <CropDetailsModal 
          crop={detailsModal} 
          onClose={() => setDetailsModal(null)} 
        />
      )}
    </div>
  )
}

function CropCard({ crop, onUpdate, onViewDetails }) {
  const totalInput = crop.inputs ? crop.inputs.reduce((s, i) => s + i.cost, 0) : 0

  return (
    <div className={`${styles.card} animate-fadeUp`}>
      <div className={styles.cardHead}>
        <div className={styles.cardHeadRow}>
          <div>
            <h3 className={styles.cardName}>{crop.name}</h3>
            <p className={styles.cardMeta}>{crop.acreage} acres &nbsp;&mdash;&nbsp; Harvest {fmtDate(crop.harvestDate)}</p>
          </div>
          <Badge variant={crop.status.toLowerCase()}>{crop.status}</Badge>
        </div>

        {/* Stage timeline */}
        <div className={styles.timeline}>
          {STAGES.map((s, i) => (
            <div key={s} className={styles.timelineStep}>
              <div className={`${styles.timelineDot}
                ${i < crop.stageIndex ? styles['timelineDot--done'] : ''}
                ${i === crop.stageIndex ? styles['timelineDot--active'] : ''}
              `}>
                {i < crop.stageIndex && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
              </div>
              {i < STAGES.length - 1 && (
                <div className={`${styles.timelineLine} ${i < crop.stageIndex ? styles['timelineLine--done'] : ''}`} />
              )}
              <span className={styles.timelineLabel}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.statsGrid}>
          <Stat label="Expected Yield" value={`${crop.expectedYield} kg`} />
          <Stat label="Actual Yield"   value={crop.actualYield ? `${crop.actualYield} kg` : '—'} />
          <Stat label="Input Cost"     value={fmt(totalInput)} />
          <Stat label="Est. ROI"       value={crop.roi ? `${crop.roi}%` : '—'} highlight={!!crop.roi} />
        </div>

        {crop.actualYield && (
          <div className={styles.yieldProgress}>
            <div className={styles.yieldLabel}>
              <span>Yield Accuracy</span>
              <span>{Math.round((crop.actualYield / crop.expectedYield) * 100)}%</span>
            </div>
            <ProgressBar value={crop.actualYield} max={crop.expectedYield} />
          </div>
        )}

        <div className={styles.inputList}>
          {crop.inputs && crop.inputs.slice(0, 3).map((inp, i) => (
            <span key={i} className={styles.inputTag}>{inp.type}</span>
          ))}
          {crop.inputs && crop.inputs.length > 3 && (
            <span className={styles.inputTag}>+{crop.inputs.length - 3} more</span>
          )}
        </div>

        <div className={styles.cardActions}>
          <Button variant="outline" size="sm" onClick={onViewDetails}>View Details</Button>
          <Button variant="primary" size="sm" onClick={onUpdate}>Log Update</Button>
        </div>
      </div>
    </div>
  )
}

function CropDetailsModal({ crop, onClose }) {
  const totalInput = crop.inputs ? crop.inputs.reduce((s, i) => s + i.cost, 0) : 0

  return (
    <Modal title={`Crop Details: ${crop.name}`} onClose={onClose} width={600}>
      <div className={styles.detailsContent}>
        <div className={styles.detailsHeader}>
          <div className={styles.detailsMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Status:</span>
              <Badge variant={crop.status.toLowerCase()}>{crop.status}</Badge>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Acreage:</span>
              <span className={styles.metaValue}>{crop.acreage} acres</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Planting Date:</span>
              <span className={styles.metaValue}>{fmtDate(crop.plantDate)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Exp. Harvest:</span>
              <span className={styles.metaValue}>{fmtDate(crop.harvestDate)}</span>
            </div>
          </div>
        </div>

        <h4 className={styles.sectionTitle}>Financial Summary</h4>
        <div className={styles.statsGrid}>
          <Stat label="Input Cost" value={fmt(totalInput)} />
          <Stat label="Exp. Revenue" value={fmt(crop.expectedYield * 50)} /> {/* Dummy price calculation */}
          <Stat label="ROI" value={crop.roi ? `${crop.roi}%` : '—'} highlight={!!crop.roi} />
        </div>

        <h4 className={styles.sectionTitle}>Input Logs</h4>
        {crop.inputs && crop.inputs.length > 0 ? (
          <Table headers={['Type', 'Quantity', 'Cost', 'Date']}>
            {crop.inputs.map((inp, i) => (
              <tr key={i}>
                <td>{inp.type}</td>
                <td>{inp.qty}</td>
                <td>{fmt(inp.cost)}</td>
                <td>{fmtDate(inp.date)}</td>
              </tr>
            ))}
          </Table>
        ) : (
          <p style={{ color: 'var(--clay)', textAlign: 'center', padding: '1rem' }}>No inputs recorded yet.</p>
        )}

        <div style={{ marginTop: '2rem' }}>
          <Button variant="primary" style={{ width: '100%' }} onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  )
}

function UpdateStageModal({ crop, onClose, onConfirm }) {
  const [stage, setStage] = useState(crop.status)

  return (
    <Modal title={`Update Stage: ${crop.name}`} onClose={onClose}>
      <FormGroup label="Current Stage">
        <Select value={stage} onChange={e => setStage(e.target.value)}>
          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
      </FormGroup>
      <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem' }}>
        <Button variant="outline" style={{ flex: 1 }} onClick={onClose}>Cancel</Button>
        <Button variant="primary" style={{ flex: 1 }} onClick={() => onConfirm(crop, stage)}>Update Stage</Button>
      </div>
    </Modal>
  )
}

function Stat({ label, value, highlight }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statLabel}>{label}</div>
      <div className={`${styles.statValue} ${highlight ? styles['statValue--highlight'] : ''}`}>{value}</div>
    </div>
  )
}

function AddCropModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '', acreage: '', plantDate: '', harvestDate: '',
    expectedYield: '', status: 'Seedling', stageIndex: 0, inputs: []
  })

  const handleSubmit = async () => {
    if (!form.name || !form.acreage) return
    await onAdd({
      ...form,
      acreage: parseFloat(form.acreage),
      expectedYield: parseInt(form.expectedYield),
      id: Date.now() // Simple unique ID
    })
    onClose()
  }

  return (
    <Modal title="Add New Crop" onClose={onClose}>
      <FormRow>
        <FormGroup label="Crop Name">
          <Input 
            placeholder="e.g. Maize" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
          />
        </FormGroup>
        <FormGroup label="Acreage">
          <Input 
            placeholder="e.g. 2.5" type="number" min="0" step="0.1" 
            value={form.acreage}
            onChange={e => setForm({...form, acreage: e.target.value})}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Planting Date">
          <Input 
            type="date" 
            value={form.plantDate}
            onChange={e => setForm({...form, plantDate: e.target.value})}
          />
        </FormGroup>
        <FormGroup label="Expected Harvest">
          <Input 
            type="date" 
            value={form.harvestDate}
            onChange={e => setForm({...form, harvestDate: e.target.value})}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Expected Yield (kg)">
          <Input 
            placeholder="e.g. 1200" type="number" 
            value={form.expectedYield}
            onChange={e => setForm({...form, expectedYield: e.target.value})}
          />
        </FormGroup>
        <FormGroup label="Current Stage">
          <Select 
            value={form.status}
            onChange={e => setForm({...form, status: e.target.value, stageIndex: STAGES.indexOf(e.target.value)})}
          >
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </FormGroup>
      </FormRow>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <Button variant="outline" style={{ flex: 1 }} onClick={onClose}>Cancel</Button>
        <Button variant="primary" style={{ flex: 1 }} onClick={handleSubmit}>Add Crop</Button>
      </div>
    </Modal>
  )
}
