# @project:   Butterfly
# @author:    DStack Group
# @module:    email-consumer
# @fileName:  Dockerfile
# @created:   2019-03-07
#
# --------------------------------------------------------------------------------------------
# Copyright (c) 2019 DStack Group.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------
#
# @description:

FROM openjdk:11-jdk-slim
LABEL Alberto Schiabel <alberto.schiabel@gmail.com>

WORKDIR /service

ARG JAR_FILE
ARG SERVER_PORT

ENV JAR_FILE=${JAR_FILE}
ENV SERVER_PORT=${SERVER_PORT}

COPY ./target/${JAR_FILE}.jar /service/${JAR_FILE}.jar

EXPOSE ${SERVER_PORT}
ENTRYPOINT java -jar ${JAR_FILE}.jar
