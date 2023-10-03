import * as moment from 'moment';

export function getDate(dateObj) {
  if (dateObj) {
    if (String(dateObj).startsWith('0000')) return null;
    else return moment(dateObj).format('yyyy-MM-DD HH:mm:ss');
  } else return dateObj;
}

export function getFormatedDate(date) {
  const outDate =
    date && date.split(' ').length > 1 ? date.split(' ')[0] : date;
  if (outDate && outDate.split('-').length === 3) {
    return (
      outDate.split('-')[2] +
      '-' +
      outDate.split('-')[1] +
      '-' +
      outDate.split('-')[0]
    );
  }
  return outDate;
}