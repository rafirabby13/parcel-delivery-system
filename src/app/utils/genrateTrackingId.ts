
export const formatDateToYYYYMMDD = (): string => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(new Date().getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
};
export const generatetrackingId = () => {

    const randomNumber = Math.round(Math.random() * 1000000)

    const date = formatDateToYYYYMMDD()

    const trackingId = `TRK-${date}-${randomNumber}`


    return trackingId

}