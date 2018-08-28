<template>
    <div class="options">
      <slot></slot>
    </div>
</template>
<script>
export default {
  // selection for single choice or multi-choice
  // options should be in the following format
  // at least contains a field called 'checked : true or false'
  // id should start from 0, it will be easy to access it using options[]
  /*

  options: [
      {
          id: 0,
          ...
          some data,
          ...
          checked: true
      },
      {
          id:  1,
          ...
          some data,
          ...
          checked: false
      },
      {
          id: 2,
          ...
          some data,
          ...
          checked: true
      },
      ...
  ]

  */
  props: ["options", "selection"],
  methods: {
    choiceManager: function(option) {
      let id = option.id;
      var i = this.options.length;
      let checkStatus = option.checked;
      if (this.selection === "single") {
        while (i--) {
          this.options[i].checked = false;
        }
        if (checkStatus === false) {
          this.options[id].checked = true;
        }
      } else if (this.selection === "single_notnull") {
        if (checkStatus === false) {
          while (i--) {
            this.options[i].checked = false;
          }
          this.options[id].checked = true;
        }
      } else {
        this.options[id].checked = !this.options[id].checked;
      }
    }
  }
};
</script>
<style lang="scss">
.options {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>