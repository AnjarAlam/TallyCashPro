/**
 * Formats a date input with ordinal suffixes and month abbreviations
 * @param date - Can be a timestamp (number), Date object, date string, or undefined (defaults to now)
 * @param format - Custom format string (default: 'D MMM YYYY')
 *                 Options: 
 *                 - YYYY: 4-digit year
 *                 - YY: 2-digit year
 *                 - MMMM: Full month name
 *                 - MMM: 3-letter month abbreviation
 *                 - MM: 2-digit month
 *                 - M: Month number
 *                 - Do: Day with ordinal (1st, 2nd, 3rd, etc.)
 *                 - DD: 2-digit day
 *                 - D: Day number
 *                 - HH: 2-digit hour (24h)
 *                 - H: Hour (24h)
 *                 - hh: 2-digit hour (12h)
 *                 - h: Hour (12h)
 *                 - mm: 2-digit minutes
 *                 - m: Minutes
 *                 - ss: 2-digit seconds
 *                 - s: Seconds
 *                 - A: AM/PM uppercase
 *                 - a: am/pm lowercase
 * @returns Formatted date string
 */
export function formatDate(
    date: number | Date | string | undefined = undefined,
    format: string = 'Do MMM YYYY'
): string {
    // Handle date input
    const dateObj = date === undefined ? new Date() :
        typeof date === 'number' ? new Date(date) :
            typeof date === 'string' ? new Date(date) :
                date;

    // Check if the date is invalid
    if (isNaN(dateObj.getTime())) {
        console.error('Invalid date provided to formatDate');
        return 'Invalid date';
    }

    // Helper functions
    const pad = (num: number): string => num.toString().padStart(2, '0');
    const getOrdinal = (num: number): string => {
        const j = num % 10;
        const k = num % 100;
        if (j === 1 && k !== 11) return num + 'st';
        if (j === 2 && k !== 12) return num + 'nd';
        if (j === 3 && k !== 13) return num + 'rd';
        return num + 'th';
    };

    // Month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthAbbr = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Time components
    const hours24 = dateObj.getHours();
    const hours12 = hours24 % 12 || 12;
    const ampm = hours24 < 12 ? 'am' : 'pm';

    const replacements: Record<string, string> = {
        YYYY: dateObj.getFullYear().toString(),
        YY: dateObj.getFullYear().toString().slice(-2),
        MMMM: monthNames[dateObj.getMonth()],
        MMM: monthAbbr[dateObj.getMonth()],
        MM: pad(dateObj.getMonth() + 1),
        M: (dateObj.getMonth() + 1).toString(),
        Do: getOrdinal(dateObj.getDate()),
        DD: pad(dateObj.getDate()),
        D: dateObj.getDate().toString(),
        HH: pad(hours24),
        H: hours24.toString(),
        hh: pad(hours12),
        h: hours12.toString(),
        mm: pad(dateObj.getMinutes()),
        m: dateObj.getMinutes().toString(),
        ss: pad(dateObj.getSeconds()),
        s: dateObj.getSeconds().toString(),
        A: ampm.toUpperCase(),
        a: ampm
    };

    return format.replace(
        /YYYY|YY|MMMM|MMM|MM|M|Do|DD|D|HH|H|hh|h|mm|m|ss|s|A|a/g,
        (match) => replacements[match]
    );
}