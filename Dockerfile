FROM ubuntu:24.04

RUN apt update && apt install -y nodejs npm
RUN apt update && apt install -y vim
RUN npm install -g @ast-grep/cli
RUN npm install -g tree-sitter-cli

WORKDIR /root/ast-grep-graphql-test
COPY . ./
WORKDIR tree-sitter-graphql
RUN TREE_SITTER_LIBDIR=.. tree-sitter test
WORKDIR /root/ast-grep-graphql-test
