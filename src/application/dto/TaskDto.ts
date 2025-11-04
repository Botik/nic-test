import * as v from 'valibot'

export const TaskIdSchema = v.pipe(
	v.number(),
	v.integer('ID must be an integer'),
	v.minValue(1, 'ID must be a positive number'),
)

export type Id = v.InferOutput<typeof TaskIdSchema>

// Схема для создания задачи
export const CreateTaskSchema = v.object({
	title: v.string('Title is required and must be a string'),
	description: v.optional(v.string()),
	dueDate: v.optional(v.pipe(v.date(), v.toMinValue(new Date()))),
})

export type CreateTaskDto = v.InferOutput<typeof CreateTaskSchema>

// Схема для обновления задачи
export const UpdateTaskSchema = v.object({
	title: v.optional(v.string()),
	description: v.optional(v.string()),
	dueDate: v.optional(v.pipe(v.date(), v.toMinValue(new Date()))),
	status: v.optional(v.union([v.literal('pending'), v.literal('completed')])),
})

export type UpdateTaskDto = v.InferOutput<typeof UpdateTaskSchema>

// Схема для фильтрации списка
export const ListTasksQuerySchema = v.object({
	status: v.optional(v.union([v.literal('pending'), v.literal('completed')])),
})

export type ListTasksQueryDto = v.InferOutput<typeof ListTasksQuerySchema>

// Вспомогательные функции
export const validateTaskId = (input: unknown): Id => v.parse(TaskIdSchema, input)

export const validateCreate = (input: unknown): CreateTaskDto => v.parse(CreateTaskSchema, input)

export const validateUpdate = (input: unknown): UpdateTaskDto => v.parse(UpdateTaskSchema, input)

export const validateListQuery = (input: unknown): ListTasksQueryDto => v.parse(ListTasksQuerySchema, input)
