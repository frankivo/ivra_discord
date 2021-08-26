FROM node:latest
WORKDIR /opt/dgfx
ADD index.js ./
ADD node_modules ./node_modules
CMD node index.js
