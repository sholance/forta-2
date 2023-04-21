import { EntityType, Finding, FindingSeverity, FindingType, HandleAlert, AlertEvent, Initialize } from 'forta-agent'
import { BOT_ID } from './constants'

const ALERT_THRESHOLD = 2;
const alertDict: { [key: string]: Set<string> } = {}


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
  const address = alert.metadata.contractAddress; 

  if (alert.findingType === "Exploit") {
    try {
      const findings = [
        Finding.fromObject({
          name: "Soft Rug Pull",
          description: `Soft rug pull has been detected`,
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

    } catch {
      } 
     }
  if (alertId && address) {
      if (!alertDict[address]) {
        alertDict[address] = new Set();
      }
      alertDict[address].add(alertId);

    if (alertDict[address]?.size >= ALERT_THRESHOLD) {
      try {
        for (const [address, alertIds] of Object.entries(alertDict)) {
          const findingsCount = alertIds.size;
          if (findingsCount >= ALERT_THRESHOLD) {
            const alertIdString = Array.from(alertIds).join("-");
            const finding = Finding.fromObject({
              name: "Soft Rug Pulls Detected",
              description: `Likely Soft rug pull has been detected`,
              alertId: alertIdString,
              severity: FindingSeverity.High,
              type: FindingType.Suspicious,
              labels: [
                {
                  entityType: EntityType.Address,
                  entity: address,
                  label: "soft-rug-pull-scam",
                  confidence: 1,
                  remove: false,
                  metadata: {},
                },
                {
                  entityType: EntityType.Address,
                  entity: address,
                  label: "attacker",
                  confidence: 1,
                  remove: false,
                  metadata: {},
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
            });
            findings.push(finding);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return findings

}

export default {
  initialize,
  handleAlert,
}