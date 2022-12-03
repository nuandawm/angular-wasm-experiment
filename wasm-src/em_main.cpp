#include <iostream>
#include <fstream>
#include <cstdint>
#include <emscripten.h>
#include <emscripten/bind.h>

using namespace std;

struct SurfData {
  std::string signature;
  int16_t format;
  int16_t objNum;
  int16_t version;
  int16_t objType;
  std::string objName;
  std::string operatorName;

  int16_t materialCode;
  int16_t acquisitionType;
  int16_t rangeType;
  int16_t specialPoints;
  int16_t absoluteHeights;
  float gaugeResolution;

  int16_t sizeOfPoints;

  int32_t zMin;
  int32_t zMax;

  // Number of points per axis
  int32_t xPoints;
  int32_t yPoints;

  int32_t totalNumberOfPoints;

  // Distance between points
  float xSpacing;
  float ySpacing;
  float zSpacing;

  // Name of axis
  std::string xName;
  std::string yName;
  std::string zName;

  // Unit of distance between points
  std::string xStepUnit;
  std::string yStepUnit;
  std::string zStepUnit;

  // Unit of axis
  std::string xLengthUnit;
  std::string yLengthUnit;
  std::string zLengthUnit;

  // Scaling of distance between points
  float xUnitRatio;
  float yUnitRatio;
  float zUnitRatio;

  int16_t imprint;
  int16_t inverted;
  int16_t levelled;

  // timestamp
  int16_t startSeconds;
  int16_t startMinutes;
  int16_t startHours;
  int16_t startDays;
  int16_t startMonths;
  int16_t startYears;
  int16_t startWeekDay;
  float measurementDuration;

  // Size of comment field
  int16_t commentSize;
  int16_t privateSize;

  std::string clientZone;

  // Axis offset
  float xOffset;
  float yOffset;
  float zOffset;

  // Temperature scale
  float tSpacing;
  float tOffset;
  std::string tStepUnit;
  std::string tAxisName;

  std::string comment;
  // Renamed as privateComment (because of c++ limitations)
  std::string privateComment;

  // Position of data points start
  int dataStart;
};

std::string strCopyAndStrim(char *orig, int size) {
  std::string cloned = "";
  for (int i=0; i<size; i++) {
    if (orig[i] == (char)0) {
      break;
    }
    cloned = cloned + orig[i];
  }
  return cloned;
}

std::string readSurfDataChar(std::ifstream &file, int size) {
  char tmpChar[size];
  file.read(tmpChar, size);
  return strCopyAndStrim(tmpChar, size);
}

int16_t readSurfDataInt16(std::ifstream &file) {
  int16_t tmpInt16;
  file.read((char*) &tmpInt16, 2);
  return tmpInt16;
}

int32_t readSurfDataInt32(std::ifstream &file) {
  int32_t tmpInt32;
  file.read((char*) &tmpInt32, 4);
  return tmpInt32;
}

float readSurfDataFloat(std::ifstream &file) {
  float tmpFloat;
  file.read((char*) &tmpFloat, 4);
  return tmpFloat;
}

