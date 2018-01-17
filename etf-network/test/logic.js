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

    describe('onPlaceOrder()', () => {
        it('Should Place Order with  ' + assetType , () => {
            const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            
            
            const etf = factory.newResource(namespace, 'ETF', 'etf1');
            etf.etfTradingSymbol = 'HYG';
            etf.outstandingUnit = 100
            /*
            asset ETF identified by etfTradingSymbol  {
  o String etfId
  o String etfTradingSymbol
  o String currency optional
  o String exchange optional
  o Double price optional
  o Double outstandingUnit optional
}
            */
            const client = factory.newResource(namespace, 'Client', 'c1');    
           

            const order = factory.newResource(namespace, 'Order', 'o1');
           
            order.etf = etf;
            order.client = client;
            order.qty = 10;
            order.tradingAmount = 500;
            order.tradeType = 'Create';
            order.status = 'Placed'
            const PlaceOrder = factory.newTransaction(namespace, 'PlaceOrder');
            PlaceOrder.order = order;     
            let etfRegistry;
            return businessNetworkConnection.getAssetRegistry(namespace + '.ETF').then(registry => {
                etfRegistry = registry;
                return etfRegistry.add(etf);
            }).then(() => {
                return businessNetworkConnection.getParticipantRegistry(namespace + '.Client');
            }).then(clientRegistry => {                
                return clientRegistry.add(client);
            }).then(() => {
                // Submit the transaction
                return businessNetworkConnection.submitTransaction(PlaceOrder);
            }).then(registry => {
                // Get the asset
                return assetRegistry.get(asset.$identifier);
            }).then(newAsset => {
                // Assert that the asset has the new value property
                newAsset.value.should.equal(changeAssetValue.newValue);
            });
        });
    });

});
