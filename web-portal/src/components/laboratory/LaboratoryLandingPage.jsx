import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  TrendingUp,
  Clock,
  Beaker,
  Award,
  Eye,
  Download,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Activity,
  BarChart3,
  FileCheck,
  X,
  CheckCircle,
  XCircle,
  MessageCircle,
  Send,
  RefreshCw
} from 'lucide-react'
import DashboardNavbar from '../common/DashboardNavbar'
import { useEnums } from '../../hooks/useEnums'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const LaboratoryLandingPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false)
  const [showComplaintModal, setShowComplaintModal] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)
  const [selectedBatchForTest, setSelectedBatchForTest] = useState(null)
  
  // API state
  const [batches, setBatches] = useState([])
  const [qcTests, setQcTests] = useState([])
  const [certificates, setCertificates] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [userData, setUserData] = useState(null)
  
  // Fetch enums for dropdowns
  const { enums } = useEnums()

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  // Load user data
  useEffect(() => {
    const userStr = localStorage.getItem('herbaltrace_user')
    if (userStr) {
      try {
        setUserData(JSON.parse(userStr))
      } catch (e) {
        console.error('Failed to parse user data')
      }
    }
  }, [])

  // Fetch batches and tests
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('herbaltrace_token')
      if (!token) {
        setError('Please sign in to view data')
        return
      }

      setIsLoading(true)
      try {
        // Fetch batches
        const batchRes = await fetch(`${BACKEND_URL}/api/v1/batches`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const batchResult = await batchRes.json()
        if (batchResult.success) {
          setBatches(batchResult.data || [])
        }

        // Fetch QC tests
        const testRes = await fetch(`${BACKEND_URL}/api/v1/qc/tests`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const testResult = await testRes.json()
        if (testResult.success) {
          setQcTests(testResult.data || [])
        }

        // Fetch certificates
        const certRes = await fetch(`${BACKEND_URL}/api/v1/qc/certificates`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const certResult = await certRes.json()
        if (certResult.success) {
          setCertificates(certResult.data || [])
        }
        
        setError('')
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate stats from real data
  const pendingTests = qcTests.filter(t => t.status === 'pending' || t.status === 'in_progress')
  const completedToday = qcTests.filter(t => t.status === 'completed' && t.completed_at?.startsWith(new Date().toISOString().split('T')[0]))
  const passedTests = qcTests.filter(t => t.status === 'completed')
  
  const stats = [
    { id: 1, title: 'Pending Tests', value: String(pendingTests.length), change: '+0', trend: 'up', icon: Clock, color: 'orange' },
    { id: 2, title: 'Completed Today', value: String(completedToday.length), change: '+0', trend: 'up', icon: CheckCircle2, color: 'green' },
    { id: 3, title: 'Total Tests', value: String(qcTests.length), change: '0', trend: 'up', icon: Award, color: 'blue' },
    { id: 4, title: 'Batches Available', value: String(batches.length), change: '0', trend: 'up', icon: TrendingUp, color: 'purple' }
  ]

  // Convert batches to display format
  const pendingBatches = batches.map((b) => ({
    id: b.batch_number,
    batchId: b.id,
    herb: b.species,
    farmer: b.created_by_name || b.created_by,
    priority: 'Medium',
    tests: [],
    receivedDate: b.created_at?.split('T')[0],
    deadline: 'N/A',
    status: b.status,
    totalQuantity: b.total_quantity,
    unit: b.unit,
    collectionCount: b.collection_count
  }))

  // Recent tests
  const recentTests = qcTests.slice(0, 5).map((t, i) => ({
    id: i,
    batch: t.batch_id,
    test: t.test_type,
    result: t.status === 'completed' ? 'Pass' : t.status,
    time: t.completed_at || t.requested_at
  }))

  // Test templates from enums API
  const testTemplates = enums.testTypes?.map((t, i) => ({
    id: i + 1,
    name: t.label,
    duration: t.duration || 'N/A',
    threshold: t.threshold || 'N/A'
  })) || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Navbar */}
      <DashboardNavbar 
        userName={userData?.fullName || 'Lab User'} 
        userRole="Laboratory"
        dateJoined="Registered User"
        approvedBy="HerbalTrace Admin"
      />

      {/* Header/Greeting Section */}
      <div className="pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-primary-100 text-sm md:text-base mb-1">Welcome back</p>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{greeting}, {userData?.fullName || 'Lab User'}</h1>
                <p className="text-primary-100 text-sm md:text-base mt-2">Quality Control Laboratory</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTestModal(true)}
                  className="bg-white text-primary-700 px-5 py-2.5 rounded-xl font-semibold flex items-center space-x-2 hover:bg-primary-50 transition-colors text-sm md:text-base shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span>New QC Test</span>
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
        {/* Loading/Error states */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600">{error}</div>
        )}
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
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
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'queue', label: 'Test Queue', icon: Clock },
            { id: 'upload', label: 'Upload Results', icon: Upload },
            { id: 'certificates', label: 'Certificates', icon: Award },
            { id: 'analytics', label: 'Analytics', icon: Activity }
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
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Test Results</h2>
                  <button className="text-primary-600 font-medium hover:text-primary-700">View All</button>
                </div>
                <div className="space-y-4">
                  {recentTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-medium text-gray-900">{test.batch}</h3>
                        <p className="text-sm text-gray-600">{test.test}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            test.result === 'Pass' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {test.result}
                        </span>
                        <span className="text-sm text-gray-500">{test.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  {[
                    { icon: Upload, label: 'Upload Test Results', color: 'blue' },
                    { icon: FileCheck, label: 'Generate Certificate', color: 'green' },
                    { icon: Search, label: 'Search Batches', color: 'purple' },
                    { icon: BarChart3, label: 'View Analytics', color: 'orange' }
                  ].map((action) => (
                    <motion.button
                      key={action.label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center space-x-3 p-4 rounded-xl border-2 border-${action.color}-100 hover:bg-${action.color}-50 transition-colors text-left`}
                    >
                      <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                        <action.icon className={`h-5 w-5 text-${action.color}-600`} />
                      </div>
                      <span className="font-medium text-gray-900">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'queue' && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Test Queue</h2>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search batches..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <button className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Filter className="h-4 w-4" />
                      <span className="text-sm">Filter</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Queue List */}
              <div className="p-6">
                <div className="space-y-4">
                  {pendingBatches.map((batch) => (
                    <motion.div
                      key={batch.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedBatch(batch)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <h3 className="font-semibold text-gray-900">{batch.id}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              batch.priority === 'High' ? 'bg-red-100 text-red-700' :
                              batch.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {batch.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              batch.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              batch.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {batch.status}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Herb</p>
                              <p className="font-medium">{batch.herb}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Farmer</p>
                              <p className="font-medium">{batch.farmer}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Deadline</p>
                              <p className="font-medium">{batch.deadline}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm text-gray-500 mb-2">Required Tests:</p>
                            <div className="flex flex-wrap gap-2">
                              {batch.tests.map((test) => (
                                <span key={test} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md">
                                  {test}
                                </span>
                              ))}
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
            </motion.div>
          )}

          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Test Upload Form */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Test Results</h2>
                <UploadForm testTypes={enums?.testTypes} />
              </div>
            </motion.div>
          )}

          {activeTab === 'certificates' && (
            <motion.div
              key="certificates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Lab Certificates</h2>
              <CertificatesSection certificates={certificates} />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <AnalyticsSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Batch Details Modal */}
      <AnimatePresence>
        {selectedBatch && (
          <BatchModal 
            batch={selectedBatch} 
            onClose={() => setSelectedBatch(null)} 
            onStartTest={(batch) => {
              setSelectedBatchForTest(batch)
              setShowTestModal(true)
            }}
          />
        )}
      </AnimatePresence>

      {/* New Test Modal */}
      <AnimatePresence>
        {isNewTestModalOpen && (
          <NewTestModal 
            onClose={() => setIsNewTestModalOpen(false)} 
            batches={batches}
            testTypes={enums?.testTypes}
            species={enums?.species}
          />
        )}
      </AnimatePresence>

      {/* QC Test Creation Modal - API Connected */}
      <AnimatePresence>
        {showTestModal && (
          <QCTestCreationModal 
            batches={pendingBatches} 
            selectedBatch={selectedBatchForTest}
            userData={userData}
            onClose={() => {
              setShowTestModal(false)
              setSelectedBatchForTest(null)
            }} 
            onSuccess={() => {
              setShowTestModal(false)
              setSelectedBatchForTest(null)
              fetchData()
            }}
            testTypesEnum={enums?.testTypes}
          />
        )}
      </AnimatePresence>

      {/* Complaint Modal */}
      <AnimatePresence>
        {showComplaintModal && (
          <ComplaintModal 
            onClose={() => setShowComplaintModal(false)} 
            categories={enums?.complaintCategories}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Upload Form Component
const UploadForm = ({ testTypes }) => {
  const [selectedTest, setSelectedTest] = useState('')
  const [testResult, setTestResult] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])

  const displayTestTypes = testTypes?.map(t => t.label) || [
    'Moisture Content',
    'Pesticide Residue',
    'Heavy Metals',
    'DNA Authentication',
    'Microbial Load',
    'Aflatoxin Analysis'
  ]

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Batch ID</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="HT-BATCH-2025-001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select test type</option>
            {displayTestTypes.map((test) => (
              <option key={test} value={test}>{test}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Test Result</label>
        <textarea
          value={testResult}
          onChange={(e) => setTestResult(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter detailed test results, measurements, and observations..."
        />
      </div>

      {/* File Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Lab Reports & Images</h3>
        <p className="text-gray-600 mb-4">Drag and drop your files here, or click to browse</p>
        <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          Choose Files
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Approve Batch</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            <span>Reject Batch</span>
          </motion.button>
        </div>
        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          Save Draft
        </button>
      </div>
    </div>
  )
}

// Certificates Section Component
const CertificatesSection = ({ certificates }) => {
  const displayCerts = certificates.length > 0 
    ? certificates.map(c => ({
        id: c.certificate_id || c.id,
        batch: c.batch_id || c.batch,
        herb: c.species || c.herb || 'Unknown',
        status: c.status === 'issued' ? 'Issued' : 'Pending',
        date: c.issued_at?.split('T')[0] || c.date || 'N/A'
      }))
    : []

  return (
    <div className="space-y-4">
      {displayCerts.length > 0 ? displayCerts.map((cert) => (
        <div key={cert.id} className="p-4 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{cert.id}</h3>
              <p className="text-sm text-gray-600">{cert.batch} - {cert.herb}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                cert.status === 'Issued' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {cert.status}
              </span>
              <button className="text-primary-600 hover:text-primary-700">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )) : (
        <div className="text-center py-8 text-gray-500">
          <FileCheck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No certificates issued yet</p>
          <p className="text-sm mt-1">Complete QC tests to generate certificates</p>
        </div>
      )}
    </div>
  )
}

// Analytics Section Component
const AnalyticsSection = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Failed Batches Analysis</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500">Chart visualization coming soon</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Turnaround Time Trends</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500">Chart visualization coming soon</p>
        </div>
      </div>
    </div>
  )
}

// Batch Detail Modal Component
const BatchModal = ({ batch, onClose, onStartTest }) => {
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
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Batch Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Batch ID</label>
              <p className="font-semibold">{batch.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Herb Type</label>
              <p className="font-semibold">{batch.herb}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Farmer</label>
              <p className="font-semibold">{batch.farmer}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Priority</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                batch.priority === 'High' ? 'bg-red-100 text-red-700' :
                batch.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {batch.priority}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Quantity</label>
              <p className="font-semibold">{batch.totalQuantity} {batch.unit}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                batch.status === 'created' ? 'bg-blue-100 text-blue-700' :
                batch.status === 'quality_tested' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {batch.status}
              </span>
            </div>
          </div>
          
          {batch.tests?.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500">Required Tests</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {batch.tests.map((test) => (
                  <span key={test} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md">
                    {test}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button 
            onClick={() => {
              onClose()
              onStartTest && onStartTest(batch)
            }}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Beaker className="h-4 w-4" />
            <span>Start Testing</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Download Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// New Test Modal Component
const NewTestModal = ({ onClose, batches, testTypes, species }) => {
  const [formData, setFormData] = useState({
    batchId: '',
    herbType: '',
    farmerName: '',
    priority: 'Medium',
    selectedTests: [],
    deadline: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Use enums for available tests
  const availableTests = testTypes?.map((t, i) => ({
    id: t.value || `test-${i}`,
    name: t.label,
    duration: t.duration || '1-2 hours'
  })) || [
    { id: 'moisture', name: 'Moisture Content', duration: '30 min' },
    { id: 'pesticide', name: 'Pesticide Residue', duration: '2 hours' },
    { id: 'heavymetals', name: 'Heavy Metals', duration: '3 hours' },
    { id: 'dna', name: 'DNA Authentication', duration: '4 hours' },
    { id: 'microbial', name: 'Microbial Load', duration: '1.5 hours' },
    { id: 'aflatoxin', name: 'Aflatoxin Analysis', duration: '2.5 hours' }
  ]

  // Use enums for herb types
  const herbTypes = species?.map(s => s.label) || [
    'Ashwagandha Root',
    'Turmeric Powder',
    'Tulsi Leaves',
    'Neem Extract',
    'Brahmi Leaves',
    'Shatavari Root',
    'Giloy Stem',
    'Amla Fruit',
    'Other'
  ]

  const handleTestToggle = (testId) => {
    setFormData(prev => ({
      ...prev,
      selectedTests: prev.selectedTests.includes(testId)
        ? prev.selectedTests.filter(id => id !== testId)
        : [...prev.selectedTests, testId]
    }))
  }

  const generateBatchId = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 900) + 100
    setFormData(prev => ({
      ...prev,
      batchId: `HT-BATCH-${year}-${random}`
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.batchId || !formData.herbType || formData.selectedTests.length === 0) {
      alert('Please fill in all required fields and select at least one test.')
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSuccess(true)
    
    // Close modal after showing success
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  if (isSuccess) {
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
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Added Successfully!</h2>
          <p className="text-gray-600 mb-2">Batch ID: <span className="font-semibold text-primary-600">{formData.batchId}</span></p>
          <p className="text-gray-500 text-sm">{formData.selectedTests.length} test(s) queued for analysis</p>
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
        className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Test</h2>
            <p className="text-sm text-gray-500 mt-1">Add a new batch for laboratory testing</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Batch ID Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Batch ID *</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={formData.batchId}
                onChange={(e) => setFormData(prev => ({ ...prev, batchId: e.target.value }))}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter or generate batch ID"
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateBatchId}
                className="px-4 py-2.5 bg-primary-100 text-primary-700 rounded-lg font-medium hover:bg-primary-200 transition-colors"
              >
                Generate
              </motion.button>
            </div>
          </div>

          {/* Herb & Farmer Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Herb Type *</label>
              <select
                value={formData.herbType}
                onChange={(e) => setFormData(prev => ({ ...prev, herbType: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">Select herb type</option>
                {herbTypes.map(herb => (
                  <option key={herb} value={herb}>{herb}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Farmer / Source</label>
              <input
                type="text"
                value={formData.farmerName}
                onChange={(e) => setFormData(prev => ({ ...prev, farmerName: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter farmer or source name"
              />
            </div>
          </div>

          {/* Priority & Deadline */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map(priority => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority }))}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                      formData.priority === priority
                        ? priority === 'High' 
                          ? 'bg-red-100 text-red-700 border-2 border-red-300'
                          : priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                          : 'bg-green-100 text-green-700 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Test Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Tests * <span className="text-gray-400 font-normal">(Choose one or more)</span></label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableTests.map(test => (
                <motion.button
                  key={test.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTestToggle(test.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    formData.selectedTests.includes(test.id)
                      ? 'bg-primary-100 border-2 border-primary-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-medium ${formData.selectedTests.includes(test.id) ? 'text-primary-700' : 'text-gray-900'}`}>
                        {test.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">Duration: {test.duration}</p>
                    </div>
                    {formData.selectedTests.includes(test.id) && (
                      <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
            {formData.selectedTests.length > 0 && (
              <p className="text-sm text-primary-600 mt-3">
                {formData.selectedTests.length} test(s) selected
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Any special instructions or observations..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add to Queue</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Complaint Modal Component
const ComplaintModal = ({ onClose, categories }) => {
  const [category, setCategory] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState('medium')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const displayCategories = categories?.map(c => c.label) || [
    'Equipment Malfunction',
    'Sample Quality Issue',
    'Testing Delay',
    'Calibration Problem',
    'Supply Shortage',
    'App/System Issue',
    'Other'
  ]

  const handleSubmit = async () => {
    if (!category || !subject || !message) return
    
    setIsSubmitting(true)
    
    try {
      const token = localStorage.getItem('herbaltrace_token')
      const response = await fetch(`${BACKEND_URL}/api/v1/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          subject,
          message,
          priority
        })
      })
      
      const result = await response.json()
      if (result.success) {
        setIsSubmitted(true)
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        alert('Failed to submit complaint: ' + (result.error || 'Unknown error'))
      }
    } catch (err) {
      console.error('Error submitting complaint:', err)
      alert('Failed to submit complaint')
    } finally {
      setIsSubmitting(false)
    }
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
              {displayCategories.map(cat => (
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

// QC Test Creation Modal - Connected to API
const QCTestCreationModal = ({ batches, selectedBatch, userData, onClose, onSuccess, testTypesEnum }) => {
  const [formData, setFormData] = useState({
    batchId: selectedBatch?.batchId || selectedBatch?.id || '',
    testType: 'IDENTITY',
    species: selectedBatch?.herb || selectedBatch?.species || '',
    priority: 'NORMAL',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Update form when selectedBatch changes
  React.useEffect(() => {
    if (selectedBatch) {
      setFormData(prev => ({
        ...prev,
        batchId: String(selectedBatch.batchId || selectedBatch.id || ''),
        species: selectedBatch.herb || selectedBatch.species || ''
      }))
    }
  }, [selectedBatch])

  // Use enum values for test types
  const testTypes = testTypesEnum?.map(t => t.value) || ['IDENTITY', 'PURITY', 'POTENCY', 'CONTAMINATION', 'MICROBIAL', 'HEAVY_METALS', 'PESTICIDES', 'MOISTURE']

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('herbaltrace_token')
    if (!token) {
      setError('Please sign in first')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const selectedBatch = batches.find(b => String(b.batchId || b.id) === formData.batchId)
      
      if (!userData?.userId) {
        setError('Lab ID not found. Please sign in again.')
        setIsSubmitting(false)
        return
      }
      
      const payload = {
        batch_id: selectedBatch?.id || formData.batchId,
        lab_id: userData.userId,
        lab_name: userData.orgName || 'Testing Lab',
        test_type: formData.testType,
        species: selectedBatch?.herb || formData.species,
        priority: formData.priority,
        notes: formData.notes
      }

      const response = await fetch(`${BACKEND_URL}/api/v1/qc/tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create QC test')
      }

      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b bg-primary-50">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Beaker className="h-5 w-5 mr-2 text-primary-600" />
            Create QC Test
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-primary-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Batch *</label>
            <select
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Choose a batch</option>
              {batches.map(batch => (
                <option key={batch.batchId || batch.id} value={batch.batchId || batch.id}>
                  {batch.id} - {batch.herb} ({batch.totalQuantity} {batch.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Type *</label>
            <select
              name="testType"
              value={formData.testType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {testTypes.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 h-24"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.batchId}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Test
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default LaboratoryLandingPage
