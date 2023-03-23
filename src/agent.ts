import { EntityType, Finding, FindingSeverity, FindingType, HandleAlert, AlertEvent, Initialize } from 'forta-agent'
import { BOT_ID } from './constants'

const ALERT_THRESHOLD = 2; 

const initialize: Initialize = async () => {
  return {
    alertConfig: {
      subscriptions: [
        {
          botId: BOT_ID,
          alertIds: ["RUG-1", "RUG-2", "RUG-3"],
        },
      ],
    },
  }
}

const handleAlert: HandleAlert = async (alertEvent: AlertEvent) => {
  const findings: Finding[] = []
  const alert = alertEvent.alert
  const alertId = alert?.alertId;
  const creatorAddress = alert.labels?.find(label => label.entityType === EntityType.Address)?.entity ?? '';
  const uniqueAlertIds: Set<string> = new Set();
  uniqueAlertIds.add(alertId || '')

  if (uniqueAlertIds.size >= ALERT_THRESHOLD) {
    const findings = [
      Finding.fromObject({
        name: "Multiple Soft Rug Pulls Detected",
        description: `Multiple soft rug pulls have been detected for address ${creatorAddress}.`,
        alertId: "SOFT-RUG-PULL",
        severity: FindingSeverity.High,
        type: FindingType.Suspicious,
        labels: [
          {
            entityType: EntityType.Address,
            entity: creatorAddress,
            label: "soft-rug-pull-scam",
            confidence: 1,
            remove: false,
          },
        ],
      }),
    ]

    return findings
  }

  return findings
}

export default {
  initialize,
  handleAlert,
}
