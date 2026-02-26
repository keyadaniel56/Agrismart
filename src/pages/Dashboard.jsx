import { useNavigate } from 'react-router-dom'
import { Panel, PanelHeader, StatCard, ProgressBar } from '../components/UI'
import { CHART_DATA, fmt, fmtDate } from '../utils/data'
import { useDerivedFinancials, useLocalData } from '../hooks'
import styles from './Dashboard.module.css'
import { IconTrendUp, IconTrendDown } from '../components/Icons'

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: transactions } = useLocalData('transactions')
  const { data: crops } = useLocalData('crops')
  const { totalIncome, totalExpense, netProfit, roi } = useDerivedFinancials(transactions)

  const maxBar = Math.max(...CHART_DATA.map(d => Math.max(d.revenue, d.expenses)))

  return (
    <div className={`${styles.page} stagger`}>

      {/* KPI row */}
      <div className={`${styles.kpiGrid} animate-fadeUp`}>
        <StatCard
          label="Active Crops"
          value={crops.length.toString()}
          sub={`${crops.filter(c => c.status === 'Harvest').length} ready to harvest`}
          trend="up"
          accentColor="var(--lime)"
        />
        <StatCard
          label="Total Revenue"
          value={fmt(totalIncome)}
          sub="+18% from last month"
          trend="up"
          accentColor="var(--harvest)"
        />
        <StatCard
          label="Total Expenses"
          value={fmt(totalExpense)}
          sub="+5% from last month"
          accentColor="var(--clay)"
        />
        <StatCard
          label="Net Profit"
          value={fmt(netProfit)}
          sub={`ROI: ${roi}%`}
          trend="up"
          accentColor="var(--forest)"
        />
      </div>

      <div className={`${styles.grid} animate-fadeUp`} style={{ animationDelay: '80ms' }}>

        {/* Left column */}
        <div className={styles.colMain}>

          {/* Revenue chart */}
          <Panel className={styles.chartPanel}>
            <PanelHeader title="Revenue vs Expenses" action="View full report" onAction={() => navigate('/reports')} />
            <div className={styles.chart}>
              {CHART_DATA.map((d) => (
                <div key={d.month} className={styles.barGroup}>
                  <div className={styles.barPair}>
                    <div
                      className={`${styles.bar} ${styles.barRevenue}`}
                      style={{ height: `${(d.revenue / maxBar) * 100}%` }}
                      title={`Revenue: ${fmt(d.revenue)}`}
                    />
                    <div
                      className={`${styles.bar} ${styles.barExpense}`}
                      style={{ height: `${(d.expenses / maxBar) * 100}%` }}
                      title={`Expenses: ${fmt(d.expenses)}`}
                    />
                  </div>
                  <span className={styles.barLabel}>{d.month}</span>
                </div>
              ))}
            </div>
            <div className={styles.legend}>
              <LegendDot color="var(--leaf)" label="Revenue" />
              <LegendDot color="var(--sand)" label="Expenses" />
            </div>
          </Panel>

          {/* Crop overview */}
          <Panel>
            <PanelHeader title="Crop Overview" action="Manage crops" onAction={() => navigate('/crops')} />
            <div className={styles.cropList}>
              {crops.slice(0, 5).map((c) => (
                <div key={c.id} className={styles.cropRow}>
                  <div className={styles.cropDot} style={{ background: `var(--${c.stageIndex === 3 ? 'harvest' : 'leaf'})` }} />
                  <div className={styles.cropInfo}>
                    <span className={styles.cropName}>{c.name}</span>
                    <span className={styles.cropMeta}>{c.acreage} acres &mdash; Harvest {fmtDate(c.harvestDate)}</span>
                  </div>
                  <div className={styles.cropProgress}>
                    <ProgressBar value={c.stageIndex + 1} max={4} color={c.stageIndex === 3 ? 'var(--harvest)' : 'var(--leaf)'} />
                    <span className={styles.cropStage}>{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right column */}
        <div className={styles.colSide}>

          {/* Quick stats */}
          <Panel>
            <PanelHeader title="Farm Summary" />
            {[
              { label: 'Total Farm Area',  value: '12.5 acres' },
              { label: 'Harvested This Season', value: '2 crops' },
              { label: 'Pending Orders',   value: '4 orders' },
              { label: 'Active Listings',  value: '3 listings' },
              { label: 'Input Costs YTD',  value: fmt(38400) },
            ].map((s, i) => (
              <div key={i} className={styles.summaryRow}>
                <span className={styles.summaryLabel}>{s.label}</span>
                <span className={styles.summaryValue}>{s.value}</span>
              </div>
            ))}
          </Panel>

          {/* Recent transactions */}
          <Panel>
            <PanelHeader title="Recent Transactions" action="View all" onAction={() => navigate('/finance')} />
            <div className={styles.txList}>
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className={styles.txRow}>
                  <div className={`${styles.txIcon} ${tx.type === 'income' ? styles.txIconIncome : styles.txIconExpense}`}>
                    {tx.type === 'income'
                      ? <IconTrendUp size={13} color="var(--leaf)" />
                      : <IconTrendDown size={13} color="var(--red)" />
                    }
                  </div>
                  <div className={styles.txInfo}>
                    <span className={styles.txDesc}>{tx.description}</span>
                    <span className={styles.txDate}>{fmtDate(tx.date)}</span>
                  </div>
                  <span className={`${styles.txAmount} ${tx.type === 'income' ? styles.txAmountIncome : styles.txAmountExpense}`}>
                    {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

        </div>
      </div>
    </div>
  )
}

function LegendDot({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--clay)' }}>
      <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
      {label}
    </div>
  )
}
