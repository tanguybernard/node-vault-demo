#

## Definition

### Cluster Kubernetes

Un cluster Kubernetes est un ensemble de machines (les nœuds) qui permettent d'exécuter des applications conteneurisées. Si vous exécutez Kubernetes, vous exécutez un cluster.

source : https://www.redhat.com/fr/topics/containers/what-is-a-kubernetes-cluster

### Kubectl

L'outil en ligne de commande de kubernetes, kubectl, vous permet d'exécuter des commandes dans les clusters Kubernetes.

### Minikube

Minikube exécute un cluster Kubernetes à nœud unique dans une machine virtuelle (VM) en local.

## info

### Login available


    https://github.com/kr1sp1n/node-vault/blob/master/features.md


## Run


### 1. Minikube

    minikube start

### 2. Helm
    git clone https://github.com/hashicorp/vault-helm.git
    cd vault-helm
    git checkout v0.16.0 # checkout stable version
    helm lint # check chart(s)
    helm install vault --set='server.dev.enabled=true' # dev mode pour la démo, NOT FOR PRODUCTION

    kubectl get po
    kubectl exec -it vault-0 -- vault status

Port forward

    kubectl port-forward vault-0 8200:8200

    kubectl exec -it vault-0 /bin/sh

    vault secrets enable -path=internal kv-v2


    vault kv put internal/database/config username="db-readonly-username" password="db-secret-password"

### 4. Enable Kubernetes Authentication

    vault auth enable kubernetes

    vault write auth/kubernetes/config \
        token_reviewer_jwt="$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" \
        kubernetes_host="https://$KUBERNETES_PORT_443_TCP_ADDR:443" \
        kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt


https://learn.hashicorp.com/tutorials/vault/kubernetes-sidecar

### 5. Configure 


Create a Kubernetes authentication role named internal-app:


    vault policy write internal-app - <<EOH
    path "internal/data/database/config" {
    capabilities = ["read"]
    }
    EOH

The role connects the Kubernetes service account, internal-app, and namespace, default, with the Vault policy, internal-app. The tokens returned after authentication are valid for 24 hours.

    vault write auth/kubernetes/role/internal-app bound_service_account_names=internal-app bound_service_account_namespaces=default policies=internal-app ttl=24h


Create Service account

    kubectl create sa internal-app

    kubectl get sa

    kubectl get secret

    kubectl describe secret <token-name>



## NodeJS App

Connected the local docker daemon with Minikube

    eval $(minikube docker-env)

    docker build -t tanguybernard/node-express-api .

    docker run -p 4000:3000 node-express-api-test #localhost:4000 -> node-api:3000

    docker ps

    docker stop <container-id>


    helm create node-helm # create chart

Install App with helm

    helm install node-express-api node-helm/

Update App with helm

    helm upgrade --install node-express-api node-helm/

Delete App With Helm

    helm del node-express-api


Get minkube service

    minikube service list // To get service name

Get access url for your application

    minikube service <service-name> --url

Resetting and restarting your cluster

    minikube delete

https://medium.com/@cloudegl/run-node-js-app-using-kubernetes-helm-bb87747785a

## Credits

https://tansanrao.com/hashicorp-vault-sidecar/

https://salmaan-rashid.medium.com/vault-kubernetes-auth-with-minikube-89929da9880f

https://learn.hashicorp.com/tutorials/vault/kubernetes-minikube

https://jhooq.com/building-first-helm-chart-with-spring-boot/

https://deepsource.io/blog/setup-vault-kubernetes/

https://medium.com/@cloudegl/run-node-js-app-using-kubernetes-helm-bb87747785a

https://www.freshbrewed.science/vault-on-kubernetes-part-2-multiple-k8s-templates-and-external-ips/index.html

https://medium.com/the-programmer/working-with-service-account-in-kubernetes-df129cb4d1cc