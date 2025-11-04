import { Elysia } from 'elysia'
import { TaskRepository } from 'infrastructure/database/repositories/TaskRepository'
import { RedisNotificationService } from 'infrastructure/redis/RedisNotificationService'
import { TaskController } from 'presentation/http/controllers/TaskController'
import { tasksRoutes } from 'presentation/http/routes/tasks.routes'
import { ValiError } from 'valibot'

import { TaskService } from 'application/services/TaskService'
import { TaskNotFoundError } from 'application/services/TaskService'

const taskRepo = new TaskRepository()
const notificationService = new RedisNotificationService()
const taskService = new TaskService(taskRepo, notificationService)
const taskController = new TaskController(taskService)

const app = new Elysia()
	.onError(({ error, set }) => {
		if (error instanceof ValiError) {
			set.status = 400

			return { error: 'Validation failed', details: error.issues }
		}

		if (error instanceof Error && error.message === 'Bad Request') {
			set.status = 400

			return { error: 'Bad Request' }
		}

		if (error instanceof TaskNotFoundError) {
			set.status = 404

			return { error: error.message }
		}

		set.status = 500
		console.error('Unhandled error:', error)

		return { error: 'Internal server error' }
	})
	.use(tasksRoutes(taskController))

console.log('🚀 Server running on http://localhost:3000')
app.listen(3000)
