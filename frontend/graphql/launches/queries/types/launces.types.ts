export type ILaunch = {
  id: string;
  site: string;
  __typename: "Launch";
};

export type IGetLaunches = {
  launches: {
    cursor: string;
    hasMore: boolean;
    launches: ILaunch[];
  };
};

export type IGetLaunchesVariables = {
  pageSize: number;
  after: string | null;
};
