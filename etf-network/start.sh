composer archive create -t dir -n .

composer runtime install --card PeerAdmin@hlfv1 --businessNetworkName etf-network

composer network start --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --archiveFile etf-network@0.0.1.bna --file networkadmin.card




composer-rest-server -c admin@etf-network -n never -w true

