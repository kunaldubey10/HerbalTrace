import { Gateway, Wallets, Network, Contract, X509Identity } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';

export interface FabricConfig {
  channelName: string;
  chaincodeName: string;
  walletPath: string;
  connectionProfilePath: string;
  mspId: string;
  identity: string;
}

export class FabricService {
  private gateway: Gateway | null = null;
  private network: Network | null = null;
  private contract: Contract | null = null;
  private config: FabricConfig;
  private isConnected: boolean = false;

  constructor(config: Partial<FabricConfig> = {}) {
    // Default configuration
    this.config = {
      channelName: config.channelName || 'herbaltrace-channel',
      chaincodeName: config.chaincodeName || 'herbaltrace',
      walletPath: config.walletPath || path.resolve(__dirname, '../../../network/wallet'),
      connectionProfilePath: config.connectionProfilePath || path.resolve(__dirname, '../../../network/organizations/peerOrganizations/processors.herbaltrace.com/connection-processors.json'),
      mspId: config.mspId || 'ProcessorsMSP',
      identity: config.identity || 'admin-Processors',
    };
  }

  private buildInlineProcessorsCCP(): any {
    const peerHost = 'peer0.processors.herbaltrace.com';
    const peerTlsPath = path.resolve(__dirname, '../../../network/organizations/peerOrganizations/processors.herbaltrace.com/peers/peer0.processors.herbaltrace.com/tls/ca.crt');
    const ordererTlsPath = path.resolve(__dirname, '../../../network/organizations/ordererOrganizations/herbaltrace.com/orderers/orderer.herbaltrace.com/msp/tlscacerts/tlsca.herbaltrace.com-cert.pem');

    if (!fs.existsSync(peerTlsPath)) {
      throw new Error(`Peer TLS cert not found: ${peerTlsPath}`);
    }
    if (!fs.existsSync(ordererTlsPath)) {
      throw new Error(`Orderer TLS cert not found: ${ordererTlsPath}`);
    }

    const peerTlsPem = fs.readFileSync(peerTlsPath, 'utf8');
    const ordererTlsPem = fs.readFileSync(ordererTlsPath, 'utf8');

    const peerDefinitions: { [key: string]: { url: string; tlsCACerts: { pem: string }; grpcOptions: any } } = {
      [peerHost]: {
        url: 'grpcs://localhost:11051',
        tlsCACerts: { pem: peerTlsPem },
        grpcOptions: {
          'ssl-target-name-override': peerHost,
          hostnameOverride: peerHost,
        },
      },
    };

    const extraPeers = [
      { alias: 'farmers', host: 'peer0.farmers.herbaltrace.com', port: 7051 },
      { alias: 'labs', host: 'peer0.labs.herbaltrace.com', port: 9051 },
      { alias: 'processors', host: 'peer0.processors.herbaltrace.com', port: 11051 },
      { alias: 'manufacturers', host: 'peer0.manufacturers.herbaltrace.com', port: 13051 },
    ];

    for (const p of extraPeers) {
      if (peerDefinitions[p.host]) {
        continue;
      }
      const extraTlsPath = path.resolve(__dirname, `../../../network/organizations/peerOrganizations/${p.alias}.herbaltrace.com/peers/${p.host}/tls/ca.crt`);
      if (!fs.existsSync(extraTlsPath)) {
        continue;
      }
      const extraTlsPem = fs.readFileSync(extraTlsPath, 'utf8');
      peerDefinitions[p.host] = {
        url: `grpcs://localhost:${p.port}`,
        tlsCACerts: { pem: extraTlsPem },
        grpcOptions: {
          'ssl-target-name-override': p.host,
          hostnameOverride: p.host,
        },
      };
    }

    return {
      name: 'herbaltrace-processors',
      version: '1.0.0',
      client: {
        organization: 'processors',
        connection: {
          timeout: {
            peer: { endorser: '300' },
            orderer: '300',
          },
        },
      },
      organizations: {
        processors: {
          mspid: 'ProcessorsMSP',
          peers: [peerHost],
        },
      },
      peers: peerDefinitions,
      orderers: {
        'orderer.herbaltrace.com': {
          url: 'grpcs://localhost:7050',
          tlsCACerts: { pem: ordererTlsPem },
          grpcOptions: {
            'ssl-target-name-override': 'orderer.herbaltrace.com',
            hostnameOverride: 'orderer.herbaltrace.com',
          },
        },
      },
      channels: {
        [this.config.channelName]: {
          orderers: ['orderer.herbaltrace.com'],
          peers: Object.keys(peerDefinitions).reduce((acc: any, host) => {
            acc[host] = {};
            return acc;
          }, {}),
        },
      },
    };
  }

