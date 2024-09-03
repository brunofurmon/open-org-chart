FROM node:20.9-slim AS base
ENV APPDIR /usr/open-org-chart

WORKDIR $APPDIR

RUN apt-get update && rm -rf /var/cache/apt/* /tmp/* /var/tmp/*

FROM base AS development
ENV NODE_ENV development
ENV YARN_CACHE_FOLDER /usr/open-org-chart/.caches/yarn

ENTRYPOINT ["./development_entrypoint.sh"]

FROM base AS production
EXPOSE $SERVER_PORT

ENV NODE_ENV production \
    NEXT_TELEMETRY_DISABLED 1 \
    TINI_VERSION v0.19.0

RUN addgroup --gid 1001 --system open-org-chart && \
    adduser --uid 1001 --system --gid 1001 open-org-chart
RUN chown -R open-org-chart:open-org-chart $APPDIR

COPY --chown=open-org-chart . $APPDIR

USER open-org-chart

RUN yarn install && yarn build

ENTRYPOINT ["yarn", "start"]
# CMD ["sh"]
