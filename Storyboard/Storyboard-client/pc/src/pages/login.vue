<template>
  <div class="login-wrapper">
    <form style="width: 26%">
      <div class="form-group form-left-centered">
        <label for="exampleInputEmail1">{{ $t("EMAIL_PHONE") }}</label>
        <div class="form-row" style="width: 100%; margin: 0; padding: 0">
          <ajax-input
            type="email"
            class="form-control"
            :style="computedInputStyle(emailOrPhoneError)"
            :init-value="computedInitEmailOrPhoneValue"
            @on-change="checkEmailOrPhoneValue"
          />
        </div>
        <span class="form-text text-danger error-text">{{
          emailOrPhoneError
        }}</span>
      </div>
      <div class="form-group form-left-centered">
        <label v-if="loginByPassword">{{ $t("PASSWORD") }}</label>
        <label v-else>{{ $t("SMS_CODE") }}</label>
        <div class="form-row" style="width: 100%; margin: 0; padding: 0">
          <div v-if="loginByPassword" class="form-row-div">
            <ajax-input
              type="password"
              class="form-control"
              :style="computedInputStyle(passwordError)"
              @on-change="checkPasswordError"
            />
          </div>
          <div v-else class="form-row-div">
            <ajax-input
              type="text"
              class="form-control code-input"
              :style="`${codeError ? 'border-color:lightcoral' : null}`"
              @on-change="checkCodeError"
            />
            <input
              :disabled="computedBtnDisabled"
              type="button"
              :value="computedBtnText"
              @click.stop="sendCode"
              class="input-group-append input-group-text code-btn"
              :style="`color: ${computedBtnDisabled ? 'grey' : 'black'}`"
            />
          </div>
        </div>
        <span v-if="loginByPassword" class="form-text text-danger error-text">{{
          passwordError
        }}</span>
        <span v-else class="form-text text-danger error-text">{{
          codeError
        }}</span>
      </div>
      <div class="form-group form-check form-space-between">
        <div class="form-group">
          <input
            type="checkbox"
            class="form-check-input"
            v-model="rememberMeValue"
          />
          <label class="form-check-label">{{ $t("REMEMBER_ME") }}</label>
        </div>
        <div
          class="form-group"
          style="cursor: pointer"
          @click.stop="changeLoginMode"
        >
          <span
            class="login-method-label text-primary"
            v-if="!loginByPassword"
            >{{ $t("LOGIN_PASSWORD") }}</span
          >
          <span class="login-method-label text-primary" v-else>{{
            $t("LOGIN_SMS")
          }}</span>
        </div>
      </div>
    </form>
    <div style="width: 26%; margin-top: 30px;">
      <button
        :disabled="status === 'todo' ? false : true"
        type="submit"
        :class="computedLoginBtnClass"
        @click="login"
      >
        <span
          v-show="status === 'doing'"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <span v-show="status === 'todo'">{{ $t("LOGIN") }}</span>
        <span v-show="status === 'done'">{{ `√${$t("LOGGEDIN")}` }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { isEmailOrPhone, isCode, isPassword } from "@/common/utils/form";
import ajaxInput from "@/components/ajaxInput";
export default {
  components: {
    ajaxInput
  },
  data() {
    return {
      status: "todo",
      loginByPassword: true,
      sent: false,
      emailOrPhoneValue: "",
      passwordValue: "",
      codeValue: "",
      rememberMeValue: false,
      emailOrPhoneError: "",
      codeError: "",
      passwordError: "",
      resendTimer: null,
      resendCount: 60,
      renderInterval: null
    };
  },
  computed: {
    computedInputStyle() {
      return function(error) {
        return `width: 100%; ${error ? "border-color: lightcoral" : null}`;
      };
    },
    computedBtnText() {
      if (this.sent) return `${this.$t("RESEND_CODE")}(${this.resendCount}s)`;
      else return `${this.$t("SEND_CODE")}`;
    },
    computedBtnDisabled() {
      const {
        sent,
        emailOrPhoneError,
        codeError,
        emailOrPhoneValue,
        codeValue
      } = this;
      let disabled =
        sent ||
        !emailOrPhoneValue ||
        emailOrPhoneError ||
        !codeValue ||
        codeError;
      if (disabled) return true;
      return false;
    },
    computedLoginBtnClass() {
      return `btn ${
        this.status === "done" ? "btn-success" : "btn-primary"
      } login-btn btn-center`;
    },
    computedInitEmailOrPhoneValue() {
      if (this.$route.params.emailOrPhone)
        return this.$route.params.emailOrPhone;
      return "";
    }
  },
  methods: {
    changeLoginMode() {
      this.loginByPassword = !this.loginByPassword;
    },
    sendCode() {
      this.sent = true;
      this.resendTimer = setTimeout(() => {
        this.sent = false;
        this.resendCount = 60;
        clearTimeout(this.resendTimer);
        clearInterval(this.renderInterval);
      }, 10000);
      this.renderInterval = setInterval(() => {
        if (this.resendCount > 0) this.resendCount--;
      }, 1000);
    },
    checkEmailOrPhoneValue(val) {
      this.emailOrPhoneValue = val;
      this.emailOrPhoneError = isEmailOrPhone(
        this.emailOrPhoneValue,
        this.$t("EMAIL_PHONE_ERROR")
      );
    },
    checkCodeError(val) {
      this.codeValue = val;
      this.codeError = isCode(this.codeValue, this.$t("CODE_ERROR"));
    },
    checkPasswordError(val) {
      this.passwordValue = val;
      this.passwordError = isPassword(
        this.passwordValue,
        this.$t("PASSWORD_ERROR")
      );
    },
    login() {
      this.status = "doing";
      this.loginTimer = setTimeout(() => {
        this.status = "done";
        clearTimeout(this.loginTimer);
      }, 3000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/container.css";
.login-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.form-left-centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

.form-space-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.form-row-div {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.login-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
}
.login-method-label {
  font-size: 14px;
  font-style: oblique;
  text-decoration: underline;
}
.code-input {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  width: 60%;
}
.code-btn {
  width: calc(40% - 1px);
  margin-left: 1px;
  height: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}
.code-btn:active {
  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
}
.code-btn:focus {
  outline: none;
}
.error-text {
  font-size: 14px;
  line-height: 14px;
  min-height: 28px;
  max-width: 100%;
}
</style>
