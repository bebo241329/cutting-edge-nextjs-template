import type { Meta, StoryObj } from "@storybook/nextjs";

import RegisterForm from "@/features/auth/components/register-form";

const meta = {
  title: "Features/Auth/RegisterForm",
  component: RegisterForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
