FROM node:22.21

ENV DATABASE_URL=""
ENV PORT=""
ENV JWT_SECRET=""

WORKDIR /app

COPY ./package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE ${PORT}

ENTRYPOINT [ "npm" ]

CMD [ "run", "start" ]
