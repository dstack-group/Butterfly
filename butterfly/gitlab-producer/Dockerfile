FROM openjdk:11-jdk-slim
LABEL DStack Group <dstackgroup@gmail.com>

# Add the service itself

WORKDIR /service

ARG JAR_FILE
ARG SERVER_PORT

ENV JAR_FILE=${JAR_FILE}
ENV SERVER_PORT=${SERVER_PORT}

COPY ./target/${JAR_FILE}.jar /service/${JAR_FILE}.jar

EXPOSE ${SERVER_PORT}
ENTRYPOINT java -jar ${JAR_FILE}.jar
