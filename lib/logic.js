'use strict';
/**
 * Write your transction processor functions here
 */


/**
 * Sample transaction
 * @param {org.etfnet.SubmitOrder} order
 * @transaction
 */
function SubmitOrder(order) {
    var etfTradingSymbol = order.etfTradingSymbol;
    var etfRegistry;
    
    var NS = 'org.etfnet';
     return getAssetRegistry('org.etfnet.ETF').then(function(registry) {
            etfRegistry = registry;
            var factory = getFactory();             
            registry.get(etfTradingSymbol).then(function(etf){  

                    //Math.random().toString(36).substring(7)
                ETFInventory = factory.newResource(NS, 'ETFInventory', 'id01');
                ETFInventory.status = 'AP_VERIFIED';
               // console.log(ETFInventory);
                getAssetRegistry('org.etfnet.ETFInventory').then(function(registry1) {
                    return registry1.add(ETFInventory);
                })

            })                                   
      });   
}


/**
 * Sample transaction
 * @param {org.etfnet.APAgentVerify} order
 * @transaction
 */
function APAgentVerify(order) {
    var inventoryId = order.inventoryId;
    var etfRegistry;    
    var NS = 'org.etfnet';
     return getAssetRegistry('org.etfnet.ETFInventory').then(function(registry) {
            etfInventoryRegistry = registry;
            var factory = getFactory();             
            registry.get(inventoryId).then(function(etfInventory){  

                etfInventory.status = 'AP_AGENT_VERIFIED';
                    
                return etfInventoryRegistry.update(etfInventory)
            })                                   
      });   
}


/**
 * Sample transaction
 * @param {org.etfnet.ETFCustodianVerify} order
 * @transaction
 */
function ETFCustodianVerify(order) {
    var inventoryId = order.inventoryId;
    var etfRegistry;    
    var NS = 'org.etfnet';
     return getAssetRegistry('org.etfnet.ETFInventory').then(function(registry) {
            etfInventoryRegistry = registry;
            var factory = getFactory();                
            registry.get(inventoryId).then(function(etfInventory){  
                etfInventory.status = 'ETF_CUST_VERIFIED';            
                return etfInventoryRegistry.update(etfInventory)
            })                                   
      });   
}



var NS = 'org.etfnet';
/**
 * Sample transaction
 * @param {org.etfnet.ClientCustodianVerify} order
 * @transaction
 */
function ClientCustodianVerify(order) {
    var inventoryId = order.inventoryId;
    
     return getAssetRegistry('org.etfnet.ETFInventory').then(function(registry) {
            etfInventoryRegistry = registry;
            var factory = getFactory();                
            registry.get(inventoryId).then(function(etfInventory){  
                etfInventory.status = 'COMPLETED';            
                return etfInventoryRegistry.update(etfInventory)
            })                                   
      });   
}















/**
 * Sample transaction
 * @param {org.etfnet.PlaceOrder} PlaceOrder
 * @transaction
 */
function PlaceOrder(PlaceOrder) {
    var etfTradingSymbol = PlaceOrder.etfTradingSymbol;
    var etfRegistry;
     return getAssetRegistry('org.etfnet.ETF').then(function(registry) {
            etfRegistry = registry;
            var factory = getFactory(); 
            console.log("Before get Asset")                      
            registry.get(etfTradingSymbol).then(function(etf){
                etf.currency = 'USD';        
                return etfRegistry.update(etf);
            })                                    
      });   
}



/**
 *
 * @param {org.etfnet.SetupDemo} setupDemo
 * @transaction
 */
