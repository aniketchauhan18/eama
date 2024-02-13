const zod = require('zod');

const loginSchema = zod.object({
  username: zod.string().email(),
  password: zod.string().min(8).max(12)
});

module.exports = loginSchema;