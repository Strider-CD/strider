import { helper } from '@ember/component/helper';

export function formatDate([date]: [string] /*, hash*/) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(new Date(date));
}

export default helper(formatDate);
