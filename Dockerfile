#


#
FROM node:latest

RUN npm i -g nodemon

USER node

RUN mkdir /home/node/code

WORKDIR /home/node/code

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node . .

EXPOSE 3000
RUN ["npm", "run", "build"]
CMD ["npm", "start"]