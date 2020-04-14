import { helper } from '@ember/component/helper';

export function truncate([value]: [string | undefined] /*, hash*/) {
  try {
    return value && value.slice(0, 10);
  } catch (e) {
    return value;
  }
}

export default helper(truncate);
