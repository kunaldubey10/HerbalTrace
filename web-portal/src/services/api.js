import { validateInput, secureRequest, rateLimit } from '../utils/security'

// Mock API for demonstration - in production, replace with actual backend
const MOCK_API_DELAY = 1000

// Sample tracking data
const sampleTrackingData = {
  'HT-TUR-2024-001': {
    id: 'HT-TUR-2024-001',
    name: 'Organic Turmeric Powder',
    grade: 'Premium Grade A',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200&h=200&fit=crop',
    status: 'completed',
    journey: [
      {
        stage: 'cultivation',
        title: 'Seed & Cultivation',
        date: '2024-01-15',
        location: 'Organic Farm, Kerala, India',
        details: 'Organic seeds planted in certified soil',
        verified: true
      },
      {
        stage: 'farming',
        title: 'Farm Management',
        date: '2024-02-20',
        location: 'Organic Farm, Kerala, India',
        details: 'Natural fertilizers and organic pest control',
        verified: true
      },
      {
        stage: 'harvest',
        title: 'Harvesting',
        date: '2024-04-20',
        location: 'Organic Farm, Kerala, India',
        details: 'Hand-harvested at optimal maturity',
        verified: true
      },
      {
        stage: 'processing',
        title: 'Processing',
        date: '2024-04-25',
        location: 'Processing Unit, Kerala',
        details: 'Sun-dried and ground using traditional methods',
        verified: true
      },
      {
        stage: 'testing',
        title: 'Quality Testing',
        date: '2024-04-30',
        location: 'Quality Lab, Mumbai',
        details: 'Lab-tested for purity and curcumin content',
        verified: true
      },
      {
        stage: 'packaging',
        title: 'Packaging',
        date: '2024-05-05',
        location: 'Packaging Unit, Mumbai',
        details: 'Sealed in food-grade packaging',
        verified: true
      }
    ],
    certificates: ['Organic India', 'ISO 22000', 'FSSAI'],
    lab_results: {
      curcumin_content: '6.5%',
      moisture_content: '8.2%',
      heavy_metals: 'Within limits',
      pesticide_residue: 'None detected'
    }
  },
  'HT-GIN-2024-002': {
    id: 'HT-GIN-2024-002',
    name: 'Organic Ginseng Root',
    grade: 'Premium Grade AAA',
    image: 'https://images.unsplash.com/photo-1609825488888-3a766db05542?w=200&h=200&fit=crop',
    status: 'in_transit',
    journey: [
      {
        stage: 'cultivation',
        title: 'Seed & Cultivation',
        date: '2019-03-10',
        location: 'Mountain Farm, Himachal Pradesh',
        details: '5-year aged ginseng cultivation',
        verified: true
      },
      {
        stage: 'harvest',
        title: 'Harvesting',
        date: '2024-03-15',
        location: 'Mountain Farm, Himachal Pradesh',
        details: 'Carefully hand-harvested after 5 years',
        verified: true
      },
      {
        stage: 'processing',
        title: 'Processing',
        date: '2024-03-20',
        location: 'Traditional Processing Unit',
        details: 'Steam-processed using Korean methods',
        verified: true
      },
      {
        stage: 'shipping',
        title: 'Shipping',
        date: '2024-11-18',
        location: 'Distribution Center, Delhi',
        details: 'Temperature-controlled shipping',
        verified: false
      }
    ],
    certificates: ['Organic India', 'Traditional Medicine Board'],
    lab_results: {
      ginsenoside_content: '4.2%',
      moisture_content: '12.1%',
      heavy_metals: 'Within limits',
      pesticide_residue: 'None detected'
    }
  },
  'HT-ASH-2024-003': {
    id: 'HT-ASH-2024-003',
    name: 'Ashwagandha Root Powder',
    grade: 'Premium Grade A+',
    image: 'https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=200&h=200&fit=crop',
    status: 'completed',
    journey: [
      {
        stage: 'cultivation',
        title: 'Seed & Cultivation',
        date: '2024-01-20',
        location: 'Organic Farm, Rajasthan',
        details: 'Traditional seeds in desert soil',
        verified: true
      },
      {
        stage: 'harvest',
        title: 'Harvesting',
        date: '2024-07-15',
        location: 'Organic Farm, Rajasthan',
        details: 'Roots harvested after 6 months',
        verified: true
      },
      {
        stage: 'processing',
        title: 'Processing',
        date: '2024-07-20',
        location: 'Ayurvedic Processing Unit',
        details: 'Traditional Ayurvedic processing methods',
        verified: true
      }
    ],
    certificates: ['Organic India', 'Ayush Ministry', 'ISO 22000'],
    lab_results: {
      withanolide_content: '2.5%',
      moisture_content: '9.8%',
      heavy_metals: 'Within limits',
      pesticide_residue: 'None detected'
    }
  }
}

