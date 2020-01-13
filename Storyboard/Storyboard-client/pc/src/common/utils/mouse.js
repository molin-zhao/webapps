import { eventBus } from "./eventBus";
export default {
  mouseover(ref) {
    let refCpnt = this.$refs[ref];
    if (refCpnt && refCpnt.show) return refCpnt.show();
  },
  mouseleave(ref) {
    let refCpnt = this.$refs[ref];
    if (refCpnt && refCpnt.hide) return refCpnt.hide();
  },
  mouseclick(ref, event) {
    if (event) event.stopPropagation();
    let refCpnt = this.$refs[ref];
    if (refCpnt) {
      if (refCpnt.visible && refCpnt.hide) return refCpnt.hide();
      if (!refCpnt.visible && refCpnt.show) {
        eventBus.$emit("reset-visible-component");
        return refCpnt.show();
      }
    }
  },
  hide(ref) {
    let refCpnt = this.$refs[ref];
    if (refCpnt && refCpnt.visible && refCpnt.hide) return refCpnt.hide();
  },
  show(ref) {
    let refCpnt = this.$refs[ref];
    if (refCpnt && !refCpnt.visible && refCpnt.show) return refCpnt.show();
  }
};
