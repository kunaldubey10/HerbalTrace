# Lab Test Queue Fix - Complete Workflow

## Problem Fixed
Lab users were unable to see farmer-created batches in their Test Queue because the dashboard was filtering by `assignedTo: user.username`, which excluded unassigned batches.

## Solution Applied
Modified `web-portal-cloned/src/components/laboratory/LabDashboard.jsx`:
1. Removed `assignedTo` filter from `fetchBatches()` function
2. Now shows ALL batches with relevant statuses: `created`, `assigned`, `quality_testing`, `quality_tested`
3. Updated header from "Batches Assigned to Lab" to "Test Queue - All Pending Batches"

## Complete Workflow

### Step 1: Farmer Creates Collection ✅
- Farmer logs in (e.g., avinashverma)
- Creates collection (e.g., Tulsi)
- System syncs to blockchain
- Collection is saved with status `synced`

### Step 2: Admin Creates Batch from Collections ⚠️
**This is the missing step in your workflow!**

Collections don't automatically become batches. An admin must group collections into batches:

#### Option A: Using PowerShell Script (Easiest)
```powershell
cd D:\Trial\HerbalTrace
.\create-batch-from-collections.ps1
```

This script will:
- Login with admin credentials
- Show all available collections grouped by species
- Let you select which collections to batch
- Create batch via API
- Batch will immediately appear in Lab Test Queue

#### Option B: Using API Directly
```bash
# Login as admin
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Get token from response, then create batch
curl -X POST http://localhost:3000/api/v1/batches \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "species": "Tulsi",
    "collectionIds": [1, 2, 3],
    "notes": "Batch for lab testing"
  }'
```

#### Option C: Add Batch Creation to Admin Dashboard (Recommended for Production)
The admin dashboard (`web-portal-cloned/src/components/AdminDashboard.jsx`) currently doesn't have batch creation UI. You should add a "Create Batch from Collections" tab.

### Step 3: Lab User Tests Batch ✅
- Lab user logs in
- Sees batch in "Test Queue" tab (NOW WORKING!)
- Selects batch and enters test results
- Submits results → status changes to `quality_tested`

### Step 4: Manufacturer Creates Product ✅
- Manufacturer logs in
- Sees tested batches (status: `quality_tested`)
- Creates product from batch
- Generates QR code for traceability

## Batch Status Flow
```
created → assigned → quality_testing → quality_tested → processing_complete → approved/rejected
```

Lab can see batches in statuses: `created`, `assigned`, `quality_testing`, `quality_tested`

## Quick Test Steps

1. **Login as Admin and Create Batch:**
   ```powershell
   cd D:\Trial\HerbalTrace
   .\create-batch-from-collections.ps1
   # Login with admin credentials
   # Select "Tulsi" species
   # Confirm batch creation
   ```

2. **Login as Lab User:**
   - Open http://localhost:3003/
   - Login with lab credentials
   - Navigate to "Test Queue" tab
   - You should now see the Tulsi batch!

3. **Test the Batch:**
   - Click on the batch
   - Enter test results
   - Submit

4. **Verify as Manufacturer:**
   - Login as manufacturer
   - Check if tested batch appears
   - Create product from batch

## Files Changed
- `web-portal-cloned/src/components/laboratory/LabDashboard.jsx` (lines 58-92, 239)

## API Endpoints Used
- `GET /api/v1/batches` - List batches (now called without filters)
- `POST /api/v1/batches` - Create batch from collections (admin only)
- `GET /api/v1/collections` - List farmer collections

## Notes
- Only **Admin** users can create batches
- Batches start with status `created` (if not assigned) or `assigned` (if assigned to processor)
- Lab sees all batches regardless of assignment status now
- Manufacturer sees only `quality_tested` or later status batches

## Troubleshooting

### Lab Test Queue still empty?
1. Verify batches exist: Check database `SELECT * FROM batches;`
2. Verify batch status is not `rejected` or `completed`
3. Check browser console for API errors
4. Refresh the page after creating batch

### Can't create batch?
1. Ensure you're logged in as Admin
2. Verify collections exist: `SELECT * FROM collections WHERE sync_status = 'synced';`
3. Check that collections aren't already in a batch: `SELECT * FROM batch_collections;`

### Frontend not updating?
1. Hard refresh browser (Ctrl+Shift+R)
2. Check if web-portal-cloned dev server is running on port 3003
3. Check browser console for React errors
