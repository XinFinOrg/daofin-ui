// import { format } from "date-fns-tz";
import { ProposalStatus } from "./types";
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

export const toDate = (timestamp: number | string) => new Date(timestamp);
export const dateNow = () => new Date(Date.now());

export const expirationDistance = (from: Date, to: Date) =>
  appFormatDistance(from, to);

export const appFormatDistance = (from: Date, to: Date) =>
  formatDistance(from, to, { includeSeconds: true });

export const proposalTimeStatus = (startDate: Date, endDate: Date) => {
  const now = new Date(Date.now());

  if (now > startDate && now < endDate) {
    return ProposalStatus.RUNNING;
  }
  if (now < startDate && now < endDate) {
    return ProposalStatus.NOT_STARTED;
  }
  if (
    now > startDate &&
    now > endDate &&
    now.getTime() < endDate.getTime() + 10 * 60 * 1000
  ) {
    return ProposalStatus.QUEUED;
  }

  return ProposalStatus.EXPIRED;
};
export const proposalStatus = (
  startDate: Date,
  endDate: Date,
  executed: boolean,
  canExecute: boolean
) => {
  const now = new Date(Date.now());

  if (now > startDate && now < endDate) {
    return ProposalStatus.RUNNING;
  }
  if (now < startDate && now < endDate) {
    return ProposalStatus.NOT_STARTED;
  }
  if (
    now > startDate &&
    now > endDate &&
    now.getTime() < endDate.getTime() + 10 * 60 * 1000
  ) {
    return ProposalStatus.QUEUED;
  }
  if (
    now > startDate &&
    now > endDate &&
    now.getTime() > endDate.getTime() + 10 * 60 * 1000
  ) {
    if (executed) {
      return ProposalStatus.EXECUTED;
    }
    if (!executed && canExecute) {
      return ProposalStatus.READY_TO_EXECUTE;
    }
  }
  return ProposalStatus.EXPIRED;
};
