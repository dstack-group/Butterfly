# @project:   Butterfly
# @author:    DStack Group
# @module:    middleware-dispatcher
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
LABEL DStack Group <dstackgroup@gmail.com>

# Add the service itself

WORKDIR /service

ARG JAR_FILE

ENV JAR_FILE=${JAR_FILE}
ENV SERVER_PORT=${SERVER_PORT}

COPY ./target/${JAR_FILE}.jar /service/${JAR_FILE}.jar

ENTRYPOINT java -jar ${JAR_FILE}.jar
