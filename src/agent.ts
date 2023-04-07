import { EntityType, Finding, FindingSeverity, FindingType, HandleAlert, AlertEvent, Initialize } from 'forta-agent'
import { BOT_ID } from './constants'

const ALERT_THRESHOLD = 0;

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

const handleAlert: HandleAlert = async (alertEvent: AlertEvent) => {
  let findings: Finding[] = [];
  const alert = alertEvent.alert
  const alertId = alert?.alertId;
  const address = alert.labels?.[0]?.entity;
  const uniqueAlertIds: Set<string> = new Set();
  uniqueAlertIds.add(alertId!)

  if (alert && (uniqueAlertIds.size > ALERT_THRESHOLD)) {
    try {
    const findings = [
      Finding.fromObject({
        name: "Soft Rug Pulls Detected",
        description: `Soft rug pulls have been detected`,
        alertId: alertId!,
        severity: FindingSeverity.High,
        type: FindingType.Suspicious,
        labels: [
          {
            entityType: EntityType.Address,
            entity: address!,
            label: "soft-rug-pull-scam",
            confidence: 1,
            remove: false,
            metadata: {},
          },
          {
            entityType: EntityType.Address,
            entity: address!,
            label: "attacker",
            confidence: 1,
            remove: false,
            metadata: {}
          },
        ],          
        metadata: {
          alert_hash: alert.hash!, 
          bot_id: alert.source?.bot?.id!, 
          alert_id: alertId!,
          contractAddress: alert.metadata.contractAddress, 
          token: alert.metadata.tokenAddress, 
          deployer: alert.metadata.deployer,
      },
      }),
    ]
    return findings
  } catch (err) {
    console.log(err)
  }
  }
  return findings
}

export default {
  initialize,
  handleAlert,
}