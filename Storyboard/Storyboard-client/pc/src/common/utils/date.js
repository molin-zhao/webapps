const parseISODate = function(isoStr) {
  try {
    return new Date(isoStr);
  } catch (err) {
    return new Date();
  }
};

const parseTimestampDate = function(timestamp) {
  try {
    return new Date(timestamp);
  } catch (err) {
    return new Date();
  }
};

const getTimestampFromISODate = function(isoStr) {
  try {
    return Date.parse(new Date(isoStr));
  } catch (err) {
    return Date.parse(new Date());
  }
};

const getTimestampFromDate = function(date) {
  try {
    return Date.parse(date);
  } catch (err) {
    return Date.parse(new Date());
  }
};

const displayTimeFromTimestamp = function(timestamp) {
  timestamp = parseInt((timestamp /= HOUR)); // to hours
  if (timestamp <= 1) return { number: 1, unit: "TIMELINE_HOUR" };
  if (timestamp > 1 && timestamp < 24)
    return { number: timestamp, unit: "TIMELINE_HOUR" };
  timestamp = parseInt((timestamp /= DAY)); // to days;
  if (timestamp <= 1) return { number: 1, unit: "TIMELINE_DAY" };
  if (timestamp > 1 && timestamp < 7)
    return { number: timestamp, unit: "TIMELINE_DAY" };
  timestamp = parseInt((timestamp /= WEEK)); // to weeks
  if (timestamp <= 1) return { number: 1, unit: "TIMELINE_WEEK" };
  if (timestamp > 1 && timestamp < 52)
    return { number: timestamp, unit: "TIMELINE_WEEK" };
  timestamp = parseInt((timestamp /= YEAR)); // to years
  if (timestamp <= 1) return { number: 1, unit: "TIMELINE_YEAR" };
  return { number: timestamp, unit: "TIMELINE_YEAR" };
};

const HOUR = 1000 * 3600;
const DAY = 24;
const WEEK = 7;
const YEAR = 52;

const NOW_ISO = new Date().toISOString();

export {
  parseISODate,
  parseTimestampDate,
  getTimestampFromISODate,
  getTimestampFromDate,
  displayTimeFromTimestamp,
  NOW_ISO
};
