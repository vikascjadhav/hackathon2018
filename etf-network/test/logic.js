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

/*    describe('onPlaceOrder()', () => {
        it('Should Place Order with  ' + assetType , () => {
            const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            
            
            const etf = factory.newResource(namespace, 'ETF', 'HYG');
            //etf.etfTradingSymbol = 'HYG';
            etf.outstandingUnit = 100
            const client = factory.newResource(namespace, 'Client', 'c1');    
           

            const order = factory.newResource(namespace, 'Order', '01');
           
            order.etf = etf;
            //order.client = client;

          //  order.qty = 10;
           // order.tradingAmount = 500;
          //  order.tradeType = 'Create';
            //order.status = 'Placed'
            order.etf = factory.newRelationship(namespace, 'ETF', 'HYG');  
            order.currency = 'EUR'; 

            const PlaceOrder = factory.newTransaction(namespace, 'PlaceOrder');
            


            //PlaceOrder.order = order;  
           // PlaceOrder.etf =  factory.newRelationship(namespace, 'ETF', 'HYG');   
           PlaceOrder.etfTradingSymbol = 'HYG';
             //etfTradingSymbol
            let etfRegistry;
            let orderRegistry;
            let clientRegistry;
            let assetRegistry;
            let registry;
            return businessNetworkConnection.getAssetRegistry(namespace + '.ETF').then(registry => {
                etfRegistry = registry;
                return etfRegistry.add(etf);
            }).then(() => {
                return businessNetworkConnection.getParticipantRegistry(namespace + '.Client');
            }).then(() => {
                // Submit the transaction
                console.log("Submitting transaction");
                return businessNetworkConnection.submitTransaction(PlaceOrder);
                console.log("Submitting transaction")
            }).then(() => {
                console.log("Completed transaction")
                etfRegistry = registry;
            }).then(() => {
                return businessNetworkConnection.getAssetRegistry(namespace + '.ETF');
            }).then((registry) => {
                            // get the listing
                return registry.get(etf.$identifier);
            }).then((updateETF) => {
                            // both offers should have been added to the listing
                updateETF.currency.should.equal('USD');
                console.log("Test Completed ");
                console.log(updateETF);
            })
        });
    });






    describe('SubmitOrder()', () => {
        it('SubmitOrder- Should Place Order with  '  , () => {
            const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            
            
            const etf = factory.newResource(namespace, 'ETF', 'HYG');
            //etf.etfTradingSymbol = 'HYG';
            etf.outstandingUnit = 100
            const client = factory.newResource(namespace, 'Client', 'c1');    
           

            const order = factory.newResource(namespace, 'Order', '01');
      
            const ap = factory.newResource(namespace, 'AP', 'AP01');
            const apAgent = factory.newResource(namespace, 'APAgent', 'AP_AGENT_01');
           

            order.etf = etf;
            
            order.etf = factory.newRelationship(namespace, 'ETF', 'HYG');  
            order.currency = 'EUR'; 

            const submitOrder = factory.newTransaction(namespace, 'SubmitOrder');
            submitOrder.ap = factory.newRelationship(namespace, 'AP', 'AP01');  
            submitOrder.apAgent =  factory.newRelationship(namespace, 'APAgent', 'AP_AGENT_01');  
            submitOrder.etfTradingSymbol = 'HYG';
            submitOrder.orderType = 'BUY';

             //etfTradingSymbol
            let etfRegistry;
            let orderRegistry;
            let clientRegistry;
            let assetRegistry;
            let registry;
            return businessNetworkConnection.getAssetRegistry(namespace + '.ETF').then(registry => {
                etfRegistry = registry;
                return etfRegistry.add(etf);
            }).then(() => {
                return businessNetworkConnection.getParticipantRegistry(namespace + '.APAgent');
            }).then(registry => {
                registry = registry;
                return registry.add(apAgent);
            }).then(() => {
                return businessNetworkConnection.getParticipantRegistry(namespace + '.AP');
            }).then(registry => {
                registry = registry;
                return registry.add(ap);
            }).then(() => {
                return businessNetworkConnection.getParticipantRegistry(namespace + '.Client');
            }).then(() => {
                // Submit the transaction
                console.log("Submitting transaction");
                return businessNetworkConnection.submitTransaction(submitOrder);
                console.log("Submitting transaction")
            }).then(() => {
                console.log("Completed transaction")
                etfRegistry = registry;
            }).then(() => {
                return businessNetworkConnection.getAssetRegistry(namespace + '.ETFInventory');
            }).then((registry) => {
                            // get the listing
                return registry.get('id01');
            }).then((eTFInventory) => {
                            // both offers should have been added to the listing
                eTFInventory.inventoryId.should.equal('id01');
                console.log("Test Completed ");
                console.log(eTFInventory);
            })
        });
    });
*/



    describe('testAll()', () => {
        it('****************8ALL- ************* '  , () => {
            const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            
            
            const etf = factory.newResource(namespace, 'ETF', 'HYG');
            const client = factory.newResource(namespace, 'Client', 'Client_01');               
            const order = factory.newResource(namespace, 'Order', '01');      
            const ap = factory.newResource(namespace, 'AP', 'AP_01');
            const apAgent = factory.newResource(namespace, 'APAgent', 'APAgent_01');
            const eTFCustodian = factory.newResource(namespace, 'ETFCustodian', 'ETFCustodian_01');
            const eTFSponsor = factory.newResource(namespace, 'ETFSponsor', 'ETFSponsor_01');
            const transferAgent = factory.newResource(namespace, 'TransferAgent', 'TransferAgent_01');
            const clientCustodian = factory.newResource(namespace, 'ClientCustodian', 'ClientCustodian_01');
            
            const submitOrder = factory.newTransaction(namespace, 'SubmitOrder');
            submitOrder.ap = factory.newRelationship(namespace, 'AP', 'AP01');  
            submitOrder.apAgent =  factory.newRelationship(namespace, 'APAgent', 'AP_AGENT_01');  
            submitOrder.etfTradingSymbol = 'HYG';
            submitOrder.orderType = 'BUY';


            const aPAgentVerify = factory.newTransaction(namespace, 'APAgentVerify');
            
            aPAgentVerify.apAgent =  factory.newRelationship(namespace, 'APAgent', 'AP_AGENT_01');  
            aPAgentVerify.inventoryId = 'id01';
            aPAgentVerify.eTFCustodian = factory.newRelationship(namespace, 'ETFCustodian', 'ETFCustodian_01');               



            const eTFCustodianVerify = factory.newTransaction(namespace, 'ETFCustodianVerify');
            
            eTFCustodianVerify.eTFSponsor = factory.newRelationship(namespace, 'ETFSponsor', 'ETFSponsor_01');               
            eTFCustodianVerify.inventoryId = 'id01';
            eTFCustodianVerify.eTFCustodian = factory.newRelationship(namespace, 'ETFCustodian', 'ETFCustodian_01');               
            eTFCustodianVerify.transferAgent = factory.newRelationship(namespace, 'TransferAgent', 'TransferAgent_01');               



            const clientCustodianVerify = factory.newTransaction(namespace, 'ClientCustodianVerify');
            
            clientCustodianVerify.clientCustodian = factory.newRelationship(namespace, 'ClientCustodian', 'ClientCustodian_01');               
            clientCustodianVerify.inventoryId = 'id01';



            let etfRegistry;
            let orderRegistry;
            let clientRegistry;
            let assetRegistry;
            let registry;
            return businessNetworkConnection.getAssetRegistry(namespace + '.ETF').then(registry => {
                etfRegistry = registry;
                return etfRegistry.add(etf);
            }).then(() => {
                return businessNetworkConnection.getParticipantRegistry(namespace + '.APAgent');
            }).then(registry => {
                registry = registry;
                return registry.add(apAgent);
            }).then(() => {
                return businessNetworkConnection.getParticipantRegistry(namespace + '.ETFSponsor');
            }).then(registry => {
                registry = registry;
                return registry.add(eTFSponsor);
            }).then(() => {
                return businessNetworkConnection.getParticipantRegistry(namespace + '.TransferAgent');
            }).then(registry => {
                registry = registry;
                return registry.add(transferAgent);
            }).then(() => {
                return businessNetworkConnection.getParticipantRegistry(namespace + '.AP');
            }).then(registry => {
                registry = registry;
                return registry.add(ap);
            }).then(() => {
                return businessNetworkConnection.getParticipantRegistry(namespace + '.Client');
            }).then(() => {
                // Submit the transaction
                console.log("Submitting transaction");
                return businessNetworkConnection.submitTransaction(submitOrder);
                console.log("Submitting transaction")
            }).then(() => {
                console.log("Completed transaction")
                etfRegistry = registry;
            }).then(() => {
                return businessNetworkConnection.getAssetRegistry(namespace + '.ETFInventory');
            }).then((registry) => {
                            // get the listing
                return registry.get('id01');
            }).then((eTFInventory) => {                            
                eTFInventory.status.should.equal('AP_VERIFIED');
                console.log("Step 1 "+ eTFInventory.status);                
                //console.log(eTFInventory);
            }).then(()=>{
                console.log("Submitting aPAgentVerify transaction");
                return businessNetworkConnection.submitTransaction(aPAgentVerify);
                console.log("Completed aPAgentVerify transaction")
            }).then(()=>{
                return businessNetworkConnection.getAssetRegistry(namespace + '.ETFInventory');
            }).then((registry)=>{                
                return registry.get('id01');
            }).then((eTFInventory) => {                            
                eTFInventory.status.should.equal('AP_AGENT_VERIFIED');                
                console.log("Step 2 "+ eTFInventory.status);
                
            }).then(()=>{
                console.log("Submitting eTFCustodianVerify transaction");
                return businessNetworkConnection.submitTransaction(eTFCustodianVerify);
                console.log("Completed eTFCustodianVerify transaction")
            }).then(()=>{
                return businessNetworkConnection.getAssetRegistry(namespace + '.ETFInventory');
            }).then((registry)=>{                
                return registry.get('id01');
            }).then((eTFInventory) => {                            
                eTFInventory.status.should.equal('ETF_CUST_VERIFIED');                              
                console.log("Step 3 "+ eTFInventory.status);
            }).then(()=>{
                console.log("Submitting eTFCustodianVerify transaction");
                return businessNetworkConnection.submitTransaction(clientCustodianVerify);
                console.log("Completed eTFCustodianVerify transaction")
            }).then(()=>{
                return businessNetworkConnection.getAssetRegistry(namespace + '.ETFInventory');
            }).then((registry)=>{                
                return registry.get('id01');
            }).then((eTFInventory) => {                            
                eTFInventory.status.should.equal('COMPLETED');                              
                console.log("Step 4 "+ eTFInventory.status);
            });

            clientCustodianVerify
        });
    });


    
});
