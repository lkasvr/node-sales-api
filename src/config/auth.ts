export default {
  jwt: {
    secret: process.env.APP_SECRET ?? 'SecretHere',
    expiresIn: '1d',
  },
};
