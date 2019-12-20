export default {
  mouseover(ref) {
    let refCpnt = this.$refs[ref];
    if (refCpnt && refCpnt.show) return refCpnt.show();
  },
  mouseleave(ref) {
    let refCpnt = this.$refs[ref];
    if (refCpnt && refCpnt.hide) return refCpnt.hide();
  },
  mouseclick(ref) {
    let refCpnt = this.$refs[ref];
    if (refCpnt) {
      if (refCpnt.visible && refCpnt.hide) return refCpnt.hide();
      if (!refCpnt.visible && refCpnt.show) return refCpnt.show();
    }
  }
};
