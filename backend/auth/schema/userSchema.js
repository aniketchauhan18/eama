const zod = require('zod');

const userRegistrationSchema = zod.object({
  firstName: zod.string().min(1).max(255),
  lastName: zod.string().min(1).max(255),
  username: zod.string().email(),
  password: zod.string().min(8).max(12)
});

const UpdateUserSchema = zod.object({
  firstName: zod.string().min(1).max(255).optional(),
  lastName: zod.string().min(1).max(255).optional(),
  username: zod.string().email().optional(),
  password: zod.string().min(8).max(12).optional()
})

module.exports = {
  userRegistrationSchema,
  UpdateUserSchema
}