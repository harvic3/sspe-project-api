const environment = process.env.NODE_ENV || 'dev';

module.exports = {
  env: environment,
  port: process.env.PORT || 7500,
  apiKey: process.env.API_KEY || '-remote-sspe-cli-web-',
  remote: {
    clientUrl:
      environment === 'dev'
        ? 'http://127.0.0.1:8080'
        : process.env.REMOTE_ORIGIN,
    environment,
  },
};