SurfData readSurfFile(string filePath) {
  SurfData data;
  ifstream myFile (filePath, ios::in | ios::binary);

  if (myFile.fail()) {
    EM_ASM(
        console.log('file not found');
    );
  }

  data.signature = readSurfDataChar(myFile, 12);
  data.format = readSurfDataInt16(myFile);
  data.objNum = readSurfDataInt16(myFile);
  data.version = readSurfDataInt16(myFile);
  data.objType = readSurfDataInt16(myFile);
  data.objName = readSurfDataChar(myFile, 30);
  data.operatorName = readSurfDataChar(myFile, 30);

  data.materialCode = readSurfDataInt16(myFile);
  data.acquisitionType = readSurfDataInt16(myFile);
  data.rangeType = readSurfDataInt16(myFile);
  data.specialPoints = readSurfDataInt16(myFile);
  data.absoluteHeights = readSurfDataInt16(myFile);
  data.gaugeResolution = readSurfDataFloat(myFile);

  // reserved
  readSurfDataChar(myFile, 4);

  data.sizeOfPoints = readSurfDataInt16(myFile);

  data.zMin = readSurfDataInt32(myFile);
  data.zMax = readSurfDataInt32(myFile);

  data.xPoints = readSurfDataInt32(myFile);
  data.yPoints = readSurfDataInt32(myFile);

  data.totalNumberOfPoints = readSurfDataInt32(myFile);

  data.xSpacing = readSurfDataFloat(myFile);
  data.ySpacing = readSurfDataFloat(myFile);
  data.zSpacing = readSurfDataFloat(myFile);

  data.xName = readSurfDataChar(myFile, 16);
  data.yName = readSurfDataChar(myFile, 16);
  data.zName = readSurfDataChar(myFile, 16);

  data.xStepUnit = readSurfDataChar(myFile, 16);
  data.yStepUnit = readSurfDataChar(myFile, 16);
  data.zStepUnit = readSurfDataChar(myFile, 16);

  data.xLengthUnit = readSurfDataChar(myFile, 16);
  data.yLengthUnit = readSurfDataChar(myFile, 16);
  data.zLengthUnit = readSurfDataChar(myFile, 16);

  data.xUnitRatio = readSurfDataFloat(myFile);
  data.yUnitRatio = readSurfDataFloat(myFile);
  data.zUnitRatio = readSurfDataFloat(myFile);

  data.imprint = readSurfDataInt16(myFile);
  data.inverted = readSurfDataInt16(myFile);
  data.levelled = readSurfDataInt16(myFile);

  // obsolete
  readSurfDataChar(myFile, 12);

  data.startSeconds = readSurfDataInt16(myFile);
  data.startMinutes = readSurfDataInt16(myFile);
  data.startHours = readSurfDataInt16(myFile);
  data.startDays = readSurfDataInt16(myFile);
  data.startMonths = readSurfDataInt16(myFile);
  data.startYears = readSurfDataInt16(myFile);
  data.startWeekDay = readSurfDataInt16(myFile);
  data.measurementDuration = readSurfDataFloat(myFile);

  // obsolete
  readSurfDataChar(myFile, 10);

  // Size of comment field
  data.commentSize = readSurfDataInt16(myFile);
  data.privateSize = readSurfDataInt16(myFile);

  data.clientZone = readSurfDataChar(myFile, 128);

  // Axis offset
  data.xOffset = readSurfDataFloat(myFile);
  data.yOffset = readSurfDataFloat(myFile);
  data.zOffset = readSurfDataFloat(myFile);

  // Temperature scale
  data.tSpacing = readSurfDataFloat(myFile);
  data.tOffset = readSurfDataFloat(myFile);
  data.tStepUnit = readSurfDataChar(myFile, 13);
  data.tAxisName = readSurfDataChar(myFile, 13);

  data.comment = readSurfDataChar(myFile, data.commentSize);
  data.privateComment = readSurfDataChar(myFile, data.privateSize);

  data.dataStart = myFile.tellg();

  myFile.close();

  return data;
}

void readSurfFilePoints16(std::string filePath, int dataStart, int16_t data[], int32_t totalNumberOfPoints) {
  std::ifstream file;
  file.open(filePath, std::ios::in | std::ios::binary);
  file.seekg(dataStart);

  for(int32_t i; i < totalNumberOfPoints; i++) {
    file.read((char*) &data[i], 2);
  }
}

void readSurfFileMatrixPoints16(std::string filePath, int dataStart, int16_t **data, int32_t totalNumberOfPoints, int32_t xPoints) {
  std::ifstream file;
  file.open(filePath, std::ios::in | std::ios::binary);
  file.seekg(dataStart);

  for(int32_t i=0; i < totalNumberOfPoints; i++) {
    file.read((char*) &data[i / xPoints][i % xPoints], 2);
  }
}

void readSurfFilePoints32(std::string filePath, int dataStart, int32_t data[], int32_t totalNumberOfPoints) {
  std::ifstream file;
  file.open(filePath, std::ios::in | std::ios::binary);
  file.seekg(dataStart);

  for(int32_t i; i < totalNumberOfPoints; i++) {
    file.read((char*) &data[i], 4);
  }
}

void readSurfFileMatrixPoints32(std::string filePath, int dataStart, int32_t **data, int32_t totalNumberOfPoints, int32_t xPoints) {
  std::ifstream file;
  file.open(filePath, std::ios::in | std::ios::binary);
  file.seekg(dataStart);

  for(int32_t i=0; i < totalNumberOfPoints; i++) {
    file.read((char*) &data[i / xPoints][i % xPoints], 4);
  }
}

