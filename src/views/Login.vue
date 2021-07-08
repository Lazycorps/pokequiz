<template>
  <amplify-authenticator>
    <amplify-sign-up
      slot="sign-up"
      username-alias="username"
      :form-fields.prop="formFields"
    ></amplify-sign-up>
  </amplify-authenticator>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import "@aws-amplify/ui-vue";
import { Hub, Logger } from 'aws-amplify';

export default defineComponent({
  setup() {
    const logger = new Logger('My-Logger');
    const formFields = [
      {
        type: "username",
        label: "Username *",
        placeholder: "Username",
        inputProps: { required: true, autocomplete: "username" },
      },
      {
        type: "email",
        label: "Email *",
        placeholder: "Email",
        inputProps: { required: true, autocomplete: "username" },
      },
      {
        type: "password",
        label: "Password *",
        placeholder: "Password",
        inputProps: { required: true, autocomplete: "new-password" },
      },
    ];
    
    const listener = (data: any) => {
        switch (data.payload.event) {
            case 'signIn':
                logger.info(data);
                break;
            case 'signUp':
                logger.info('user signed up');
                break;
            case 'signOut':
                logger.info('user signed out');
                break;
            case 'signIn_failure':
                logger.error('user sign in failed');
                break;
            case 'tokenRefresh':
                logger.info('token refresh succeeded');
                break;
            case 'tokenRefresh_failure':
                logger.error('token refresh failed');
                break;
            case 'configured':
                logger.info('the Auth module is configured');
        }
    }


    return {
      formFields,
    };
  },
});
</script>

<style scoped></style>
