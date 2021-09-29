const vault = require("node-vault")({
    apiVersion: "v1",
    endpoint: "http://127.0.0.1:8200",
});

const appName = 'internal-app';

//const appServiceAccountSecretToken = process.env.APP_SVC_ACCT_SECRET_TOKEN || 'app-k8s-token';
const appServiceAccountSecretToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IlZsZFNQaXlZMTduTTlDMmhsZk8tV1BBWXY2cHNGRlhmcWFRdDZkLUJ0TWMifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImludGVybmFsLWFwcC10b2tlbi1neDRqdyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJpbnRlcm5hbC1hcHAiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJlMzlkYTIwYS1iMzM3LTQ3YzItYWQwNi03ZTdmM2UyMzk0NmIiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6ZGVmYXVsdDppbnRlcm5hbC1hcHAifQ.4gRQ1fdGht9GMclQ1fUd61bEv4Hw1h1zfdl0xEWsqTEMMA6yrzEKZgbz8gxGK_4hJDLyP1Fy0N9S8fuIV1sQLJ5dnPhdE1HjlQZEtv66VFMgsCvfNhAsXtuwhjcio5fML9Wg6MurKh0lKlb0sD8YgGVmUyswHGO84816EeZCVEzIsYnPv7EBT0ZPypN6D8iDs3ItsOp12Ak6VcWWZquO0pNupF3zczfn8y4SeJcjz8TxVUTieBl2E0mWGguEs7i0E0JlU1o4Ms0r2dyItseKV2Xn67zPcrdxqcGmhojh_UNi2k1opsjfbLuHKnjwQbch6VvrwgNYTcDGieGjgEhuvw';

console.log("fromage");

vault.kubernetesLogin({role: appName, jwt: appServiceAccountSecretToken})
    .then(data => {
        console.log('data:', data);
        console.log('token:', data.auth.client_token);
        vault.read(
            'internal/data/database/config',
            {token: data.auth.client_token})
            .then(console.log)
            .catch((err) => console.log('readError', err.message))

    })
    .catch((err) => console.log('yaya', err.message))





const express = require('express')
const os = require('os')

const app = express()
app.get('/', (req, res) => {
    res.send(`Hello from ${os.hostname()}!`)
})

const port = 3000
app.listen(port, () => console.log(`listening on port ${port}`))


/*
const roleId = process.env.ROLE_ID;
const secretId = process.env.SECRET_ID;

const run = async () => {

    const result = await vault.approleLogin({
        role_id: roleId,
        secret_id: secretId,
    });

    vault.token = result.auth.client_token; // Add token to vault object for subsequent requests.

    const { data } = await vault.read("secret/data/mysql/webapp"); // Retrieve the secret stored in previous steps.

    const databaseName = data.data.db_name;
    const username = data.data.username;
    const password = data.data.password;

    console.log({
        databaseName,
        username,
        password,
    });

    console.log("Attempt to delete the secret");

};

run();

*/
