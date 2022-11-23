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

  int sizeOfPoints;

  int32_t zMin;
  int32_t zMax;
};

SurfData readSurfFile(string filePath) {
  ifstream myFile (filePath, ios::in | ios::binary);

  if (myFile.fail()) {
    EM_ASM(
        console.log('file not found');
    );
  }

  SurfData data;

  char signature[12];
  myFile.read(signature, 12);
  data.signature = signature;
  myFile.read((char*) &data.format, 2);
  myFile.read((char*) &data.objNum, 2);
  myFile.read((char*) &data.version, 2);
  myFile.read((char*) &data.objType, 2);
  char objName[30];
  myFile.read(objName, 30);
  data.objName = objName;
  char operatorName[30];
  myFile.read(operatorName, 30);
  data.operatorName = operatorName;

  myFile.read((char*) &data.materialCode, 2);
  myFile.read((char*) &data.acquisitionType, 2);
  myFile.read((char*) &data.rangeType, 2);
  myFile.read((char*) &data.specialPoints, 2);
  myFile.read((char*) &data.absoluteHeights, 2);
  myFile.read((char*) &data.gaugeResolution, 4);

  char reserved[4];
  myFile.read((char*) reserved, 4);

  myFile.read((char*) &data.sizeOfPoints, 2);

  myFile.read((char*) &data.zMin, 4);
  myFile.read((char*) &data.zMax, 4);

  myFile.close();

  return data;
}

extern "C" {

int getSizeOfPoints() {
    SurfData data = readSurfFile("/surf.sur");
    return 42;
}

}

SurfData wrapperReadSurfFile(std::string filePath) {
    return readSurfFile(filePath);
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
            ;

    emscripten::function("wrapperReadSurfFile", &wrapperReadSurfFile);
}
