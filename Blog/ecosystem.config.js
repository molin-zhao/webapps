const { NODE } = require("./config");
module.exports = {
  apps: [
    {
      name: "molinz-blog",
      script: "bin/www",

      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "100M",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],

  deploy: {
    production: {
      user: "root",
      host: NODE.BLOG_NODE,
      ref: "origin/master",
      repo: "https://github.com/RayMoore/webapps.git",
      path: "/home/root/app/molinz",
      "post-deploy":
        "cd Blog/ && npm install && pm2 reload ecosystem.config.js --env production",
      env: {
        NODE_ENV: "production"
      }
    }
  }
};
