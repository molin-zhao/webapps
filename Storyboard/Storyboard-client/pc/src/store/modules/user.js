import {projects} from '../../mock/task';
const state = {
    projects: []
}
const getters = {
    getProjects: state => state.projects
}
const actions = {}
const mutations = {
    add_project(state, payload){
        state.projects = state.project.concat(payload)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}