'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.etfnet.PlaceOrder} changeAssetValue
 * @transaction
 */
function onPlaceOrder(Order) {
        

    return getAssetRegistry('org.etfnet.ETF').then(function(etfRegistry) {
            var factory = getFactory();
            //var order = factory.newResource('org.etfnet', 'Order', '123');
            var etfTradingSymbol = Order.ETF.etfTradingSymbol;
            var ETF = etfRegistry.get(etfTradingSymbol);
            ETF.outstandingUnit = ETF.outstandingUnit - Order.qty;
            //orderRegistry.add(order);;
            return ETF
        })


        /*getAssetRegistry('org.etfnet.Order')
        .then(function(orderRegistry) {
            var factory = getFactory();
            //var order = factory.newResource('org.etfnet', 'Order', '123');
            order.ETF = orderPlaced.ETF;
            //orderRegistry.add(order);;
            return 
        })
        */
       /* .then(function(asset) {
            asset.status = 'COMPLTE';
            return assetRegistry.update(asset);
        });*/
}