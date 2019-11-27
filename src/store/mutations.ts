import { State } from "./interface";
export const mutations = {
  SUMBOUNS(state: State, num: number) {
    state.userData.sumBonus = num;
  }
};
