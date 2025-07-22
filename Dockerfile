FROM node:22.14.0-alpine3.21

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

RUN npm run db:generate
RUN npm run build

RUN cp -rf ./src/generated ./dist

ENTRYPOINT [ "node" ]

CMD [ "/app/dist" ]

# Entrypoint => Processo principal
# CMD => Parâmetros default para o entrypoint

# typescript paths
