import { makeVar } from "@apollo/client";

export type IUserInfo = {
  email: string | null;
  fullName: string | null;
};

export const userInfo = makeVar<IUserInfo>({
  email: "Berkelmas",
  fullName: null,
});
