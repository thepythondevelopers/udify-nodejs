const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const path = require("path");
const { json } = require('body-parser');

exports.plaid = async (req,res)=>{
// res.sendFile(path.join(__dirname, "plaid-link.html"));
    const configuration = new Configuration({
        basePath: PlaidEnvironments.sandbox,
        baseOptions: {
          headers: {
            'PLAID-CLIENT-ID': '62591cd156a57c001a52e211',
            'PLAID-SECRET': '767793484baaee5f8e0973cb26db3f',
          },
        },
      });
      
       client = new PlaidApi(configuration);
       public_token = 'public-sandbox-5a679b9e-b565-4a68-b5a6-669d9f2d39aa';
       
       const response = await client.itemPublicTokenExchange({ public_token });
       const access_token = response.data.access_token;
       const accounts_response = await client.accountsGet({ access_token });
       const accounts = accounts_response.data.accounts;
       return res.json(accounts);
        //res.sendFile(path.join(__dirname, "plaid-link.html"));
      
}