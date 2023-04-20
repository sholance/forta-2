import { EntityType, Finding, FindingSeverity, FindingType, HandleAlert, AlertEvent, Initialize } from 'forta-agent';
import { BOT_ID } from './constants';
import agent from './agent';
const {handleAlert, initialize} = agent

describe('myAgent', () => {
  it('should export initialize and handleAlert functions', () => {
    expect(typeof initialize).toBeDefined();
    expect(typeof handleAlert).toBeDefined();
  });


  it('should return alertConfig from initialize()', async () => {
    const mockConfig = {
      botId: BOT_ID,
    };
    const mockChainId = '1';
    const result = await initialize();

    expect(result).toMatchObject({
      alertConfig: {
        subscriptions: [
          {
            botId: BOT_ID,
            alertIds: ["SOFT-RUG-PULL-SUS-LIQ-POOL-CREATION", "SOFT-RUG-PULL-SUS-LIQ-POOL-RESERVE-CHANGE", "SOFT-RUG-PULL-SUS-POOL-REMOVAL"],
          },
        ],
      },
    });
  });
});
