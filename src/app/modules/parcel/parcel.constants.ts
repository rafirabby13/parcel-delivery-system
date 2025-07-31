import { Parcel_Status } from "./parcel.interface";


export const VALID_STATUS_TRANSITIONS: Record<Parcel_Status, Parcel_Status[]> = {
  [Parcel_Status.REQUESTED]: [Parcel_Status.APPROVED, Parcel_Status.CANCELLED],
  [Parcel_Status.APPROVED]: [Parcel_Status.PICKED_UP, Parcel_Status.CANCELLED],
  [Parcel_Status.PICKED_UP]: [Parcel_Status.IN_TRANSIT, Parcel_Status.CANCELLED],
  [Parcel_Status.IN_TRANSIT]: [
    Parcel_Status.DELIVERED,
    Parcel_Status.CANCELLED,
    Parcel_Status.BLOCKED,
    Parcel_Status.RETURNED,
    Parcel_Status.RESCHEDULED
  ],
  [Parcel_Status.RESCHEDULED]: [Parcel_Status.IN_TRANSIT, Parcel_Status.CANCELLED],
  [Parcel_Status.BLOCKED]: [Parcel_Status.RESCHEDULED, Parcel_Status.RETURNED],
  [Parcel_Status.RETURNED]: [], // Terminal
  [Parcel_Status.DELIVERED]: [], // Terminal
  [Parcel_Status.CANCELLED]: [] // Terminal
};
