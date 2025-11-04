import type { Task } from 'domain/entities/Task'
import type { NotificationService } from 'domain/services/NotificationService'

import { redis } from './client'

export class RedisNotificationService implements NotificationService {
	scheduleNotification(task: Task): Promise<void> {
		// Эмудируем очередьь
		return redis
			.lpush(
				'notifications:due-soon',
				JSON.stringify({
					taskId: task.id,
					title: task.title,
					dueDate: task.dueDate?.toISOString(),
					timestamp: new Date().toISOString(),
				}),
			)
			.then(() => {
				console.log(`[NOTIFICATION SCHEDULED] Task ${task.id} is due soon`)

				return
			})
	}
}
