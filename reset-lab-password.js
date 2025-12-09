const Database = require('./backend/node_modules/better-sqlite3');
const bcrypt = require('./backend/node_modules/bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'data', 'herbaltrace.db');
const db = new Database(dbPath);

// New password
const newPassword = 'lab123';
const passwordHash = bcrypt.hashSync(newPassword, 10);

// Update lab user password
const stmt = db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE username = ?");
const result = stmt.run(passwordHash, 'labtest');

console.log('\n=== Lab Password Reset ===');
console.log('Rows updated:', result.changes);

if (result.changes > 0) {
    console.log('\n✓ Password reset successful!');
    console.log('\nNew credentials:');
    console.log('  Username: labtest');
    console.log('  Password:', newPassword);
    console.log('\nTry logging in now at http://localhost:3003');
} else {
    console.log('\n✗ No user found with username "labtest"');
    
    // Check what lab users exist
    const users = db.prepare('SELECT username, email, role, full_name FROM users WHERE role = "lab"').all();
    console.log('\nLab users in database:', users);
}

db.close();
