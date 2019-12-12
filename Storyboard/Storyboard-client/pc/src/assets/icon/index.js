import Vue from 'vue'
import icon from '@/components/icon'// svg组件

// register globally
Vue.component('icon', icon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)