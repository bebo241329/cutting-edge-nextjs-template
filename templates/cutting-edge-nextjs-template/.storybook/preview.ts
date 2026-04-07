import { createElement } from "react";
import type { Preview } from "@storybook/react";
import "../app/globals.css";

import TanStackQueryProvider from "@/providers/tanstack-query-provider";

const preview: Preview = {
  decorators: [
    (Story) =>
      createElement(
        TanStackQueryProvider,
        undefined,
        createElement(Story)
      ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
