console.log('VAULT_URI',process.env.VAULT_URI);

const vault = require("node-vault")({
    apiVersion: "v1",
    endpoint: process.env.VAULT_URI,
});

const appName = 'node-express-api-node-helm';

const fs = require('fs');

const token = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token', 'utf-8');

console.log(token);
vault.kubernetesLogin({
    role: appName,
    jwt: token
})
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

app.get('/secrets', async (req, res) => {

    async function fetchData(){
        let login = await vault.kubernetesLogin({role: appName, jwt: token});
        let secrets = await vault.read(
            'internal/data/database/config',
            {token: login.auth.client_token})
        return secrets.data.data;
    }
    const secrets = await fetchData()

    res.json(secrets);
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
