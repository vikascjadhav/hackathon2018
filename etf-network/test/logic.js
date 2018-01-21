'use strict';
/**
 * Write the unit tests for your transction processor functions here
 */

const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const IdCard = require('composer-common').IdCard;
const MemoryCardStore = require('composer-common').MemoryCardStore;

const path = require('path');

require('chai').should();

const namespace = 'org.etfnet';
const assetType = 'Order';

describe('#' + namespace, () => {
    // In-memory card store for testing so cards are not persisted to the file system
    const cardStore = new MemoryCardStore();
    let adminConnection;
    let businessNetworkConnection;

    before(() => {
        // Embedded connection used for local testing
        const connectionProfile = {
            name: 'embedded',
            type: 'embedded'
        };
        // Embedded connection does not need real credentials
        const credentials = {
            certificate: 'FAKE CERTIFICATE',
            privateKey: 'FAKE PRIVATE KEY'
        };

        // PeerAdmin identity used with the admin connection to deploy business networks
        const deployerMetadata = {
            version: 1,
            userName: 'PeerAdmin',
            roles: [ 'PeerAdmin', 'ChannelAdmin' ]
        };
        const deployerCard = new IdCard(deployerMetadata, connectionProfile);
        deployerCard.setCredentials(credentials);

        const deployerCardName = 'PeerAdmin';
        adminConnection = new AdminConnection({ cardStore: cardStore });

        return adminConnection.importCard(deployerCardName, deployerCard).then(() => {
            return adminConnection.connect(deployerCardName);
        });
    });

    beforeEach(() => {
        businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });

        const adminUserName = 'admin';
        let adminCardName;
        let businessNetworkDefinition;

        return BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..')).then(definition => {
            businessNetworkDefinition = definition;
            // Install the Composer runtime for the new business network
            return adminConnection.install(businessNetworkDefinition.getName());
        }).then(() => {
            // Start the business network and configure an network admin identity
            const startOptions = {
                networkAdmins: [
                    {
                        userName: adminUserName,
                        enrollmentSecret: 'adminpw'
                    }
                ]
            };
            return adminConnection.start(businessNetworkDefinition, startOptions);
        }).then(adminCards => {
            // Import the network admin identity for us to use
            adminCardName = `${adminUserName}@${businessNetworkDefinition.getName()}`;
            return adminConnection.importCard(adminCardName, adminCards.get(adminUserName));
        }).then(() => {
            // Connect to the business network using the network admin identity
            return businessNetworkConnection.connect(adminCardName);
        });
    });


    describe('testEtfNetworkFlow()', () => {
        it('****************testAll Method in ETF Network (Simluation of ETF Lifecycle) ************* '  , () => {
            const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            
            
            const etf = factory.newResource(namespace, 'ETF', 'HYG');
            const client = factory.newResource(namespace, 'Client', 'CLIENT_01');               
            
            const ap = factory.newResource(namespace, 'AP', 'AP_011');
            const apAgent = factory.newResource(namespace, 'APAgent', 'APAgent_01');
            const eTFCustodian = factory.newResource(namespace, 'ETFCustodian', 'ETFCustodian_01');
            const eTFSponsor = factory.newResource(namespace, 'ETFSponsor', 'ETFSponsor_01');
            const transferAgent = factory.newResource(namespace, 'TransferAgent', 'TransferAgent_01');
            const clientCustodian = factory.newResource(namespace, 'ClientCustodian', 'ClientCustodian_01');
            
            const submitOrder = factory.newTransaction(namespace, 'SubmitOrder');
            submitOrder.ap = factory.newRelationship(namespace, 'AP', 'AP011');  
            submitOrder.apAgent =  factory.newRelationship(namespace, 'APAgent', 'AP_AGENT_01');  
            submitOrder.etfTradingSymbol = 'ETF_01';
            submitOrder.orderType = 'BUY';
            submitOrder.client = factory.newRelationship(namespace, 'Client', 'Client_01');  
            submitOrder.qty = 100;
            submitOrder.price = 200;

            const aPAgentVerify = factory.newTransaction(namespace, 'APAgentVerify');
            
            aPAgentVerify.apAgent =  factory.newRelationship(namespace, 'APAgent', 'AP_AGENT_01');  
            
            aPAgentVerify.eTFCustodian = factory.newRelationship(namespace, 'ETFCustodian', 'ETFCustodian_01');               



            const eTFCustodianVerify = factory.newTransaction(namespace, 'ETFCustodianVerify');
            
            eTFCustodianVerify.eTFSponsor = factory.newRelationship(namespace, 'ETFSponsor', 'ETFSponsor_01');               
          
            eTFCustodianVerify.eTFCustodian = factory.newRelationship(namespace, 'ETFCustodian', 'ETFCustodian_01');               
            eTFCustodianVerify.transferAgent = factory.newRelationship(namespace, 'TransferAgent', 'TransferAgent_01');               


            
            const clientCustodianVerify = factory.newTransaction(namespace, 'ClientCustodianVerify');
            
            clientCustodianVerify.clientCustodian = factory.newRelationship(namespace, 'ClientCustodian', 'ClientCustodian_01');               
            

            const setupDemo = factory.newTransaction(namespace, 'SetupDemo');


            let etfRegistry;
            let orderRegistry;
            let clientRegistry;
            let assetRegistry;
            let registry;
            let orderId;
            let status = 'AP_VERIFIED'; 
            
            return businessNetworkConnection.submitTransaction(setupDemo).then(() => {
            
                console.log("Submitting - submitOrder transaction");
                return businessNetworkConnection.submitTransaction(submitOrder);
                
            }).then(() => {
               
                etfRegistry = registry;
            }).then(() => {
            	return businessNetworkConnection.query('selectOrderBookRecordUsingSymbol', {'status':status});
            	
            }).then(function(orderRecords){
            	 if(orderRecords.length>0) {
            		orderId = orderRecords[0].inventoryId; 	
            		console.log("Order ID Generated = ",orderId);
            	 } else {
            	 	 throw new Error('No Valid Transaction Found after SubmitOrder');
            	 }
            }).then(() => {
                return businessNetworkConnection.getAssetRegistry(namespace + '.ETFInventory');
            }).then((registry) => {
                            // get the listing
                return registry.get(orderId);
            }).then((eTFInventory) => {                            
                eTFInventory.status.should.equal('AP_VERIFIED');
                console.log("Done Step 1) submitOrder Order_Status = "+ eTFInventory.status + " Order_Id = "+orderId);                
                //console.log(eTFInventory);
            }).then(()=>{
                console.log("Submitting aPAgentVerify transaction");
                aPAgentVerify.inventoryId = orderId;
                return businessNetworkConnection.submitTransaction(aPAgentVerify);
                console.log("Completed aPAgentVerify transaction")
            }).then(()=>{
                return businessNetworkConnection.getAssetRegistry(namespace + '.ETFInventory');
            }).then((registry)=>{                
                return registry.get(orderId);
            }).then((eTFInventory) => {                            
                eTFInventory.status.should.equal('AP_AGENT_VERIFIED');                
                console.log("Done Step 2) APAgentVerify Order_Status = "+ eTFInventory.status + " Order_Id = "+orderId);
                
            }).then(()=>{
                console.log("Submitting eTFCustodianVerify transaction");
                 eTFCustodianVerify.inventoryId = orderId;
                return businessNetworkConnection.submitTransaction(eTFCustodianVerify);
                console.log("Completed eTFCustodianVerify transaction")
            }).then(()=>{
                return businessNetworkConnection.getAssetRegistry(namespace + '.ETFInventory');
            }).then((registry)=>{                
                return registry.get(orderId);
            }).then((eTFInventory) => {                            
                eTFInventory.status.should.equal('ETF_CUST_VERIFIED');                              
                console.log("Done Step 3) eTFCustodianVerify Orde _Status = "+ eTFInventory.status + " Order_Id = "+orderId);
            }).then(()=>{
                console.log("Submitting clientCustodianVerify transaction");
                clientCustodianVerify.inventoryId = orderId;
                return businessNetworkConnection.submitTransaction(clientCustodianVerify);
                
            }).then(()=>{
                return businessNetworkConnection.getAssetRegistry(namespace + '.ETFInventory');
            }).then((registry)=>{                
                return registry.get(orderId);
            }).then((eTFInventory) => {                            
                eTFInventory.status.should.equal('COMPLETED');                              
                console.log("Done Step 4) clientCustodianVerify Order_Status = "+ eTFInventory.status + " Order_Id = "+orderId);
            });            
        });
    });
});
