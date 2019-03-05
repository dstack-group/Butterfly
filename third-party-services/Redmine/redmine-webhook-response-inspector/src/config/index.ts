const {
  NODE_ENV,
  APP_NAME,
  APP_HOST,
  APP_PORT,
} = process.env;

const env = NODE_ENV || 'development';
const configs = {
  base: {
    env,
    host: APP_HOST!,
    name: APP_NAME!,
    port: parseInt(APP_PORT!, 10),
  },
};

export const config = configs.base;
