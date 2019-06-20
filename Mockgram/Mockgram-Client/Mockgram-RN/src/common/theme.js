import window from "../utils/getDeviceInfo";
export default (theme = {
  primaryColor: "#eb765a",
  primaryBlue: "#4696ec",
  primaryGrey: "#f8f8fa",
  primaryGreen: "#28a745",
  primaryWarning: "#ffc107",
  primaryDanger: "#dc3545",
  iconSm: window.height * 0.02,
  iconMd: window.height * 0.03,
  iconLg: window.height * 0.04,
  indicatorSm: window.width * 0.05,
  indicatorMd: window.width * 0.08,
  indicatorLg: window.width * 0.1,
  paddingToWindow: 10,
  inputHeight: Math.floor(window.height * 0.05),
  marginTop: Math.floor(window.height * 0.03),
  headerIconMargin: 20
});
