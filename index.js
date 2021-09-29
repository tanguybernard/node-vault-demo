const vault = require("node-vault")({
    apiVersion: "v1",
    endpoint: "http://127.0.0.1:8200",
});

const appName = 'internal-app';

//const appServiceAccountSecretToken = process.env.APP_SVC_ACCT_SECRET_TOKEN || 'app-k8s-token';
const appServiceAccountSecretToken = 'YOUR_TOKEN_HERE';

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
