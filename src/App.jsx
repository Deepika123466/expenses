import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard, ArrowLeftRight, ChartNoAxesCombined, Target, Settings, CircleHelp,
  Bell, Search, Plus, ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, PiggyBank,
  Coffee, ShoppingBag, CarFront, House, HeartPulse, GraduationCap, Ellipsis,
  Trash2, X, Check, Sparkles, CalendarDays, ChevronDown, CircleDollarSign, Menu,
  Download, Lightbulb, CreditCard, ShieldCheck, Zap
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const initialTransactions = [
  { id: 1, name: 'Monthly salary', category: 'Income', date: '2026-10-01', amount: 28000, type: 'income', note: 'Salary' },
  { id: 2, name: 'Apartment rent', category: 'Housing', date: '2026-10-02', amount: 7500, type: 'expense', note: 'Monthly rent' },
  { id: 3, name: 'Grocery shopping', category: 'Groceries', date: '2026-10-04', amount: 1850, type: 'expense', note: 'Weekly essentials' },
  { id: 4, name: 'Fuel', category: 'Transport', date: '2026-10-05', amount: 900, type: 'expense', note: 'Commute' },
  { id: 5, name: 'Coffee & snacks', category: 'Food', date: '2026-10-06', amount: 420, type: 'expense', note: 'Small treats' },
  { id: 6, name: 'Internet bill', category: 'Bills', date: '2026-10-07', amount: 799, type: 'expense', note: 'Wi-Fi' },
  { id: 7, name: 'Dinner with friends', category: 'Food', date: '2026-10-08', amount: 780, type: 'expense', note: 'Weekend dinner' },
  { id: 8, name: 'Pharmacy', category: 'Health', date: '2026-10-09', amount: 360, type: 'expense', note: 'Medicines' },
];
const categoryMeta = {
  Housing: { color: '#8b7cff', icon: House },
  Groceries: { color: '#28c99a', icon: ShoppingBag },
  Transport: { color: '#f5b84b', icon: CarFront },
  Food: { color: '#ff8d73', icon: Coffee },
  Bills: { color: '#63a8ff', icon: CreditCard },
  Health: { color: '#f472b6', icon: HeartPulse },
  Education: { color: '#a78bfa', icon: GraduationCap },
  Other: { color: '#94a3b8', icon: Ellipsis },
};
const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const dateLabel = d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