export const trackingService = {
  // Track product by code with security validation
  async trackProduct(code, userIP = 'unknown') {
    // Rate limiting
    if (!rateLimit.canMakeRequest(userIP, 10, 300000)) { // 10 attempts per 5 minutes
      throw new Error('Too many requests. Please try again later.')
    }

    // Validate and sanitize tracking code
    const validCode = validateInput.trackingCode(code)
    if (!validCode) {
      throw new Error('Invalid tracking code format. Please check and try again.')
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY))

    // Check if tracking data exists
    if (!sampleTrackingData[validCode]) {
      throw new Error('Product not found. Please verify the tracking code.')
    }

    return {
      success: true,
      data: sampleTrackingData[validCode]
    }
  },

  // Get all available sample codes (for demo purposes)
  getSampleCodes() {
    return Object.keys(sampleTrackingData)
  },

  // Validate QR code data
  async validateQRCode(qrData, userIP = 'unknown') {
    // Rate limiting
    if (!rateLimit.canMakeRequest(`qr_${userIP}`, 5, 300000)) {
      throw new Error('Too many QR scan attempts. Please try again later.')
    }

    try {
      // Parse QR code data (should contain tracking code)
      const data = JSON.parse(qrData)
      if (!data.trackingCode) {
        throw new Error('Invalid QR code format')
      }

      return await this.trackProduct(data.trackingCode, userIP)
    } catch (error) {
      throw new Error('Invalid QR code. Please scan a valid Herbal Trace QR code.')
    }
  }
}

export const contactService = {
  // Submit contact form with validation
  async submitContactForm(formData, userIP = 'unknown') {
    // Rate limiting for contact form
    if (!rateLimit.canMakeRequest(`contact_${userIP}`, 3, 600000)) { // 3 attempts per 10 minutes
      throw new Error('Too many contact form submissions. Please try again later.')
    }

    // Validate all form fields
    const validatedData = {
      name: validateInput.name(formData.name),
      email: validateInput.email(formData.email),
      company: validateInput.company(formData.company || ''),
      message: validateInput.message(formData.message)
    }

    // Check if required fields are valid
    if (!validatedData.name) {
      throw new Error('Please enter a valid name (2-50 characters, letters only).')
    }
    if (!validatedData.email) {
      throw new Error('Please enter a valid email address.')
    }
    if (!validatedData.message) {
      throw new Error('Please enter a valid message (10-1000 characters).')
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In production, this would make a secure API call
    // return await secureRequest('/api/contact', {
    //   method: 'POST',
    //   body: JSON.stringify(validatedData)
    // })

    console.log('Contact form submitted:', validatedData)
    
    return {
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    }
  }
}

export const searchService = {
  // Search herbs with security validation
  async searchHerbs(query, userIP = 'unknown') {
    // Rate limiting for search
    if (!rateLimit.canMakeRequest(`search_${userIP}`, 20, 300000)) { // 20 searches per 5 minutes
      throw new Error('Too many search requests. Please try again later.')
    }

    // Validate and sanitize search query
    const sanitizedQuery = validateInput.sanitizeHtml(query)
    if (!sanitizedQuery || sanitizedQuery.length < 2) {
      throw new Error('Please enter at least 2 characters for search.')
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock search results
    const mockResults = [
      { id: 1, name: 'Turmeric', scientific: 'Curcuma longa' },
      { id: 2, name: 'Ginseng', scientific: 'Panax ginseng' },
      { id: 3, name: 'Ashwagandha', scientific: 'Withania somnifera' },
      { id: 4, name: 'Ginkgo', scientific: 'Ginkgo biloba' },
      { id: 5, name: 'Echinacea', scientific: 'Echinacea purpurea' }
    ]

    const filteredResults = mockResults.filter(herb => 
      herb.name.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
      herb.scientific.toLowerCase().includes(sanitizedQuery.toLowerCase())
    )

    return {
      success: true,
      data: filteredResults,
      query: sanitizedQuery
    }
  }
}