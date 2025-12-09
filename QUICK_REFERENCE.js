#!/usr/bin/env node

/**
 * HerbalTrace System Quick Reference
 * Run this script for instant access to all credentials and endpoints
 */

console.log('\n' + '='.repeat(70));
console.log('  🌿 HERBALTRACE BLOCKCHAIN TRACEABILITY SYSTEM - QUICK REFERENCE');
console.log('='.repeat(70));

console.log('\n📍 SYSTEM STATUS');
console.log('   Backend API: http://localhost:3000');
console.log('   Database: backend/data/herbaltrace.db');
console.log('   Blockchain Network: Hyperledger Fabric');

console.log('\n🔐 USER CREDENTIALS');
console.log('   ┌─────────────────┬──────────────────┬──────────────────┐');
console.log('   │ Role            │ Username         │ Password         │');
console.log('   ├─────────────────┼──────────────────┼──────────────────┤');
console.log('   │ Admin           │ admin            │ admin123         │');
console.log('   │ Farmer          │ avinashverma     │ avinash123       │');
console.log('   │ Lab             │ labtest          │ lab123           │');
console.log('   │ Manufacturer    │ manufacturer     │ manufacturer123  │');
console.log('   └─────────────────┴──────────────────┴──────────────────┘');

console.log('\n📡 KEY API ENDPOINTS');
console.log('   Authentication:');
console.log('   • POST   /api/v1/auth/login');
console.log('   • POST   /api/v1/auth/registration-request');
console.log('   • GET    /api/v1/auth/registration-requests');
console.log('   • POST   /api/v1/auth/registration-requests/:id/approve');

console.log('\n   Farmer Operations:');
console.log('   • POST   /api/v1/collections              (Submit harvest)');
console.log('   • GET    /api/v1/collections              (View collections)');
console.log('   • GET    /api/v1/batches                  (View batches)');

console.log('\n   Lab Operations:');
console.log('   • POST   /api/v1/qc/tests                 (Create QC test)');
console.log('   • POST   /api/v1/qc/tests/:id/results     (Submit results)');
console.log('   • POST   /api/v1/qc/tests/:id/certificate (Generate cert)');
console.log('   • GET    /api/v1/qc/tests                 (View tests)');

console.log('\n   Manufacturer Operations:');
console.log('   • POST   /api/v1/manufacturer/products    (Create product + QR)');
console.log('   • GET    /api/v1/manufacturer/products    (View products)');
console.log('   • GET    /api/v1/batches?status=quality_tested');

console.log('\n   Consumer Operations:');
console.log('   • GET    /api/v1/qr/verify/:qrCode        (Verify product)');
console.log('   • GET    /api/v1/qr/:qrCode                (Get provenance)');

console.log('\n🔧 QUICK COMMANDS');
console.log('   # Start backend server');
console.log('   cd backend && npm start');

console.log('\n   # Test authentication');
console.log('   cd backend && node test-auth-all.js');

console.log('\n   # Check database');
console.log('   cd backend && node check-db.js');

console.log('\n   # Reset passwords');
console.log('   cd backend && node setup-credentials.js');

console.log('\n   # Test login (Admin)');
console.log('   curl -X POST http://localhost:3000/api/v1/auth/login \\');
console.log('     -H "Content-Type: application/json" \\');
console.log('     -d \'{"username":"admin","password":"admin123"}\'');

console.log('\n🎯 WORKFLOW SUMMARY');
console.log('   1️⃣  Farmer logs in → Submits collection event');
console.log('   2️⃣  Admin creates batch from collections');
console.log('   3️⃣  Lab logs in → Creates test → Submits results → Generates certificate');
console.log('   4️⃣  Manufacturer logs in → Creates product from batch → QR auto-generated');
console.log('   5️⃣  Consumer scans QR → Views complete provenance (no login needed)');

console.log('\n📁 KEY FILES');
console.log('   • CREDENTIALS_GUIDE.md       - Complete authentication guide');
console.log('   • backend/setup-credentials.js  - Reset user passwords');
console.log('   • backend/test-auth-all.js      - Test all user logins');
console.log('   • backend/check-db.js           - Database inspection');

console.log('\n🚨 TROUBLESHOOTING');
console.log('   • Backend not starting?     → Check: cd backend && npm install');
console.log('   • Login fails?              → Run: node setup-credentials.js');
console.log('   • Blockchain errors?        → Check: docker ps');
console.log('   • Database issues?          → Check: node check-db.js');

console.log('\n✨ SYSTEM READY FOR HACKATHON DEMO!');
console.log('='.repeat(70) + '\n');
