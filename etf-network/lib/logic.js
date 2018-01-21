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
    var ap = order.ap;
    var NS = 'org.etfnet';    
    if(!(order.qty > 0))  {
      throw new Error('Please Enter Valid quantity for ETF');      
    }
    return getAssetRegistry('org.etfnet.ETF').then(function(registry) {
            etfRegistry = registry;
            var factory = getFactory();             
            registry.get(etfTradingSymbol).then(function(etf){  
               var id =  Math.random().toString(36).substring(2, 6) +'#'+ Math.random().toString(36).substring(2, 6)+'#'+Math.random().toString(36).substring(2, 6) +'#'+ Math.random().toString(36).substring(2, 6);
               eTFInventory = factory.newResource(NS, 'ETFInventory',id);
               // eTFInventory = factory.newResource(NS, 'ETFInventory', 'id01');
                eTFInventory.status = 'AP_VERIFIED';
                eTFInventory.ap = ap;
                eTFInventory.qty    = order.qty;
                eTFInventory.client = order.client;
                eTFInventory.price = order.price;
                eTFInventory.netAmount = (order.price * order.qty);
                eTFInventory.orderType = order.orderType;
                eTFInventory.tradeDate = order.tradeDate
                eTFInventory.settlementDate = order.settlementDate;
                eTFInventory.createdBy = order.createdBy;
               // console.log(ETFInventory);
                getAssetRegistry('org.etfnet.ETFInventory').then(function(registry1) {
                     
                     var event = getFactory().newEvent('org.etfnet', 'APNotifyEvent');
                      event.inventoryId = id;
                      event.apAgent = order.apAgent;                      
                      emit(event);

                    return registry1.add(eTFInventory);
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
              if (etfInventory.status !== 'AP_VERIFIED') {
                  throw new Error('Order is not AP_VERIFIED');
              }
              etfInventory.eTFCustodian = order.eTFCustodian
              etfInventory.status = 'AP_AGENT_VERIFIED'; 
               var event = getFactory().newEvent('org.etfnet', 'APAgentNotifyEvent');
                      event.inventoryId = inventoryId;
                      event.eTFCustodian = order.eTFCustodian;                      
                      emit(event);
                   
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
                if (etfInventory.status !== 'AP_AGENT_VERIFIED') {
                    throw new Error('Order is not AP_AGENT_VERIFIED');
                }
                etfInventory.eTFSponsor = order.eTFSponsor
                etfInventory.transferAgent = order.transferAgent;
                etfInventory.status = 'ETF_CUST_VERIFIED';           
                    var event = getFactory().newEvent('org.etfnet', 'ETFCustodianNotifyEvent');
                      event.inventoryId = inventoryId;
                      event.eTFSponsor = order.eTFSponsor;       
                      event.clientCustodian = order.clientCustodian;
                      event.transferAgent = order.transferAgent
                      emit(event);
              
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
    
    var orders = [
       factory.newResource(NS, 'ETFInventory', 'OrderId10000'),
       factory.newResource(NS, 'ETFInventory', 'OrderId10001'),
       factory.newResource(NS, 'ETFInventory', 'OrderId10002'),
       factory.newResource(NS, 'ETFInventory', 'OrderId10003'),
       factory.newResource(NS, 'ETFInventory', 'OrderId10004')
   ];
  /* orders[0].status = 'AP_VERIFIED';
   orders[1].status = 'AP_AGENT_VERIFIED';
   orders[2].status = 'ETF_CUST_VERIFIED';
   orders[3].status = 'CLIENT_CUST_VERIFIED';
   orders[4].status = 'COMPLETED';
  */   
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
                    etf.etfId = 'VANGARD';
                    etf.etfTradingSymbol = '2838-HK';
                    etf.currency = 'INR';
                    etf.price = 20.11;
                    etf.outstandingUnit = 1983464;
                    etf.createdBy = 'APAGENT_01';
                    etf.amendedBy = 'ClientCustodian_01';  
                  });
                //console.log("******* SetupDemo COMPLETED ******");
                return registry.addAll(etfs);
           }).then(function(){            
              return  getAssetRegistry(NS + '.ETFInventory');
           }).then(function(registry){
                orders.forEach(function(order) {          
                    order.eTFCustodian = eTFCustodians[0]; //factory.newRelationship(NS, 'ETFCustodian', 'ETFCustodian_02');
                    order.clientCustodian = clientCustodians[0]; //factory.newRelationship(NS, 'ClientCustodian', 'ClientCustodian_02');
                    order.eTFSponsor =  eTFSponsors[0];//factory.newRelationship(NS, 'ETFSponsor', 'ETFSponsor_02');
                    order.apAgent = apAgents[0];//factory.newRelationship(NS, 'APAgent', 'APAgent_02');
                    order.etf = etfs[0];//factory.newRelationship(NS, 'ETF', 'ETF_02');
                    order.ap = aps[0];//factory.newRelationship(NS, 'AP', 'AP_02');*/
                    order.client = clients[0]; 
                    order.status = 'COMPLETED';
                });
                console.log("******* SetupDemo COMPLETED ******");
                return registry.addAll(orders);
           });

}
