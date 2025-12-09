# Reset Lab User Password
$newPassword = "lab123"

Write-Host "`n=== Resetting Lab User Password ===" -ForegroundColor Cyan

# Hash the new password
Add-Type -Path "D:\Trial\HerbalTrace\backend\node_modules\bcryptjs\dist\bcrypt.js" -ErrorAction SilentlyContinue

# Use Node.js to hash password since PowerShell can't load bcrypt easily
$hashScript = @"
const bcrypt = require('bcryptjs');
const password = '$newPassword';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
"@

Set-Content -Path "D:\Trial\HerbalTrace\hash-password.js" -Value $hashScript
$passwordHash = node "D:\Trial\HerbalTrace\hash-password.js"

Write-Host "New password hash: $passwordHash" -ForegroundColor Gray

# Update database
$dbPath = "D:\Trial\HerbalTrace\backend\data\herbaltrace.db"
$updateQuery = "UPDATE users SET password_hash = '$passwordHash', updated_at = datetime('now') WHERE username = 'labtest';"

# Create a temporary SQL file
Set-Content -Path "D:\Trial\HerbalTrace\update-lab-password.sql" -Value $updateQuery

# Execute using sqlite3 (if available) or via Node.js
try {
    $updateScript = @"
const Database = require('better-sqlite3');
const db = new Database('$dbPath');
const stmt = db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime(''now'') WHERE username = ?');
const result = stmt.run('$passwordHash', 'labtest');
console.log('Rows updated:', result.changes);
db.close();
"@
    Set-Content -Path "D:\Trial\HerbalTrace\update-password.js" -Value $updateScript
    node "D:\Trial\HerbalTrace\update-password.js"
    
    Write-Host "`n✓ Password updated successfully!" -ForegroundColor Green
    Write-Host "`nNew credentials:" -ForegroundColor Yellow
    Write-Host "  Username: labtest" -ForegroundColor White
    Write-Host "  Password: $newPassword" -ForegroundColor White
    Write-Host "`nTry logging in now!" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
