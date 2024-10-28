## 1. Install docker
    curl https://releases.rancher.com/install-docker/20.10.sh | sudo sh
    https://ranchermanager.docs.rancher.com/getting-started/installation-and-upgrade/installation-requirements/install-docker

2. Install docker-compose
    sudo apt install docker-compose
    sudo usermod -aG docker $USER
    newgrp docker

3. Install kubectl
    sudo snap install kubectl --classic

4. copy rancher config to ~/.kube/config

5. install  argocd
    kubectl create namespace argocd
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml


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
            -> Name *
                WORKFLOW_TOKEN 
            -> Value * 
                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s
 
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