function setupDemo(setupDemo) {
    var factory = getFactory();
    var NS = 'org.etfnet';
    var etfs = [
       factory.newResource(NS, 'ETF', 'ETF_01'),
       factory.newResource(NS, 'ETF', 'ETF_02'),
       factory.newResource(NS, 'ETF', 'ETF_03'),
       factory.newResource(NS, 'ETF', 'ETF_04'),
       factory.newResource(NS, 'ETF', 'ETF_05')
   ];
   var clients = [
       factory.newResource(NS, 'Client', 'CLIENT_01'),
       factory.newResource(NS, 'Client', 'CLIENT_02'),
       factory.newResource(NS, 'Client', 'CLIENT_03'),
       factory.newResource(NS, 'Client', 'CLIENT_04')
   ];
   var aps = [
       factory.newResource(NS, 'AP','AP_01'),
       factory.newResource(NS, 'AP','AP_02'),
       factory.newResource(NS, 'AP','AP_03'),
       factory.newResource(NS, 'AP','AP_04')
   ];
   var apAgents = [
       factory.newResource(NS, 'APAgent', 'APAGENT_01'),
       factory.newResource(NS, 'APAgent', 'APAGENT_02'),
       factory.newResource(NS, 'APAgent', 'APAGENT_03'),
       factory.newResource(NS, 'APAgent', 'APAGENT_04')
   ];

   var transferAgents = [
    factory.newResource(NS, 'TransferAgent', 'TransferAgent_01'),
    factory.newResource(NS, 'TransferAgent', 'TransferAgent_02'),
    factory.newResource(NS, 'TransferAgent', 'TransferAgent_03'),
    factory.newResource(NS, 'TransferAgent', 'TransferAgent_04')
   ];

   var clientCustodians = [
    factory.newResource(NS, 'ClientCustodian', 'ClientCustodian_01'),
    factory.newResource(NS, 'ClientCustodian', 'ClientCustodian_02'),
    factory.newResource(NS, 'ClientCustodian', 'ClientCustodian_03'),
    factory.newResource(NS, 'ClientCustodian', 'ClientCustodian_04')

   ];

   var eTFCustodians = [
    factory.newResource(NS, 'ETFCustodian', 'ETFCustodian_01'),
    factory.newResource(NS, 'ETFCustodian', 'ETFCustodian_02'),
    factory.newResource(NS, 'ETFCustodian', 'ETFCustodian_03'),
    factory.newResource(NS, 'ETFCustodian', 'ETFCustodian_04')
   ];

   var eTFSponsors = [
    factory.newResource(NS, 'ETFSponsor', 'ETFSponsor_01'),
    factory.newResource(NS, 'ETFSponsor', 'ETFSponsor_02'),
    factory.newResource(NS, 'ETFSponsor', 'ETFSponsor_03'),
    factory.newResource(NS, 'ETFSponsor', 'ETFSponsor_04')
   ];
    
      return getParticipantRegistry(NS + '.APAgent')
           .then(function(APAgentRegistry) {
                apAgents.forEach(function(apAgent) {          
                    apAgent.firstName = 'firstName';
                    apAgent.lastName = 'lastName';
                  });
                return APAgentRegistry.addAll(apAgents);                  
           }).then(function(){
              return  getParticipantRegistry(NS + '.AP');
           }).then(function(registry){
                aps.forEach(function(ap) {          
                    ap.firstName = 'APFirstName';
                    ap.lastName = 'APLastName';
                  });
                return registry.addAll(aps);
           }).then(function(){
              return  getParticipantRegistry(NS + '.Client');
           }).then(function(registry){
                clients.forEach(function(client) {          
                    client.clientType = 'BAHRT002';
                    client.firstName = 'Bharat';
                    client.lastName = 'Limited';
                  });
                return registry.addAll(clients);
           }).then(function(){
              return  getParticipantRegistry(NS + '.APAgent');
           }).then(function(registry){
                apAgents.forEach(function(apAgent) {          
                    apAgent.agentId = 'BLKRK001';
                    apAgent.firstName = 'Blackrock';
                    apAgent.lastName = 'PtvLtd';
                  });
                return registry.addAll(apAgents);
           }).then(function(){
              return  getParticipantRegistry(NS + '.TransferAgent');
           }).then(function(registry){
                transferAgents.forEach(function(transferAgent) {          
                    transferAgent.agentId = 'HDFC0001';
                    transferAgent.firstName = 'HDFC';
                    transferAgent.lastName = 'Limited';
                  });
                return registry.addAll(transferAgents);
           }).then(function(){
              return  getParticipantRegistry(NS + '.ClientCustodian');
           }).then(function(registry){
                clientCustodians.forEach(function(clientCustodian) {          
                    clientCustodian.clientCustodianId = 'CSAG';
                    clientCustodian.firstName = 'CreditSuisse';
                    clientCustodian.lastName = 'AG';
                  });
                return registry.addAll(clientCustodians);
           }).then(function(){
              return  getParticipantRegistry(NS + '.ETFCustodian');
           }).then(function(registry){
                eTFCustodians.forEach(function(eTFCustodian) {          
                    eTFCustodian.etfCustodianId = 'JPMC';
                    eTFCustodian.firstName = 'JPMorgan';
                    eTFCustodian.lastName = 'ETF Custodian';
                  });
                return registry.addAll(eTFCustodians);
           }).then(function(){
              return  getParticipantRegistry(NS + '.ETFSponsor');
           }).then(function(registry){
                eTFSponsors.forEach(function(eTFSponsor) {          
                    eTFSponsor.eTFSponsorId = 'VANGARD';
                    eTFSponsor.firstName = 'Vanguard';
                    eTFSponsor.lastName = 'Sponsor ETF';
                  });
                return registry.addAll(eTFSponsors);
           }).then(function(){
              return  getAssetRegistry(NS + '.ETF');
           }).then(function(registry){
                etfs.forEach(function(etf) {          
                    etfs.etfId = 'VANGARD';
                    etfs.etfTradingSymbol = '2838-HK';
                    etfs.currency = 'INR';
                    etfs.price = 20.11;
                    etfs.outstandingUnit = 1983464;
                    etfs.createdBy = 'APAGENT_01';
                    etfs.amendedBy = 'ClientCustodian_01';  
                  });
                console.log("******* SetupDemo COMPLETED ******");
                return registry.addAll(etfs);
           });


}
