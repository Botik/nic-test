import { Task } from '../entities/Task'

export interface NotificationService {
	scheduleNotification(task: Task): Promise<void>
}
