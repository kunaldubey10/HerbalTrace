import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Settings, 
  Users, 
  FilePieChart, 
  ShieldAlert,
  Activity,
  Server,
  Database,
  Network,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Globe,
  Shield,
  Code,
  BarChart3,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  X,
  Download,
  RefreshCw,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Leaf,
  Tractor,
  Beaker,
  Factory,
  Target,
  Award,
  Calendar,
  Monitor,
  Link,
  GitBranch,
  Key,
  UserCheck,
  MessageCircle,
  Send
} from 'lucide-react'
import DashboardNavbar from '../common/DashboardNavbar'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const AdminLandingPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userRoles, setUserRoles] = useState([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')
  const [userData, setUserData] = useState(null)
  
  // Real stats from API
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBatches: 0,
    totalProducts: 0,
    pendingRegistrations: 0
  })
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  
  // System health data from API
  const [systemHealth, setSystemHealth] = useState({
    blockchain: { status: 'Unknown', value: '-', color: 'gray' },
    api: { status: 'Unknown', value: '-', color: 'gray' },
    database: { status: 'Unknown', value: '-', color: 'gray' },
    storage: { status: 'Unknown', value: '-', color: 'gray' }
  })
  const [isHealthLoading, setIsHealthLoading] = useState(true)
  
  // Transaction throughput data
  const [transactionStats, setTransactionStats] = useState({
    peakTPS: 0,
    avgResponse: 0
  })
  
  // Recent activities
  const [recentActivities, setRecentActivities] = useState([
    { action: 'System initialized', time: 'Just now', icon: Code, color: 'blue' },
    { action: 'Waiting for data...', time: 'Loading', icon: Server, color: 'gray' }
  ])

  // Load logged-in user data
  useEffect(() => {
    const storedUser = localStorage.getItem('herbaltrace_user')
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser))
      } catch (e) {}
    }
  }, [])

  // Fetch real statistics from backend
  useEffect(() => {
    const token = localStorage.getItem('herbaltrace_token')
    if (!token) return

    const fetchStats = async () => {
      setIsStatsLoading(true)
      try {
        // Fetch users count
        const usersRes = await fetch(`${BACKEND_URL}/api/v1/auth/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const usersData = await usersRes.json()
        
        // Fetch batches count
        const batchesRes = await fetch(`${BACKEND_URL}/api/v1/batches`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const batchesData = await batchesRes.json()
        
        // Fetch products count
        const productsRes = await fetch(`${BACKEND_URL}/api/v1/manufacturer/products`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const productsData = await productsRes.json()
        
        // Fetch pending registrations
        const regsRes = await fetch(`${BACKEND_URL}/api/v1/auth/registration-requests`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const regsData = await regsRes.json()
        const pendingRegs = (regsData.data || []).filter(r => r.status === 'pending')

        setStats({
          totalUsers: usersData.data?.length || 0,
          totalBatches: batchesData.data?.length || 0,
          totalProducts: productsData.data?.length || 0,
          pendingRegistrations: pendingRegs.length
        })
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setIsStatsLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Fetch system health from backend
  useEffect(() => {
    const token = localStorage.getItem('herbaltrace_token')
    if (!token) return

    const fetchSystemHealth = async () => {
      setIsHealthLoading(true)
      try {
        // Fetch overall health
        const healthRes = await fetch(`${BACKEND_URL}/api/v1/health/detailed`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const healthData = await healthRes.json()
        
        if (healthData.success) {
          const health = healthData.data
          const services = health.services || {}
          
          // Calculate API response time from uptime
          const apiResponseTime = Math.round(process?.uptime ? 1000 / process.uptime() : 245)
          
          // Memory usage percentage
          const memoryPercent = health.memory 
            ? Math.round((health.memory.heapUsed / health.memory.heapTotal) * 100) 
            : 67
          
          setSystemHealth({
            blockchain: {
              status: services.blockchain?.status === 'healthy' ? 'Healthy' : 
                       services.blockchain?.status === 'unknown' ? 'Unknown' : 'Degraded',
              value: services.blockchain?.status === 'healthy' ? '100%' : '-',
              color: services.blockchain?.status === 'healthy' ? 'green' : 
                     services.blockchain?.status === 'unknown' ? 'yellow' : 'red'
            },
            api: {
              status: services.api?.status === 'healthy' ? 'Good' : 'Unknown',
              value: services.api?.status === 'healthy' ? `${apiResponseTime}ms` : '-',
              color: services.api?.status === 'healthy' ? 'blue' : 'yellow'
            },
            database: {
              status: services.database?.status === 'healthy' ? 'Normal' : 
                      services.database?.status === 'unknown' ? 'Unknown' : 'Error',
              value: `${memoryPercent}%`,
              color: services.database?.status === 'healthy' ? 'yellow' : 
                     services.database?.status === 'unknown' ? 'gray' : 'red'
            },
            storage: {
              status: 'Healthy',
              value: '76% Free',
              color: 'green'
            }
          })
          
          // Calculate transaction stats from stats data
          const totalTransactions = stats.totalBatches + stats.totalProducts
          const estimatedTPS = totalTransactions > 0 ? Math.min(totalTransactions * 10, 9999) : 0
          setTransactionStats({
            peakTPS: estimatedTPS,
            avgResponse: apiResponseTime
          })
          
          // Update recent activities based on actual data
          const activities = [
            { action: 'System initialized', time: 'Just now', icon: Code, color: 'blue' }
          ]
          
          if (services.blockchain?.status === 'healthy') {
            activities.push({ 
              action: 'Fabric network connected', 
              time: 'Active', 
              icon: Server, 
              color: 'green' 
            })
          }
          
          if (userData) {
            activities.push({ 
              action: `${userData.fullName || userData.username || 'Admin'} logged in`, 
              time: 'Current session', 
              icon: Users, 
              color: 'purple' 
            })
          }
          
          if (services.database?.status === 'healthy' || services.database?.status === 'unknown') {
            activities.push({ 
              action: 'Database synced', 
              time: 'Active', 
              icon: Database, 
              color: 'gray' 
            })
          }
          
          setRecentActivities(activities)
        }
      } catch (err) {
        console.error('Failed to fetch system health:', err)
        // Keep default values on error
      } finally {
        setIsHealthLoading(false)
      }
    }

    fetchSystemHealth()
    // Refresh health every 30 seconds
    const interval = setInterval(fetchSystemHealth, 30000)
    return () => clearInterval(interval)
  }, [stats, userData])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  // Dynamic stats from real data
  const systemStats = [
    { id: 1, title: 'Total Users', value: isStatsLoading ? '...' : String(stats.totalUsers), change: 'Live', trend: 'up', icon: Users, color: 'blue' },
    { id: 2, title: 'Total Batches', value: isStatsLoading ? '...' : String(stats.totalBatches), change: 'Live', trend: 'up', icon: Database, color: 'green' },
    { id: 3, title: 'Products Created', value: isStatsLoading ? '...' : String(stats.totalProducts), change: 'Live', trend: 'up', icon: Zap, color: 'purple' },
    { id: 4, title: 'Pending Registrations', value: isStatsLoading ? '...' : String(stats.pendingRegistrations), change: 'Live', trend: 'up', icon: Activity, color: 'orange' }
  ]

  const networkNodes = [
    {
      id: 'NODE-001',
      name: 'Peer0 Farmers',
      type: 'Peer',
      status: 'Online',
      uptime: '99.9%',
      version: 'v2.5.1',
      location: 'localhost:7051',
      cpu: '-',
      memory: '-',
      network: '-',
      lastSync: new Date().toISOString()
    },
    {
      id: 'NODE-002',
      name: 'Peer0 Labs',
      type: 'Peer',
      status: 'Online',
      uptime: '99.9%',
      version: 'v2.5.0',
      location: 'localhost:9051',
      cpu: '-',
      memory: '-',
      network: '-',
      lastSync: new Date().toISOString()
    },
    {
      id: 'NODE-003',
      name: 'Peer0 Processors',
      type: 'Peer',
      status: 'Online',
      uptime: '99.9%',
      version: 'v2.5.1',
      location: 'localhost:11051',
      cpu: '-',
      memory: '-',
      network: '-',
      lastSync: new Date().toISOString()
    },
    {
      id: 'NODE-004',
      name: 'Orderer',
      type: 'Orderer',
      status: 'Online',
      uptime: '99.99%',
      version: 'v2.5.1',
      location: 'localhost:7050',
      cpu: '22%',
      memory: '44%',
      network: '245 MB/s',
      lastSync: new Date().toISOString()
    }
  ]

  useEffect(() => {
    const token = localStorage.getItem('herbaltrace_token')
    if (!token) {
      setUsersError('Sign in as Admin to view live users.')
      return
    }

    const loadUsers = async () => {
      setIsUsersLoading(true)
      setUsersError('')
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const result = await response.json()
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to load users')
        }

        const liveUsers = (result.data || []).map((u) => ({
          id: u.userId,
          name: u.fullName || u.username,
          email: u.email,
          role: u.role,
          status: (u.status || 'active').charAt(0).toUpperCase() + (u.status || 'active').slice(1),
          lastLogin: u.lastLogin || 'Never',
          permissions: []
        }))
        setUserRoles(liveUsers)
      } catch (err) {
        setUsersError(err.message || 'Could not load users from API')
      } finally {
        setIsUsersLoading(false)
      }
    }

    loadUsers()
  }, [])

  const sustainabilityKPIs = [
    { metric: 'Total Users', value: String(stats.totalUsers), target: '-', progress: 100, icon: Users },
    { metric: 'Active Farmers', value: String(userRoles.filter(u => u.role === 'Farmer').length), target: '-', progress: 100, icon: Tractor },
    { metric: 'Lab Users', value: String(userRoles.filter(u => u.role === 'Lab' || u.role === 'Laboratory').length), target: '-', progress: 100, icon: Beaker },
    { metric: 'Manufacturers', value: String(userRoles.filter(u => u.role === 'Manufacturer').length), target: '-', progress: 100, icon: Factory }
  ]

  const smartContracts = [
    {
      name: 'HerbalTraceContract',
      version: 'v1.0.0',
      deployedAt: 'herbaltrace-channel',
      status: 'Active',
      transactions: String(stats.totalBatches + stats.totalProducts),
      gasUsed: 'N/A (Fabric)'
    },
    {
      name: 'CollectionEvent',
      version: 'v1.0.0',
      deployedAt: 'herbaltrace-channel',
      status: 'Active',
      transactions: 'Live',
      gasUsed: 'N/A (Fabric)'
    },
    {
      name: 'QualityTest',
      version: 'v1.0.0',
      deployedAt: 'herbaltrace-channel',
      status: 'Active',
      transactions: 'Live',
      gasUsed: 'N/A (Fabric)'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Navbar */}
      <DashboardNavbar 
        userName={userData?.fullName || userData?.username || 'Admin'} 
        userRole="Admin"
        dateJoined="System Administrator"
        approvedBy="HerbalTrace Network"
      />

      {/* Header/Greeting Section */}
      <div className="pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-primary-100 text-sm md:text-base mb-1">Welcome back</p>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{greeting}, {userData?.fullName || userData?.username || 'Admin'}</h1>
                <p className="text-primary-100 text-sm md:text-base mt-2">Network Administrator - HerbalTrace Platform</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-700 px-5 py-2.5 rounded-xl font-semibold flex items-center space-x-2 hover:bg-primary-50 transition-colors text-sm md:text-base shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Node</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.id * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className={
                  stat.color === 'blue' ? 'p-3 rounded-xl bg-blue-100' :
                  stat.color === 'green' ? 'p-3 rounded-xl bg-green-100' :
                  stat.color === 'purple' ? 'p-3 rounded-xl bg-purple-100' :
                  stat.color === 'orange' ? 'p-3 rounded-xl bg-orange-100' :
                  'p-3 rounded-xl bg-gray-100'
                }>
                  <stat.icon className={
                    stat.color === 'blue' ? 'h-6 w-6 text-blue-600' :
                    stat.color === 'green' ? 'h-6 w-6 text-green-600' :
                    stat.color === 'purple' ? 'h-6 w-6 text-purple-600' :
                    stat.color === 'orange' ? 'h-6 w-6 text-orange-600' :
                    'h-6 w-6 text-gray-600'
                  } />
                </div>
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'System Overview', icon: BarChart3 },
            { id: 'registrations', label: 'Registrations', icon: UserCheck },
            { id: 'nodes', label: 'Network Nodes', icon: Server },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'complaints', label: 'Complaints', icon: MessageCircle },
            { id: 'contracts', label: 'Smart Contracts', icon: Code },
            { id: 'integrations', label: 'Integrations', icon: Link },
            { id: 'sustainability', label: 'Sustainability KPIs', icon: Leaf }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm md:text-base ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              <SystemHealthOverview systemHealth={systemHealth} isLoading={isHealthLoading} />
              <TransactionThroughput stats={transactionStats} />
              <RecentActivities activities={recentActivities} />
            </motion.div>
          )}

          {activeTab === 'registrations' && (
            <motion.div
              key="registrations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <RegistrationRequestsManagement />
            </motion.div>
          )}

          {activeTab === 'nodes' && (
            <motion.div
              key="nodes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <NetworkNodeManagement nodes={networkNodes} onSelectNode={setSelectedNode} />
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <UserRoleManagement
                users={userRoles}
                onSelectUser={setSelectedUser}
                isLoading={isUsersLoading}
                error={usersError}
              />
            </motion.div>
          )}

          {activeTab === 'complaints' && (
            <motion.div
              key="complaints"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <ComplaintsManagement />
            </motion.div>
          )}

          {activeTab === 'contracts' && (
            <motion.div
              key="contracts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <SmartContractManagement contracts={smartContracts} />
            </motion.div>
          )}

          {activeTab === 'integrations' && (
            <motion.div
              key="integrations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <IntegrationControlPanel />
            </motion.div>
          )}

          {activeTab === 'sustainability' && (
            <motion.div
              key="sustainability"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <SustainabilityDashboard kpis={sustainabilityKPIs} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedNode && (
          <NodeDetailModal node={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
        {selectedUser && (
          <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// System Health Overview Component
const SystemHealthOverview = ({ systemHealth, isLoading }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">System Health</h2>
    {isLoading ? (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    ) : (
      <div className="space-y-4">
        {[
          { label: 'Blockchain Sync', ...systemHealth.blockchain },
          { label: 'API Response', ...systemHealth.api },
          { label: 'Database Load', ...systemHealth.database },
          { label: 'Storage Space', ...systemHealth.storage }
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-600">{item.value}</p>
            </div>
            <span className={
              item.color === 'green' ? 'px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700' :
              item.color === 'blue' ? 'px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700' :
              item.color === 'yellow' ? 'px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700' :
              item.color === 'red' ? 'px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700' :
              'px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700'
            }>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
)

// Transaction Throughput Component
const TransactionThroughput = ({ stats }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Transaction Throughput</h2>
    <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
      <div className="text-center">
        <Activity className="h-12 w-12 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Real-time metrics</p>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-600">Estimated TPS</p>
        <p className="font-bold text-2xl text-green-600">{stats.peakTPS.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-gray-600">Avg Response</p>
        <p className="font-bold text-2xl text-blue-600">{stats.avgResponse}ms</p>
      </div>
    </div>
  </div>
)

// Recent Activities Component
const RecentActivities = ({ activities }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
          <div className={
            activity.color === 'blue' ? 'p-2 rounded-lg bg-blue-100' :
            activity.color === 'green' ? 'p-2 rounded-lg bg-green-100' :
            activity.color === 'purple' ? 'p-2 rounded-lg bg-purple-100' :
            activity.color === 'gray' ? 'p-2 rounded-lg bg-gray-100' :
            'p-2 rounded-lg bg-gray-100'
          }>
            <activity.icon className={
              activity.color === 'blue' ? 'h-4 w-4 text-blue-600' :
              activity.color === 'green' ? 'h-4 w-4 text-green-600' :
              activity.color === 'purple' ? 'h-4 w-4 text-purple-600' :
              activity.color === 'gray' ? 'h-4 w-4 text-gray-600' :
              'h-4 w-4 text-gray-600'
            } />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
            <p className="text-xs text-gray-600">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Network Node Management Component
const NetworkNodeManagement = ({ nodes, onSelectNode }) => (
  <div>
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Network Nodes</h2>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </div>
    </div>

    <div className="p-6">
      <div className="space-y-4">
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            whileHover={{ scale: 1.01 }}
            className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all cursor-pointer"
            onClick={() => onSelectNode(node)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="font-semibold text-gray-900">{node.name}</h3>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {node.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    node.status === 'Online' ? 'bg-green-100 text-green-700' :
                    node.status === 'Syncing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {node.status}
                  </span>
                </div>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium">{node.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">CPU Usage</p>
                    <p className="font-medium">{node.cpu}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Memory</p>
                    <p className="font-medium">{node.memory}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Network</p>
                    <p className="font-medium">{node.network}</p>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
)

// User Role Management Component
const UserRoleManagement = ({ users, onSelectUser, isLoading, error }) => (
  <div>
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">User & Role Management</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm">
            Add User
          </button>
        </div>
      </div>
    </div>

    <div className="p-6">
      {isLoading && (
        <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          Loading users from API...
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-yellow-100 bg-yellow-50 p-3 text-sm text-yellow-700">
          {error}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-sm text-gray-500 text-center">
                  No users available.
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id || user.email} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.lastLogin}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded" onClick={() => onSelectUser(user)}>
                      <Eye className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

// Complaints Management Component
const ComplaintsManagement = () => {
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [responseText, setResponseText] = useState('')
  const [complaints, setComplaints] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch complaints from API
  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem('herbaltrace_token')
      if (!token) {
        setError('Please sign in to view complaints')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/complaints`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const result = await response.json()
        
        if (result.success) {
          const apiComplaints = (result.data || []).map(c => ({
            id: c.id || `CMP-${c.complaint_id || Date.now()}`,
            from: c.user_name || c.submitted_by || 'Unknown User',
            role: c.user_role || 'User',
            category: c.category,
            subject: c.subject,
            message: c.message,
            priority: c.priority || 'medium',
            status: c.status || 'pending',
            createdAt: c.created_at ? new Date(c.created_at).toLocaleString() : 'Unknown',
            response: c.admin_response
          }))
          setComplaints(apiComplaints)
        } else {
          setError(result.error || 'Failed to fetch complaints')
        }
      } catch (err) {
        console.error('Error fetching complaints:', err)
        setError('Failed to load complaints')
      } finally {
        setIsLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  const handleSubmitResponse = async () => {
    if (!selectedComplaint || !responseText.trim()) return
    
    const token = localStorage.getItem('herbaltrace_token')
    if (!token) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/complaints/${selectedComplaint.id}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          response: responseText
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // Update local state
        setComplaints(prev => prev.map(c => 
          c.id === selectedComplaint.id 
            ? { ...c, response: responseText, status: 'in_progress' }
            : c
        ))
        setSelectedComplaint(null)
        setResponseText('')
      }
    } catch (err) {
      console.error('Error submitting response:', err)
    }
  }

  const filteredComplaints = filterStatus === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === filterStatus)

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-green-100 text-green-700'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-gray-100 text-gray-700'
      case 'in-progress': return 'bg-blue-100 text-blue-700'
      case 'resolved': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRoleColor = (role) => {
    switch(role) {
      case 'Farmer': return 'bg-green-100 text-green-700'
      case 'Laboratory': return 'bg-purple-100 text-purple-700'
      case 'Manufacturer': return 'bg-blue-100 text-blue-700'
      case 'Regulator': return 'bg-orange-100 text-orange-700'
      case 'Consumer': return 'bg-pink-100 text-pink-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div>
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <MessageCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Complaints Management</h2>
              <p className="text-sm text-gray-600">Review and resolve stakeholder complaints</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{complaints.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{complaints.filter(c => c.status === 'pending').length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{complaints.filter(c => c.status === 'in-progress').length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{complaints.filter(c => c.status === 'resolved').length}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <motion.div
              key={complaint.id}
              whileHover={{ scale: 1.01 }}
              className={`p-6 border rounded-xl transition-all cursor-pointer ${
                selectedComplaint?.id === complaint.id 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:shadow-md'
              }`}
              onClick={() => setSelectedComplaint(selectedComplaint?.id === complaint.id ? null : complaint)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm text-gray-500">{complaint.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(complaint.role)}`}>
                    {complaint.role}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{complaint.createdAt}</span>
              </div>

              <div className="mb-2">
                <span className="font-medium text-gray-900">{complaint.from}</span>
                <span className="text-gray-500 mx-2">•</span>
                <span className="text-gray-600">{complaint.category}</span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{complaint.subject}</h3>
              <p className="text-gray-600 text-sm">{complaint.message}</p>

              {complaint.response && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Admin Response</span>
                  </div>
                  <p className="text-sm text-green-800">{complaint.response}</p>
                </div>
              )}

              {/* Response Form */}
              <AnimatePresence>
                {selectedComplaint?.id === complaint.id && complaint.status !== 'resolved' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Response
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows="3"
                      placeholder="Type your response to this complaint..."
                    />
                    <div className="flex items-center justify-end space-x-3 mt-3">
                      <button 
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                        onClick={() => setSelectedComplaint(null)}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSubmitResponse}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-2"
                      >
                        <Send className="h-4 w-4" />
                        <span>Send Response</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Smart Contract Management Component
const SmartContractManagement = ({ contracts }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Smart Contract Management</h2>
    <div className="space-y-4">
      {contracts.map((contract) => (
        <div key={contract.name} className="p-4 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">{contract.name}</h3>
              <p className="text-sm text-gray-600">Version {contract.version}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                contract.status === 'Active' ? 'bg-green-100 text-green-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {contract.status}
              </span>
              <button className="bg-primary-600 text-white px-3 py-1 rounded text-xs hover:bg-primary-700">
                Update
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Contract Address</p>
              <p className="font-mono">{contract.deployedAt}</p>
            </div>
            <div>
              <p className="text-gray-500">Transactions</p>
              <p className="font-medium">{contract.transactions}</p>
            </div>
            <div>
              <p className="text-gray-500">Gas Used</p>
              <p className="font-medium">{contract.gasUsed}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Integration Control Panel Component
const IntegrationControlPanel = () => (
  <div className="grid lg:grid-cols-2 gap-8">
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ERP Integrations</h3>
      <div className="space-y-3">
        {['SAP S/4HANA', 'Oracle ERP', 'Microsoft Dynamics', 'Custom ERP'].map((erp) => (
          <div key={erp} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="font-medium">{erp}</span>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">IoT & API Management</h3>
      <div className="space-y-3">
        {['Sensor Network API', 'Weather Data API', 'Transportation API', 'Laboratory API'].map((api) => (
          <div key={api} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="font-medium">{api}</span>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm text-gray-600">Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Sustainability Dashboard Component
const SustainabilityDashboard = ({ kpis }) => (
  <div className="space-y-8">
    <div className="grid lg:grid-cols-2 gap-8">
      {kpis.map((kpi) => (
        <div key={kpi.metric} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <kpi.icon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{kpi.metric}</h3>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-primary-600">{kpi.value}</span>
                <span className="text-sm text-gray-600">Target: {kpi.target}</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(kpi.progress, 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{kpi.progress}% of target achieved</p>
        </div>
      ))}
    </div>
    
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analytics</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">847</div>
          <div className="text-sm text-gray-600">Active Farmers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">96.2%</div>
          <div className="text-sm text-gray-600">Lab Reliability Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">94.8%</div>
          <div className="text-sm text-gray-600">Processing Efficiency</div>
        </div>
      </div>
    </div>
  </div>
)

// Modal Components
const NodeDetailModal = ({ node, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Node Details - {node.name}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(node).filter(([key]) => key !== 'id').map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <p className="font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
        <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
          Restart Node
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          View Logs
        </button>
      </div>
    </motion.div>
  </motion.div>
)

const UserDetailModal = ({ user, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">User Details - {user.name}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(user).filter(([key]) => key !== 'id' && key !== 'permissions').map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <p className="font-semibold">{value}</p>
            </div>
          ))}
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500">Permissions</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {(user.permissions || []).map((permission) => (
              <span key={permission} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md">
                {permission}
              </span>
            ))}
            {(user.permissions || []).length === 0 && (
              <span className="text-sm text-gray-500">No explicit permissions listed</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
        <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
          Edit Permissions
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          View Activity
        </button>
      </div>
    </motion.div>
  </motion.div>
)

// Registration Requests Management Component
const RegistrationRequestsManagement = () => {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [approvalData, setApprovalData] = useState({ role: '', orgName: '' })
  const [isApproving, setIsApproving] = useState(false)
  const [approvalResult, setApprovalResult] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  const roleOptions = ['Farmer', 'Lab', 'Manufacturer', 'Consumer', 'Regulator']
  const orgOptions = ['FarmersCoop', 'TestingLabs', 'Manufacturers', 'Processors']

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    const token = localStorage.getItem('herbaltrace_token')
    if (!token) {
      setError('Sign in as Admin to view registration requests')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/registration-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch requests')
      }
      setRequests(result.data || [])
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedRequest || !approvalData.role || !approvalData.orgName) {
      return
    }
    
    const token = localStorage.getItem('herbaltrace_token')
    setIsApproving(true)
    setApprovalResult(null)

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/registration-requests/${selectedRequest.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          role: approvalData.role,
          orgName: approvalData.orgName,
          orgMsp: `${approvalData.orgName}MSP`
        })
      })
      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Approval failed')
      }
      setApprovalResult({
        type: 'success',
        data: result.data
      })
      fetchRequests()
    } catch (err) {
      setApprovalResult({ type: 'error', message: err.message })
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest || !rejectReason) return
    
    const token = localStorage.getItem('herbaltrace_token')
    setIsApproving(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/registration-requests/${selectedRequest.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectReason })
      })
      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Rejection failed')
      }
      setSelectedRequest(null)
      setShowRejectModal(false)
      setRejectReason('')
      fetchRequests()
    } catch (err) {
      alert(err.message)
    } finally {
      setIsApproving(false)
    }
  }

  const handleDelete = async (requestId) => {
    if (!confirm('Are you sure you want to delete this registration request?')) return
    
    const token = localStorage.getItem('herbaltrace_token')
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/registration-requests/${requestId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Delete failed')
      }
      fetchRequests()
    } catch (err) {
      alert(err.message)
    }
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const processedRequests = requests.filter(r => r.status !== 'pending')

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Registration Requests</h2>
        <button
          onClick={fetchRequests}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Requests */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-500" />
              Pending Requests ({pendingRequests.length})
            </h3>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending registration requests</p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedRequest(req)
                      setApprovalData({ role: req.role || 'Farmer', orgName: 'FarmersCoop' })
                      setApprovalResult(null)
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{req.full_name}</p>
                        <p className="text-sm text-gray-600">{req.email}</p>
                        <p className="text-xs text-gray-500">
                          {req.role || 'No role specified'} • {req.location_state || 'Unknown location'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        Pending
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(req.id)
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Processed Requests */}
          {processedRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Processed Requests ({processedRequests.length})
              </h3>
              <div className="space-y-2">
                {processedRequests.slice(0, 5).map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{req.full_name}</p>
                      <p className="text-sm text-gray-600">{req.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      req.status === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Approval Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-xl font-semibold text-gray-900">Review Registration</h3>
                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {approvalResult?.type === 'success' ? (
                  <div className="text-center py-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">User Created Successfully!</h4>
                    <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
                      <p><strong>User ID:</strong> {approvalResult.data.userId}</p>
                      <p><strong>Username:</strong> {approvalResult.data.username}</p>
                      <p><strong>Password:</strong> <code className="bg-yellow-100 px-2 py-1 rounded">{approvalResult.data.password}</code></p>
                      <p><strong>Email:</strong> {approvalResult.data.email}</p>
                      <p><strong>Role:</strong> {approvalResult.data.role}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">Please share these credentials with the user securely.</p>
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-gray-900">{selectedRequest.full_name}</p>
                          <p className="text-gray-600">{selectedRequest.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Phone</p>
                          <p className="font-medium">{selectedRequest.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Aadhaar</p>
                          <p className="font-medium">{selectedRequest.aadhar_number || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Location</p>
                          <p className="font-medium">{selectedRequest.location_district}, {selectedRequest.location_state}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Requested Role</p>
                          <p className="font-medium">{selectedRequest.role || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-4">
                      <h4 className="font-semibold text-gray-900">Assign Role & Organization</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                        <select
                          value={approvalData.role}
                          onChange={(e) => setApprovalData(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          {roleOptions.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organization *</label>
                        <select
                          value={approvalData.orgName}
                          onChange={(e) => setApprovalData(prev => ({ ...prev, orgName: e.target.value }))}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          {orgOptions.map(org => (
                            <option key={org} value={org}>{org}</option>
                          ))}
                        </select>
                      </div>

                      {approvalResult?.type === 'error' && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                          {approvalResult.message}
                        </div>
                      )}

                      <div className="flex space-x-3 pt-2">
                        <button
                          onClick={handleApprove}
                          disabled={isApproving || !approvalData.role || !approvalData.orgName}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                        >
                          {isApproving ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setShowRejectModal(true)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Rejection Reason</h4>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 h-32"
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectReason || isApproving}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isApproving ? 'Rejecting...' : 'Confirm Reject'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminLandingPage
