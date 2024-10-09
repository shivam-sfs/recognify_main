export const DDMMYYYY = (dateString: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour12: true,
    };

    const date = new Date(dateString);
    const formattedDate = date.toLocaleString('en-US', options);

    return formattedDate;
}