<template>
  <div class="member-wrapper" @click.stop="memberOnClick">
    <img
      v-for="(member, index) in computedMember"
      :key="member.id"
      :src="member.avatar"
      class="member-avatar"
      :style="computedStyle(index)"
    />
  </div>
</template>

<script>
export default {
  props: {
    member: {
      type: Array,
      default: []
    },
    displayNumber: {
      type: Number,
      default: 3
    }
  },
  computed: {
    computedMember() {
      if (this.member.length > this.displayNumber) {
        return this.member.slice(0, this.displayNumber);
      } else {
        return this.member;
      }
    },
    computedStyle() {
      return function(index) {
        let length = this.member.length;
        let zIndex = `z-index: ${length - index}`;
        if (index > 0) {
          return `${zIndex}; margin-left: -10px`;
        }
        return `${zIndex};`;
      };
    }
  },
  methods: {
    memberOnClick() {
      this.$confirm.show({
        title: "hello",
        message: "Hello, world! This is a toast message",
        // interval: 5000
        confirmLabel: "HELLO",
        cancelLabel: "WORLD",
        success: function() {
          console.log(this);
          console.log("confirm");
        },
        fail: function() {
          console.log(this);
          console.log("cancel");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.member-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: whitesmoke;
  .member-avatar {
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius: 15px;
  }
}
</style>