function App() {
  const [transactions, setTransactions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('stm-transactions')) || initialTransactions; }
    catch { return initialTransactions; }
  });
  const [budget, setBudget] = useState(() => Number(localStorage.getItem('stm-budget')) || 10000);
  const [goal, setGoal] = useState(() => Number(localStorage.getItem('stm-goal')) || 5000);
  const [saved, setSaved] = useState(() => Number(localStorage.getItem('stm-saved')) || 1800);
  const [active, setActive] = useState('Overview');
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('This month');
  const [mobileNav, setMobileNav] = useState(false);
  const [form, setForm] = useState({ name: '', amount: '', category: 'Groceries', date: '2026-10-11', type: 'expense' });
  const [toast, setToast] = useState('');

  useEffect(() => { localStorage.setItem('stm-transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('stm-budget', String(budget)); }, [budget]);
  useEffect(() => { localStorage.setItem('stm-goal', String(goal)); }, [goal]);
  useEffect(() => { localStorage.setItem('stm-saved', String(saved)); }, [saved]);

  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income').reduce((s,t) => s+t.amount, 0);
  const spent = expenses.reduce((s,t) => s+t.amount, 0);
  const remaining = Math.max(0, budget - spent);
  const today = 11;
  const daysLeft = Math.max(1, 30 - today + 1);
  const daily = remaining / daysLeft;
  const budgetUsed = Math.min(100, (spent / Math.max(1,budget))*100);
  const filteredTransactions = useMemo(() => transactions
    .filter(t => `${t.name} ${t.category} ${t.type}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => b.date.localeCompare(a.date)), [transactions, search]);

  const categoryData = Object.keys(categoryMeta).map(name => ({
    name, value: expenses.filter(t => t.category === name).reduce((s,t) => s+t.amount,0),
    color: categoryMeta[name].color
  })).filter(x => x.value > 0);
  const trendData = [
    { day: '01', spent: 1200, budget: 1700 }, { day: '04', spent: 3050, budget: 3400 },
    { day: '07', spent: 4749, budget: 5100 }, { day: '10', spent: spent, budget: 6800 },
    { day: '14', spent: Math.round(spent*1.12), budget: 7600 }, { day: '18', spent: Math.round(spent*1.25), budget: 8200 },
    { day: '22', spent: Math.round(spent*1.42), budget: 9000 }, { day: '26', spent: Math.round(spent*1.55), budget: 9500 },
    { day: '30', spent: Math.round(spent*1.7), budget: budget }
  ];
  const monthForecast = spent + (spent / Math.max(1,today)) * (30 - today);
  const healthScore = Math.max(35, Math.min(98, Math.round(100 - budgetUsed * .45 + (saved / Math.max(1,goal))*10)));
  const insight = budgetUsed > 80
    ? 'You’re spending faster than planned. Try pausing non-essential purchases for a few days.'
    : 'You’re on track! Keeping small daily expenses in check can help you reach your savings goal sooner.';

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }
  function addTransaction(e) {
    e.preventDefault();
    if (!form.name.trim() || Number(form.amount) <= 0) { notify('Add a name and a valid amount.'); return; }
    setTransactions(prev => [...prev, { ...form, id: Date.now(), amount: Number(form.amount), note: '' }]);
    setForm({ name: '', amount: '', category: 'Groceries', date: '2026-10-11', type: 'expense' });
    setShowModal(false);
    notify('Transaction added successfully.');
  }
  function deleteTransaction(id) {
    setTransactions(prev => prev.filter(t => t.id !== id));
    notify('Transaction deleted.');
  }
  function exportCSV() {
    const rows = [['Name','Category','Date','Type','Amount'], ...transactions.map(t => [t.name,t.category,t.date,t.type,t.amount])];
    const csv = rows.map(row => row.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'survive-the-month-transactions.csv'; a.click();
    URL.revokeObjectURL(url); notify('CSV exported.');
  }

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard }, { name: 'Transactions', icon: ArrowLeftRight },
    { name: 'Analytics', icon: ChartNoAxesCombined }, { name: 'Savings goals', icon: Target },
  ];
  const categoryOptions = ['Housing','Groceries','Transport','Food','Bills','Health','Education','Other'];

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><CircleDollarSign size={22}/></div><div><strong>pennywise</strong><span>SMART MONEY, CALM MIND</span></div><button className="mobile-close icon-btn" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace"><div className="avatar">S</div><div><b>My finances</b><small>Personal workspace</small></div><ChevronDown size={16}/></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{navItems.map(item => <button key={item.name} className={`nav-item ${active === item.name ? 'active' : ''}`} onClick={() => {setActive(item.name);setMobileNav(false)}}><item.icon size={18}/><span>{item.name}</span>{item.name === 'Transactions' && <small>{transactions.length}</small>}</button>)}</nav>
      <div className="nav-label tools-label">TOOLS</div>
      <button className={`nav-item ${active === 'Budget coach' ? 'active' : ''}`} onClick={() => setActive('Budget coach')}><Sparkles size={18}/><span>Budget coach</span><span className="new-pill">NEW</span></button>
      <button className={`nav-item ${active === 'Settings' ? 'active' : ''}`} onClick={() => setActive('Settings')}><Settings size={18}/><span>Settings</span></button>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Lightbulb size={18}/></div><b>A little progress adds up.</b><p>Small choices today create more freedom tomorrow.</p><button onClick={() => {setActive('Budget coach');setMobileNav(false)}}>Get a money tip <ArrowUpRight size={14}/></button></div><div className="profile"><div className="profile-avatar">S</div><div><b>Saritha</b><small>Personal account</small></div><Ellipsis size={18}/></div></div>
    </aside>

    {mobileNav && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)}/>}

    <main className="main-area">
      <header className="topbar"><button className="mobile-menu icon-btn" onClick={() => setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumbs">Workspace <span>/</span> <b>{active}</b></div><div className="top-actions"><label className="searchbox"><Search size={16}/><input placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)}/><kbd>⌘ K</kbd></label><button className="icon-btn notification" onClick={() => notify('You’re all caught up!')} aria-label="Notifications"><Bell size={18}/><i/></button><div className="top-avatar">S</div></div></header>

      <div className="page-content">
        <div className="page-heading"><div><div className="eyebrow"><span className="live-dot"/> YOUR FINANCIAL SNAPSHOT <span className="heading-date"><CalendarDays size={13}/> OCT 2026</span></div><h1>{active === 'Overview' ? 'Good afternoon, Saritha' : active}</h1><p>{active === 'Overview' ? 'A clearer picture of your money starts here.' : pageSubtitle(active)}</p></div><div className="heading-actions"><button className="btn btn-secondary" onClick={exportCSV}><Download size={16}/> Export</button><button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={17}/> Add transaction</button></div></div>

        {active === 'Overview' && <>
          <section className="hero-card">
            <div className="hero-copy"><div className="hero-tag"><Sparkles size={13}/> MONTHLY OVERVIEW</div><p className="hero-label">Available to spend</p><div className="hero-amount">{money(remaining)}</div><p className="hero-sub">of {money(budget)} monthly budget <span className="hero-divider">•</span> {budgetUsed.toFixed(0)}% used</p><div className="hero-progress"><div style={{width:`${budgetUsed}%`}}/></div><div className="hero-foot"><span><span className="mini-dot green"/> {money(spent)} spent so far</span><button onClick={() => setActive('Transactions')}>View transactions <ArrowUpRight size={14}/></button></div></div>
            <div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-circle"><Wallet size={40}/></div><div className="float-card float-top"><span className="float-icon"><TrendingUp size={16}/></span><div><small>Daily allowance</small><b>{money(daily)}</b></div></div><div className="float-card float-bottom"><span className="float-icon purple"><PiggyBank size={16}/></span><div><small>Savings progress</small><b>{Math.min(100,Math.round(saved/Math.max(1,goal)*100))}% of goal</b></div></div><div className="spark spark-a">✦</div><div className="spark spark-b">✧</div></div>
          </section>

          <section className="stats-grid">
            <StatCard label="Total spent" value={money(spent)} change={`${budgetUsed.toFixed(0)}% of budget`} icon={ArrowUpRight} tone="rose" foot="Monthly expenses"/>
            <StatCard label="Income tracked" value={money(income)} change="Money in" icon={ArrowDownRight} tone="mint" foot="Recorded this month"/>
            <StatCard label="Daily allowance" value={money(daily)} change={`${daysLeft} days left`} icon={Wallet} tone="blue" foot="Safe-to-spend estimate"/>
            <StatCard label="Money wellness" value={`${healthScore}/100`} change={healthScore >= 70 ? 'Looking healthy' : 'Needs attention'} icon={ShieldCheck} tone="violet" foot="Based on your budget"/>
          </section>

          <section className="content-grid">
            <div className="panel trend-panel"><div className="panel-header"><div><h2>Spending overview</h2><p>Track your spending pace through the month.</p></div><select className="select-small" value={period} onChange={e => setPeriod(e.target.value)}><option>This month</option><option>Last 30 days</option></select></div><div className="chart-legend"><span><i className="legend-dot actual"/> Actual spending</span><span><i className="legend-dot planned"/> Planned budget</span></div><div className="trend-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{top:10,right:8,left:-18,bottom:0}}><defs><linearGradient id="spentFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38d6a5" stopOpacity={0.23}/><stop offset="95%" stopColor="#38d6a5" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#263246" strokeDasharray="3 5" vertical={false}/><XAxis dataKey="day" tick={{fill:'#8491a7',fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#8491a7',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v/1000}k` : v}/><Tooltip contentStyle={{background:'#111c2d',border:'1px solid #2b3a50',borderRadius:12,color:'#fff'}} formatter={v => money(v)}/><Area type="monotone" dataKey="budget" name="Planned budget" stroke="#62728c" strokeDasharray="5 5" fill="transparent" strokeWidth={2}/><Area type="monotone" dataKey="spent" name="Actual spending" stroke="#38d6a5" fill="url(#spentFill)" strokeWidth={2.5} activeDot={{r:5,fill:'#38d6a5',stroke:'#0b1220',strokeWidth:3}}/></AreaChart></ResponsiveContainer></div><div className="chart-footer"><span><span className="mini-dot green"/> Spending is {budgetUsed < 65 ? 'within your planned pace' : 'moving above your comfort zone'}.</span><button onClick={() => setActive('Analytics')}>Detailed analytics <ArrowUpRight size={14}/></button></div></div>

            <div className="panel category-panel"><div className="panel-header"><div><h2>Where it goes</h2><p>Your expense breakdown.</p></div><button className="icon-btn subtle" onClick={() => setActive('Analytics')} aria-label="View analytics"><Ellipsis size={19}/></button></div><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData.length ? categoryData : [{name:'No expenses',value:1,color:'#253247'}]} dataKey="value" nameKey="name" innerRadius={62} outerRadius={84} paddingAngle={4} stroke="none"><Cell fill="#253247"/>{categoryData.map((entry,i)=><Cell key={entry.name} fill={entry.color}/>)}</Pie><Tooltip contentStyle={{background:'#111c2d',border:'1px solid #2b3a50',borderRadius:12,color:'#fff'}} formatter={v=>money(v)}/></PieChart></ResponsiveContainer><div className="donut-center"><b>{money(spent)}</b><span>Total spent</span></div></div><div className="category-list">{(categoryData.length ? categoryData : [{name:'No expenses',value:0,color:'#253247'}]).sort((a,b)=>b.value-a.value).slice(0,4).map(c=><div className="category-row" key={c.name}><span className="category-name"><i style={{background:c.color}}/>{c.name}</span><b>{money(c.value)}</b><small>{spent ? Math.round(c.value/spent*100) : 0}%</small></div>)}</div></div>
          </section>

          <section className="content-grid lower-grid"><div className="panel transactions-panel"><div className="panel-header"><div><h2>Recent transactions</h2><p>Your latest money movements.</p></div><button className="text-link" onClick={() => setActive('Transactions')}>See all <ArrowUpRight size={14}/></button></div><TransactionTable transactions={filteredTransactions.slice(0,5)} onDelete={deleteTransaction}/></div><div className="panel goal-panel"><div className="panel-header"><div><h2>Savings goal</h2><p>Small steps, meaningful progress.</p></div><span className="goal-icon"><Target size={18}/></span></div><div className="goal-main"><div><span className="muted-label">NEW LAPTOP FUND</span><h3>{money(saved)} <span>of {money(goal)}</span></h3></div><span className="goal-percent">{Math.min(100,Math.round(saved/Math.max(1,goal)*100))}%</span></div><div className="goal-progress"><div style={{width:`${Math.min(100,saved/Math.max(1,goal)*100)}%`}}/></div><div className="goal-bottom"><span>{money(Math.max(0,goal-saved))} to go</span><button onClick={() => {const v=prompt('How much would you like to add to savings?','500'); if(v && Number(v)>0){setSaved(s=>s+Number(v));notify('Savings goal updated.')}}}><Plus size={14}/> Add savings</button></div><div className="goal-tip"><Sparkles size={15}/><span>Automate a small amount each week to build your fund without stress.</span></div></div></section>

          <section className="coach-banner"><div className="coach-symbol"><Sparkles size={21}/></div><div><b>Your money, with a little more clarity.</b><p>{insight}</p></div><button onClick={() => setActive('Budget coach')}>Open budget coach <ArrowUpRight size={15}/></button></section>
        </>}

        {active === 'Transactions' && <section className="panel full-panel"><div className="panel-header"><div><h2>All transactions</h2><p>Search, review, and manage your money movements.</p></div><button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16}/> Add new</button></div><TransactionTable transactions={filteredTransactions} onDelete={deleteTransaction} emptyMessage="No matching transactions. Try another search."/></section>}

        {active === 'Analytics' && <><section className="stats-grid"><StatCard label="Total expenses" value={money(spent)} change="This month" icon={ArrowUpRight} tone="rose" foot="All recorded expenses"/><StatCard label="Monthly budget" value={money(budget)} change="Your spending limit" icon={Wallet} tone="blue" foot="Edit in Settings"/><StatCard label="Forecasted spend" value={money(monthForecast)} change={monthForecast > budget ? 'May exceed budget' : 'Within budget'} icon={TrendingUp} tone="violet" foot="Based on current pace"/><StatCard label="Savings rate" value={`${income ? Math.max(0,Math.round((income-spent)/income*100)) : 0}%`} change="Income minus expenses" icon={PiggyBank} tone="mint" foot="Estimated savings rate"/></section><section className="content-grid analytics-grid"><div className="panel"><div className="panel-header"><div><h2>Spending pace</h2><p>Actual spending compared with your plan.</p></div></div><div className="trend-chart tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={trendData}><CartesianGrid stroke="#263246" strokeDasharray="3 5" vertical={false}/><XAxis dataKey="day" tick={{fill:'#8491a7',fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#8491a7',fontSize:11}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:'#111c2d',border:'1px solid #2b3a50',borderRadius:12,color:'#fff'}} formatter={v=>money(v)}/><Bar dataKey="spent" name="Actual spending" fill="#38d6a5" radius={[5,5,0,0]}/><Bar dataKey="budget" name="Planned budget" fill="#53647d" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></div><div className="panel"><div className="panel-header"><div><h2>Category details</h2><p>Where your money is going.</p></div></div><div className="category-detail-list">{categoryData.map(c=><div className="category-detail" key={c.name}><div className="category-detail-top"><span><i style={{background:c.color}}/>{c.name}</span><b>{money(c.value)}</b></div><div className="thin-track"><div style={{width:`${spent?c.value/spent*100:0}%`,background:c.color}}/></div><small>{spent?Math.round(c.value/spent*100):0}% of expenses</small></div>)}</div></div></section></>}

        {active === 'Savings goals' && <section className="panel goal-page"><div className="goal-page-icon"><Target size={28}/></div><h2>Make your next goal happen.</h2><p>Turn a big purchase into small, achievable steps.</p><div className="goal-edit-grid"><label>Goal name<input defaultValue="New laptop fund" /></label><label>Target amount (₹)<input type="number" value={goal} onChange={e=>setGoal(Math.max(1,Number(e.target.value)))}/></label><label>Already saved (₹)<input type="number" value={saved} onChange={e=>setSaved(Math.max(0,Number(e.target.value)))}/></label></div><div className="big-goal-progress"><div className="goal-main"><b>{money(saved)} saved</b><span>{Math.min(100,Math.round(saved/Math.max(1,goal)*100))}% complete</span></div><div className="goal-progress"><div style={{width:`${Math.min(100,saved/Math.max(1,goal)*100)}%`}}/></div></div><button className="btn btn-primary" onClick={()=>notify('Your savings goal is saved automatically.')}><Check size={16}/> Save goal</button></section>}

        {active === 'Budget coach' && <section className="coach-page"><div className="coach-hero"><div className="coach-symbol large"><Sparkles size={27}/></div><div><span className="eyebrow">YOUR PERSONAL MONEY ASSISTANT</span><h2>A calmer way to manage money.</h2><p>Helpful suggestions based on the transactions you track.</p></div></div><div className="coach-cards"><div className="panel tip-card"><div className="tip-icon"><Lightbulb size={20}/></div><span className="tip-label">TODAY’S TIP</span><h3>{budgetUsed > 80 ? 'Give your budget some breathing room' : 'Small habits create big savings'}</h3><p>{insight}</p><div className="tip-footer"><span><Zap size={14}/> 2 min read</span><span>Personalized</span></div></div><div className="panel tip-card"><div className="tip-icon blue"><Target size={20}/></div><span className="tip-label">YOUR NEXT STEP</span><h3>Protect your daily allowance</h3><p>You have about <b>{money(daily)}</b> per day left in your current budget estimate. Use this as a guide, not a strict rule.</p><div className="tip-footer"><span><ShieldCheck size={14}/> Practical action</span><span>Budgeting</span></div></div><div className="panel tip-card"><div className="tip-icon purple"><PiggyBank size={20}/></div><span className="tip-label">SAVINGS MOMENTUM</span><h3>Keep your goal visible</h3><p>You have saved {Math.min(100,Math.round(saved/Math.max(1,goal)*100))}% of your target. Add a little whenever it feels comfortable.</p><div className="tip-footer"><span><TrendingUp size={14}/> Progress</span><span>Savings</span></div></div></div><p className="disclaimer">Budget Coach provides general educational guidance based on the sample data you enter. It is not professional financial advice.</p></section>}

        {active === 'Settings' && <section className="panel settings-panel"><div className="panel-header"><div><h2>Budget settings</h2><p>Make your plan fit your real life.</p></div><span className="settings-icon"><Settings size={20}/></span></div><label className="setting-row"><span><b>Monthly spending budget</b><small>Set the amount you plan to spend this month.</small></span><div className="setting-input"><span>₹</span><input type="number" min="1" value={budget} onChange={e=>setBudget(Math.max(1,Number(e.target.value)))}/></div></label><label className="setting-row"><span><b>Monthly savings target</b><small>Set a goal you want to work toward.</small></span><div className="setting-input"><span>₹</span><input type="number" min="1" value={goal} onChange={e=>setGoal(Math.max(1,Number(e.target.value)))}/></div></label><div className="setting-row"><span><b>Demo data</b><small>Restore the original sample transactions.</small></span><button className="btn btn-secondary" onClick={()=>{if(confirm('Restore sample transactions? Your current list will be replaced.')){setTransactions(initialTransactions);notify('Sample data restored.')}}}>Reset sample data</button></div><div className="settings-note"><ShieldCheck size={18}/><span>Your data is stored in this browser using localStorage. It is not synced to a bank or shared with a server.</span></div></section>}
        <footer className="page-footer"><span>© 2026 Pennywise · Built for better money habits.</span><span><ShieldCheck size={13}/> Your data stays in your browser</span></footer>
      </div>
    </main>

    {showModal && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowModal(false)}}><div className="transaction-modal"><div className="modal-header"><div><span className="eyebrow">MONEY MOVEMENT</span><h2>Add transaction</h2><p>Keep your budget up to date.</p></div><button className="icon-btn" onClick={()=>setShowModal(false)}><X size={19}/></button></div><form onSubmit={addTransaction}><div className="type-toggle"><button type="button" className={form.type==='expense'?'selected expense-selected':''} onClick={()=>setForm(f=>({...f,type:'expense'}))}>Expense</button><button type="button" className={form.type==='income'?'selected income-selected':''} onClick={()=>setForm(f=>({...f,type:'income',category:'Income'}))}>Income</button></div><label>Transaction name<input autoFocus placeholder="e.g. Grocery shopping" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required/></label><label>Amount (₹)<input type="number" min="1" placeholder="0" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} required/></label><div className="form-two"><label>Category<select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>{(form.type==='income'?['Income','Other']:categoryOptions).map(c=><option key={c}>{c}</option>)}</select></label><label>Date<input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} required/></label></div><div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary"><Plus size={16}/> Save transaction</button></div></form></div></div>}
    {toast && <div className="toast"><span><Check size={16}/></span>{toast}</div>}
  </div>;
}

