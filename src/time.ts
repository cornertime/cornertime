export function formatDuration(seconds: number): string {
    let sign = '';
    if (seconds < 0) {
        sign = '-';
        seconds = -seconds;
    }

    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    let hours = Math.floor(minutes / 60);
    minutes %= 60;

    if (hours) {
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${sign}${hours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
        return `${sign}${minutes}:${formattedSeconds}`;
    }
}
