FROM node:20-slim

# Set working directory
WORKDIR /app

RUN apt update
RUN apt install -y nfs-common

# Install PM2 globally
RUN npm install -g pm2

# Copy package.json and install dependencies
COPY package*.json .
RUN npm install

# Copy the rest of the application code
COPY . .

# Create the uploads directory with correct ownership and permissions
# RUN mkdir -p ./uploads && \
#     chown -R $(whoami) ./uploads && \
#     chmod -R 777 ./uploads

# Switch to the 'node' user for better security
# USER node

# Expose the desired port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "serve"]
