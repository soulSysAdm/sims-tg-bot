import {
  getLowerCase,
  getValidateNumber,
  getValidateString,
} from '../../assets/validateData'
import {
  BEST_BEFORE_DATE_KEY,
  DATE_KEY,
  NO_NUMBERS_BY_MONTH,
  NUMBER_VALID_KEY,
  PHONE_NUMBER_KEY,
} from '../../constants'
import {
  AllTelegramMessages,
  DataByMonth,
  FilteredNumberRow,
  NumberRowWithDate,
  TelegramMessages,
} from '../../types'
import {
  getDataByMonth,
  getDateByUnknownFormat,
  getMonthYearLabel,
} from '../../assets/dateFormat'
import type { SheetObject } from '../../types'
import { validKeys } from '../../globals'

/**
 * Тип строки, которая содержит оба ключа
 */

/**
 * Проверка, что объект имеет нужные поля
 */
function isFilteredRow(obj: unknown): obj is FilteredNumberRow {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    PHONE_NUMBER_KEY in obj &&
    BEST_BEFORE_DATE_KEY in obj &&
    typeof (obj as any)[PHONE_NUMBER_KEY] === 'string' &&
    typeof (obj as any)[BEST_BEFORE_DATE_KEY] === 'string'
  )
}

/**
 * Фильтрует массив, оставляя только валидные строки
 */
const getSheetByNumber = (data?: unknown[]): FilteredNumberRow[] => {
  return data
    .filter((item) => getValidateNumber(item[PHONE_NUMBER_KEY]))
    .map((item: FilteredNumberRow) => ({
      [PHONE_NUMBER_KEY]: getValidateNumber(item[PHONE_NUMBER_KEY]) + '',
      [BEST_BEFORE_DATE_KEY]: getValidateString(
        item[BEST_BEFORE_DATE_KEY],
      ).trim(),
      [NUMBER_VALID_KEY]: getValidateString(item[NUMBER_VALID_KEY]).trim(),
    }))
}

const isEmptyItemValid = (value: string): boolean => {
  const lowerValue = getLowerCase(value)
  for (const key of validKeys) {
    if (lowerValue === getLowerCase(key)) return false
  }
  return true
}

const isEmptyItemDate = (value: string): boolean => {
  const lowerValue = getLowerCase(value)
  return lowerValue.length < 10
}

const getSheetByEmptyBeforeDateOrNumberValid = (
  data?: FilteredNumberRow[],
): FilteredNumberRow[] => {
  return data.filter(
    (item) =>
      isEmptyItemDate(item[BEST_BEFORE_DATE_KEY]) ||
      isEmptyItemValid(item[NUMBER_VALID_KEY]),
  )
}

const getSheetByAllDataWithDate = (
  data?: FilteredNumberRow[],
): NumberRowWithDate[] => {
  return data
    .filter(
      (item) =>
        !isEmptyItemDate(item[BEST_BEFORE_DATE_KEY]) &&
        !isEmptyItemValid(item[NUMBER_VALID_KEY]),
    )
    .map((item) => {
      return {
        ...item,
        [DATE_KEY]: getDateByUnknownFormat(item[BEST_BEFORE_DATE_KEY]),
      }
    })
}

const getSheetByAllData = (data?: FilteredNumberRow[]): FilteredNumberRow[] => {
  return data.filter(
    (item) =>
      !isEmptyItemDate(item[BEST_BEFORE_DATE_KEY]) &&
      !isEmptyItemValid(item[NUMBER_VALID_KEY]),
  )
}

const getSheetByNextThreeMonth = (data: NumberRowWithDate[]): DataByMonth[] => {
  const currentMonth: DataByMonth = {
    title: `${getMonthYearLabel(0)} (Текущий месяц)\n\n`,
    data: getDataByMonth(data, 0),
  }
  const nextMonth: DataByMonth = {
    title: `${getMonthYearLabel(1)} (Через 1 месяц)\n\n`,
    data: getDataByMonth(data, 1),
  }
  const inTwoMonths: DataByMonth = {
    title: `${getMonthYearLabel(2)} (Через 2 месяца)\n\n`,
    data: getDataByMonth(data, 2),
  }
  const inThreeMonths: DataByMonth = {
    title: `${getMonthYearLabel(3)} (Через 3 месяца)\n\n`,
    data: getDataByMonth(data, 3),
  }
  return [currentMonth, nextMonth, inTwoMonths, inThreeMonths]
}

const getMessageByType = (data: NumberRowWithDate[]): string => {
  let message = ''
  validKeys.forEach((key) => {
    const filteredData = data.filter(
      (item) => getLowerCase(item[NUMBER_VALID_KEY]) === getLowerCase(key),
    )
    if (filteredData.length) {
      message += `"${key}" тип:\n`
      filteredData.forEach((dataNumber) => {
        message += dataNumber[PHONE_NUMBER_KEY] + '\n'
      })
    }
  })
  return message
}

const getValidateMessages = (data: DataByMonth[]): TelegramMessages => {
  const result = []
  data.forEach((item) => {
    let message = ''
    message += item.title
    if (!item.data.length) {
      message += NO_NUMBERS_BY_MONTH
    } else {
      message += getMessageByType(item.data)
    }
    result.push(message)
  })
  return result
}

const getUnValidateMessages = (data: FilteredNumberRow[]): TelegramMessages => {
  const result = []
  let message = `Проблемные номера: \n\n`
  if (data.length) {
    data.forEach((item) => {
      message += `${PHONE_NUMBER_KEY}: ${item[PHONE_NUMBER_KEY]} | ${BEST_BEFORE_DATE_KEY}: ${item[BEST_BEFORE_DATE_KEY] || '-'} |${NUMBER_VALID_KEY}: ${item[NUMBER_VALID_KEY] || '-'} \n`
    })
    result.push(message)
  } else {
    message += NO_NUMBERS_BY_MONTH
  }

  return result
}

export const getTelegramMessages = (
  dataSheet: SheetObject[],
): AllTelegramMessages => {
  const dataSheetNumber = getSheetByNumber(dataSheet)
  const dataByEmptyBeforeDateNumberValid =
    getSheetByEmptyBeforeDateOrNumberValid(dataSheetNumber)
  const dataByValid = getSheetByAllData(dataSheetNumber)
  const dataByValidDataWithDate = getSheetByAllDataWithDate(dataByValid)
  const dataByMonths = getSheetByNextThreeMonth(dataByValidDataWithDate)

  return {
    validMessages: getValidateMessages(dataByMonths),
    unValidMessages: getUnValidateMessages(dataByEmptyBeforeDateNumberValid),
  }
}
