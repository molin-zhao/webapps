<template>
    <transition-group tag="div" class="container">
  <div class="item" v-for="item in items" :key="item.key" :style="{background:item.color,width:'80px',height:'80px'}"
    draggable="true"
  @dragstart="handleDragStart($event, item)"
    @dragover.prevent="handleDragOver($event, item)"
    @dragenter="handleDragEnter($event, item)" 
    @dragend="handleDragEnd($event, item)" >
  </div>
</transition-group>
</template>
<script>
export default {
 name: 'Toolbar',
 data () {
  return {
   items: [
    { key: 1, color: '#ffebcc'},
    { key: 2, color: '#ffb86c'},
    { key: 3, color: '#f01b2d'}
   ],
    
    dragging: null
  }
 },
 methods:{
  handleDragStart(e,item){
    this.dragging = item;
  },
  handleDragEnd(e,item){
    this.dragging = null
  },
  //首先把div变成可以放置的元素，即重写dragenter/dragover
  handleDragOver(e) {
    e.dataTransfer.dropEffect = 'move'// e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
  },
  handleDragEnter(e,item){
    e.dataTransfer.effectAllowed = "move"//为需要移动的元素设置dragstart事件
    if(item === this.dragging){
      return
    }
    const newItems = [...this.items]
    console.log(newItems)
    const src = newItems.indexOf(this.dragging)
    const dst = newItems.indexOf(item)
 
    newItems.splice(dst, 0, ...newItems.splice(src, 1))
 
    this.items = newItems
  }
 }
}
</script>
 
<style scoped>
  .container{
    width: 80px;
    height: 300px;
    position: absolute;
    left: 0;
    display:flex;
    flex-direction: column;
    padding: 0;
  }
  .item {
   margin-top: 10px;
   transition: all linear .3s
  }