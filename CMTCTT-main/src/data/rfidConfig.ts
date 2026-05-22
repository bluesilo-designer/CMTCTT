export interface RFIDReader {
  id: string;
  no: number;
  displayName: string;
  macAddress: string;
  status: "Active" | "Inactive";
  armStatus: "Arm" | "Disarm";
  serialNumber: string;
  ipAddress: string;
  firmwareVersion?: string;
}

export interface AntennaEntry {
  id: string;
  no: number;
  station: string;
  rfidReader: string;
  antennaPortNumber: string;
  antenna: string;
  antennaKey: string;
  gpo: string;
}

export const rfidReaders: RFIDReader[] = [
  {
    id: "r1", no: 1,
    displayName: "RFID Reader 1",
    macAddress: "84248DF03FC8001",
    status: "Active",
    armStatus: "Arm",
    serialNumber: "JX3621390195-001",
    ipAddress: "352.323.322.1",
  },
  {
    id: "r2", no: 2,
    displayName: "RFID Reader 2",
    macAddress: "84248DF03FC8002",
    status: "Active",
    armStatus: "Arm",
    serialNumber: "JX3621390195-002",
    ipAddress: "352.323.322.2",
  },
  {
    id: "r3", no: 3,
    displayName: "RFID Reader 3",
    macAddress: "84248DF03FC8003",
    status: "Active",
    armStatus: "Arm",
    serialNumber: "JX3621390195-003",
    ipAddress: "352.323.322.3",
  },
];

export const antennaEntries: AntennaEntry[] = [
  { id: "a1", no: 1, station: "IMT-01", rfidReader: "RFID Reader 1", antennaPortNumber: "25255DF8FC01001", antenna: "RFID Reader 1 - Antenna 1", antennaKey: "ANT1", gpo: "GPO1" },
  { id: "a2", no: 2, station: "IMT-02", rfidReader: "RFID Reader 1", antennaPortNumber: "25255DF8FC01002", antenna: "RFID Reader 1 - Antenna 2", antennaKey: "ANT2", gpo: "GPO2" },
  { id: "a3", no: 3, station: "IMT-03", rfidReader: "RFID Reader 2", antennaPortNumber: "25255DF8FC02001", antenna: "RFID Reader 2 - Antenna 1", antennaKey: "ANT1", gpo: "GPO1" },
  { id: "a4", no: 4, station: "IMT-04", rfidReader: "RFID Reader 2", antennaPortNumber: "25255DF8FC02002", antenna: "RFID Reader 2 - Antenna 2", antennaKey: "ANT2", gpo: "GPO2" },
  { id: "a5", no: 5, station: "IMT-05", rfidReader: "RFID Reader 3", antennaPortNumber: "25255DF8FC03001", antenna: "RFID Reader 3 - Antenna 1", antennaKey: "ANT1", gpo: "GPO1" },
  { id: "a6", no: 6, station: "IMT-06", rfidReader: "RFID Reader 3", antennaPortNumber: "25255DF8FC03002", antenna: "RFID Reader 3 - Antenna 2", antennaKey: "ANT2", gpo: "GPO2" },
];
