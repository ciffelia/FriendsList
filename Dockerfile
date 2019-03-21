FROM node:10-alpine

ENV NODE_ENV production

ADD package.json yarn.lock /root/FriendsList/
WORKDIR /root/FriendsList
RUN yarn --pure-lockfile && yarn cache clean

ADD . /root/FriendsList

CMD ["yarn", "start"]