// TODO Skale datapoints without Offset
// TODO Generate Axis without Offset

extern "C" {

int getSizeOfPoints() {
    SurfData data = readSurfFile("/surf.sur");
    return 42;
}

}

SurfData wrapperReadSurfFile(std::string filePath) {
    return readSurfFile(filePath);
}

void wrapperReadSurfFilePoints32(std::string filePath, int dataStart, int32_t data[], int32_t totalNumberOfPoints) {
    readSurfFilePoints32(filePath, dataStart, data, totalNumberOfPoints);
}

EMSCRIPTEN_BINDINGS(my_value_example) {
    emscripten::value_object<SurfData>("SurfData")
            .field("signature", &SurfData::signature)
            .field("format", &SurfData::format)
            .field("objNum", &SurfData::objNum)
            .field("version", &SurfData::version)
            .field("objType", &SurfData::objType)
            .field("objName", &SurfData::objName)
            .field("operatorName", &SurfData::operatorName)
            .field("materialCode", &SurfData::materialCode)
            .field("acquisitionType", &SurfData::acquisitionType)
            .field("rangeType", &SurfData::rangeType)
            .field("specialPoints", &SurfData::specialPoints)
            .field("absoluteHeights", &SurfData::absoluteHeights)
            .field("gaugeResolution", &SurfData::gaugeResolution)
            .field("sizeOfPoints", &SurfData::sizeOfPoints)
            .field("zMin", &SurfData::zMin)
            .field("zMax", &SurfData::zMax)
            .field("xPoints", &SurfData::xPoints)
            .field("yPoints", &SurfData::yPoints)
            .field("totalNumberOfPoints", &SurfData::totalNumberOfPoints)
            .field("xSpacing", &SurfData::xSpacing)
            .field("ySpacing", &SurfData::ySpacing)
            .field("zSpacing", &SurfData::zSpacing)
            .field("xName", &SurfData::xName)
            .field("yName", &SurfData::yName)
            .field("zName", &SurfData::zName)
            .field("xStepUnit", &SurfData::xStepUnit)
            .field("yStepUnit", &SurfData::yStepUnit)
            .field("zStepUnit", &SurfData::zStepUnit)
            .field("xLengthUnit", &SurfData::xLengthUnit)
            .field("yLengthUnit", &SurfData::yLengthUnit)
            .field("zLengthUnit", &SurfData::zLengthUnit)
            .field("xUnitRatio", &SurfData::xUnitRatio)
            .field("yUnitRatio", &SurfData::yUnitRatio)
            .field("zUnitRatio", &SurfData::zUnitRatio)
            .field("imprint", &SurfData::imprint)
            .field("inverted", &SurfData::inverted)
            .field("levelled", &SurfData::levelled)
            .field("startSeconds", &SurfData::startSeconds)
            .field("startMinutes", &SurfData::startMinutes)
            .field("startHours", &SurfData::startHours)
            .field("startDays", &SurfData::startDays)
            .field("startMonths", &SurfData::startMonths)
            .field("startYears", &SurfData::startYears)
            .field("startWeekDay", &SurfData::startWeekDay)
            .field("measurementDuration", &SurfData::measurementDuration)
            .field("commentSize", &SurfData::commentSize)
            .field("privateSize", &SurfData::privateSize)
            .field("clientZone", &SurfData::clientZone)
            .field("xOffset", &SurfData::xOffset)
            .field("yOffset", &SurfData::yOffset)
            .field("zOffset", &SurfData::zOffset)
            .field("tSpacing", &SurfData::tSpacing)
            .field("tOffset", &SurfData::tOffset)
            .field("tStepUnit", &SurfData::tStepUnit)
            .field("tAxisName", &SurfData::tAxisName)
            .field("comment", &SurfData::comment)
            .field("privateComment", &SurfData::privateComment)
            .field("dataStart", &SurfData::dataStart)
            ;

    emscripten::function("wrapperReadSurfFile", &wrapperReadSurfFile);

    emscripten::function("wrapperReadSurfFilePoints32", &wrapperReadSurfFilePoints32, emscripten::allow_raw_pointers());
}
