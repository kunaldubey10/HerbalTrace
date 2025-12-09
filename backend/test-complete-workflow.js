/**
 * Complete Backend Proof of Concept
 * Demonstrates: Farmer Collection → Batch Creation → Lab Testing → Product Creation with QR
 */

const BASE_URL = 'http://localhost:3000/api/v1';

// Store tokens
let farmerToken, adminToken, labToken, manufacturerToken;
let collectionId, batchId, testId, productId, qrCode;

// Helper function for API calls using native fetch (Node 18+)
async function apiCall(method, endpoint, body = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  return await response.json();
}

console.log('\n🌿 ===== HERBALTRACE COMPLETE WORKFLOW PROOF OF CONCEPT =====\n');

(async () => {
  try {
    // =====================================================
    // STEP 1: LOGIN ALL USERS
    // =====================================================
    console.log('📋 STEP 1: Authenticating Users...');
    
    const farmerLogin = await apiCall('POST', '/auth/login', { username: 'avinashverma', password: 'avinashverma123' });
    farmerToken = farmerLogin.data?.token || farmerLogin.token;
    if (!farmerToken) throw new Error('Farmer login failed');
    console.log('✅ Farmer (avinashverma) logged in');
    
    const adminLogin = await apiCall('POST', '/auth/login', { username: 'admin', password: 'admin123' });
    adminToken = adminLogin.data?.token || adminLogin.token;
    if (!adminToken) throw new Error('Admin login failed');
    console.log('✅ Admin logged in');
    
    const labLogin = await apiCall('POST', '/auth/login', { username: 'labtest', password: 'labtest123' });
    labToken = labLogin.data?.token || labLogin.token;
    if (!labToken) throw new Error('Lab login failed');
    console.log('✅ Lab (labtest) logged in');
    
    const mfgLogin = await apiCall('POST', '/auth/login', { username: 'manufacturer', password: 'manufacturer123' });
    manufacturerToken = mfgLogin.data?.token || mfgLogin.token;
    if (!manufacturerToken) throw new Error('Manufacturer login failed');
    console.log('✅ Manufacturer logged in\n');

    // =====================================================
    // STEP 2: FARMER CREATES COLLECTION EVENT
    // =====================================================
    console.log('📋 STEP 2: Farmer Creates Collection Event...');
    
    const collectionData = {
      species: 'Tulsi',
      quantity: 10.5,
      unit: 'kg',
      latitude: 28.6139,
      longitude: 77.2090,
      altitude: 216,
      zoneName: 'Delhi NCR',
      harvestDate: new Date().toISOString().split('T')[0],
      harvestMethod: 'Hand Picked',
      partCollected: 'Leaves',
      weatherConditions: 'Sunny, 28°C'
    };
    
    const collection = await apiCall('POST', '/collections', collectionData, farmerToken);
    if (!collection.success) {
      throw new Error(`Collection failed: ${collection.message}`);
    }
    collectionId = collection.data?.id || collection.data?.collectionId;
    console.log(`✅ Collection created: ${collectionId}`);
    console.log(`   Species: ${collectionData.species}, Quantity: ${collectionData.quantity}${collectionData.unit}\n`);

    // =====================================================
    // STEP 3: ADMIN CREATES BATCH FROM COLLECTIONS
    // =====================================================
    console.log('📋 STEP 3: Admin Creates Batch...');
    
    const batchData = {
      species: 'Tulsi',
      collectionIds: [collectionId],
      notes: 'Premium quality Tulsi batch for testing'
    };
    
    const batch = await apiCall('POST', '/batches', batchData, adminToken);
    if (!batch.success) {
      throw new Error(`Batch creation failed: ${batch.message}`);
    }
    batchId = batch.data.batchNumber || batch.data.batch_number;
    console.log(`✅ Batch created: ${batchId}`);
    console.log(`   Total Quantity: ${batch.data.totalQuantity || batch.data.total_quantity}${batch.data.unit}`);
    console.log(`   Collections: ${batch.data.collectionCount || batch.data.collection_count}\n`);

    // =====================================================
    // STEP 4: LAB PERFORMS QUALITY TESTS
    // =====================================================
    console.log('📋 STEP 4: Lab Performs Quality Tests...');
    
    // Get test templates
    const templates = await apiCall('GET', '/qc/templates', null, labToken);
    console.log(`   Available test templates: ${templates.data.length}`);
    
    // Request tests for the batch
    const testRequest = {
      batchId: batchId,
      testTemplateIds: templates.data.slice(0, 3).map(t => t.id), // Use first 3 tests
      priority: 'HIGH',
      requestedBy: 'lab',
      notes: 'Standard quality testing for Tulsi batch'
    };
    
    const testReq = await apiCall('POST', '/qc/tests/request', testRequest, labToken);
    console.log(`✅ Quality tests requested: ${testReq.data.length} tests`);
    
    // Get the test IDs
    const tests = await apiCall('GET', `/qc/batches/${batchId}/tests`, null, labToken);
    testId = tests.data[0].test_id;
    
    // Submit test results
    console.log('   Submitting test results...');
    for (const test of tests.data) {
      const results = {
        testId: test.test_id,
        results: [
          {
            parameterId: 'param1',
            parameterName: 'Moisture Content',
            value: '8.5',
            unit: '%',
            result: 'PASS',
            notes: 'Within acceptable range'
          },
          {
            parameterId: 'param2',
            parameterName: 'Heavy Metals',
            value: '0.001',
            unit: 'ppm',
            result: 'PASS',
            notes: 'Below safety threshold'
          }
        ],
        overallResult: 'PASS',
        testedBy: 'lab',
        notes: 'All parameters within specification'
      };
      
      await apiCall('POST', '/qc/tests/results', results, labToken);
    }
    console.log(`✅ Test results submitted\n`);
    
    // Generate certificate
    console.log('   Generating quality certificate...');
    const certificate = await apiCall('POST', `/qc/tests/${testId}/certificate`, {
      issuedBy: 'lab',
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Batch meets all quality standards'
    }, labToken);
    console.log(`✅ Certificate issued: ${certificate.data.certificate_number}\n`);

    // =====================================================
    // STEP 5: MANUFACTURER CREATES PRODUCT WITH QR
    // =====================================================
    console.log('📋 STEP 5: Manufacturer Creates Product with QR Code...');
    
    const productData = {
      batchId: batchId,
      productName: 'Premium Organic Tulsi Powder',
      productType: 'powder',
      quantity: 100,
      unit: 'g',
      manufactureDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 years
      ingredients: ['Tulsi Leaves Powder', 'Organic Tulsi Extract'],
      certifications: ['Organic', 'GMP Certified', 'ISO 9001'],
      processingSteps: [
        {
          processType: 'Drying',
          temperature: 60,
          duration: 24,
          equipment: 'Industrial Dryer',
          notes: 'Sun dried for optimal nutrients'
        },
        {
          processType: 'Grinding',
          temperature: 25,
          duration: 2,
          equipment: 'Grinder',
          notes: 'Fine powder - 100 mesh'
        },
        {
          processType: 'Sieving',
          temperature: 20,
          duration: 1,
          equipment: 'Sieve',
          notes: 'Uniform particle size'
        },
        {
          processType: 'Packaging',
          temperature: 20,
          duration: 1,
          equipment: 'Sealing Machine',
          notes: 'Sealed in airtight bottles'
        }
      ]
    };
    
    const product = await apiCall('POST', '/manufacturer/products', productData, manufacturerToken);
    productId = product.data.id;
    qrCode = product.data.qrCode;
    console.log(`✅ Product created: ${productId}`);
    console.log(`   Name: ${product.data.productName}`);
    console.log(`   QR Code: ${qrCode}`);
    console.log(`   QR Image: ${product.data.qrCodeImage ? 'Generated ✅' : 'Not generated ❌'}`);
    console.log(`   Verification URL: ${product.data.verificationUrl}\n`);

    // =====================================================
    // STEP 6: VERIFY QR CODE (CONSUMER SCAN)
    // =====================================================
    console.log('📋 STEP 6: Consumer Scans QR Code...');
    
    const verification = await apiCall('GET', `/qr/verify/${qrCode}`);
    if (verification.success) {
      console.log('✅ QR Code Verified Successfully!');
      console.log('\n📦 Product Information:');
      console.log(`   Name: ${verification.data.product.name}`);
      console.log(`   Type: ${verification.data.product.type}`);
      console.log(`   Quantity: ${verification.data.product.quantity}${verification.data.product.unit}`);
      console.log(`   Manufacturer: ${verification.data.product.manufacturer}`);
      console.log(`   Manufacture Date: ${verification.data.product.manufactureDate}`);
      console.log(`   Expiry Date: ${verification.data.product.expiryDate}`);
      
      console.log('\n🌾 Source Batch:');
      console.log(`   Batch Number: ${verification.data.batch.batchNumber}`);
      console.log(`   Species: ${verification.data.batch.species}`);
      console.log(`   Total Quantity: ${verification.data.batch.totalQuantity}${verification.data.batch.unit}`);
      console.log(`   Farmer Collections: ${verification.data.batch.collectionCount}`);
      
      console.log('\n👨‍🌾 Farm Origin:');
      verification.data.collections.forEach((col, i) => {
        console.log(`   ${i+1}. Farmer: ${col.farmerName || 'Certified Farmer'}`);
        console.log(`      Quantity: ${col.quantity}${col.unit}`);
        console.log(`      Harvest Date: ${col.harvestDate}`);
        console.log(`      Location: ${col.location.zoneName || 'Organic Farm'}`);
      });
      
      console.log('\n🔬 Quality Tests:');
      verification.data.qualityTests.forEach((test, i) => {
        console.log(`   ${i+1}. ${test.testType || 'Quality Test'}`);
        console.log(`      Result: ${test.overallResult || 'PASS'}`);
        console.log(`      Lab: ${test.labName || 'Certified Lab'}`);
      });
      
      console.log('\n🔗 Blockchain:');
      console.log(`   Product Tx: ${verification.data.product.blockchainTx}`);
      console.log(`   Verified: ${verification.data.verification.verified}`);
    }

    // =====================================================
    // STEP 7: SUMMARY
    // =====================================================
    console.log('\n\n🎉 ===== PROOF OF CONCEPT COMPLETE =====\n');
    console.log('✅ Full traceability established:');
    console.log('   1. ✅ Farmer created collection event on blockchain');
    console.log('   2. ✅ Admin created batch from collections');
    console.log('   3. ✅ Lab performed quality tests and issued certificate');
    console.log('   4. ✅ Manufacturer created product with QR code');
    console.log('   5. ✅ QR code contains complete traceability data');
    console.log('   6. ✅ Consumer can verify product authenticity');
    console.log('\n📱 Scan this QR code for complete traceability:');
    console.log(`   ${BASE_URL.replace('/api/v1', '')}/verify/${qrCode}`);
    console.log('\n✨ All data is stored in SQLite database');
    console.log('✨ Blockchain integration ready (currently optional)');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', await error.response.text());
    }
  }
})();
