import { Elysia } from 'elysia'

import { validateTaskId } from 'application/dto/TaskDto'

import { TaskController } from '../controllers/TaskController'

export const tasksRoutes = (taskController: TaskController) =>
	new Elysia({ prefix: '/tasks' })
		.post('/', ({ body }) => taskController.create(body))
		.get('/', ({ query }) => taskController.list(query))
		.get('/:id', ({ params: { id } }) => {
			const validId = validateTaskId(id)

			return taskController.get(validId)
		})
		.put('/:id', ({ params: { id }, body }) => {
			const validId = validateTaskId(id)

			return taskController.update(validId, body)
		})
		.delete('/:id', ({ params: { id } }) => {
			const validId = validateTaskId(id)

			return taskController.delete(validId)
		})
