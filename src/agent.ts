import { EntityType, Finding, FindingSeverity, FindingType, HandleAlert, AlertEvent, Initialize, getEthersProvider } from 'forta-agent'
import { BOT_ID } from './constants'

const ALERT_THRESHOLD = 2;
const alertDict: Record<string, { alerts: Set<AlertEvent>, alertIds: Set<string>, alertHashes: Set<string>, txHashes: Set<string> }> = {}

const initialize: Initialize = async () => {
  const { chainId } = await getEthersProvider().getNetwork();

  return {
    alertConfig: {
      subscriptions: [
        {
          botId: BOT_ID,
          alertIds: ["SOFT-RUG-PULL-SUS-LIQ-POOL-CREATION", "SOFT-RUG-PULL-SUS-LIQ-POOL-RESERVE-CHANGE", "SOFT-RUG-PULL-SUS-POOL-REMOVAL"],
          chainId,
        },
      ],
    },
  }
}

const handleAlert: HandleAlert = async (alertEvent: AlertEvent) => {
  const findings: Finding[] = [];
  const alert = alertEvent.alert;
  const { alertId, hash } = alert ?? {};
  const txHash = alert.metadata.transaction;
  const alertType = alert?.findingType;
  const address = alert.metadata?.tokenAddress;

  if (alertId && hash && address) {
    if (!alertDict[address]) {
      alertDict[address] = { alerts: new Set(), alertIds: new Set(), alertHashes: new Set(), txHashes: new Set() };
    }
    alertDict[address].alertIds.add(alertId);
    alertDict[address].alertHashes.add(hash);
    alertDict[address].alerts.add(alertEvent);
    alertDict[address].txHashes.add(txHash);

    if (alertDict[address].alertIds.size >= ALERT_THRESHOLD) {
      try {
        const alerts = Array.from(alertDict[address].alerts);
        const findingsCount = alertDict[address].alertIds.size;

          const alertIdString = Array.from(alertDict[address].alertIds).join(" && ");
          const alertHashString = Array.from(alertDict[address].alertHashes).join(" && ");
          const txHashString = Array.from(alertDict[address].txHashes).join(" && ");
          const hashes = txHashString.split("&&").map(h => h.trim());

          if (findingsCount == ALERT_THRESHOLD) {
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
              bot_id: alert?.source?.bot?.id!,
              alert_id: alertIdString,
              contractAddress: alert.metadata.contractAddress,
              token: alerts[0].alert.metadata.tokenAddress,
              deployer: alert.metadata.deployer,
              txHashes: txHashString,
            },
          });
          findings.push(finding);
        }
        }
       catch (error)
{
}
  }
  if (alert ) {
    if (alert.alertId === "SOFT-RUG-PULL-SUS-POOL-REMOVAL"){
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
        token: alert.metadata?.tokenAddress,
        deployer: alert.metadata.deployer,
      },
    })
    findings.push(finding);
  }}

  }
  return findings

}



export default {
  initialize,
  handleAlert,
}
