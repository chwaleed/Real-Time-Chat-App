import { render } from "@testing-library/react";
import Message from "./index";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/socketContext";
import { vi } from "vitest";

// Mock the hooks
vi.mock("@/store", () => ({
  useAppStore: vi.fn(),
}));
vi.mock("@/context/socketContext", () => ({
  useSocket: vi.fn(),
}));
vi.mock("react-intersection-observer", () => ({
  useInView: vi.fn(() => ({ ref: null, inView: false })),
}));

describe("Message", () => {
  it("should render the message content", () => {
    const message = {
      _id: "1",
      sender: "user1",
      content: "Hello, world!",
      timestamp: new Date().toISOString(),
      status: "sent",
    };
    useAppStore.mockReturnValue({
      userInfo: { id: "user2" },
      selectedChatData: { _id: "user1", email: "test@example.com" },
    });
    useSocket.mockReturnValue({ current: { emit: vi.fn() } });

    const { getByText } = render(<Message message={message} />);

    expect(getByText("Hello, world!")).toBeInTheDocument();
  });
});
