import { makeVar } from "@apollo/client";

export type IAddedLaunch = {
  id: string;
};

export const addedLaunches = makeVar<IAddedLaunch[]>([]);
