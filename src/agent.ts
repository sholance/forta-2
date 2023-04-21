import { EntityType, Finding, FindingSeverity, FindingType, HandleAlert, AlertEvent, Initialize, getEthersProvider } from 'forta-agent'
import { BOT_ID } from './constants'

const ALERT_THRESHOLD = 2;
const alertDict: { [key: string]: { alertIds: Set<string>, alertHashes: Set<string> } } = {}

const initialize: Initialize = async () => {
  const { chainId } = await getEthersProvider().getNetwork();

  return {
    alertConfig: {
      subscriptions: [
        {
          botId: BOT_ID,
          alertIds: ["SOFT-RUG-PULL-SUS-LIQ-POOL-CREATION", "SOFT-RUG-PULL-SUS-LIQ-POOL-RESERVE-CHANGE", "SOFT-RUG-PULL-SUS-POOL-REMOVAL"],
          chainId: chainId
        }
      ],
    },
  }
}

const handleAlert: HandleAlert = async (alertEvent: AlertEvent) => {
  let findings: Finding[] = [];
  const alert = alertEvent.alert
  const alertId = alert?.alertId;
  const alertHash = alert?.hash;
  const address = alert.metadata.contractAddress; 
  const alertType = alert?.findingType;


  if (alertId && alertHash && address) {
      if (!alertDict[address]) {
        alertDict[address] = { alertIds: new Set(), alertHashes: new Set() };
      }
      alertDict[address].alertIds.add(alertId);
      alertDict[address].alertHashes.add(alertHash);

    if (alertDict[address]?.alertIds.size >= ALERT_THRESHOLD) {
      try {
        for (const [address, { alertIds, alertHashes }] of Object.entries(alertDict)) {
          const findingsCount = alertIds.size;
          if (findingsCount >= ALERT_THRESHOLD) {
            const alertIdString = Array.from(alertIds).join(" && ");
            const alertHashString = Array.from(alertHashes).join(" && ");
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
                alert_hash: alertHashString,
                bot_id: alert.source?.bot?.id!,
                alert_id: alertIdString,
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
    if (alertType === 'Exploit') {
      const finding = Finding.fromObject({
        name: "Soft Rug Pulls",
        description: `Soft rug pull has been detected`,
        alertId: alertId!,
        severity: FindingSeverity.High,
        type: FindingType.Suspicious,
        labels: [
          {
            entityType: EntityType.Address,
            entity: address,
            label: "potential-exploit",
            confidence: 1,
            remove: false,
            metadata: {},
          },
        ],
        metadata: {
          alert_hash: alert.hash!,
          bot_id: alert.source?.bot?.id!,
          contractAddress: alert.metadata.contractAddress,
          token: alert.metadata.tokenAddress,
          deployer: alert.metadata.deployer,
        },
      })
      findings.push(finding);
    }
  }

  return findings

}



export default {
  initialize,
  handleAlert,
}
