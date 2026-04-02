import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  MapPin, 
  Leaf, 
  FileCheck, 
  ShieldCheck,
  Eye,
  Map,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Calendar,
  Globe,
  BarChart3,
  FileText,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  Database,
  Plus,
  MoreHorizontal,
  X,
  Award,
  Target,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Camera,
  Microscope,
  FlaskConical,
  Navigation,
  ExternalLink,
  RefreshCw,
  MessageCircle,
  Send
} from 'lucide-react'
import DashboardNavbar from '../common/DashboardNavbar'

const RegulatorLandingPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [selectedViolation, setSelectedViolation] = useState(null)
  const [mapView, setMapView] = useState('supply-chain')
  const [showComplaintModal, setShowComplaintModal] = useState(false)

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const blockchainStats = [
    { id: 1, title: 'Verified Batches', value: '0', change: '0', trend: 'up', icon: Database, color: 'blue' },
    { id: 2, title: 'Compliance Rate', value: '0%', change: '0%', trend: 'up', icon: ShieldCheck, color: 'green' },
    { id: 3, title: 'Active Alerts', value: '0', change: '0', trend: 'up', icon: AlertTriangle, color: 'orange' },
    { id: 4, title: 'Reports Generated', value: '0', change: '0', trend: 'up', icon: FileText, color: 'purple' }
  ]

  const blockchainRecords = [
    {
      id: 'HT-BTH-2847',
      herb: 'Ashwagandha',
      farmer: 'Rajesh Kumar',
      location: 'Rajasthan',
      harvestDate: '2025-11-15',
      status: 'Verified',
      compliance: 'NMPB Compliant',
      testResults: 'Passed',
      sustainabilityScore: 'A+',
      transactions: 47
    },
    {
      id: 'HT-BTH-2846',
      herb: 'Brahmi',
      farmer: 'Meera Patel',
      location: 'Gujarat',
      harvestDate: '2025-11-12',
      status: 'Under Review',
      compliance: 'Pending Verification',
      testResults: 'In Progress',
      sustainabilityScore: 'A',
      transactions: 23
    },
    {
      id: 'HT-BTH-2845',
      herb: 'Turmeric',
      farmer: 'Suresh Singh',
      location: 'Karnataka',
      harvestDate: '2025-11-10',
      status: 'Flagged',
      compliance: 'Violation Detected',
      testResults: 'Failed',
      sustainabilityScore: 'B-',
      transactions: 15
    }
  ]

  const violations = [
    {
      id: 'VIO-001',
      type: 'Out-of-Season Harvest',
      batch: 'HT-BTH-2845',
      herb: 'Turmeric',
      farmer: 'Suresh Singh',
      location: 'Karnataka',
      severity: 'High',
      detectedOn: '2025-11-28',
      details: 'Harvest detected during conservation season (Nov-Jan)',
      status: 'Under Investigation'
    },
    {
      id: 'VIO-002',
      type: 'Banned Zone Collection',
      batch: 'HT-BTH-2832',
      herb: 'Shankhpushpi',
      farmer: 'Amit Sharma',
      location: 'Protected Reserve Area',
      severity: 'Critical',
      detectedOn: '2025-11-26',
      details: 'Collection from protected biodiversity zone',
      status: 'Action Required'
    },
    {
      id: 'VIO-003',
      type: 'Abnormal Test Results',
      batch: 'HT-BTH-2828',
      herb: 'Brahmi',
      farmer: 'Kavita Devi',
      location: 'Maharashtra',
      severity: 'Medium',
      detectedOn: '2025-11-25',
      details: 'Heavy metal content exceeds AYUSH standards',
      status: 'Resolved'
    }
  ]

  const sustainabilityRatings = [
    {
      id: 'HT-BTH-2847',
      herb: 'Ashwagandha',
      farmer: 'Rajesh Kumar',
      overallScore: 'A+',
      carbonFootprint: 'Low',
      waterUsage: 'Efficient',
      biodiversityImpact: 'Positive',
      soilHealth: 'Excellent',
      socialImpact: 'High',
      certifications: ['Organic', 'Fair Trade', 'Sustainable']
    },
    {
      id: 'HT-BTH-2846',
      herb: 'Brahmi',
      farmer: 'Meera Patel',
      overallScore: 'A',
      carbonFootprint: 'Low',
      waterUsage: 'Moderate',
      biodiversityImpact: 'Neutral',
      soilHealth: 'Good',
      socialImpact: 'Medium',
      certifications: ['Organic', 'Sustainable']
    },
    {
      id: 'HT-BTH-2845',
      herb: 'Turmeric',
      farmer: 'Suresh Singh',
      overallScore: 'B-',
      carbonFootprint: 'High',
      waterUsage: 'Excessive',
      biodiversityImpact: 'Negative',
      soilHealth: 'Poor',
      socialImpact: 'Low',
      certifications: []
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Navbar */}
      <DashboardNavbar 
        userName="Inspector Kavya Sharma" 
        userRole="Regulator"
        dateJoined="5 November 2023"
        approvedBy="System Administrator"
      />

      {/* Header/Greeting Section */}
      <div className="pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-primary-100 text-sm md:text-base mb-1">Welcome back</p>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{greeting}, Inspector Kavya Sharma</h1>
                <p className="text-primary-100 text-sm md:text-base mt-2">Medicinal Plant Conservation Authority - Eastern Himalayan Region</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-700 px-5 py-2.5 rounded-xl font-semibold flex items-center space-x-2 hover:bg-primary-50 transition-colors text-sm md:text-base shadow-md"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Report Violation</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowComplaintModal(true)}
                  className="bg-red-500 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center space-x-2 hover:bg-red-600 transition-colors text-sm md:text-base shadow-md"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Raise Complaint</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blockchain Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {blockchainStats.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.id * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
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
            { id: 'overview', label: 'Regulatory Overview', icon: BarChart3 },
            { id: 'blockchain', label: 'Blockchain Records', icon: Database },
            { id: 'supply-chain', label: 'Supply Chain Maps', icon: Map },
            { id: 'violations', label: 'Violation Detection', icon: AlertTriangle },
            { id: 'sustainability', label: 'Sustainability Ratings', icon: Leaf },
            { id: 'reports', label: 'Compliance Reports', icon: FileText }
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
              <RegulatoryOverview />
              <ComplianceMetrics />
              <RecentViolations violations={violations.slice(0, 3)} onSelectViolation={setSelectedViolation} />
            </motion.div>
          )}

          {activeTab === 'blockchain' && (
            <motion.div
              key="blockchain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <BlockchainRecordsView records={blockchainRecords} onSelectBatch={setSelectedBatch} />
            </motion.div>
          )}

          {activeTab === 'supply-chain' && (
            <motion.div
              key="supply-chain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <SupplyChainMaps mapView={mapView} setMapView={setMapView} />
            </motion.div>
          )}

          {activeTab === 'violations' && (
            <motion.div
              key="violations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <ViolationDetection violations={violations} onSelectViolation={setSelectedViolation} />
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
              <SustainabilityRatings ratings={sustainabilityRatings} />
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <ComplianceReports />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedBatch && (
          <BatchDetailModal batch={selectedBatch} onClose={() => setSelectedBatch(null)} />
        )}
        {selectedViolation && (
          <ViolationDetailModal violation={selectedViolation} onClose={() => setSelectedViolation(null)} />
        )}
        {showComplaintModal && (
          <ComplaintModal onClose={() => setShowComplaintModal(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// Regulatory Overview Component
const RegulatoryOverview = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Regulatory Overview</h2>
    <div className="space-y-4">
      {[
        { label: 'NMPB Compliance', status: 'Good', value: '96.2%', color: 'green' },
        { label: 'AYUSH Standards', status: 'Excellent', value: '98.5%', color: 'blue' },
        { label: 'Conservation Zones', status: 'Monitored', value: '12 Active', color: 'purple' },
        { label: 'Seasonal Restrictions', status: 'Enforced', value: '3 Active', color: 'orange' }
      ].map((item) => (
        <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">{item.label}</p>
            <p className="text-sm text-gray-600">{item.value}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${item.color}-100 text-${item.color}-700`}>
            {item.status}
          </span>
        </div>
      ))}
    </div>
  </div>
)

// Compliance Metrics Component
const ComplianceMetrics = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Compliance Metrics</h2>
    <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
      <p className="text-gray-500">Compliance chart placeholder</p>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-600">Violation Rate</p>
        <p className="font-bold text-2xl text-red-600">3.8%</p>
      </div>
      <div>
        <p className="text-gray-600">Resolution Time</p>
        <p className="font-bold text-2xl text-green-600">2.3 days</p>
      </div>
    </div>
  </div>
)

// Recent Violations Component
const RecentViolations = ({ violations, onSelectViolation }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Violations</h2>
    <div className="space-y-4">
      {violations.map((violation) => (
        <div key={violation.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => onSelectViolation(violation)}>
          <div className={`p-2 rounded-lg ${
            violation.severity === 'Critical' ? 'bg-red-100' :
            violation.severity === 'High' ? 'bg-orange-100' : 'bg-yellow-100'
          }`}>
            <AlertTriangle className={`h-4 w-4 ${
              violation.severity === 'Critical' ? 'text-red-600' :
              violation.severity === 'High' ? 'text-orange-600' : 'text-yellow-600'
            }`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{violation.type}</p>
            <p className="text-xs text-gray-600">{violation.herb} - {violation.farmer}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            violation.severity === 'Critical' ? 'bg-red-100 text-red-700' :
            violation.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {violation.severity}
          </span>
        </div>
      ))}
    </div>
  </div>
)

// Blockchain Records View Component
const BlockchainRecordsView = ({ records, onSelectBatch }) => (
  <div>
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Blockchain Records - Read-Only Access</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search batch records..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </div>
    </div>

    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Herb</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sustainability</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-mono text-sm text-gray-900">{record.id}</div>
                  <div className="text-xs text-gray-500">{record.transactions} transactions</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{record.herb}</div>
                  <div className="text-sm text-gray-600">{record.location}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{record.farmer}</div>
                  <div className="text-xs text-gray-600">{record.harvestDate}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    record.status === 'Verified' ? 'bg-green-100 text-green-700' :
                    record.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    record.compliance === 'NMPB Compliant' ? 'bg-blue-100 text-blue-700' :
                    record.compliance === 'Pending Verification' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {record.compliance}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    record.sustainabilityScore.includes('A') ? 'bg-green-100 text-green-700' :
                    record.sustainabilityScore.includes('B') ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {record.sustainabilityScore}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded" onClick={() => onSelectBatch(record)}>
                      <Eye className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ExternalLink className="h-4 w-4 text-gray-500" />
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

// Supply Chain Maps Component
const SupplyChainMaps = ({ mapView, setMapView }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Visual Supply Chain Maps</h2>
        <div className="flex space-x-2">
          {[
            { id: 'supply-chain', label: 'Supply Chain' },
            { id: 'geo-zones', label: 'Geo-Fenced Zones' },
            { id: 'seasonal', label: 'Seasonal Restrictions' }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setMapView(view.id)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                mapView === view.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-96 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">{
            mapView === 'supply-chain' ? 'Interactive Supply Chain Map' :
            mapView === 'geo-zones' ? 'Geo-Fenced Protection Zones' :
            'Seasonal Collection Restrictions'
          }</p>
          <p className="text-sm text-gray-400 mt-2">Real-time tracking and compliance visualization</p>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900">Compliant Zones</h4>
          <p className="text-2xl font-bold text-green-600">847</p>
          <p className="text-sm text-green-700">Active collection sites</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-medium text-red-900">Restricted Zones</h4>
          <p className="text-2xl font-bold text-red-600">12</p>
          <p className="text-sm text-red-700">Protected areas</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900">Seasonal Restrictions</h4>
          <p className="text-2xl font-bold text-yellow-600">3</p>
          <p className="text-sm text-yellow-700">Currently active</p>
        </div>
      </div>
    </div>
  </div>
)

// Violation Detection Component
const ViolationDetection = ({ violations, onSelectViolation }) => (
  <div>
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Automated Violation Detection</h2>
        <div className="flex items-center space-x-3">
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>All Severities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>All Status</option>
            <option>Under Investigation</option>
            <option>Action Required</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>
    </div>

    <div className="p-6">
      <div className="space-y-4">
        {violations.map((violation) => (
          <motion.div
            key={violation.id}
            whileHover={{ scale: 1.01 }}
            className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all cursor-pointer"
            onClick={() => onSelectViolation(violation)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${
                  violation.severity === 'Critical' ? 'bg-red-100' :
                  violation.severity === 'High' ? 'bg-orange-100' : 'bg-yellow-100'
                }`}>
                  <AlertTriangle className={`h-6 w-6 ${
                    violation.severity === 'Critical' ? 'text-red-600' :
                    violation.severity === 'High' ? 'text-orange-600' : 'text-yellow-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{violation.type}</h3>
                  <p className="text-sm text-gray-600">Batch: {violation.batch}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  violation.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                  violation.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {violation.severity}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  violation.status === 'Action Required' ? 'bg-red-100 text-red-700' :
                  violation.status === 'Under Investigation' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {violation.status}
                </span>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Herb</p>
                <p className="font-medium">{violation.herb}</p>
              </div>
              <div>
                <p className="text-gray-500">Farmer</p>
                <p className="font-medium">{violation.farmer}</p>
              </div>
              <div>
                <p className="text-gray-500">Location</p>
                <p className="font-medium">{violation.location}</p>
              </div>
              <div>
                <p className="text-gray-500">Detected</p>
                <p className="font-medium">{violation.detectedOn}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-700">{violation.details}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
)

// Sustainability Ratings Component
const SustainabilityRatings = ({ ratings }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Batch-wise Sustainability Ratings</h2>
      <div className="space-y-6">
        {ratings.map((rating) => (
          <div key={rating.id} className="p-6 border border-gray-200 rounded-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{rating.herb}</h3>
                <p className="text-sm text-gray-600">Batch: {rating.id} - Farmer: {rating.farmer}</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  rating.overallScore.includes('A') ? 'text-green-600' :
                  rating.overallScore.includes('B') ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {rating.overallScore}
                </div>
                <p className="text-sm text-gray-600">Overall Score</p>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-4 mb-4">
              {[
                { label: 'Carbon Footprint', value: rating.carbonFootprint, icon: Wind },
                { label: 'Water Usage', value: rating.waterUsage, icon: Droplets },
                { label: 'Biodiversity Impact', value: rating.biodiversityImpact, icon: Leaf },
                { label: 'Soil Health', value: rating.soilHealth, icon: Target },
                { label: 'Social Impact', value: rating.socialImpact, icon: Award }
              ].map((metric) => (
                <div key={metric.label} className="text-center p-3 bg-gray-50 rounded-lg">
                  <metric.icon className="h-5 w-5 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">{metric.label}</p>
                  <p className={`font-semibold text-sm ${
                    ['Excellent', 'High', 'Low', 'Efficient', 'Positive'].includes(metric.value) ? 'text-green-600' :
                    ['Good', 'Medium', 'Moderate', 'Neutral'].includes(metric.value) ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            {rating.certifications.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Certifications:</p>
                <div className="flex flex-wrap gap-2">
                  {rating.certifications.map((cert) => (
                    <span key={cert} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Compliance Reports Component
const ComplianceReports = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Export NMPB/AYUSH Compliance Reports</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">NMPB Reports</h3>
          <div className="space-y-3">
            {[
              { name: 'Monthly Collection Report', date: 'November 2025', size: '2.3 MB' },
              { name: 'Conservation Compliance', date: 'November 2025', size: '1.8 MB' },
              { name: 'Violation Summary', date: 'November 2025', size: '894 KB' }
            ].map((report) => (
              <div key={report.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-600">{report.date} • {report.size}</p>
                </div>
                <button className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">AYUSH Reports</h3>
          <div className="space-y-3">
            {[
              { name: 'Quality Standards Report', date: 'November 2025', size: '3.1 MB' },
              { name: 'Lab Testing Summary', date: 'November 2025', size: '2.7 MB' },
              { name: 'Manufacturing Compliance', date: 'November 2025', size: '1.5 MB' }
            ].map((report) => (
              <div key={report.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-600">{report.date} • {report.size}</p>
                </div>
                <button className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-xl">
        <h4 className="font-medium text-blue-900 mb-2">Custom Report Generation</h4>
        <p className="text-sm text-blue-700 mb-4">Generate custom compliance reports with specific parameters</p>
        <div className="grid md:grid-cols-3 gap-4">
          <select className="border border-blue-200 rounded-lg px-3 py-2 text-sm">
            <option>Report Type</option>
            <option>NMPB Compliance</option>
            <option>AYUSH Standards</option>
            <option>Sustainability</option>
          </select>
          <select className="border border-blue-200 rounded-lg px-3 py-2 text-sm">
            <option>Date Range</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  </div>
)

// Modal Components
const BatchDetailModal = ({ batch, onClose }) => (
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
        <h2 className="text-xl font-semibold text-gray-900">Batch Details - {batch.id}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(batch).filter(([key]) => key !== 'id').map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <p className="font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
        <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
          View Full Chain
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Export Data
        </button>
      </div>
    </motion.div>
  </motion.div>
)

const ViolationDetailModal = ({ violation, onClose }) => (
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
        <h2 className="text-xl font-semibold text-gray-900">Violation Details - {violation.id}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(violation).filter(([key]) => key !== 'id').map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <p className="font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
        <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
          Take Action
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Generate Report
        </button>
      </div>
    </motion.div>
  </motion.div>
)

// Complaint Modal Component
const ComplaintModal = ({ onClose }) => {
  const [category, setCategory] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState('medium')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const categories = [
    'Compliance Issue',
    'System Access Problem',
    'Data Discrepancy',
    'Report Generation Issue',
    'Blockchain Sync Issue',
    'App/System Issue',
    'Other'
  ]

  const handleSubmit = async () => {
    if (!category || !subject || !message) return
    
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Complaint Submitted!</h3>
          <p className="text-gray-600">Your complaint has been sent to the admin. You will receive a response soon.</p>
        </motion.div>
      </motion.div>
    )
  }

  return (
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
        className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Raise Complaint</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Brief subject of your complaint"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <div className="flex space-x-3">
              {['low', 'medium', 'high', 'urgent'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                    priority === p
                      ? p === 'urgent' ? 'bg-red-600 text-white'
                        : p === 'high' ? 'bg-orange-500 text-white'
                        : p === 'medium' ? 'bg-yellow-500 text-white'
                        : 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows="4"
              placeholder="Describe your complaint in detail..."
            />
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!category || !subject || !message || isSubmitting}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors ${
              !category || !subject || !message || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Submit Complaint</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RegulatorLandingPage
