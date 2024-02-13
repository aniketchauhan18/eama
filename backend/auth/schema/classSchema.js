const zod = require('zod')

const classSchema = zod.object({
  name: zod.string().min(3).max(233),
  instructor: zod.string(),
  enrolledStudents: zod.array(zod.string()).optional(),
  schedule: zod.string(),
  description: zod.string(),
  sessions: zod.array(zod.object({
    date: zod.string(),
    attendance: zod.array(zod.object({
      student: zod.string(),
      status: zod.enum(['present', 'absent']).default('absent')
    }))
  })),
})

const updateClassSchema = zod.object({
  name: zod.string().min(3).max(233).optional(),
  instructor: zod.string().optional(),
  enrolledStudents: zod.array(zod.string()).optional(),
  schedule: zod.string().optional(),
  description: zod.string().optional(),
  sessions: zod.array(zod.object({
    date: zod.string().optional(),
    attendance: zod.array(zod.object({
      student: zod.string().optional(),
      status: zod.enum(['present', 'absent']).optional()
    })).optional()
  })).optional()
})

module.exports = {
  classSchema,
  updateClassSchema
}