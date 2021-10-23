FROM node:14-alpine

# Switch to non-root user
RUN adduser -D friends_list
USER friends_list
WORKDIR /home/friends_list

ENV NODE_ENV production

COPY --chown=friends_list:friends_list . .

RUN yarn install --immutable && \
    yarn cache clean --mirror

ENTRYPOINT ["yarn", "run", "start"]
