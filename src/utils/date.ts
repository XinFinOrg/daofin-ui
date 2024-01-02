import { format, formatDistance } from "date-fns";

const DEFAULT_FORMAT = "MMM do, yyyy - h:mm aa";
export const toStandardTimestamp = (solidityTimestamp: number | string) =>
  (typeof solidityTimestamp === "string"
    ? parseInt(solidityTimestamp)
    : solidityTimestamp) * 1000;

export const toNormalDate = (solidityTimestamp: number | string) =>
  new Date(toStandardTimestamp(solidityTimestamp));

export const toStandardFormatString = (date: Date) =>
  format(date, DEFAULT_FORMAT);

export const timestampToStandardFormatString = (
  solidityTimestamp: number | string
) => format(toStandardTimestamp(solidityTimestamp), DEFAULT_FORMAT);

export const expirationDistance = (from: Date, to: Date) =>
  formatDistance(from, to, { includeSeconds: true });
