FROM cypress/base:12
COPY fail.sh fail.sh
COPY pass.sh pass.sh
ENTRYPOINT ["tail", "-f", "/dev/null"]