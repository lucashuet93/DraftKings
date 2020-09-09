export class Timer {
  startTime!: Date;

  start(): void {
    this.startTime = new Date();
  }

  end(): number {
    const endTime: Date = new Date();
    const elapsedMilliseconds: number =
      endTime.getTime() - this.startTime.getTime();
    return elapsedMilliseconds;
  }

  getTimeStringFromMilliseconds(timeInMiliseconds: number): string {
    const hours: number = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
    const minutes: number = Math.floor(
      (timeInMiliseconds / 1000 / 60 / 60 - hours) * 60
    );
    const seconds: number = Math.floor(
      ((timeInMiliseconds / 1000 / 60 / 60 - hours) * 60 - minutes) * 60
    );
    const secondString: string = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const minuteString: string = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const hourString: string = hours < 10 ? `0${hours}` : `${hours}`;
    return `${hourString}:${minuteString}:${secondString}`;
  }
}
