<template>
  <div class="test-wrapper">
    <div class="btn-group">
      <button @click="add" style="width: 20%; height: 80%">添加</button>
      <button @click="del" style="width: 20%; height: 80%">删除</button>
    </div>
    <test-item
      @del="delWithIndex"
      :item="item"
      v-for="item in data_array"
      :key="item"
    />
  </div>
</template>

<script>
import testItem from "@/components/testItem";
export default {
  components: {
    testItem
  },
  data() {
    return {
      data_array: [1, 2, 3, 4, 5]
    };
  },
  methods: {
    add() {
      let lastEl = this.data_array[this.data_array.length - 1];
      this.data_array.push(lastEl + 1);
    },
    del() {
      this.data_array.pop();
    },
    delWithIndex(item) {
      this.data_array.splice(this.data_array.indexOf(item), 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.test-wrapper {
  width: 100%;
  height: 100%;
  background-color: lightblue;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.btn-group {
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
</style>
