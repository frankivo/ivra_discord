FROM node:latest
WORKDIR /opt/dgfx
CMD node index.js
RUN npm install discord.js @discordjs/rest 
ADD *.js config.json ./
