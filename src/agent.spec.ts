const { handleAlert } = require("./agent");

describe("Soft Rug Pull agent", () => {
  let alertEvent: { alert: { alertId: string; metadata: { contractAddress: string; }; labels: { entityType: number; entity: string; label: string; confidence: number; remove: boolean; }[]; }; botId: string; };
  const mockFinding = {
    name: "test finding",
    description: "test description",
    alertId: "test alert",
    severity: 0,
    type: 0,
    labels: [],
  };

  beforeEach(() => {
    alertEvent = {
      alert: {
        alertId: "test alert",
        metadata: {
          contractAddress: "0x123",
        },
        labels: [
          {
            entityType: 0,
            entity: "0x456",
            label: "test label",
            confidence: 0,
            remove: false,
          },
        ],
      },
      botId: "test bot",
    };
  });

  it("returns a finding when the threshold is met", async () => {
    const alertEvent2 = {
      alert: {
        alertId: "test alert 2",
        metadata: {
          contractAddress: "0x123",
        },
        labels: [
          {
            entityType: 0,
            entity: "0x456",
            label: "test label",
            confidence: 0,
            remove: false,
          },
        ],
      },
      botId: "test bot",
    };

    const findings = await handleAlert(alertEvent);
    expect(findings).toEqual([]);
    const findings2 = await handleAlert(alertEvent2);
    expect(findings2).toEqual([mockFinding, mockFinding, mockFinding]);
  });

  it("does not return a finding when the threshold is not met", async () => {
    const alertEvent2 = {
      alert: {
        alertId: "test alert 2",
        metadata: {
          contractAddress: "0x123",
        },
        labels: [
          {
            entityType: 0,
            entity: "0x456",
            label: "test label",
            confidence: 0,
            remove: false,
          },
        ],
      },
      botId: "test bot",
    };

    const findings = await handleAlert(alertEvent);
    expect(findings).toEqual([]);
    const findings2 = await handleAlert(alertEvent2);
    expect(findings2).toEqual([]);
  });
});
