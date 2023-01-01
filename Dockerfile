FROM node:19.3.0-bullseye-slim

# Switch to non-root user
RUN useradd --create-home --user-group friends_list
USER friends_list
WORKDIR /home/friends_list

ENV NODE_ENV production
ENV FRIENDS_LIST_CONFIG /config/config.js

COPY --chown=friends_list:friends_list . .

RUN yarn install --immutable && \
    yarn cache clean --mirror

ENTRYPOINT ["yarn", "run", "start"]
