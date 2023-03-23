import { EntityType, Finding, FindingSeverity, FindingType, HandleAlert, AlertEvent, Initialize } from 'forta-agent'
// import { BOT_ID } from './constants';

// const THRESHOLD = 2;

// interface AlertCount {
//   [key: string]: number;
// }

// let alertCounts: AlertCount = {};

// const initialize: Initialize = async () => {
//   return {
//     alertConfig: {
//       subscriptions: [
//         {
//           botId: BOT_ID,
//           alertIds: ["RUG-1", "RUG-2", "RUG-3"],
//         }
//       ],
//     },
//   };
// };

// const handleAlert: HandleAlert = async (alertEvent: AlertEvent) => {
//   const findings: Finding[] = [];
//   const alert = alertEvent.alert; 
//   const contractAddress = alert.metadata.contractAddress;

//   if (alertEvent.botId === BOT_ID) {
//     if (!alertCounts[contractAddress]) {
//       alertCounts[contractAddress] = 1;
//     } else {
//       alertCounts[contractAddress]++;
//     }

//     if (alertCounts[contractAddress] >= THRESHOLD) {
//       findings.push(
//         Finding.fromObject({
//           name: `Soft Rug Pull Alert`,
//           description: `Suspicious Activity in Contract: ${contractAddress} has been detected.`,
//           alertId: `ID`,
//           severity: FindingSeverity.Info,
//           type: FindingType.Info,
//           labels: [{
//             entityType: EntityType.Address,
//             entity: contractAddress,
//             label: "soft-rug-pull",
//             confidence: 1,
//             remove: false,
//           }]
//         })
//       );

//       // Reset alert count for this contract address
//       alertCounts[contractAddress] = 0;
//     }
//   } 

//   return findings;
// }

// export default {
//   initialize,
//   handleAlert,
// };