  /**
   * Connect to Hyperledger Fabric network
   */
  async connect(): Promise<void> {
    try {
      if (this.isConnected) {
        logger.info('Already connected to Fabric network');
        return;
      }

      logger.info('Connecting to Hyperledger Fabric network...');

      // Load connection profile
      const ccpPath = this.config.connectionProfilePath;
      let ccp: any;
      if (fs.existsSync(ccpPath)) {
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        ccp = JSON.parse(ccpJSON);
      } else {
        logger.warn(`Connection profile not found at ${ccpPath}, using inline processors profile`);
        ccp = this.buildInlineProcessorsCCP();
      }

      // Create a new file system based wallet for managing identities
      const walletPath = this.config.walletPath;
      if (!fs.existsSync(walletPath)) {
        throw new Error(`Wallet not found at: ${walletPath}`);
      }

      const wallet = await Wallets.newFileSystemWallet(walletPath);

      // Check if identity exists in wallet
      const identity = await wallet.get(this.config.identity);
      if (!identity) {
        throw new Error(`Identity "${this.config.identity}" not found in wallet. Please enroll the identity first.`);
      }

      logger.info(`Using identity: ${this.config.identity} (${this.config.mspId})`);

      // Create a new gateway for connecting to our peer node
      this.gateway = new Gateway();
      await this.gateway.connect(ccp, {
        wallet,
        identity: this.config.identity,
        discovery: { enabled: false },
      });

      // Get the network (channel) our contract is deployed to
      this.network = await this.gateway.getNetwork(this.config.channelName);

      // Get the contract from the network
      this.contract = this.network.getContract(this.config.chaincodeName);

      this.isConnected = true;
      logger.info(`✅ Connected to Fabric network (Channel: ${this.config.channelName}, Chaincode: ${this.config.chaincodeName})`);
    } catch (error: any) {
      logger.error('Failed to connect to Fabric network:', error);
      this.isConnected = false;
      throw new Error(`Fabric connection failed: ${error.message}`);
    }
  }

  /**
   * Disconnect from Fabric network
   */
  async disconnect(): Promise<void> {
    if (this.gateway) {
      await this.gateway.disconnect();
      this.gateway = null;
      this.network = null;
      this.contract = null;
      this.isConnected = false;
      logger.info('Disconnected from Fabric network');
    }
  }

  /**
   * Check if connected to Fabric network
   */
  isNetworkConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get the contract instance (ensures connection)
   */
  private async getContract(): Promise<Contract> {
    if (!this.isConnected || !this.contract) {
      await this.connect();
    }

    if (!this.contract) {
      throw new Error('Failed to get contract. Network not connected.');
    }

    return this.contract;
  }

