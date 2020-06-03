FROM node:12.18.0-alpine

ENV NODE_ENV production

ADD package.json yarn.lock /root/FriendsList/
WORKDIR /root/FriendsList
RUN yarn install --pure-lockfile && \
    yarn cache clean

ADD . /root/FriendsList

CMD ["yarn", "start"]
