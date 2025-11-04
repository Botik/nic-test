export class DueDate {
	public readonly value: Date

	private constructor(date: Date) {
		if (isNaN(date.getTime())) {
			throw new Error('Invalid date')
		}

		// if (date < now) {
		//   throw new Error('DueDate cannot be in the past');
		// }
		this.value = date
	}

	static create(date: Date): DueDate {
		return new DueDate(date)
	}

	toString(): string {
		return this.value.toISOString()
	}

	equals(other: DueDate): boolean {
		return this.value.getTime() === other.value.getTime()
	}
}
