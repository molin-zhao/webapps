<template>
  <div class="register-wrapper">
    <form style="width: 26%">
      <div class="form-group form-left-centered">
        <label for="exampleInputEmail1">{{ $t("EMAIL_PHONE") }}</label>
        <div class="form-row" style="width: 100%; margin: 0; padding: 0">
          <ajax-input
            type="email"
            class="form-control"
            :style="
              computedInputStyle(
                emailOrPhoneError || computedAlreadyRegisterdError
              )
            "
            @on-change="checkEmailOrPhoneValue"
          />
        </div>
        <span
          v-if="computedAlreadyRegisterdError"
          class="form-text text-danger error-text"
          >{{ computedAlreadyRegisterdError
          }}<router-link
            :to="{
              name: 'login',
              params: { emailOrPhone: this.emailOrPhoneValue }
            }"
            >{{ this.$t("LOGIN_NOW") }}</router-link
          ></span
        >
        <span v-else class="form-text text-danger error-text">{{
          emailOrPhoneError
        }}</span>
      </div>
      <div class="form-group form-left-centered">
        <label>{{ $t("SMS_CODE") }}</label>
        <div class="form-row" style="width: 100%; margin: 0; padding: 0">
          <div class="form-row-div">
            <ajax-input
              type="text"
              class="form-control code-input"
              :style="`${codeError ? 'border-color:lightcoral' : null}`"
              @on-change="checkCodeError"
            />
            <input
              :disabled="computedCodeBtnDisabled"
              type="button"
              :value="computedBtnText"
              @click.stop="sendCode"
              class="input-group-append input-group-text code-btn"
              :style="`color: ${computedCodeBtnDisabled ? 'grey' : 'black'}`"
            />
          </div>
        </div>
        <span class="form-text text-danger error-text">{{ codeError }}</span>
      </div>
      <div class="form-group form-left-centered">
        <div class="form-group form-left-centered">
          <label>{{ $t("PASSWORD") }}</label>
          <div class="form-row-div">
            <ajax-input
              type="password"
              class="form-control"
              :style="computedInputStyle(passwordError)"
              @on-change="checkPasswordError"
            />
          </div>
          <span class="form-text text-danger error-text">{{
            passwordError
          }}</span>
          <label>{{ $t("CONFIRM_PASSWORD") }}</label>
          <div class="form-row-div">
            <ajax-input
              type="password"
              class="form-control"
              :style="computedInputStyle(confirmPasswordError)"
              @on-change="checkConfirmPasswordError"
            />
          </div>
          <span class="form-text text-danger error-text">{{
            confirmPasswordError
          }}</span>
        </div>
      </div>
    </form>
    <div style="width: 26%; margin-top: 30px;">
      <button
        :disabled="status === 'todo' ? false : true"
        type="submit"
        :class="computedRegisterBtnClass"
        @click="register"
      >
        <span
          v-show="status === 'doing'"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <span v-show="status === 'todo'">{{ $t("REGISTER") }}</span>
        <span v-show="status === 'done'">{{ `√${$t("REGISTERED")}` }}</span>
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
      sent: false,
      emailOrPhoneValue: "",
      passwordValue: "",
      codeValue: "",
      rememberMeValue: false,
      emailOrPhoneError: "",
      codeError: "",
      passwordError: "",
      confirmPasswordError: "",
      resendTimer: null,
      resendCount: 60,
      renderInterval: null,
      registeredEmailOrPhone: []
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
    computedCodeBtnDisabled() {
      const { sent, emailOrPhoneValue, emailOrPhoneError } = this;
      let disabled = sent || !emailOrPhoneValue || emailOrPhoneError;
      console.log(disabled);
      return disabled ? true : false;
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
      return disabled ? true : false;
    },
    computedRegisterBtnClass() {
      return `btn ${
        this.status === "done" ? "btn-success" : "btn-primary"
      } register-btn btn-center`;
    },
    computedAlreadyRegisterdError() {
      const { registeredEmailOrPhone, emailOrPhoneValue } = this;
      if (registeredEmailOrPhone.includes(emailOrPhoneValue)) {
        return this.$t("ALREADY_REGISTERED");
      }
      return "";
    }
  },
  methods: {
    changeLoginMode() {
      this.registerByPassword = !this.registerByPassword;
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
    checkConfirmPasswordError(val) {
      if (val && val !== this.passwordValue) {
        this.confirmPasswordError = this.$t("CONFIRM_PASSWORD_ERROR");
      } else {
        this.confirmPasswordError = "";
      }
    },
    register() {
      this.status = "doing";
      this.registerTimer = setTimeout(() => {
        this.status = "todo";
        this.registeredEmailOrPhone.push("844973523@qq.com");
        clearTimeout(this.registerTimer);
      }, 3000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/container.css";
.register-wrapper {
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
.register-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
}
.register-method-label {
  font-size: 14px;
  font-style: oblique;
  text-decoration: underline;
}
.code-input {
  width: 60%;
}
.code-btn {
  width: calc(40% - 4px);
  margin-left: 4px;
  height: 100%;
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
