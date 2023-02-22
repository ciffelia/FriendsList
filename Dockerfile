FROM --platform=$BUILDPLATFORM node:18.14.2-bullseye-slim as deps-downloader

# Switch to unpriviledged user
RUN useradd --create-home --user-group friends-list
USER friends-list
WORKDIR /home/friends-list/friends-list

ENV NODE_ENV production

COPY --chown=friends-list:friends-list . .

RUN yarn install --immutable --mode=skip-build

FROM node:18.14.2-bullseye-slim

# Switch to unpriviledged user
RUN useradd --create-home --user-group friends-list
USER friends-list
WORKDIR /home/friends-list/friends-list

ENV NODE_ENV production
ENV FRIENDS_LIST_CONFIG /config/config.js

COPY --chown=friends-list:friends-list . .
COPY --from=deps-downloader --chown=friends-list:friends-list /home/friends-list/friends-list/.yarn/cache ./.yarn/cache
COPY --from=deps-downloader --chown=friends-list:friends-list /home/friends-list/friends-list/.pnp.* ./

RUN yarn install --immutable && \
    yarn cache clean --mirror

ENTRYPOINT ["yarn", "run", "start"]