function pageSubtitle(active) {
  return ({'Transactions':'Every inflow and outflow, all in one place.','Analytics':'Patterns today can create better habits tomorrow.','Savings goals':'A little saved consistently can go a long way.','Budget coach':'Small, practical guidance for healthier money habits.','Settings':'Personalize your monthly money plan.'})[active] || '';
}
function StatCard({label,value,change,icon:Icon,tone,foot}) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon size={17}/></span></div><div className="stat-value">{value}</div><div className="stat-change"><span className={`change-dot ${tone}`}/>{change}</div><div className="stat-foot">{foot}</div></div>;
}
function TransactionTable({transactions,onDelete,emptyMessage='No transactions yet. Add one to get started.'}) {
  if (!transactions.length) return <div className="empty-state"><div><ArrowLeftRight size={22}/></div><b>Nothing to show yet</b><p>{emptyMessage}</p></div>;
  return <div className="table-wrap"><table><thead><tr><th>TRANSACTION</th><th>CATEGORY</th><th>DATE</th><th className="amount-head">AMOUNT</th><th></th></tr></thead><tbody>{transactions.map(t=>{const meta=categoryMeta[t.category] || {color:'#28c99a',icon:CircleDollarSign};const Icon=meta.icon;return <tr key={t.id}><td><div className="transaction-name"><span className="transaction-icon" style={{'--cat-color':meta.color}}><Icon size={16}/></span><span><b>{t.name}</b><small>{t.note || (t.type==='income'?'Money received':'Card / cash')}</small></span></div></td><td><span className="category-chip"><i style={{background:meta.color}}/>{t.category}</span></td><td className="date-cell">{dateLabel(t.date)}</td><td className={`amount-cell ${t.type==='income'?'income-amount':''}`}>{t.type==='income'?'+':'−'}{money(t.amount)}</td><td><button className="delete-btn" title="Delete transaction" onClick={()=>onDelete(t.id)}><Trash2 size={15}/></button></td></tr>})}</tbody></table></div>;
}

export default App;
