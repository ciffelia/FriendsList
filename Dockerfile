FROM node:12.18.0-alpine

# Switch to non-root user
RUN adduser -D friends_list
USER friends_list
WORKDIR /home/friends_list

ENV NODE_ENV production

COPY --chown=friends_list:friends_list ./package.json ./yarn.lock /home/friends_list/

RUN yarn install --pure-lockfile && \
    yarn cache clean

COPY --chown=friends_list:friends_list . /home/friends_list

CMD ["yarn", "start"]
