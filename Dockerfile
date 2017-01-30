FROM        node:alpine


ARG         SECRET_TOKEN
ARG         GITHUB_TOKEN
ARG         SNITCH_URL

ENV         WEBHOOK_VERSION 2.6.0

COPY        . /judges

WORKDIR     /judges

RUN         set -ex && \
            mv redeploy.sh /deploy.sh && \
            apk add --update curl git && \
            curl -L -o /tmp/webhook-${WEBHOOK_VERSION}.tar.gz https://github.com/adnanh/webhook/releases/download/${WEBHOOK_VERSION}/webhook-linux-amd64.tar.gz && \
            tar -xvzf /tmp/webhook-${WEBHOOK_VERSION}.tar.gz -C /tmp && \
            mv /tmp/webhook-linux-amd64/webhook /bin/webhook && \
            sed -i "s/SECRET_TOKEN/$SECRET_TOKEN/" hooks.json && \
            sed -i "s/SNITCH_URL/$SNITCH_URL/" /deploy.json && \
            rm -rf /tmp/* && \
            rm -rf /var/cache/apk/*

VOLUME      /judges
EXPOSE      9000

ENTRYPOINT  ["/bin/webhook", "-hooks", "hooks.json"]
