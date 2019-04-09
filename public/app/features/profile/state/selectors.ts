import { UserState } from 'app/types';
import { Timezone } from '@grafana/ui';

export const getTimezone = (state: UserState) => {
  const tz: Timezone = {
    raw: state.timezone,
    isUtc: state.timezone === 'utc',
  };
  return tz;
};
