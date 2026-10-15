import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Package, 
  LogOut, 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  ArrowUpRight, 
  Layers,
  ChevronRight,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle2
} from 'lucide-react';

// Automatically detect production vs local API URL
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:10000'
  : 'https://marketmind-ai-deployment-1.onrender.com';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('marketmind_token') || '');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dashboard state data
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [churn, setChurn] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [searchCustomerId, setSearchCustomerId] = useState('12346');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  useEffect(() => {
    if (token && user) {
      fetchDashboardData();
    }
  }, [token, user, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to login');
      
      localStorage.setItem('marketmind_token', data.access_token);
      setToken(data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('marketmind_token');
    setToken('');
    setUser(null);
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      handleLogout();
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      if (activeTab === 'overview' || activeTab === 'sales') {
        const sumRes = await fetch(`${API_BASE_URL}/sales/summary`, { headers });
        if (sumRes.ok) setSummary(await sumRes.json());

        const salesRes = await fetch(`${API_BASE_URL}/sales-transactions`, { headers });
        if (salesRes.ok) setSales(await salesRes.json());
      }
      
      if (activeTab === 'churn') {
        const churnRes = await fetch(`${API_BASE_URL}/churn`, { headers });
        if (churnRes.ok) setChurn(await churnRes.json());
      }

      if (activeTab === 'anomalies') {
        const anomRes = await fetch(`${API_BASE_URL}/anomalies`, { headers });
        if (anomRes.ok) setAnomalies(await anomRes.json());
      }

      if (activeTab === 'recommendations') {
        const recRes = await fetch(`${API_BASE_URL}/recommendations?customer_id=${searchCustomerId}`, { headers });
        if (recRes.ok) setRecommendations(await recRes.json());
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Render Login screen if not authenticated
  if (!token || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-4 shadow-inner">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">MarketMind AI</h1>
            <p className="text-sm text-slate-400 mt-1">Retail Analytics & Forecasting Platform</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@test.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
            Connected to Render Cloud Backend
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900/70 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">MarketMind AI</h2>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                System Live
              </span>
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'sales', label: 'Sales & Inventory', icon: Package },
              { id: 'churn', label: 'Churn Prediction', icon: Users },
              { id: 'anomalies', label: 'Anomaly Alerts', icon: AlertTriangle },
              { id: 'recommendations', label: 'AI Recommender', icon: Layers },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 font-semibold text-xs shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-slate-200 truncate">{user.name}</p>
                <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-semibold">{user.role}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/40 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-slate-200 font-medium capitalize">{activeTab.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700/60"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back, {user.name}</h1>
                <p className="text-sm text-slate-400">Here is the latest retail intelligence summary for your platform.</p>
              </div>

              {/* Summary Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Units Sold</p>
                      <h3 className="text-3xl font-extrabold text-white mt-2">
                        {summary ? summary.total_units_sold.toLocaleString() : '—'}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Inventory Level</p>
                      <h3 className="text-3xl font-extrabold text-white mt-2">
                        {summary ? summary.total_inventory.toLocaleString() : '—'}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Package className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Low Stock Alerts</p>
                      <h3 className="text-3xl font-extrabold text-amber-400 mt-2">
                        {summary ? summary.low_stock_count : '—'}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Sales Preview Table */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-semibold text-white">Recent Sales Transactions</h3>
                  <button onClick={() => setActiveTab('sales')} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View all</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="py-3 px-6">Stock Code</th>
                        <th className="py-3 px-6">Description</th>
                        <th className="py-3 px-6">Units Sold</th>
                        <th className="py-3 px-6">Inventory</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {sales.slice(0, 5).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-6 font-mono text-xs text-indigo-300">{row.stock_code}</td>
                          <td className="py-3.5 px-6 font-medium">{row.description}</td>
                          <td className="py-3.5 px-6">{row.units_sold}</td>
                          <td className="py-3.5 px-6">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              row.inventory_level < 100 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {row.inventory_level} units
                            </span>
                          </td>
                        </tr>
                      ))}
                      {sales.length === 0 && !loading && (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-slate-500">No records found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SALES & INVENTORY */}
          {activeTab === 'sales' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Sales & Inventory Management</h1>
                <p className="text-sm text-slate-400">Inspect granular store transactions and inventory levels.</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="py-3.5 px-6">Stock Code</th>
                        <th className="py-3.5 px-6">Description</th>
                        <th className="py-3.5 px-6">Units Sold</th>
                        <th className="py-3.5 px-6">Inventory Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {sales.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-6 font-mono text-xs text-indigo-300">{row.stock_code}</td>
                          <td className="py-3.5 px-6 font-medium">{row.description}</td>
                          <td className="py-3.5 px-6">{row.units_sold}</td>
                          <td className="py-3.5 px-6">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              row.inventory_level < 100 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {row.inventory_level} units
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHURN PREDICTION */}
          {activeTab === 'churn' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Customer Churn Prediction</h1>
                <p className="text-sm text-slate-400">AI-driven retention risk analysis and customer scoring.</p>
              </div>

              {churn && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Customers Analyzed</p>
                    <h3 className="text-3xl font-extrabold text-white mt-2">{churn.total_customers}</h3>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">High Risk Count</p>
                    <h3 className="text-3xl font-extrabold text-rose-400 mt-2">{churn.risk_summary?.['High Risk'] || 0}</h3>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Model Used</p>
                    <h3 className="text-lg font-bold text-indigo-400 mt-3 truncate">{churn.model_used || 'Gradient Boosting'}</h3>
                  </div>
                </div>
              )}

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800">
                  <h3 className="font-semibold text-white">Customer Retention Risk Table</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="py-3.5 px-6">Customer ID</th>
                        <th className="py-3.5 px-6">Retention Risk</th>
                        <th className="py-3.5 px-6">Churn Probability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {churn?.customers?.map((cust, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-6 font-mono text-xs text-indigo-300">{cust.CustomerID || cust.customer_id}</td>
                          <td className="py-3.5 px-6">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              cust.retention_risk === 'High Risk' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                              cust.retention_risk === 'Medium Risk' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {cust.retention_risk}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 font-medium">
                            {cust.churn_probability ? `${(cust.churn_probability * 100).toFixed(1)}%` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANOMALY ALERTS */}
          {activeTab === 'anomalies' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Anomaly Detection Alerts</h1>
                <p className="text-sm text-slate-400">Automated alerts detecting outlier transactions and suspicious patterns.</p>
              </div>

              {anomalies && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Alerts</p>
                    <h3 className="text-3xl font-extrabold text-white mt-2">{anomalies.total_alerts}</h3>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">High Severity</p>
                    <h3 className="text-3xl font-extrabold text-rose-400 mt-2">{anomalies.high_severity}</h3>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Medium Severity</p>
                    <h3 className="text-3xl font-extrabold text-amber-400 mt-2">{anomalies.medium_severity}</h3>
                  </div>
                </div>
              )}

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800">
                  <h3 className="font-semibold text-white">Alert Log</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="py-3.5 px-6">Severity</th>
                        <th className="py-3.5 px-6">Details / Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {anomalies?.alerts?.map((alert, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-6">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
                              alert.severity === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {alert.severity}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 font-medium">
                            {alert.description || alert.message || JSON.stringify(alert)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI RECOMMENDER */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">AI Recommendation Engine</h1>
                <p className="text-sm text-slate-400">Collaborative filtering product recommendations per customer ID.</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Customer ID</label>
                  <input 
                    type="text" 
                    value={searchCustomerId}
                    onChange={(e) => setSearchCustomerId(e.target.value)}
                    placeholder="e.g. 12346"
                    className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
                <button 
                  onClick={fetchDashboardData}
                  className="w-full sm:w-auto mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Get Recommendations
                </button>
              </div>

              {recommendations && (
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="font-semibold text-white">Recommended Products for Customer {recommendations.customer_id}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.recommended_for_you?.map((prod, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium text-slate-200">{prod}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}