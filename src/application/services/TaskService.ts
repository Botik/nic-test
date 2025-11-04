import { Task, type TaskStatus } from 'domain/entities/Task'
import type { TaskRepository } from 'domain/repositories/TaskRepository'
import type { NotificationService } from 'domain/services/NotificationService'

export class TaskService {
	constructor(
		private readonly taskRepo: TaskRepository,
		private readonly notificationService: NotificationService,
	) {}

	async createTask(input: { title: string; description?: string; dueDate?: Date }) {
		const task = Task.create(input)
		const saved = await this.taskRepo.save(task)

		if (saved.isDueSoon()) {
			await this.notificationService.scheduleNotification(saved)
		}

		return saved
	}

	async getTasks(status?: TaskStatus) {
		return this.taskRepo.findAll(status)
	}

	async getTaskById(id: number) {
		return this.taskRepo.findById(id)
	}

	async updateTask(id: number, input: Partial<Omit<Task, 'id'>>) {
		const existing = await this.taskRepo.findById(id)

		if (!existing) throw new TaskNotFoundError(id)

		const updated = existing.update(input) // метод в Task, создающий новый экземпляр
		const saved = await this.taskRepo.save(updated)

		if (saved.isDueSoon() && !existing.isDueSoon()) {
			await this.notificationService.scheduleNotification(saved)
		}

		return saved
	}

	async deleteTask(id: number) {
		const existing = await this.taskRepo.findById(id)

		if (!existing) throw new TaskNotFoundError(id)

		await this.taskRepo.delete(id)
	}
}

export class TaskNotFoundError extends Error {
	constructor(id: number) {
		super(`Task with id ${id} not found`)
		this.name = 'TaskNotFoundError'
	}
}
