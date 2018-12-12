import {Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class Ultils {

  constructor(
    private toastrService: ToastrService,
    public translate: TranslateService
  ) {
  }

  static date(fc: FormControl) {
    if (fc.value !== null) {
      var _date = fc.value._d;
      var _nowDate = new Date();
      if (typeof _date === "undefined") {
        _date = fc.value
      }
      if (_date > _nowDate) {
        return ({date: true});
      }
    } 
    return (null);
  }

  static ValidURL(fc: FormControl) {
    if (fc.value !== null && fc.value !== "") {
      let str = fc.value;
      var regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
      var url = new RegExp(regexQuery, "i");
      if(!url.test(str)) {
        return ({ValidURL: true});
      }
    }
    return (null);
  }

  validDateTime(fc: FormControl) {
    if (fc.value !== null) {
      var _date = fc.value._d;
      var _nowDate = new Date();
      if (typeof _date === "undefined") {
        _date = fc.value
      }
      if (_date > _nowDate) {
        return false;
      }
    } 
    return true;
  }

  dateToyyyyMMdd(dateInput): string {
    var date = dateInput._d;
    if (typeof date === "undefined") {
      date = dateInput
    }
    const MM = date.getMonth() + 1;
    const dd = date.getDate();

    return [
        date.getFullYear(),
        (MM > 9 ? '' : '0') + MM,
        (dd > 9 ? '' : '0') + dd
    ].join('-');
  }

  stringToyyyyMMdd(date): string {
    const arr = date.split('-');
    const yyyy = arr[0];
    const MM = arr[1];
    const dd = arr[2].substr(0, 2);
    return [
      yyyy,
      MM,
      dd
    ].join('/');
  }

  validateEmail(email): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  getSearchDateValue(searchDate, objSearch) {
    if (
      (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') ||
      (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') ||
      (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') ||
      (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') ||
      (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') ||
      (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '')
    ) {
      //#region error
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (
          (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') ||
          (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '')
        )
      ) {
        this.toastrService.warning(this.translate.instant("message.dayRequired"), "");
        return false;
      }
      else if (
        (
          (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
          (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') &&
          (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '')
        ) ||
        (
          (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
          (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '') &&
          (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '')
        )
      ) {
        this.toastrService.warning(this.translate.instant("message.monthRequired"), "");
        return false;
      }
      //#endregion

      //#region 2017/__/__ -> ____/__/__		<-->		2017/01/01 <= filter
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        objSearch.from_date = _fromYear + '-01-01';
      }
      //#endregion

      //#region 2017/__/__ -> 2018/__/__		<-->		2017/01/01 <= filter <= 2018/12/31
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        objSearch.from_date = _fromYear + '-01-01';

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toDay = new Date(parseInt(_toYear), 12, 0).getDate();
        objSearch.to_date = _toYear + '-12-' + _toDay;
      }
      //#endregion

      //#region 2017/__/__ -> 2018/05/__		<-->		2017/01/01 <= filter <= 2018/05/31
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        objSearch.from_date = _fromYear + '-01-01';

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '00' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        objSearch.to_date = _toYear + '-' + _toMonth + '-' + _toDay;
      }
      //#endregion

      //#region 2017/__/__ -> 2018/05/25		<-->		2017/01/01 <= filter <= 2018/05/25
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        objSearch.from_date = _fromYear + '-01-01';

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastDay) {
          _toDay = _lastDay.toString();
        }

        objSearch.to_date = _toYear + '-' + _toMonth + '-' + _toDay;
      }
      //#endregion

      //#region ____/__/__ -> 2018/__/__		<-->		filter <= 2018/12/31
      if (
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toDay = new Date(parseInt(_toYear), 12, 0).getDate();
        objSearch.to_date = _toYear + '-12-' + _toDay;
      }
      //#endregion

      //#region 2017/05/__ -> 2018/__/__		<-->		2017/05/01 <= filter <= 2018/12/31
      if (
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toDay = new Date(parseInt(_toYear), 12, 0).getDate();
        objSearch.to_date = _toYear + '-12-' + _toDay;

        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        objSearch.from_date = _fromYear + '-' + _fromMonth + '-01';
      }
      //#endregion

      //#region 2017/05/25 -> 2018/__/__		<-->		2017/05/25 <= filter <= 2018/12/31
      if (
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '')
      ) {
        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toDay = new Date(parseInt(_toYear), 12, 0).getDate();
        objSearch.to_date = _toYear + '-12-' + _toDay;

        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromDay.substr(_fromDay.length - 2);

        let _lastDay = new Date(parseInt(_fromYear), parseInt(_fromMonth), 0).getDate();
        if (parseInt(_fromDay) > _lastDay) {
          _fromDay = _lastDay.toString();
        }

        objSearch.from_date = _fromYear + '-' + _fromMonth + '-' + _fromDay;
      }

      //#endregion

      //#region 2017/05/__ -> ____/__/__		<-->		2017/05/01 <= filter
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        objSearch.from_date = _fromYear + '-' + _fromMonth + '-01';
      }
      //#endregion

      //#region 2017/05/__ -> 2018/05/__		<-->		2017/05/01 <= filter <= 2018/05/31
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        objSearch.from_date = _fromYear + '-' + _fromMonth + '-01';

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        objSearch.to_date = _toYear + '-' + _toMonth + '-' + _toDay;
      }
      //#endregion

      //#region 2017/05/__ -> 2018/05/25		<-->		2017/05/01 <= filter <= 2018/05/25
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        objSearch.from_date = _fromYear + '-' + _fromMonth + '-01';

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastDay) {
          _toDay = _lastDay.toString();
        }

        objSearch.to_date = _toYear + '-' + _toMonth + '-' + _toDay;
      }
      //#endregion

      //#region ____/__/__ -> 2018/05/__		<-->		filter <= 2018/05/31
      if (
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        objSearch.to_date = _toYear + '-' + _toMonth + '-' + _toDay;
      }
      //#endregion

      //#region 2017/05/25 -> 2018/05/__		<-->		2017/05/25 <= filter <= 2018/05/31
      if (
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '')
      ) {
        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        objSearch.to_date = _toYear + '-' + _toMonth + '-' + _toDay;

        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromDay.substr(_fromDay.length - 2);

        let _lastDay = new Date(parseInt(_fromYear), parseInt(_fromMonth), 0).getDate();
        if (parseInt(_fromDay) > _lastDay) {
          _fromDay = _lastDay.toString();
        }
        objSearch.from_date = _fromYear + '-' + _fromMonth + '-' + _fromDay;
      }
      //#endregion

      //#region ____/05/25 -> ____/__/__		<-->		2017/05/25 <= filter
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') &&
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _now = new Date();
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromDay.substr(_fromDay.length - 2);
        objSearch.from_date = _now.getFullYear() + '-' + _fromMonth + '-' + _fromDay;
      }
      //#endregion

      //#region ____/05/25 -> 2018/__/__		<-->		2017/05/25 <= filter <= 2018/12/31
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _now = new Date();
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromDay.substr(_fromDay.length - 2);
        objSearch.from_date = _now.getFullYear() + '-' + _fromMonth + '-' + _fromDay;

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toDay = new Date(parseInt(_toYear), 12, 0).getDate();
        objSearch.to_date = _toYear + '-12-' + _toDay;
      }
      //#endregion

      //#region ____/05/25 -> 2018/05/__		<-->		2017/05/25 <= filter <= 2018/05/31
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _now = new Date();
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromDay.substr(_fromDay.length - 2);
        objSearch.from_date = _now.getFullYear() + '-' + _fromMonth + '-' + _fromDay;

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        objSearch.to_date = _toYear + '-' + _toMonth + '-' + _toDay;
      }
      //#endregion

      //#region ____/05/25 -> 2018/05/25		<-->		2017/05/25 <= filter <= 2018/05/25
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '')
      ) {
        let _now = new Date();
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromDay.substr(_fromDay.length - 2);
        objSearch.from_date = _now.getFullYear() + '-' + _fromMonth + '-' + _fromDay;

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastDay) {
          _toDay = _lastDay.toString();
        }

        objSearch.to_date = _toYear + '-' + _toMonth + '-' + _toDay;
      }
      //#endregion

      //#region ____/__/__ -> ____/05/25		<-->		filter <= 2018/05/25
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '') &&
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _now = new Date();
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastDay = new Date(_now.getFullYear(), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastDay) {
          _toDay = _lastDay.toString();
        }
        objSearch.to_date = _now.getFullYear + '-' + _toMonth + '-' + _toDay;
      }
      //#endregion

      //#region 2017/__/__ -> ____/05/25		<-->		2017/01/01 <= filter <= 2018/05/25
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _now = new Date();
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastDay = new Date(_now.getFullYear(), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastDay) {
          _toDay = _lastDay.toString();
        }
        objSearch.to_date = _now.getFullYear + '-' + _toMonth + '-' + _toDay;
        
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        objSearch.from_date = _fromYear + '-01-01';
      }
      //#endregion

      //#region 2017/05/__ -> ____/05/25		<-->		2017/05/01 <= filter <= 2018/05/25
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _now = new Date();
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastDay = new Date(_now.getFullYear(), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastDay) {
          _toDay = _lastDay.toString();
        }
        objSearch.to_date = _now.getFullYear + '-' + _toMonth + '-' + _toDay;

        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        objSearch.from_date = _fromYear + '-' + _fromMonth + '-01';
      }
      //#endregion

      //#region 2017/05/25 -> ____/05/25		<-->		2017/05/25 <= filter <= 2018/05/25
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '')
      ) {
        let _now = new Date();
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastToDay = new Date(_now.getFullYear(), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastToDay) {
          _toDay = _lastToDay.toString();
        }
        objSearch.to_date = _now.getFullYear + '-' + _toMonth + '-' + _toDay;

        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromDay.substr(_fromDay.length - 2);

        let _lastFromDay = new Date(parseInt(_fromYear), parseInt(_fromMonth), 0).getDate();
        if (parseInt(_fromDay) > _lastFromDay) {
          _fromDay = _lastFromDay.toString();
        }

        objSearch.from_date = _fromYear + '-' + _fromMonth + '-' + _fromDay;
      }
      //#endregion

      //#region ____/05/__ -> ____/__/__		<-->		2017/05/01 <= filter
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _now = new Date();
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        objSearch.from_date = _now.getFullYear() + '-' + _fromMonth + '-01';
      }
      //#endregion

      //#region ____/05/__ -> 2018/__/__		<-->		(month >= 5 and year < 2018) or (year >= 2018 and <= 2018/12/31)
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        objSearch.from_date = '9000-' + _fromMonth + '-01';

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toDay = new Date(parseInt(_toYear), 12, 0).getDate();
        objSearch.to_date = _toYear + '-12-' + _toDay;
      }
      //#endregion

      //#region ____/05/__ -> 2018/05/__		<-->		(month >= 5 and year < 2018) or (year >= 2018 and <= 2018/05/31)
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        objSearch.from_date = '9000-' + _fromMonth + '-01';

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        objSearch.to_date = _toYear + '-' + _toMonth + '-' + _toDay;
      }
      //#endregion

      //#region ____/05/__ -> 2018/05/25		<-->		(month >= 5 and year < 2018) or (year >= 2018 and <= 2018/05/25)
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '')
      ) {
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        objSearch.from_date = '9000-' + _fromMonth + '-01';

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastDay) {
          _toDay = _lastDay.toString();
        }

        objSearch.to_date = _toYear + '-' + _toMonth + '-' + _toDay;
      }
      //#endregion

      //#region ____/05/__ -> ____/06/__		<-->		5 <= month <= 6
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _now = new Date();

        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        objSearch.from_date = '9000-' + _fromMonth + '-01';

        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        objSearch.to_date = '9000-' + _toMonth + '-15';
      }
      //#endregion

      //#region ____/__/__ -> ____/05/__		<-->		filter <= 2018/05/31
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _now = new Date();
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(_now.getFullYear(), parseInt(_toMonth), 0).getDate();
        objSearch.to_date = _now.getFullYear() + '-' + _toMonth + '-' + _toDay;
      }
      //#endregion

      //#region 2017/__/__ -> ____/05/__		<-->		2017/01/01 <= filter <= 2017/05/31
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        objSearch.from_date = _fromYear + '-01-01';

        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_fromYear), parseInt(_toMonth), 0).getDate();
        objSearch.to_date = _fromYear + '-' + _toMonth + '-' + _toDay;
      }
      //#endregion

      //#region 2017/05/__ -> ____/05/__		<-->		2017/05/01 <= filter <= 2017/05/31
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        objSearch.from_date = _fromYear + '-' + _fromMonth + '-01';

        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_fromYear), parseInt(_toMonth), 0).getDate();
        objSearch.to_date = _fromYear + '-' + _toMonth + '-' + _toDay;
      }
      //#endregion

      //#region 2017/05/25 -> ____/05/__		<-->		2017/05/25 <= filter <= 2017/05/31
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromMonth.substr(_fromDay.length - 2);

        let _lastDay = new Date(parseInt(_fromYear), parseInt(_fromMonth), 0).getDate();
        if (parseInt(_fromDay) > _lastDay) {
          _fromDay = _lastDay.toString();
        }

        objSearch.from_date = _fromYear + '-' + _fromMonth + '-' + _fromDay;
      }
      //#endregion

      //#region 2017/05/25 -> 2017/05/31    <-->    2017/05/25 <= filter <= 2017/05/31
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromMonth.substr(_fromDay.length - 2);

        let _lastFromDay = new Date(parseInt(_fromYear), parseInt(_fromMonth), 0).getDate();
        if (parseInt(_fromDay) > _lastFromDay) {
          _fromDay = _lastFromDay.toString();
        }
        objSearch.from_date = _fromYear + '-' + _fromMonth + '-' + _fromDay;

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastToDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastToDay) {
          _toDay = _lastToDay.toString();
        }
        objSearch.to_date = _toYear + '-' + _toMonth + '-' + _toDay;
      }
      //#endregion
    }
    return true;
  }

  changeSearchDate(searchDate, fromDateFormControl, toDateFormControl): void {
    if (
      (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') ||
      (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') ||
      (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') ||
      (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') ||
      (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') ||
      (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '')
    ) {
      //#region max day and max month
      if (searchDate.fromMonth.length === 1 && parseInt(searchDate.fromMonth) > 1) {
        searchDate.fromMonth = '0' + searchDate.fromMonth;
      }
      if (searchDate.fromDay.length === 1 && parseInt(searchDate.fromDay) > 3) {
        searchDate.fromDay = '0' + searchDate.fromDay;
      }
      if (searchDate.toMonth.length === 1 && parseInt(searchDate.toMonth) > 1) {
        searchDate.toMonth = '0' + searchDate.toMonth;
      }
      if (searchDate.toDay.length === 1 && parseInt(searchDate.toDay) > 3) {
        searchDate.toDay = '0' + searchDate.toDay;
      }
      if (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') {
        if (parseInt(searchDate.fromDay) > 31) {
          searchDate.fromDay = '31';
        }
      }
      if (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '') {
        if (parseInt(searchDate.toDay) > 31) {
          searchDate.toDay = '31';
        }
      }
      if (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') {
        if (parseInt(searchDate.fromMonth) > 12) {
          searchDate.fromMonth = '12';
        }
      }
      if (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') {
        if (parseInt(searchDate.toMonth) > 12) {
          searchDate.toMonth = '12';
        }
      }
      //#endregion

      //#region 2017/__/__ -> ____/__/__		<-->		2017/01/01 <= filter
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromDate = _fromYear + '-01-01';
        fromDateFormControl.setValue(new Date(_fromDate));
      }
      //#endregion

      //#region 2017/__/__ -> 2018/__/__		<-->		2017/01/01 <= filter <= 2018/12/31
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromDate = _fromYear + '-01-01';
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toDay = new Date(parseInt(_toYear), 12, 0).getDate();
        let _toDate = _toYear + '-12-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region 2017/__/__ -> 2018/05/__		<-->		2017/01/01 <= filter <= 2018/05/31
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromDate = _fromYear + '-01-01';
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '00' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        let _toDate = _toYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region 2017/__/__ -> 2018/05/25		<-->		2017/01/01 <= filter <= 2018/05/25
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromDate = _fromYear + '-01-01';
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastDay) {
          _toDay = _lastDay.toString();
          searchDate.toDay = _toDay;
        }

        let _toDate = _toYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region ____/__/__ -> 2018/__/__		<-->		filter <= 2018/12/31
      if (
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toDay = new Date(parseInt(_toYear), 12, 0).getDate();
        let _toDate = _toYear + '-12-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region 2017/05/__ -> 2018/__/__		<-->		2017/05/01 <= filter <= 2018/12/31
      if (
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toDay = new Date(parseInt(_toYear), 12, 0).getDate();
        let _toDate = _toYear + '-12-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));

        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDate = _fromYear + '-' + _fromMonth + '-01';
        fromDateFormControl.setValue(new Date(_fromDate));
      }
      //#endregion

      //#region 2017/05/25 -> 2018/__/__		<-->		2017/05/25 <= filter <= 2018/12/31
      if (
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '')
      ) {
        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toDay = new Date(parseInt(_toYear), 12, 0).getDate();
        let _toDate = _toYear + '-12-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));

        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromDay.substr(_fromDay.length - 2);

        let _lastDay = new Date(parseInt(_fromYear), parseInt(_fromMonth), 0).getDate();
        if (parseInt(_fromDay) > _lastDay) {
          _fromDay = _lastDay.toString();
          searchDate.fromDay = _fromDay;
        }

        let _fromDate = _fromYear + '-' + _fromMonth + '-' + _fromDay;
        fromDateFormControl.setValue(new Date(_fromDate));
      }

      //#endregion

      //#region 2017/05/__ -> ____/__/__		<-->		2017/05/01 <= filter
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDate = _fromYear + '-' + _fromMonth + '-01';
        fromDateFormControl.setValue(new Date(_fromDate));
      }
      //#endregion

      //#region 2017/05/__ -> 2018/05/__		<-->		2017/05/01 <= filter <= 2018/05/31
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDate = _fromYear + '-' + _fromMonth + '-01';
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        let _toDate = _toYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }

      //#endregion

      //#region 2017/05/__ -> 2018/05/25		<-->		2017/05/01 <= filter <= 2018/05/25
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDate = _fromYear + '-' + _fromMonth + '-01';
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastDay) {
          _toDay = _lastDay.toString();
          searchDate.toDay = _toDay;
        }

        let _toDate = _toYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region ____/__/__ -> 2018/05/__		<-->		filter <= 2018/05/31
      if (
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        let _toDate = _toYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region 2017/05/25 -> 2018/05/__		<-->		2017/05/25 <= filter <= 2018/05/31
      if (
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '')
      ) {
        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        let _toDate = _toYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));

        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromDay.substr(_fromDay.length - 2);

        let _lastDay = new Date(parseInt(_fromYear), parseInt(_fromMonth), 0).getDate();
        if (parseInt(_fromDay) > _lastDay) {
          _fromDay = _lastDay.toString();
          searchDate.fromDay = _fromDay;
        }
        let _fromDate = _fromYear + '-' + _fromMonth + '-' + _fromDay;
        fromDateFormControl.setValue(new Date(_fromDate));
      }
      //#endregion

      //#region ____/05/25 -> ____/__/__		<-->		2017/05/25 <= filter
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') &&
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _now = new Date();
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromDay.substr(_fromDay.length - 2);
        let _lastDay = new Date(_now.getFullYear(), parseInt(_fromMonth), 0).getDate();
        if (parseInt(_fromDay) > _lastDay) {
          _fromDay = _lastDay.toString();
          searchDate.fromDay = _fromDay;
        }
        let _fromDate = _now.getFullYear() + '-' + _fromMonth + '-' + _fromDay;
        fromDateFormControl.setValue(new Date(_fromDate));
      }
      //#endregion

      //#region ____/05/25 -> 2018/__/__		<-->		2017/05/25 <= filter <= 2018/12/31
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _now = new Date();
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromDay.substr(_fromDay.length - 2);
        let _lastDay = new Date(_now.getFullYear(), parseInt(_fromMonth), 0).getDate();
        if (parseInt(_fromDay) > _lastDay) {
          _fromDay = _lastDay.toString();
          searchDate.fromDay = _fromDay;
        }
        let _fromDate = _now.getFullYear() + '-' + _fromMonth + '-' + _fromDay;
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toDay = new Date(parseInt(_toYear), 12, 0).getDate();
        let _toDate = _toYear + '-12-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region ____/05/25 -> 2018/05/__		<-->		2017/05/25 <= filter <= 2018/05/31
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _now = new Date();
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromDay.substr(_fromDay.length - 2);
        let _lastDay = new Date(_now.getFullYear(), parseInt(_fromMonth), 0).getDate();
        if (parseInt(_fromDay) > _lastDay) {
          _fromDay = _lastDay.toString();
          searchDate.fromDay = _fromDay;
        }
        let _fromDate = _now.getFullYear() + '-' + _fromMonth + '-' + _fromDay;
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        let _toDate = _toYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region ____/05/25 -> 2018/05/25		<-->		2017/05/25 <= filter <= 2018/05/25
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '')
      ) {
        let _now = new Date();
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromDay.substr(_fromDay.length - 2);
        let _lastFromDay = new Date(_now.getFullYear(), parseInt(_fromMonth), 0).getDate();
        if (parseInt(_fromDay) > _lastFromDay) {
          _fromDay = _lastFromDay.toString();
          searchDate.fromDay = _fromDay;
        }
        let _fromDate = _now.getFullYear() + '-' + _fromMonth + '-' + _fromDay;
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastToDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastToDay) {
          _toDay = _lastToDay.toString();
          searchDate.toDay = _toDay;
        }

        let _toDate = _toYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region ____/__/__ -> ____/05/25		<-->		filter <= 2018/05/25
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '') &&
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _now = new Date();
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastDay = new Date(_now.getFullYear(), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastDay) {
          _toDay = _lastDay.toString();
          searchDate.toDay = _toDay;
        }
        let _toDate = _now.getFullYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region 2017/__/__ -> ____/05/25		<-->		2017/01/01 <= filter <= 2018/05/25
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _now = new Date();
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastDay = new Date(_now.getFullYear(), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastDay) {
          _toDay = _lastDay.toString();
          searchDate.toDay = _toDay;
        }
        let _toDate = _now.getFullYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));

        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromDate = _fromYear + '-01-01';
        fromDateFormControl.setValue(new Date(_fromDate));
      }
      //#endregion

      //#region 2017/05/__ -> ____/05/25		<-->		2017/05/01 <= filter <= 2018/05/25
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _now = new Date();
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastDay = new Date(_now.getFullYear(), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastDay) {
          _toDay = _lastDay.toString();
          searchDate.toDay = _toDay;
        }
        let _toDate = _now.getFullYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));

        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDate = _fromYear + '-' + _fromMonth + '-01';
        fromDateFormControl.setValue(new Date(_fromDate));
      }
      //#endregion

      //#region 2017/05/25 -> ____/05/25		<-->		2017/05/25 <= filter <= 2018/05/25
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '')
      ) {
        let _now = new Date();
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastToDay = new Date(_now.getFullYear(), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastToDay) {
          _toDay = _lastToDay.toString();
          searchDate.toDay = _toDay;
        }
        let _toDate = _now.getFullYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));

        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromDay.substr(_fromDay.length - 2);

        let _lastFromDay = new Date(parseInt(_fromYear), parseInt(_fromMonth), 0).getDate();
        if (parseInt(_fromDay) > _lastFromDay) {
          _fromDay = _lastFromDay.toString();
          searchDate.fromDay = _fromDay;
        }

        let _fromDate = _fromYear + '-' + _fromMonth + '-' + _fromDay;
        fromDateFormControl.setValue(new Date(_fromDate));
      }
      //#endregion

      //#region ____/05/__ -> ____/__/__		<-->		2017/05/01 <= filter
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _now = new Date();
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDate = _now.getFullYear() + '-' + _fromMonth + '-01';
        fromDateFormControl.setValue(new Date(_fromDate));
      }
      //#endregion

      //#region ____/05/__ -> 2018/__/__		<-->		(month >= 5 and year < 2018) or (year >= 2018 and <= 2018/12/31)
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth === 'undefined' || searchDate.toMonth === null || searchDate.toMonth === '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDate = '1900-' + _fromMonth + '-01';
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toDay = new Date(parseInt(_toYear), 12, 0).getDate();
        let _toDate = _toYear + '-12-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region ____/05/__ -> 2018/05/__		<-->		(month >= 5 and year < 2018) or (year >= 2018 and <= 2018/05/31)
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDate = '1900-' + _fromMonth + '-01';
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        let _toDate = _toYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region ____/05/__ -> 2018/05/25		<-->		(month >= 5 and year < 2018) or (year >= 2018 and <= 2018/05/25)
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '')
      ) {
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDate = '1900-' + _fromMonth + '-01';
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastDay) {
          _toDay = _lastDay.toString();
          searchDate.toDay = _toDay;
        }

        let _toDate = _toYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region ____/05/__ -> ____/06/__		<-->		5 <= month <= 6
      if (
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '') &&
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '')
      ) {
        let _now = new Date();

        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDate = _now.getFullYear() + '-' + _fromMonth + '-01';
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDate = _now.getFullYear() + '-' + _toMonth + '-15';
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region ____/__/__ -> ____/05/__		<-->		filter <= 2018/05/31
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear === 'undefined' || searchDate.fromYear === null || searchDate.fromYear === '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _now = new Date();
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(_now.getFullYear(), parseInt(_toMonth), 0).getDate();
        let _toDate = _now.getFullYear() + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region 2017/__/__ -> ____/05/__		<-->		2017/01/01 <= filter <= 2017/05/31
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth === 'undefined' || searchDate.fromMonth === null || searchDate.fromMonth === '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromDate = _fromYear + '-01-01';
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_fromYear), parseInt(_toMonth), 0).getDate();
        let _toDate = _fromYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region 2017/05/__ -> ____/05/__		<-->		2017/05/01 <= filter <= 2017/05/31
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay === 'undefined' || searchDate.fromDay === null || searchDate.fromDay === '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDate = _fromYear + '-' + _fromMonth + '-01';
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = new Date(parseInt(_fromYear), parseInt(_toMonth), 0).getDate();
        let _toDate = _fromYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion

      //#region 2017/05/25 -> ____/05/__		<-->		2017/05/25 <= filter <= 2017/05/31
      if (
        (typeof searchDate.toYear === 'undefined' || searchDate.toYear === null || searchDate.toYear === '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay === 'undefined' || searchDate.toDay === null || searchDate.toDay === '') &&
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromMonth.substr(_fromDay.length - 2);

        let _lastDay = new Date(parseInt(_fromYear), parseInt(_fromMonth), 0).getDate();
        if (parseInt(_fromDay) > _lastDay) {
          _fromDay = _lastDay.toString();
          searchDate.fromDay = _fromDay;
        }

        let _fromDate = _fromYear + '-' + _fromMonth + '-' + _fromDay;
        fromDateFormControl.setValue(new Date(_fromDate));
      }
      //#endregion

      //#region 2017/05/25 -> 2017/05/31    <-->    2017/05/25 <= filter <= 2017/05/31
      if (
        (typeof searchDate.fromYear !== 'undefined' && searchDate.fromYear !== null && searchDate.fromYear !== '') &&
        (typeof searchDate.fromMonth !== 'undefined' && searchDate.fromMonth !== null && searchDate.fromMonth !== '') &&
        (typeof searchDate.fromDay !== 'undefined' && searchDate.fromDay !== null && searchDate.fromDay !== '') &&
        (typeof searchDate.toYear !== 'undefined' && searchDate.toYear !== null && searchDate.toYear !== '') &&
        (typeof searchDate.toMonth !== 'undefined' && searchDate.toMonth !== null && searchDate.toMonth !== '') &&
        (typeof searchDate.toDay !== 'undefined' && searchDate.toDay !== null && searchDate.toDay !== '')
      ) {
        let _fromYear = '000' + searchDate.fromYear;
        _fromYear = _fromYear.substr(_fromYear.length - 4);
        let _fromMonth = '0' + searchDate.fromMonth;
        _fromMonth = _fromMonth.substr(_fromMonth.length - 2);
        let _fromDay = '0' + searchDate.fromDay;
        _fromDay = _fromMonth.substr(_fromDay.length - 2);

        let _lastFromDay = new Date(parseInt(_fromYear), parseInt(_fromMonth), 0).getDate();
        if (parseInt(_fromDay) > _lastFromDay) {
          _fromDay = _lastFromDay.toString();
          searchDate.fromDay = _fromDay;
        }
        let _fromDate = _fromYear + '-' + _fromMonth + '-' + _fromDay;
        fromDateFormControl.setValue(new Date(_fromDate));

        let _toYear = '000' + searchDate.toYear;
        _toYear = _toYear.substr(_toYear.length - 4);
        let _toMonth = '0' + searchDate.toMonth;
        _toMonth = _toMonth.substr(_toMonth.length - 2);
        let _toDay = '0' + searchDate.toDay;
        _toDay = _toDay.substr(_toDay.length - 2);

        let _lastToDay = new Date(parseInt(_toYear), parseInt(_toMonth), 0).getDate();
        if (parseInt(_toDay) > _lastToDay) {
          _toDay = _lastToDay.toString();
          searchDate.toDay = _toDay;
        }
        let _toDate = _toYear + '-' + _toMonth + '-' + _toDay;
        toDateFormControl.setValue(new Date(_toDate));
      }
      //#endregion
    }
  }
}

export interface IHash {
  [details: string]: string
}