FROM openjdk:11-jdk-slim
LABEL Alberto Schiabel <alberto.schiabel@gmail.com>

# Add the service itself

WORKDIR /service

ARG JAR_FILE
ARG SERVER_PORT

ENV JAR_FILE=${JAR_FILE}
ENV SERVER_PORT=${SERVER_PORT}

# RUN echo ${JAR_FILE}
# RUN echo ${SERVER_PORT}

COPY ./target/${JAR_FILE}.jar /service/${JAR_FILE}.jar

EXPOSE ${SERVER_PORT}
# See https://github.com/google/guice/issues/1133#issuecomment-434635902
ENTRYPOINT java --add-opens java.base/java.lang=ALL-UNNAMED -jar ${JAR_FILE}.jar
