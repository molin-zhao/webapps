import { projects } from "../../mock/task";
const state = {
  projects: [],
  id: null,
  token: null
};
const getters = {
  get_projects: state => state.projects
};
const actions = {
  fetch_projects: async ({ commit }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit("reload_projects", projects);
        return resolve("good");
      }, 3000);
    });
  }
};
const mutations = {
  add_projects(state, payload) {
    state.projects = state.projects.concat(payload);
  },
  reload_projects(state, payload) {
    state.projects = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
