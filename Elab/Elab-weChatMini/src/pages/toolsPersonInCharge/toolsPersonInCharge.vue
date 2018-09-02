<template>
  <div class="container">
    <div class="bg">
      <toolCardComponent v-for="(item, index) in items" :key="index" :item="item" :deleteFn="deleteFn" :editFn="editFn"></toolCardComponent>
    </div>
  </div>
</template>
<script>
import toolCardComponent from '@/components/EquipmentCard'
export default {
  components: {
    toolCardComponent
  },
  data () {
    return {
      items: [
        {
          id: 0,
          image: '/static/images/xwj.png',
          name: '电子秤 1000g 物理生物化学专用实验器材',
          displayName: '电子秤',
          status: 'open',
          person: {
            status: 'pending',
            name: '张雅'
          }
        },
        {
          id: 1,
          image: '/static/images/xwj.png',
          name: '电子秤 1000g 物理生物化学专用实验器材',
          displayName: '物理电子秤',
          status: 'closed',
          person: {
            status: 'active',
            name: '侯小刚'
          }
        },
        {
          id: 2,
          image: '/static/images/xwj.png',
          name: '电子秤 1000g 物理生物化学专用实验器材',
          displayName: '生物电子秤',
          status: 'closed',
          person: {
            status: 'active',
            name: '毛子'
          }
        },
        {
          id: 3,
          image: '/static/images/xwj.png',
          name: '电子秤 1000g 物理生物化学专用实验器材',
          displayName: '化学',
          status: 'open',
          person: {
            status: 'pending',
            name: '魏璎珞'
          }
        }
      ]
    }
  },
  methods: {
    editFn: function (item) {
      wx.navigateTo({
        url: `/pages/editPersonInCharge/main?id=${item.id}&displayName=${
          item.displayName
        }`
      })
    },
    deleteFn: function (item) {
      console.log('删除: ' + item.name)
    }
  }
}
</script>
<style lang="scss">
.bg {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(248, 248, 248, 1);
}
</style>


