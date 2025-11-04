import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { DueDate } from 'domain/value-objects/DueDate'

dayjs.extend(isBetween)

export const taskStatusEnum = ['pending', 'completed'] as const
export type TaskStatus = (typeof taskStatusEnum)[number]

export class Task {
	constructor(
		public readonly id: number,
		public readonly title: string,
		public readonly description: string | null,
		public readonly status: TaskStatus,
		public readonly dueDate: Date | null,
	) {}

	isDueSoon(): boolean {
		if (!this.dueDate) return false

		const now = dayjs()
		const twentyFourHoursFromNow = dayjs().add(1, 'd')

		return dayjs(this.dueDate).isBetween(twentyFourHoursFromNow, dayjs())
	}

	static create(props: {
		title: string
		description?: string | null
		status?: TaskStatus
		dueDate?: Date | null
	}): Task {
		const dueDate = props.dueDate ? DueDate.create(props.dueDate).value : null

		return new Task(0, props.title, props.description || null, props.status || taskStatusEnum[0], dueDate)
	}

	update(props: { title?: string; description?: string | null; dueDate?: Date | null; status?: TaskStatus }): Task {
		const dueDate = props.dueDate ? DueDate.create(props.dueDate).value : null

		return new Task(
			this.id,
			props.title?.trim() || this.title,
			props.description === undefined ? this.description : props.description?.trim() || null,
			props.status || this.status,
			dueDate,
		)
	}
}
