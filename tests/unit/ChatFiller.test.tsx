import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ChatFiller } from "@/components/ChatFiller";
import { SAMPLES } from "@/frameworks";
import type { Eisenhower, FrameworkResult } from "@/frameworks";

const baseData = SAMPLES.eisenhower as Eisenhower;

type TurnBody = {
  reply: string;
  updatedData: FrameworkResult | null;
  done: boolean;
};

function mockResponses(...turns: TurnBody[]) {
  const queue = [...turns];
  const fn: typeof globalThis.fetch = async () => {
    const next = queue.shift();
    if (!next) throw new Error("ChatFiller fetch called more times than expected");
    return new Response(JSON.stringify(next), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  return vi.fn(fn);
}

describe("<ChatFiller />", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("kicks off the conversation on mount and renders the first assistant message", async () => {
    const fetchMock = mockResponses({
      reply: "What's the most urgent thing on your plate this week?",
      updatedData: null,
      done: false,
    });
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    render(
      <ChatFiller
        frameworkId="eisenhower"
        frameworkName="Eisenhower Matrix"
        decisionText="my chaotic week"
        data={baseData}
        onUpdate={() => {}}
        onClose={() => {}}
      />,
    );

    expect(await screen.findByText(/most urgent thing/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const firstCall = fetchMock.mock.calls[0]!;
    const body = JSON.parse((firstCall[1] as RequestInit).body as string);
    expect(body.kickoff).toBe(true);
    expect(body.frameworkId).toBe("eisenhower");
    expect(body.messages).toEqual([]);
  });

  it("sends the user's reply, applies updatedData, and shows the 'framework updated' tag", async () => {
    const patched: FrameworkResult = {
      ...baseData,
      tasks: [
        ...baseData.tasks,
        { text: "Ship investor update", urgent: true, important: true },
      ],
    };
    const fetchMock = mockResponses(
      { reply: "What's pressing?", updatedData: null, done: false },
      { reply: "Got it — added the investor update.", updatedData: patched, done: false },
    );
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    const onUpdate = vi.fn();
    render(
      <ChatFiller
        frameworkId="eisenhower"
        frameworkName="Eisenhower Matrix"
        decisionText="my chaotic week"
        data={baseData}
        onUpdate={onUpdate}
        onClose={() => {}}
      />,
    );

    await screen.findByText(/What's pressing\?/i);

    const textarea = screen.getByPlaceholderText(/Type your answer/i);
    fireEvent.change(textarea, { target: { value: "Ship the investor update tomorrow" } });
    fireEvent.click(screen.getByRole("button", { name: /Send/i }));

    expect(await screen.findByText(/added the investor update/i)).toBeInTheDocument();
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate.mock.calls[0]![0]).toEqual(patched);
    expect(screen.getByText(/framework updated/i)).toBeInTheDocument();

    // Second turn POST carries the user's message + kickoff=false.
    const secondBody = JSON.parse((fetchMock.mock.calls[1]![1] as RequestInit).body as string);
    expect(secondBody.kickoff).toBe(false);
    expect(secondBody.messages).toEqual([
      { role: "assistant", content: "What's pressing?" },
      { role: "user", content: "Ship the investor update tomorrow" },
    ]);
  });

  it("does NOT call onUpdate when the turn returns updatedData=null", async () => {
    const fetchMock = mockResponses(
      { reply: "What's pressing?", updatedData: null, done: false },
      { reply: "Could you say more?", updatedData: null, done: false },
    );
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    const onUpdate = vi.fn();
    render(
      <ChatFiller
        frameworkId="eisenhower"
        frameworkName="Eisenhower Matrix"
        decisionText="my chaotic week"
        data={baseData}
        onUpdate={onUpdate}
        onClose={() => {}}
      />,
    );

    await screen.findByText(/What's pressing\?/i);
    fireEvent.change(screen.getByPlaceholderText(/Type your answer/i), {
      target: { value: "hi" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Send/i }));

    await screen.findByText(/Could you say more/i);
    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.queryByText(/framework updated/i)).not.toBeInTheDocument();
  });

  it("shows an error message when the API responds with an error body", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ error: { code: "DM-X", message: "the model exploded" } }), {
        status: 502,
        headers: { "content-type": "application/json" },
      }),
    ) as unknown as typeof globalThis.fetch;

    render(
      <ChatFiller
        frameworkId="eisenhower"
        frameworkName="Eisenhower Matrix"
        decisionText="my chaotic week"
        data={baseData}
        onUpdate={() => {}}
        onClose={() => {}}
      />,
    );

    expect(await screen.findByText(/the model exploded/i)).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    globalThis.fetch = mockResponses({
      reply: "first question",
      updatedData: null,
      done: false,
    }) as unknown as typeof globalThis.fetch;

    const onClose = vi.fn();
    render(
      <ChatFiller
        frameworkId="eisenhower"
        frameworkName="Eisenhower Matrix"
        decisionText="my chaotic week"
        data={baseData}
        onUpdate={() => {}}
        onClose={onClose}
      />,
    );

    await screen.findByText(/first question/i);
    fireEvent.click(screen.getByRole("button", { name: /Close chat/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("submitting empty input does nothing", async () => {
    const fetchMock = mockResponses({
      reply: "kickoff question",
      updatedData: null,
      done: false,
    });
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    render(
      <ChatFiller
        frameworkId="eisenhower"
        frameworkName="Eisenhower Matrix"
        decisionText="my chaotic week"
        data={baseData}
        onUpdate={() => {}}
        onClose={() => {}}
      />,
    );

    await screen.findByText(/kickoff question/i);
    const sendBtn = screen.getByRole("button", { name: /Send/i });
    expect(sendBtn).toBeDisabled();
    // simulate a click anyway — should be a no-op
    await act(async () => {
      fireEvent.click(sendBtn);
    });
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  });
});
