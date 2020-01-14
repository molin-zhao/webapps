const parseISODate = function(isoStr) {
  try {
    return new Date(isoStr);
  } catch {
    return new Date();
  }
};

const parseTimestampDate = function(timestamp) {
  try {
    return new Date(timestamp);
  } catch {
    return new Date();
  }
};

const getTimestampFromISODate = function(isoStr) {
  try {
    return Date.parse(new Date(isoStr));
  } catch {
    return Date.parse(new Date());
  }
};

export { parseISODate, parseTimestampDate, getTimestampFromISODate };
