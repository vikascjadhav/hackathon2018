# hackathon2018
## ETF Network
### Participants
1) Client
2) AuthorizedParticipant(AP)
3) APAgent
4) ClientCustodian
5) TransferAgent
6) ClientCustodian
7) ETFCustodian
8) ETFSponsor


### Assets
1) ETF
2) ETFInventory

### Transactions
1) SubmitOrder
2) APAgentVerify
3) ETFCustodianVerify
4) ClientCustodianVerify
6) SetupDemo

### Events
1) confirmReceiptByCustodian
2) notifyETFSponsor and notifyTransferAgent



### ETF Inventory status will have one of below status
1) AP_VERIFIED
2) AP_AGENT_VERIFIED
3) ETF_CUST_VERIFIED
4) CLIENT_CUST_VERIFIED
5) COMPLETED
