import type { Meta, StoryObj } from "@storybook/nextjs";

import ExampleEntityForm from "@/features/example-entity/components/example-entity-form";

const meta = {
  title: "Features/ExampleEntity/ExampleEntityForm",
  component: ExampleEntityForm,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ExampleEntityForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {
  args: {
    mode: "create",
  },
};

export const Edit: Story = {
  args: {
    mode: "edit",
    id: "entity_1",
    defaultValues: {
      title: "Example entity title",
      body: "Example entity body content",
    },
  },
};
