export type ITrip = {
  id: string;
  site: string;
  __typename: "Launch";
};

export type IMe = {
  me: {
    email: string;
    token: string;
    trips: ITrip[];
  };
};

export type IGetMeVariables = {};
