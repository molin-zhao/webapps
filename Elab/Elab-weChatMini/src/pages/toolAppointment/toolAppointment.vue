<template>
  <div class="container">
    <div class="search-bar">
      <search-bar-component holder="搜索实验器材" :options=options></search-bar-component>
    </div>
    <div class="toolList">
      <tool-appointment-component :key='tool.id' v-for='tool in tools' :tool='tool'></tool-appointment-component>
    </div>
  </div>
</template>
<script>
import searchBarComponent from '@/components/SearchBar'
import toolAppointmentComponent from '@/components/EquipmentReservation'
export default {
  components: {
    searchBarComponent,
    toolAppointmentComponent
  },
  data () {
    return {
      // test data
      options: {
        option: ['共享', '独享']
      },
      tools: [
        {
          id: 0,
          image: '/static/images/dzc.png',
          status: 0,
          title: '电子秤 物理生物化学专用实验器材',
          appointment: '2018.07.03-2018.07.05',
          badge: ''
        },
        {
          id: 1,
          image: '/static/images/dzc.png',
          status: 1,
          title: '光具座 含附件盒 凹透镜光屏 物理器材',
          appointment: '2018.07.03-2018.07.05',
          badge: '共享槽位5个'
        },
        {
          id: 2,
          image: '/static/images/dzc.png',
          status: 1,
          title: 'DNA双螺旋结构模型组件',
          appointment: '',
          badge: ''
        },
        {
          id: 3,
          image: '/static/images/dzc.png',
          status: 0,
          title: '电子秤 物理生物化学专用实验器材',
          appointment: '2018.07.10-2018.07.15',
          badge: ''
        },
        {
          id: 4,
          image: '/static/images/dzc.png',
          status: 1,
          title: '电子秤 物理生物化学专用实验器材',
          appointment: '2018.07.03-2018.07.05',
          badge: ''
        }
      ]
    }
  }
}
</script>
<style lang="scss">
.search-bar {
  width: 100%;
}
.toolList {
  margin-top: 40rpx;
}
</style>


