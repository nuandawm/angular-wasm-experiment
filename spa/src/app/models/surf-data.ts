export type SurfData = {
  signature: string;
  format: number;
  objNum: number;
  version: number;
  objType: number;
  objName: string;
  operatorName: string;
  materialCode: number;
  acquisitionType: number;
  rangeType: number;
  specialPoints: number;
  absoluteHeights: number;
  gaugeResolution: number;
  sizeOfPoints: number;
  zMin: number;
  zMax: number;
  xPoints: number,
  yPoints: number,
  totalNumberOfPoints: number,
  xSpacing: number,
  ySpacing: number,
  zSpacing: number,
  xName: string,
  yName: string,
  zName: string,
  xStepUnit: string,
  yStepUnit: string,
  zStepUnit: string,
  xLengthUnit: string,
  yLengthUnit: string,
  zLengthUnit: string,
  xUnitRatio: number,
  yUnitRatio: number,
  zUnitRatio: number,
  imprint: number,
  inverted: number,
  levelled: number,
  startSeconds: number,
  startMinutes: number,
  startHours: number,
  startDays: number,
  startMonths: number,
  startYears: number,
  startWeekDay: number,
  measurementDuration: number,
  commentSize: number,
  privateSize: number,
  clientZone: string,
  xOffset: number,
  yOffset: number,
  zOffset: number,
  tSpacing: number,
  tOffset: number,
  tStepUnit: string,
  tAxisName: string,
  comment: string,
  privateComment: string,
  dataStart: number
}
