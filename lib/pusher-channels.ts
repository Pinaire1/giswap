export function threadChannelName(threadId: string): string {
  return `private-thread-${threadId}`;
}

export function parseThreadChannel(channelName: string): string | null {
  const match = channelName.match(/^private-thread-(.+)$/);
  return match?.[1] ?? null;
}
