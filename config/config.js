const environment = process.env.NODE_ENV || 'development';

module.exports = {
  env: environment,
  port: process.env.PORT || 7500,
  remote: {
    servicUrl:
      environment === 'development'
        ? 'http://localhost:7500'
        : process.env.REMOTE_ORIGIN,
    environment,
  },
};
