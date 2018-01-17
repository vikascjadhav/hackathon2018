# hackathon2018
## ETF Network
### Participants
Client
AuthorizedParticipant(AP)
APAgent
ClientCustodian
TransferAgent
ClientCustodian
ETFCustodian
ETFSponsor


### Assets
1) ETF
2) ETFInventory

### Transactions
SubmitOrder
APAgentVerify
ETFCustodianVerify
ClientCustodianVerify
SetupDemo

### Events
1) confirmReceiptByCustodian
2) notifyETFSponsor and notifyTransferAgent



### ETF Inventory status will have one of below status
  
  o AP_VERIFIED
  o AP_AGENT_VERIFIED
  o ETF_CUST_VERIFIED
  o CLIENT_CUST_VERIFIED
  o COMPLETED
