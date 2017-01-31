FROM        node


ARG         SECRET_TOKEN
ARG         STEWARD_TOKEN
ARG         STEWARD_JOB

ENV         WEBHOOK_VERSION 2.6.0

COPY        . /judges

RUN         set -ex && \
            mv /judges/redeploy.sh /deploy.sh && \
            chmod +x /deploy.sh && \
            curl -L -o /tmp/webhook-${WEBHOOK_VERSION}.tar.gz https://github.com/adnanh/webhook/releases/download/${WEBHOOK_VERSION}/webhook-linux-amd64.tar.gz && \
            tar -xvzf /tmp/webhook-${WEBHOOK_VERSION}.tar.gz -C /tmp && \
            mv /tmp/webhook-linux-amd64/webhook /bin/webhook && \
            chmod +x /bin/webhook && \
            sed -i "s|SECRET_TOKEN|$SECRET_TOKEN|" /judges/hooks.json && \
            sed -i "s|STEWARD_TOKEN|$STEWARD_TOKEN|g" /deploy.sh && \
            sed -i "s|STEWARD_JOB|$STEWARD_JOB|g" /deploy.sh

VOLUME      /judges
EXPOSE      9000

CMD  webhook -verbose -hooks /judges/hooks.json
