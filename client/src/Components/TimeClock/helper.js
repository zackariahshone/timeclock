export function convertMilitaryToStandard(militaryTime) {
  if (militaryTime) {
    // Split the time string into hours and minutes
    const [hours, minutes] = militaryTime.split(":").map(Number);
    // Determine AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";
    // Convert hours to 12-hour format
    const standardHours = hours % 12 || 12;
    // Format the standard time string
    const standardTime = `${standardHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    return standardTime;
  }
  return '';
}
