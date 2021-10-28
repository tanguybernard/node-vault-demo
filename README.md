#

## info

### Login available


    https://github.com/kr1sp1n/node-vault/blob/master/features.md


## Run


### 1. Minikube

    minikube start

### 2. Helm Vault

Clone (Optional)

    git clone https://github.com/hashicorp/vault-helm.git
    cd vault-helm
    git checkout v0.16.0 # checkout stable version
    helm lint # check chart(s)
    // dev mode pour la démo, NOT FOR PRODUCTION

Install Vault with helm
    
    helm install vault-app vault-helm/ --set='server.dev.enabled=true' 


    kubectl get po
    kubectl exec -it vault-app-0 -- vault status

Port forward

    kubectl port-forward vault-app-0 8200:8200

    k port-forward node-express-api-node-helm-5b66d7db87-zptbc 3000:3000

### 3. Enable kv secret and write

    kubectl exec -it vault-app-0 /bin/sh

    vault secrets enable -path=internal kv-v2
    vault kv put internal/database/config username="db-readonly-username" password="db-secret-password"

### 4. Enable Kubernetes Authentication

    vault auth enable kubernetes

    vault write auth/kubernetes/config issuer="https://kubernetes.default.svc.cluster.local" token_reviewer_jwt="$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" kubernetes_host="https://$KUBERNETES_PORT_443_TCP_ADDR:443" kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt disable_iss_validation=true


Issue with ISS JWT TOKEN (You can disable iss validation, ONLY FOR TEST, not production...)

    vault write auth/kubernetes/config .... disable_iss_validation=true

https://learn.hashicorp.com/tutorials/vault/kubernetes-sidecar

### 5. Configure 


Create a Kubernetes authentication role for nodeJs application:


    vault policy write node-express-api-node-helm - <<EOH
    path "internal/data/database/config" {
    capabilities = ["read"]
    }
    EOH




The role connects the Kubernetes service account with the Vault policy.
The tokens returned after authentication are valid for 24 hours.

    vault auth enable kubernetes
    vault write auth/kubernetes/role/node-express-api-node-helm bound_service_account_names=node-express-api-node-helm bound_service_account_namespaces=default policies=node-express-api-node-helm ttl=24h



## 8. NodeJS App

### Build image

    eval $(minikube docker-env)

    #optional
    helm del node-express-api

    docker build -t tanguybernard/node-express-api . --no-cache

### Connected the local docker daemon with Minikube (Optional)

    docker run -p 4000:3000 node-express-api-test #localhost:4000 -> node-api:3000

    docker ps

    docker stop <container-id>

    helm create node-helm # create chart (optional)

## Helm Command

Install App with helm

    helm install node-express-api node-helm/ --set vaultService.host=http://vault-app:8200

Update App with helm

    helm upgrade --install node-express-api node-helm/

Delete App With Helm

    helm del node-express-api

## Minikube command

Get minkube service

    minikube service list // To get service name

Get access url for your application

    minikube service <service-name> --url

Resetting and restarting your cluster

    minikube delete

## Kubectl command

### Create Service account

    kubectl create sa my-super-application

    kubectl get sa

    kubectl get secret

    kubectl describe secret <token-name>

## Credits

https://tansanrao.com/hashicorp-vault-sidecar/

https://salmaan-rashid.medium.com/vault-kubernetes-auth-with-minikube-89929da9880f

https://learn.hashicorp.com/tutorials/vault/kubernetes-minikube

https://jhooq.com/building-first-helm-chart-with-spring-boot/

https://deepsource.io/blog/setup-vault-kubernetes/

https://medium.com/@cloudegl/run-node-js-app-using-kubernetes-helm-bb87747785a

https://www.freshbrewed.science/vault-on-kubernetes-part-2-multiple-k8s-templates-and-external-ips/index.html

https://medium.com/the-programmer/working-with-service-account-in-kubernetes-df129cb4d1cc

Deploy with helm

https://www.ibm.com/cloud/blog/quick-example-helm-chart-for-kubernetes