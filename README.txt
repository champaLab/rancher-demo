## 1. Install docker
    curl -4 icanhazip.com
    dig +short replace_with_subdomain
    curl https://releases.rancher.com/install-docker/20.10.sh | sudo sh
    // document 
    https://ranchermanager.docs.rancher.com/getting-started/installation-and-upgrade/installation-requirements/install-docker
 
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    docker-compose --version


2. Install docker-compose
    ps -p 1141
    sudo kill -9 1616
    sudo usermod -aG docker $USER 
    newgrp docker 
    git clone https://github.com/champaLab/rancher-demo.git
    sudo apt install -y docker-compose 

    ## delete docker 
    docker rm -f $(docker ps -a -q)
    docker ps -a

 
3. Install kubectl
    sudo snap install kubectl --classic
    kubectl get svc

    EXPORT config
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    chmod +x kubectl
    sudo mv kubectl /usr/local/bin/

    sudo vim kubeconfig ===> copy config form rancher
    sudo chmod 400 kubeconfig
    export KUBECONFIG=$(pwd)/kubeconfig
    echo $KUBECONFIG
    sudo snap install kubectl --classic
    kubectl get nodes


   

4. copy rancher config to ~/.kube/config

5. install  argocd
    docker exec -it rancher-demo /bin/sh 
    kubectl create namespace argocd
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'

    reset password
    https://github.com/argoproj/argo-cd/blob/master/docs/faq.md#i-forgot-the-admin-password-how-do-i-reset-it
    argocd account bcrypt --password <YOUR-PASSWORD-HERE>
    # bcrypt(password)=$2a$10$rRyBsGSHK6.uc8fntPwVIuLVHgsAhAX7TcdrqW/RADU0uh7CaChLa
    kubectl -n argocd patch secret argocd-secret \
      -p '{"stringData": {
        "admin.password": "$2a$10$rRyBsGSHK6.uc8fntPwVIuLVHgsAhAX7TcdrqW/RADU0uh7CaChLa",
        "admin.passwordMtime": "'$(date +%FT%T%Z)'"
      }}'

 # get password 
    kubectl config set-context --current --namespace=argocd
    kubectl get svc
    kubectl get secret -n argocd 
    kubectl get secret -n argocd argocd-initial-admin-secret -o yaml

6 start argocd 
    kubectl port-forward svc/argocd-server -n argocd 1234:443
    argocd admin initial-password -n argocd


#Deploy application on kubernetes cluster
## create namespace and secret key 
    1. select secret choose registry type
        - select namespace the same namespace in your app  
        - name : ghcr-secret
        - Registry Domain Name : ghcr.io
        - Uasername And password (WORKFLOW_TOKEN)


    1. change github name  from file  -- .github/workflows/dev-cicd.yaml
    2. change config name from file 
        -- infra/gitops/dev/config.yaml
        -- infra/gitops/prod/deployment.yaml
        -- infra/gitops/prod/service.yaml
        && check port helper check from  -- infra/gitops/dev/deployment.yaml
    3. create DockerFile
    4. check output dir from tsconfig.json  & ecosystem.config.js
    5. check kubernetes port use telnet == IP nodePort (form file -- infra/gitops/dev/deployment.yaml )
        5.1 new  Secrets and variables 
            -> Name : WORKFLOW_TOKEN 
            -> Example value :  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s
 
        5.2 Push project to github & check github action 

        ---------------------- How to generate Workflow Token ----------------------
             -> goto https://github.com/settings/tokens/new
             -> Choose option
                -> repo
                -> workflow 
        ---------------------------------------------------------------------------
            

    5. check kubernetes port use telnet == IP nodePort (form file -- infra/gitops/dev/service.yaml )
    6. open docker & connect to kubernetes cluster production server
        exec on terminal 
            kubectl port-forward svc/argocd-server -n argocd 1234:443
            argocd admin initial-password -n argocd
    7.Go to argocd and create project
        -- http://localhost:1234
          -> Setting 
          -> Repositories 
          -> connect Repositories
            -> set name
            -> set url from github repo (SSH URL)
            -> SSH PRIVATE key from your computer file --  cat ~/.ssh/id_ed25519
          -> New Application
            -> set application name
            -> Project Name (use default)
            -> Sync Policy (Automatic)
            -> Choose Self Heal
            -> SOURCE 
                -> Repository URL 
                -> Revision HEAD
                -> Path = infra/gitops/dev
            -> DESTINATION 
                -> Cluster URL (select)
                -> Namespace = dev


server {
    server_name domain.com www.domain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_cache_bypass $http_upgrade;
    }
}

apt install -y nginx
vim /etc/nginx/sites-available/domain.com
sudo ln -s /etc/nginx/sites-available/domain.com /etc/nginx/sites-enabled/
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx



============> Set Up NFS Server
1. Install NFS Server:
    sudo apt install nfs-kernel-server -y
    sudo mkdir -p /mnt/share
    sudo chown -R nobody:nogroup /mnt/share
    sudo chmod 755 /mnt/share
    echo "/mnt/share <IP-Client/24>(rw,sync,no_subtree_check,no_root_squash)" | sudo tee -a /etc/exports
    sudo exportfs -a 
    sudo systemctl start nfs-kernel-server
    sudo systemctl enable nfs-kernel-server
    sudo systemctl restart nfs-kernel-server
    sudo systemctl status nfs-kernel-server


2. Set Up NFS Client
    sudo apt update
    sudo apt install nfs-common -y 
    sudo mkdir -p /mnt/client_share
    sudo mount <server_ip>:/mnt/share /mnt/client_share
    df -h | grep share


Automate the Mount: To mount automatically at boot, add the following to /etc/fstab:
nfs_server_ip:/mnt/share /mnt/client_share nfs defaults 0 0


# https://gist.github.com/dmancloud/0474dbfedaa7e3793099f68e96cab88f
