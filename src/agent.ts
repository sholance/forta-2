import { EntityType, Finding, FindingSeverity, FindingType, HandleAlert, AlertEvent, Initialize } from 'forta-agent'
import { BOT_ID } from './constants'

const ALERT_THRESHOLD = 1;

const initialize: Initialize = async () => {
  return {
    alertConfig: {
      subscriptions: [
        {
          botId: BOT_ID,
          alertIds: ["SOFT-RUG-PULL-SUS-LIQ-POOL-CREATION", "SOFT-RUG-PULL-SUS-LIQ-POOL-RESERVE-CHANGE", "SOFT-RUG-PULL-SUS-POOL-REMOVAL"],
        },
      ],
    },
  }
}

const handleAlert: HandleAlert = async (alertEvent: AlertEvent): Promise<Finding[]> => {
    let findings: Finding[] = [];
if (alertEvent) {
    const alert = alertEvent.alert
    const alertId = alert?.alertId;
    const contractAddress = alert?.contracts?.[0]?.address;
    const attacker = alert?.contracts?.[0]?.address?.[0];
    const uniqueAlertIds: Set<string> = new Set();
    uniqueAlertIds.add(alertId!)

    if (uniqueAlertIds.size > ALERT_THRESHOLD) {
      const findings = [
        Finding.fromObject({
          name: "Soft Rug Pulls Detected",
          description: `Soft rug pulls have been detected for address ${contractAddress}.`,
          alertId: "SOFT-RUG-PULL",
          severity: FindingSeverity.High,
          type: FindingType.Suspicious,
          labels: [
            {
              entityType: EntityType.Address,
              entity: contractAddress!,
              label: "soft-rug-pull-scam",
              confidence: 1,
              remove: false,
              metadata: {},
            },
            {
              entityType: EntityType.Address,
              entity: attacker!,
              label: "attacker",
              confidence: 1,
              remove: false,
              metadata: {},
            },
          ],
        }),
      ]
      return findings
    }
  }
    return findings
}


export default {
  initialize,
  handleAlert,
}
