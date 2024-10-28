1. Install docker
    ```
        curl https://releases.rancher.com/install-docker/20.10.sh | sudo sh
    ```
- https://ranchermanager.docs.rancher.com/getting-started/installation-and-upgrade/installation-requirements/install-docker

2. Install docker-compose
    ```
    sudo apt install docker-compose
    ```
    sudo usermod -aG docker $USER
    newgrp docker

3. Install kubectl
- sudo snap install kubectl --classic

4. copy rancher config to ~/.kube/config

5. install  argocd
    kubectl create namespace argocd
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml


6 start argocd 
    kubectl port-forward svc/argocd-server -n argocd 1234:443
    argocd admin initial-password -n argocd