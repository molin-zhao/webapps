export const dateConverter = dateString => {
  let monthAbbrArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  let dateInput = new Date(dateString);

  let dateNow_timestamp = Date.now();
  let dateInput_timestamp = dateInput.getTime();

  // convert timestamp difference into seconds
  let timestampDiff = (dateNow_timestamp - dateInput_timestamp) / 1000;

  if (timestampDiff < 60) {
    // if less than 1 minute
    return `now`;
  } else {
    // convert timestamp difference into minutes
    timestampDiff /= 60;
    if (timestampDiff < 60) {
      // if less than 1 hour
      return `${Math.floor(timestampDiff)} minute(s) ago`;
    } else {
      // convert timestamp difference into hours
      timestampDiff /= 60;
      if (timestampDiff < 24) {
        // if less than 24 hours or 1 day
        return `${Math.floor(timestampDiff)} hour(s) ago`;
      } else {
        // convert timestamp difference into days
        timestampDiff /= 24;
        if (timestampDiff < 6) {
          // if less than 1 week
          return `${Math.floor(timestampDiff)} day(s) ago`;
        }
      }
    }
  }
  let dateInput_month = dateInput.getMonth();
  let dateInput_date = dateInput.getDate();
  let dateInput_year = dateInput.getFullYear();
  return `${monthAbbrArr[dateInput_month]}.${dateInput_date}.${dateInput_year}`;
};

export const messageCountNormalizer = inputInt => {
  if (inputInt > 99) {
    return `99+`;
  } else if (inputInt > 0) {
    return `${inputInt}`;
  } else {
    return "";
  }
};

export const numberConverter = inputNum => {
  if (inputNum > 1000000) {
    return `${(inputNum / 1000000).toFixed(1)}M`;
  } else if (inputNum > 1000) {
    return `${(inputNum / 1000).toFixed(1)}K`;
  } else {
    return `${inputNum}`;
  }
};

export const stringTrimmer = (inputString, maxLength = 20) => {
  if (inputString.constructor === String) {
    return inputString.length <= maxLength
      ? inputString
      : inputString.substring(0, maxLength - 3) + "...";
  }
  return "";
};
