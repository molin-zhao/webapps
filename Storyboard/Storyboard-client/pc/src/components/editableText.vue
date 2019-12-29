<template>
  <div ref="editableText" class="wrapper">
    <span v-show="!editing" :style="computedTextLabelStyle">
      {{ computedValue }}</span
    >
    <div v-show="editing" class="input-wrapper">
      <input
        ref="input"
        v-if="row === 1"
        :placeholder="computedValue"
        v-model="inputValue"
        class="input"
        :style="fontStyle"
      />
      <textarea
        ref="input"
        v-else
        :placeholder="computedValue"
        v-model="inputValue"
        class="input"
        :style="fontStyle"
        :rows="row"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    },
    defaultValue: {
      type: String,
      required: true
    },
    row: {
      type: Number,
      default: 1
    },
    fontStyle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      editing: false,
      inputValue: this.$props.value
    };
  },
  computed: {
    computedValue() {
      if (this.inputValue) return this.inputValue;
      else if (this.$t(`${this.defaultValue}`))
        return this.$t(`${this.defaultValue}`);
      return this.defaultValue;
    },
    // computedTextLabelStyle() {
    //   return `display: block; width: 100%; text-align: left; ${this.fontStyle}`;
    // },
    computedTextLabelStyle() {
      if (this.row === 1) {
        // single line input
        return `width: 100%; 
        overflow: hidden; 
        text-align: left; 
        text-overflow: ellipsis; 
        white-space: nowrap; 
        ${this.fontStyle}`;
      } else {
        // multiple lines textarea
        return `width: 100%; 
        overflow: hidden; 
        text-align: left; 
        display: -webkit-box; 
        -webkit-box-orient: vertical; 
        -webkit-line-clamp: ${this.row}; 
        text-overflow: ellipsis; 
        word-wrap: break-word; 
        ${this.fontStyle}`;
      }
    }
  },
  created() {
    document.addEventListener("click", this.checkMouseClick);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.checkMouseClick);
  },
  methods: {
    checkMouseClick(event) {
      const e = event || window.event;
      let { type, target } = e;
      if (
        this.$refs["editableText"] &&
        this.$refs["editableText"].contains(target)
      ) {
        // click inside the wrapper, show textinput
        if (!this.editing) {
          // first time click, autofocus textinput
          this.editing = true;
          this.$nextTick(() => {
            if (this.$refs["input"] && this.$refs["input"].focus) {
              // autofocus
              this.$refs["input"].focus();
            }
          });
        }
      } else {
        if (this.editing) this.editing = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.input-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.input-value {
  display: block;
  word-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
}
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  flex-wrap: wrap;
  word-break: break-all;
  text-overflow: ellipsis;
}
.wrapper:hover {
  cursor: pointer;
}
.input {
  width: 100%;
  // height: 100%;
  background-color: none;
  display: block；;
  border-radius: 4px;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