  /**
   * Submit a transaction to the ledger
   */
  async submitTransaction(functionName: string, ...args: string[]): Promise<string> {
    try {
      const contract = await this.getContract();
      const normalizedArgs = args.map((arg, index) => {
        if (arg === undefined || arg === null) {
          logger.warn(`Transaction ${functionName} arg at index ${index} was ${arg}; using empty string`);
          return '';
        }
        return String(arg);
      });

      logger.info(`Submitting transaction: ${functionName}`, { args: normalizedArgs });

      const transaction = contract.createTransaction(functionName);
      const channel = (this.network as any)?.getChannel?.();
      const endorsers = channel?.getEndorsers?.();
      if (Array.isArray(endorsers) && endorsers.length > 0) {
        transaction.setEndorsingPeers(endorsers);
      }

      const result = await transaction.submit(...normalizedArgs);
      const response = result.toString();
      const txId = transaction.getTransactionId();

      logger.info(`Transaction ${functionName} submitted successfully`);
      if (!response) {
        return JSON.stringify({ txId });
      }
      return response;
    } catch (error: any) {
      logger.error(`Failed to submit transaction ${functionName}:`, error);
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }

  /**
   * Evaluate a transaction (query, read-only)
   */
  async evaluateTransaction(functionName: string, ...args: string[]): Promise<string> {
    try {
      const contract = await this.getContract();
      logger.info(`Evaluating transaction: ${functionName}`, { args });

      const result = await contract.evaluateTransaction(functionName, ...args);
      const response = result.toString();

      logger.info(`Transaction ${functionName} evaluated successfully`);
      return response;
    } catch (error: any) {
      logger.error(`Failed to evaluate transaction ${functionName}:`, error);
      throw new Error(`Query failed: ${error.message}`);
    }
  }

  /**
   * Record QC Certificate on blockchain
   */
  async recordQCCertificate(certificateData: {
    certificateId: string;
    testId: string;
    batchId: string;
    batchNumber: string;
    speciesName: string;
    testType: string;
    labId: string;
    labName: string;
    overallResult: string;
    issuedDate: string;
    testedBy: string;
    results: any[];
  }): Promise<string> {
    const args = [
      certificateData.certificateId || '',
      certificateData.testId || '',
      certificateData.batchId || '',
      certificateData.batchNumber || '',
      certificateData.speciesName || 'UNKNOWN',
      certificateData.testType || 'STANDARD',
      certificateData.labId || '',
      certificateData.labName || '',
      certificateData.overallResult || '',
      certificateData.issuedDate || new Date().toISOString(),
      certificateData.testedBy || '',
      JSON.stringify(certificateData.results),
    ];

    return await this.submitTransaction('RecordQCCertificate', ...args);
  }

  /**
   * Query QC Certificate from blockchain
   */
  async queryQCCertificate(certificateId: string): Promise<any> {
    const result = await this.evaluateTransaction('QueryQCCertificate', certificateId);
    return JSON.parse(result);
  }

  /**
   * Get certificate history from blockchain
   */
  async getCertificateHistory(certificateId: string): Promise<any[]> {
    const result = await this.evaluateTransaction('GetCertificateHistory', certificateId);
    return JSON.parse(result);
  }

  /**
   * Query certificates by batch
   */
  async queryCertificatesByBatch(batchId: string): Promise<any[]> {
    const result = await this.evaluateTransaction('QueryCertificatesByBatch', batchId);
    return JSON.parse(result);
  }

  /**
   * Get all certificates (paginated)
   */
  async getAllCertificates(pageSize: number = 10, bookmark: string = ''): Promise<any> {
    const result = await this.evaluateTransaction('GetAllCertificates', pageSize.toString(), bookmark);
    return JSON.parse(result);
  }

  /**
   * Verify certificate authenticity
   */
  async verifyCertificate(certificateId: string): Promise<{ valid: boolean; message: string; certificate?: any }> {
    try {
      const certificate = await this.queryQCCertificate(certificateId);
      
      if (!certificate) {
        return {
          valid: false,
          message: 'Certificate not found on blockchain',
        };
      }

      // Check if certificate has been tampered with
      const history = await this.getCertificateHistory(certificateId);
      
      return {
        valid: true,
        message: 'Certificate is authentic and recorded on blockchain',
        certificate: {
          ...certificate,
          recordedAt: history[0]?.timestamp || 'Unknown',
          transactionCount: history.length,
        },
      };
    } catch (error: any) {
      return {
        valid: false,
        message: `Verification failed: ${error.message}`,
      };
    }
  }

  /**
   * Get blockchain network info
   */
  async getNetworkInfo(): Promise<any> {
    try {
      if (!this.network) {
        await this.connect();
      }

      return {
        channelName: this.config.channelName,
        chaincodeName: this.config.chaincodeName,
        mspId: this.config.mspId,
        identity: this.config.identity,
        connected: this.isConnected,
      };
    } catch (error: any) {
      logger.error('Failed to get network info:', error);
      throw error;
    }
  }
}

// Singleton instance
export const fabricService = new FabricService();

export default FabricService;
