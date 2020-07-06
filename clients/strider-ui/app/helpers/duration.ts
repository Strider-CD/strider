import { helper } from '@ember/component/helper';

export function duration([value]: [string | number | undefined] /*, hash*/) {
  try {
    return Math.round(Number(value) / 1000);
  } catch (e) {
    return value;
  }
}

export default helper(duration);
