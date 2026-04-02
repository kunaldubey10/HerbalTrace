import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Shield, 
  Leaf,
  FlaskConical,
  Package,
  Truck,
  Store,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const ProductJourneyPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const journeyPathRef = useRef(null)
  const truckMarkerRef = useRef(null)
  const animationRef = useRef(null)
  
  const [activeOperation, setActiveOperation] = useState('op1')
  const [activeCity, setActiveCity] = useState('satara')
  const [expandedSection, setExpandedSection] = useState('journey')
  const [truckPosition, setTruckPosition] = useState({ lat: 17.6800, lng: 73.9900 })

  // Supply Chain Data
  const supplyChainData = {
    product: {
      name: 'Ashwagandha Root Tablets',
      batch: productId || 'ASH-2025-09-01',
      expiry: 'Sep 2027',
      manufacturer: 'HerbalLife Plus',
      verified: true
    },
    cities: [
      {
        id: "satara",
        name: "Satara",
        state: "Maharashtra",
        steps: [1, 2],
        lat: 17.6800,
        lng: 73.9900,
        operations: [
          {
            id: "op1",
            step: 1,
            type: "collection",
            title: "Harvest Collection",
            date: "Sep 15, 2025",
            time: "07:30 AM",
            icon: Leaf,
            details: {
              "Part Used": "Root",
              "Method": "Hand-pulled, shade-dried",
              "Moisture": "11.2%",
              "Compliance": "Within geo-fence",
              "Location": "Organic Plot #12, Satara"
            }
          },
          {
            id: "op2",
            step: 2,
            type: "processing",
            title: "Primary Processing",
            date: "Sep 16, 2025",
            time: "10:10 AM",
            icon: Package,
            details: {
              "Steps": "Washing, Sorting, Drying",
              "Temperature": "35–40°C",
              "Duration": "48 hours",
              "Facility": "Satara Processing Center",
              "Quality Check": "Initial screening passed"
            }
          }
        ]
      },
      {
        id: "pune",
        name: "Pune",
        state: "Maharashtra",
        steps: [3, 4, 5],
        lat: 18.5204,
        lng: 73.8567,
        operations: [
          {
            id: "op3",
            step: 3,
            type: "processing",
            title: "Milling & Powdering",
            date: "Sep 18, 2025",
            time: "12:00 PM",
            icon: Package,
            details: {
              "Batch ID": "ASH-MILL-2025-09-18",
              "Mesh Size": "80 mesh",
              "Storage": "Food-grade containers",
              "Facility": "HerbalTrace Milling Unit",
              "Quality": "Fine powder consistency"
            }
          },
          {
            id: "op4",
            step: 4,
            type: "lab",
            title: "Quality Testing",
            date: "Sep 19, 2025",
            time: "09:15 AM",
            icon: FlaskConical,
            details: {
              "Moisture": "7.5% (Pass)",
              "Pesticides": "Not Detected (Pass)",
              "Heavy Metals": "Within limits (Pass)",
              "DNA Match": "99.3% (Pass)",
              "Certificate": "LAB-ASH-2025-0919"
            }
          },
          {
            id: "op5",
            step: 5,
            type: "packaging",
            title: "Tablet Formulation",
            date: "Sep 25, 2025",
            time: "03:00 PM",
            icon: Package,
            details: {
              "Form": "Tablets",
              "Pack Size": "60 tablets",
              "Line": "Packaging Line 2",
              "Serialization": "HT-ASH- prefix",
              "Batch Code": "ASH-2025-09-01"
            }
          }
        ]
      },
      {
        id: "mumbai",
        name: "Mumbai",
        state: "Maharashtra",
        steps: [6],
        lat: 19.0760,
        lng: 72.8777,
        operations: [
          {
            id: "op6",
            step: 6,
            type: "distribution",
            title: "Distribution Hub",
            date: "Oct 1, 2025",
            time: "06:00 AM",
            icon: Truck,
            details: {
              "Logistics": "GreenRoute Logistics",
              "Shipment ID": "SHIP-ASH-2025-1001",
              "Destination": "Delhi, Bengaluru, Chennai",
              "Status": "In Transit",
              "ETA": "Oct 3-5, 2025"
            }
          }
        ]
      },
      {
        id: "delhi",
        name: "Delhi",
        state: "Delhi NCR",
        steps: [7],
        lat: 28.6139,
        lng: 77.2090,
        operations: [
          {
            id: "op7",
            step: 7,
            type: "distribution",
            title: "Regional Distribution",
            date: "Oct 3, 2025",
            time: "10:00 AM",
            icon: Truck,
            details: {
              "Warehouse": "Delhi North Distribution",
              "Temperature": "Controlled 20-25°C",
              "Inventory": "500 units received",
              "Next Stop": "Local retailers",
              "Tracking": "Active GPS monitoring"
            }
          }
        ]
      },
      {
        id: "bengaluru",
        name: "Bengaluru",
        state: "Karnataka",
        steps: [8],
        lat: 12.9716,
        lng: 77.5946,
        operations: [
          {
            id: "op8",
            step: 8,
            type: "retail",
            title: "Retail Delivery",
            date: "Oct 5, 2025",
            time: "02:30 PM",
            icon: Store,
            details: {
              "Store": "Wellness Pharmacy",
              "Location": "MG Road, Bengaluru",
              "Shelf Life": "24 months remaining",
              "QR Code": "Activated",
              "Status": "Ready for sale"
            }
          }
        ]
      }
    ],
    quality: {
      moisture: "7.5%",
      pesticides: "Not Detected",
      heavyMetals: "Within Limits",
      dnaMatch: "99.3%",
      certificate: "LAB-ASH-2025-0919"
    }
  }

  // City color mapping
  const getCityColor = (cityId) => {
    const colors = {
      satara: '#16a34a',
      pune: '#0ea5e9',
      mumbai: '#f59e0b',
      delhi: '#8b5cf6',
      bengaluru: '#ec4899'
    }
    return colors[cityId] || '#16a34a'
  }

  // Create truck icon
  const createTruckIcon = () => {
    return L.divIcon({
      html: `
        <div style="
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="40" height="40">
            <path fill="#D4A574" d="M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
          </svg>
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      className: 'truck-marker'
    })
  }

  // Animate truck movement
  const animateTruck = (fromLat, fromLng, toLat, toLng, duration = 2000) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth movement
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      
      const currentLat = fromLat + (toLat - fromLat) * easeProgress
      const currentLng = fromLng + (toLng - fromLng) * easeProgress
      
      if (truckMarkerRef.current) {
        truckMarkerRef.current.setLatLng([currentLat, currentLng])
      }
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setTruckPosition({ lat: toLat, lng: toLng })
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }

  // Initialize map
  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current, {
        attributionControl: false,
        zoomControl: false
      }).setView([20.0, 78.0], 5)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapInstance.current)

      L.control.zoom({ 
        position: 'bottomright'
      }).addTo(mapInstance.current)

      // Plot city markers
      supplyChainData.cities.forEach(city => {
        const cityColor = getCityColor(city.id)
        
        const icon = L.divIcon({
          html: `
            <div style="
              background: ${cityColor};
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              position: relative;
            ">
              <div style="font-size: 14px;">${city.name.charAt(0)}</div>
              <div style="font-size: 10px; opacity: 0.9;">${city.steps[0]}-${city.steps[city.steps.length-1]}</div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })

        const marker = L.marker([city.lat, city.lng], { 
          icon: icon,
          title: `${city.name} (Steps ${city.steps.join('-')})`
        }).addTo(mapInstance.current)

        city.operations.forEach(op => {
          markersRef.current.push({ 
            id: op.id, 
            marker, 
            cityId: city.id,
            operation: op 
          })
        })

        marker.on('click', () => {
          if (city.operations.length > 0) {
            highlightOperation(city.operations[0].id)
          }
        })
      })

      // Draw journey path
      const points = supplyChainData.cities.map(city => [city.lat, city.lng])
      journeyPathRef.current = L.polyline(points, {
        color: '#16a34a',
        weight: 3,
        opacity: 0.6,
        lineCap: 'round',
        dashArray: '8, 8'
      }).addTo(mapInstance.current)

      // Fit bounds
      const markerGroup = L.featureGroup(supplyChainData.cities.map(c => 
        L.marker([c.lat, c.lng])
      ))
      mapInstance.current.fitBounds(markerGroup.getBounds().pad(0.1))

      // Add truck marker at starting position (Satara)
      const startCity = supplyChainData.cities[0]
      truckMarkerRef.current = L.marker([startCity.lat, startCity.lng], {
        icon: createTruckIcon(),
        zIndexOffset: 1000
      }).addTo(mapInstance.current)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  const highlightOperation = (operationId) => {
    setActiveOperation(operationId)
    
    const targetCity = supplyChainData.cities.find(city => 
      city.operations.some(op => op.id === operationId)
    )
    
    if (targetCity) {
      setActiveCity(targetCity.id)
      
      if (mapInstance.current) {
        mapInstance.current.setView([targetCity.lat, targetCity.lng], 8)
        
        // Animate truck to the target city
        animateTruck(
          truckPosition.lat,
          truckPosition.lng,
          targetCity.lat,
          targetCity.lng,
          2000 // 2 seconds animation
        )
      }
    }
  }

  const handleCityStepClick = (cityId) => {
    const city = supplyChainData.cities.find(c => c.id === cityId)
    if (city && city.operations.length > 0) {
      // Animate truck to clicked city
      if (mapInstance.current && truckMarkerRef.current) {
        animateTruck(
          truckPosition.lat,
          truckPosition.lng,
          city.lat,
          city.lng,
          2000
        )
      }
      highlightOperation(city.operations[0].id)
    }
  }

  const renderCityStep = (city, index) => {
    const isActive = activeCity === city.id
    const cityOrder = ['satara', 'pune', 'mumbai', 'delhi', 'bengaluru']
    const currentIndex = cityOrder.indexOf(activeCity)
    const stepIndex = cityOrder.indexOf(city.id)
    const isCompleted = stepIndex < currentIndex
    
    return (
      <div 
        key={city.id}
        className="flex flex-col items-center relative z-10 bg-white px-2 cursor-pointer"
        onClick={() => handleCityStepClick(city.id)}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 transition-all duration-300 ${
          isActive 
            ? 'bg-primary-600 border-primary-600 text-white transform scale-110 shadow-lg ring-4 ring-primary-200' 
            : isCompleted
            ? 'bg-primary-600 border-primary-600 text-white'
            : 'bg-white border-gray-300 text-gray-500 border-2'
        }`}>
          {isCompleted || isActive ? <CheckCircle className="h-5 w-5" /> : index + 1}
        </div>
        <div className="text-xs text-gray-500 text-center mt-1 max-w-[70px] hidden sm:block">
          {city.name}
        </div>
      </div>
    )
  }

  const renderOperationCard = (operation, city) => {
    const Icon = operation.icon || Package
    return (
      <motion.div 
        key={operation.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:border-primary-400 hover:shadow-md ${
          activeOperation === operation.id 
            ? 'bg-primary-50 border-primary-400 shadow-md' 
            : 'bg-white border-gray-200'
        }`}
        onClick={() => highlightOperation(operation.id)}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
            activeOperation === operation.id ? 'bg-primary-600' : 'bg-gray-400'
          }`}>
            {operation.step}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{operation.title}</div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              {operation.date}
              <Clock className="h-3 w-3 ml-2" />
              {operation.time}
            </div>
          </div>
          <Icon className={`h-5 w-5 ${activeOperation === operation.id ? 'text-primary-600' : 'text-gray-400'}`} />
        </div>
        
        {activeOperation === operation.id && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 pt-3 border-t border-gray-200"
          >
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(operation.details).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{key}</div>
                  <div className="text-sm font-medium text-gray-900">{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  <Leaf className="h-5 w-5" />
                </div>
                <div className="text-xl font-bold text-gray-900">HerbalTrace</div>
              </div>
            </div>
            
            <div className="flex-1 text-center px-4">
              <div className="font-semibold text-gray-900">{supplyChainData.product.name}</div>
              <div className="text-sm text-gray-500">Batch: {supplyChainData.product.batch} • Expires: {supplyChainData.product.expiry}</div>
            </div>
            
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Authenticity Verified</span>
            </div>
          </div>
        </div>
      </header>

      {/* City Progress */}
      <section className="bg-white border-b border-gray-200 py-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between min-w-[500px]">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
            {supplyChainData.cities.map((city, index) => renderCityStep(city, index))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Map */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                Product Journey Map
              </h3>
            </div>
            <div ref={mapRef} className="h-[400px] lg:h-[500px] w-full"></div>
          </div>

          {/* Right Column: Journey Details */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {supplyChainData.cities.map(city => (
              <div key={city.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === city.id ? '' : city.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: getCityColor(city.id) }}
                    >
                      {city.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{city.name}, {city.state}</div>
                      <div className="text-sm text-gray-500">Steps {city.steps.join('-')}</div>
                    </div>
                  </div>
                  {expandedSection === city.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                {(expandedSection === city.id || expandedSection === 'journey') && (
                  <div className="px-4 pb-4 space-y-3">
                    {city.operations.map(op => renderOperationCard(op, city))}
                  </div>
                )}
              </div>
            ))}

            {/* Quality Metrics */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <FlaskConical className="h-5 w-5 text-primary-600" />
                </div>
                <div className="font-semibold text-gray-900">Quality Test Results</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <div className="text-2xl font-bold text-primary-600 mb-1">7.5%</div>
                  <div className="text-sm text-gray-500 mb-2">Moisture Content</div>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Pass
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <div className="text-2xl font-bold text-primary-600 mb-1">0.0</div>
                  <div className="text-sm text-gray-500 mb-2">Pesticides</div>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Not Detected
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <div className="text-2xl font-bold text-primary-600 mb-1">✓</div>
                  <div className="text-sm text-gray-500 mb-2">Heavy Metals</div>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Within Limits
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <div className="text-2xl font-bold text-primary-600 mb-1">99.3%</div>
                  <div className="text-sm text-gray-500 mb-2">DNA Match</div>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Pass
                  </span>
                </div>
              </div>
            </div>

            {/* Blockchain Info */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary-600" />
                </div>
                <div className="font-semibold text-gray-900">Blockchain Security</div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-primary-600">Network:</span>
                  <span className="text-gray-700">Permissioned Blockchain</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600">TxID:</span>
                  <span className="text-gray-700">0xA9F3B17C92D4...FA21</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600">Recorded:</span>
                  <span className="text-gray-700">2025-09-25 15:05:12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600">Nodes:</span>
                  <span className="text-gray-700">5 Cities, 4 Companies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-5 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-sm text-gray-600">HerbalTrace © 2025 | Supply Chain Transparency Platform</div>
          <div className="text-xs text-gray-500 mt-1">Track your product's journey from farm to shelf</div>
        </div>
      </footer>
    </div>
  )
}

export default ProductJourneyPage
