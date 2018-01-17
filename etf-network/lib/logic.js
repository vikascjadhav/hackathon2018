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
       factory.newResource(NS, 'ETF', 'ETF_1'),
       factory.newResource(NS, 'ETF', 'ETF_2'),
       factory.newResource(NS, 'ETF', 'ETF_3'),
       factory.newResource(NS, 'ETF', 'ETF_4'),
       factory.newResource(NS, 'ETF', 'ETF_5')
   ];

   var clients = [
       factory.newResource(NS, 'Client', 'CLIENT_1'),
       factory.newResource(NS, 'Client', 'CLIENT_2'),
       factory.newResource(NS, 'Client', 'CLIENT_3'),
       factory.newResource(NS, 'Client', 'CLIENT_4')
   ];

   var aps = [
       factory.newResource(NS, 'AP','AP_1'),
       factory.newResource(NS, 'AP','AP_2'),
       factory.newResource(NS, 'AP','AP_3'),
       factory.newResource(NS, 'AP','AP_4')
   ];

   var ApAgents = [
       factory.newResource(NS, 'APAgent', 'APAGENT_1'),
       factory.newResource(NS, 'APAgent', 'APAGENT_2'),
       factory.newResource(NS, 'APAgent', 'APAGENT_3'),
       factory.newResource(NS, 'APAgent', 'APAGENT_4')
   ];

    
      return getParticipantRegistry(NS + '.APAgent')
           .then(function(APAgentRegistry) {
                ApAgents.forEach(function(apAgent) {          
                    apAgent.firstName = 'firstName';
                    apAgent.lastName = 'lastName';
                  });
                return APAgentRegistry.addAll(ApAgents);                  
           }).then(function(){
              return  getParticipantRegistry(NS + '.AP');
           }).then(function(registry){

                aps.forEach(function(ap) {          
                    ap.firstName = 'firstName';
                    ap.lastName = 'lastName';
                  });
                return registry.addAll(aps);
           });
    
}

