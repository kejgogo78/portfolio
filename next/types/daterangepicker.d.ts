import * as moment from 'moment';

declare module 'jquery' {
  interface DateRangePickerOptions {
    startDate?: moment.Moment | string;
    endDate?: moment.Moment | string;
    ranges?: { [key: string]: [moment.Moment, moment.Moment] };
    // 필요한 옵션들을 추가로 정의할 수 있음
    [key: string]: any;
  }

  interface JQuery {
    daterangepicker(options?: DateRangePickerOptions, callback?: (start: moment.Moment, end: moment.Moment) => void): JQuery;
  }

}
