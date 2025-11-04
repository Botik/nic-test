import { validateCreate, validateListQuery, validateUpdate } from 'application/dto/TaskDto'
import { TaskResponseDto } from 'application/dto/TaskResponseDto'
import { TaskNotFoundError, TaskService } from 'application/services/TaskService'

export class TaskController {
	constructor(private taskService: TaskService) {}

	create(body: unknown): Promise<TaskResponseDto> {
		const dto = validateCreate(body)

		return this.taskService.createTask(dto).then(task => TaskResponseDto.fromEntity(task))
	}

	list(query: unknown): Promise<TaskResponseDto[]> {
		const status = validateListQuery(query).status

		return this.taskService.getTasks(status).then(tasks => tasks.map(task => TaskResponseDto.fromEntity(task)))
	}

	get(id: number): Promise<TaskResponseDto> {
		return this.taskService.getTaskById(id).then(task => {
			if (!task) throw new TaskNotFoundError(id)

			return TaskResponseDto.fromEntity(task)
		})
	}

	update(id: number, body: unknown): Promise<TaskResponseDto> {
		const dto = validateUpdate(body)

		return this.taskService.updateTask(id, dto).then(task => TaskResponseDto.fromEntity(task))
	}

	delete(id: number): Promise<{ success: true }> {
		return this.taskService.deleteTask(id).then(() => ({ success: true }))
	}
}
