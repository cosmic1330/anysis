export default function parseLsusbOutput(output: string) {
  const lines = output.trim().split("\n");
  const devices = lines
    .map((line) => {
      const match = line.match(
        /Bus (\d+) Device (\d+): ID ([a-f0-9]+:[a-f0-9]+) (.+)/
      );
      if (match) {
        const bus = match[1];
        const device = match[2];
        const id = match[3];
        const description = match[4];
        return { bus, device, id, description };
      }
      return null;
    })
    .filter((device) => device !== null);

  return devices;
}
