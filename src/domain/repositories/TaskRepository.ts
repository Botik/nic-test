import { Task } from '../entities/Task'

export interface TaskRepository {
	save(task: Task): Promise<Task>
	findById(id: number): Promise<Task | null>
	findAll(status?: 'pending' | 'completed'): Promise<Task[]>
	delete(id: number): Promise<void>
}
