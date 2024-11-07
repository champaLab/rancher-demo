# Dockerfile
FROM rancher/rancher:v2.9.2

# Install dependencies and Helm
RUN apt-get update && \
    apt-get install -y curl apt-transport-https gnupg && \
    curl https://baltocdn.com/helm/signing.asc | gpg --dearmor -o /usr/share/keyrings/helm.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | tee /etc/apt/sources.list.d/helm-stable-debian.list && \
    apt-get update && \
    apt-get install -y helm && \
    rm -rf /var/lib/apt/lists/*

# Expose ports
EXPOSE 80 443
