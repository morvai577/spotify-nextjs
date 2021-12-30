import React from "react";
import AuthForm from "../../components/authForm";

export default {
  title: "Components/AuthForm",
  component: AuthForm,
  args: {
    mode: "signup",
  },
};

export const AuthFormComponent = (args) => <AuthForm {...args} />;

AuthFormComponent.args = { mode: "signup" };
