import { ILaunch } from "../../../launches/queries/types/launces.types";

export type IAddTripData = {
  bookTrips: {
    message: string;
    success: boolean;
    launches: ILaunch[];
  };
};

export type IAddTripVariables = {
  launchIds: string[];
};
