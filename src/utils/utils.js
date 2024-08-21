export const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  export const metersToKilometers = (meters) => {
    if (typeof meters !== "number" || isNaN(meters)) {
      throw new Error("Input must be a valid number.");
    }
  
    const km = meters / 1000;
    return Math.round(km * 100) / 100;
  };

  export const secondsToHours = (seconds) => {
    if (typeof seconds !== "number" || isNaN(seconds)) {
      throw new Error("Input must be a valid number.");
    }
  
    const hours = (seconds / 60) /60;
    return Math.round(hours * 100) / 100;
  };
  