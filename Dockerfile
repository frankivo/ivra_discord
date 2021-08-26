FROM node:latest
WORKDIR /opt/dgfx
ADD node_modules ./node_modules
CMD node index.js
ADD index.js ./
