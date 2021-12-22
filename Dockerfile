FROM gcr.io/distroless/nodejs:12
COPY ./dist/ /app
WORKDIR /app
CMD ["index.js"]
