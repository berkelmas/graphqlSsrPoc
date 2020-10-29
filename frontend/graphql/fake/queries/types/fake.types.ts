export type IFake = {
  item: string;
  orderer: string;
  orderDate: string;
};

export type IGetFake = {
  orders: IFake[];
};

export type IGetFakeVariables = {
  pageIndex: number;
  pageSize: number;
};
