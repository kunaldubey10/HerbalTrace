import { Router, Request, Response, NextFunction } from 'express';
import { getFabricClient } from '../fabric/fabricClient';
import { authenticate } from '../middleware/auth';
import { logger } from '../utils/logger';
import { db } from '../config/database';
import QRCode from 'qrcode';

const router = Router();

/**
 * @route   GET /api/qr/verify/:qrCode
 * @desc    Verify and get complete provenance for a product QR code (Consumer scanning)
 * @access  Public
 */
router.get('/verify/:qrCode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { qrCode } = req.params;

    // Get product from database
    const product = await db.prepare('SELECT * FROM products WHERE qr_code = ?').get(qrCode) as any;

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found. QR code may be invalid.',
      });
    }

    // Get batch details
    const batch = await db.prepare('SELECT * FROM batches WHERE batch_number = ?').get(product.batch_id) as any;

    // Get collection events for this batch
    const collections = await db.prepare(`
      SELECT ce.*, bc.batch_id
      FROM collection_events_cache ce
      JOIN batch_collections bc ON ce.id = bc.collection_id
      WHERE bc.batch_id = ?
    `).all(batch.id) as any[];

    // Get QC tests and certificates
    const qcTests = await db.prepare(`
      SELECT t.*, c.certificate_number, c.overall_result, c.issued_date, c.blockchain_txid
      FROM qc_tests t
      LEFT JOIN qc_certificates c ON t.id = c.test_id
      WHERE t.batch_id = ?
    `).all(product.batch_id) as any[];

    // ✅ ENHANCED: Get blockchain provenance and verify authenticity
    let blockchainProvenance = null;
    let blockchainVerified = false;
    let blockchainBatch = null;
    let blockchainCertificates = [];
    
    try {
      const fabricClient = getFabricClient();
      await fabricClient.connect('admin-FarmersCoop', 'FarmersCoop');
      
      // Try to get full provenance by QR code
      try {
        blockchainProvenance = await fabricClient.getProvenanceByQRCode(qrCode);
        blockchainVerified = true;
      } catch (err) {
        logger.warn('Full provenance not available, trying individual queries');
      }

      // ✅ Verify batch on blockchain using transaction ID
      if (batch.blockchain_tx_id) {
        try {
          const batchId = `BATCH-${batch.id}`;
          blockchainBatch = await fabricClient.evaluateTransaction('GetBatch', batchId);
          if (blockchainBatch) {
            blockchainBatch = JSON.parse(blockchainBatch);
            blockchainVerified = true;
            logger.info(`✅ Batch ${batch.batch_number} verified on blockchain`);
          }
        } catch (err: any) {
          logger.warn(`Batch verification failed: ${err.message}`);
        }
      }

      // ✅ Verify QC certificates on blockchain
      for (const qcTest of qcTests) {
        if (qcTest.blockchain_txid && qcTest.certificate_number) {
          try {
            const certData = await fabricClient.evaluateTransaction('QueryQCCertificate', qcTest.certificate_number);
            if (certData) {
              blockchainCertificates.push(JSON.parse(certData));
              logger.info(`✅ Certificate ${qcTest.certificate_number} verified on blockchain`);
            }
          } catch (err) {
            logger.warn(`Certificate ${qcTest.certificate_number} not found on blockchain`);
          }
        }
      }

      await fabricClient.disconnect();
    } catch (error: any) {
      logger.warn(`Could not fetch blockchain provenance: ${error.message}`);
    }

    // Build comprehensive provenance response
    const provenance = {
      product: {
        id: product.id,
        name: product.product_name,
        type: product.product_type,
        quantity: product.quantity,
        unit: product.unit,
        manufactureDate: product.manufacture_date,
        expiryDate: product.expiry_date,
        manufacturer: product.manufacturer_name,
        qrCode: product.qr_code,
        blockchainTx: product.blockchain_tx_id,
        ingredients: JSON.parse(product.ingredients || '[]'),
        certifications: JSON.parse(product.certifications || '[]'),
      },
      batch: {
        batchNumber: batch.batch_number,
        species: batch.species,
        totalQuantity: batch.total_quantity,
        unit: batch.unit,
        collectionCount: collections.length,
        status: batch.status,
        createdAt: batch.created_at,
        blockchainTx: batch.blockchain_tx_id,
        blockchainVerified: !!blockchainBatch,
        blockchainData: blockchainBatch || null
      },
      collections: collections.map((c: any) => {
        let data = {};
        try {
          data = JSON.parse(c.data_json || '{}');
        } catch {}
        return {
          id: c.id || c.collection_id,
          farmerId: c.farmer_id,
          farmerName: c.farmer_name,
          species: c.species,
          quantity: c.quantity,
          unit: c.unit,
          location: {
            latitude: c.latitude,
            longitude: c.longitude,
            altitude: c.altitude,
            zoneName: (data as any).zoneName,
          },
          harvestDate: c.harvest_date,
          harvestMethod: (data as any).harvestMethod,
          partCollected: (data as any).partCollected,
          weatherConditions: (data as any).weatherConditions,
          blockchainTx: c.blockchain_tx_id,
        };
      }),
      qualityTests: qcTests.map((t: any) => ({
        testId: t.test_id || t.id,
        testType: t.test_type,
        labName: t.lab_name,
        testDate: t.requested_at,
        certificateNumber: t.certificate_number,
        overallResult: t.overall_result,
        issuedDate: t.issued_date,
        blockchainTx: t.blockchain_txid,
        blockchainVerified: blockchainCertificates.some((bc: any) => bc.certificateId === t.certificate_number)
      })),
      blockchain: {
        available: blockchainVerified,
        verified: blockchainVerified,
        message: blockchainVerified 
          ? 'Product data verified on blockchain' 
          : 'Blockchain verification unavailable',
        provenance: blockchainProvenance,
        certificates: blockchainCertificates,
        timestamp: new Date().toISOString()
      },
      verification: {
        verified: true,
        blockchainVerified: blockchainVerified,
        verifiedAt: new Date().toISOString(),
        dataSource: 'HerbalTrace Platform',
        authenticity: blockchainVerified ? 'VERIFIED_ON_BLOCKCHAIN' : 'DATABASE_ONLY',
        trustLevel: blockchainVerified ? 'HIGH' : 'MEDIUM'
      },
    };

    logger.info(`QR code scanned successfully: ${qrCode} (Blockchain verified: ${blockchainVerified})`);

    res.status(200).json({
      success: true,
      message: blockchainVerified 
        ? 'Product verified successfully on blockchain'
        : 'Product verified successfully',
      data: provenance,
    });
  } catch (error: any) {
    logger.error('Error verifying QR code:', error);
    next(error);
  }
});

/**
 * @route   GET /api/qr/:qrCode
 * @desc    Get product provenance by QR code (Consumer scanning) - Legacy endpoint
 * @access  Public
 */
router.get('/:qrCode', async (req: Request, res: Response, next: NextFunction) => {
  // Redirect to verify endpoint
  return res.redirect(`/api/v1/qr/verify/${req.params.qrCode}`);
});

/**
 * @route   POST /api/qr/generate
 * @desc    Generate QR code image
 * @access  Private
 */
router.post('/generate', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, format } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Data is required'
      });
    }

    const qrCodeImage = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2
    });

    res.status(200).json({
      success: true,
      data: {
        qrCode: data,
        image: qrCodeImage
      }
    });
  } catch (error: any) {
    logger.error('Error generating QR code:', error);
    next(error);
  }
});

export default router;
