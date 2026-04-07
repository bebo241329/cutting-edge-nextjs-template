import type { Meta, StoryObj } from "@storybook/nextjs";

import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";

const meta = {
  title: "Features/Auth/ForgotPasswordForm",
  component: ForgotPasswordForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ForgotPasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
