/**
  BasicHTTPSClient.ino

  Created on: 20.08.2018

*/

#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <ESP8266HTTPClient.h>

#include <ArduinoJson.h>

//#include <WiFiClientSecureBearSSL.h>

//***************************************************
// Can be updated via server through get config call
unsigned long loopDelay = 10000;
bool useThreshold = false;
double threshold = 0.0;
//***************************************************

//***************************************************
// Update with your WIFI settings
const char *ssid = "BinodAirtel";
const char *passwd = "mathfact970";
//***************************************************

//===================== Wifi Setup Begin =====================

ESP8266WiFiMulti WiFiMulti;

void setup()
{

  Serial.begin(115200);
  // Serial.setDebugOutput(true);

  Serial.println();
  Serial.println();
  Serial.println();

  for (uint8_t t = 4; t > 0; t--)
  {
    Serial.printf("[SETUP] WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid, passwd);
}

//===================== Wifi Setup Ends =====================

//================ Start Communication Begin =================

//***************************************************
// Set your scope for server
const String scope = "1";
//***************************************************

// Do not change anything below
// Fingerprint for URL, expires, needs to be updated before installing
const char fingerprint[] PROGMEM = "E5 49 97 52 0C EB 31 2E 0E 85 5E 8B D6 F0 F8 5C C1 2D BB 6B";
#define URLMAXLEN 200
const String configURL = "https://iot-azure.vercel.app/api/store/" + scope + "/config";
const String recordURL = "https://iot-azure.vercel.app/api/store/" + scope + "/record";
// Set this false if using http instead of https, change https to http in urls. Current server only supports HTTPS
const bool useSecure = true;

String openChannel(bool getX, String message)
{
  // wait for WiFi connection
  String payload;
  if ((WiFiMulti.run() == WL_CONNECTED))
  {

    std::unique_ptr<BearSSL::WiFiClientSecure> client(new BearSSL::WiFiClientSecure);

    if (useSecure)
    {
      client->setFingerprint(fingerprint);
    }
    else
    {
      // Or, if you happy to ignore the SSL certificate, then use the following line instead:
      client->setInsecure();
    }

    HTTPClient https;

    Serial.print("[HTTPS] begin...\n");
    char url[URLMAXLEN];
    if (getX)
    {
      configURL.toCharArray(url, URLMAXLEN);
    }
    else
    {
      recordURL.toCharArray(url, URLMAXLEN);
    }
    Serial.print("[HTTPS] url...\n");
    Serial.println(url);
    if (https.begin(*client, url))
    { // HTTPS
      int httpCode;
      if (getX)
      {
        Serial.print("[HTTPS] GET...\n");
        // start connection and send HTTP header
        httpCode = https.GET();
      }
      else
      {
        Serial.print("[HTTPS] POST...\n");
        // start connection and send HTTP header
        https.addHeader("Content-Type", "application/json");
        httpCode = https.POST(message);
      }
      // httpCode will be negative on error
      if (httpCode > 0)
      {
        // HTTP header has been send and Server response header has been handled
        if (getX)
        {
          Serial.printf("[HTTPS] GET... code: %d\n", httpCode);
        }
        else
        {
          Serial.printf("[HTTPS] POST... code: %d\n", httpCode);
        }

        // file found at server
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY)
        {
          payload = https.getString();
        }
      }
      else
      {
        Serial.printf("[HTTPS] GET... failed, error: %s\n", https.errorToString(httpCode).c_str());
      }

      https.end();
    }
    else
    {
      Serial.printf("[HTTPS] Unable to connect\n");
    }
  }
  return payload;
}

//================ Start Communication Ends =================

//================ JSON Parsing Begin =================
//***************************************************
// https://arduinojson.org/v6/example/parser/
// Set max length of JSON you will receive in get config
#define JSONSIZE 300
// I am assuming my JSON to be {"status":"success","data":{"config":{"probePeriod": <some number uint>, "useThreshold": <0/1 int>, "threshold": <some_number, floating>}}}
//***************************************************

void parseJSON(String message)
{
  StaticJsonDocument<JSONSIZE> doc;

  // StaticJsonDocument<N> allocates memory on the stack, it can be
  // replaced by DynamicJsonDocument which allocates in the heap.
  //
  // DynamicJsonDocument doc(JSONSIZE);

  // JSON input string.
  //
  // Using a char[], as shown here, enables the "zero-copy" mode. This mode uses
  // the minimal amount of memory because the JsonDocument stores pointers to
  // the input buffer.
  // If you use another type of input, ArduinoJson must copy the strings from
  // the input to the JsonDocument, so you need to increase the capacity of the
  // JsonDocument.
  char json[JSONSIZE];
  message.toCharArray(json, JSONSIZE);

  // Deserialize the JSON document
  DeserializationError error = deserializeJson(doc, json);

  // Test if parsing succeeds.
  if (error)
  {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  // Fetch values.
  //
  // Most of the time, you can rely on the implicit casts.
  // In other case, you can do doc["time"].as<long>();
  const char *status = doc["status"];
  loopDelay = doc["data"]["config"]["probePeriod"];
  int val = doc["data"]["config"]["useThreshold"];
  if (val == 0)
  {
    useThreshold = false;
  }
  else
  {
    useThreshold = true;
  }
  threshold = doc["data"]["config"]["threshold"];

  if (loopDelay <= 0)
  {
    loopDelay = 10000;
  }

  // // Print values.
  Serial.println(status);
  Serial.println(loopDelay);
  Serial.println(useThreshold);
  Serial.println(val);
  Serial.println(threshold, 6);
}
//================ JSON Parsing Ends =================

bool getX = false;
unsigned long loopCount = 0;
double value = 0;
double stepV = 0.5;

void loop()
{
  unsigned long start = millis();
  loopCount += 1;
  value += stepV;
  String message = "{\"loopCount\": " + String(loopCount) + ", \"value\": " + String(value, 6) + "}";
  String payload = openChannel(getX, message);
  Serial.println(payload);
  getX = !getX;
  payload = openChannel(getX, message);
  Serial.println(payload);
  parseJSON(payload);
  getX = !getX;
  Serial.println(value);
  Serial.println(stepV);
  if (threshold > 0)
  {
    Serial.println("Testing threshold");
    if (value > threshold)
    {
      Serial.println("v>t");
      Serial.println(stepV);
      stepV = stepV > 0 ? -stepV : stepV;
      Serial.println(stepV);
    }
    if (value < (-threshold))
    {
      Serial.println("v<-t");
      Serial.println(stepV);
      stepV = stepV < 0 ? -stepV : stepV;
      Serial.println(stepV);
    }
    Serial.println("Testing threshold Completed");
  }
  if (loopDelay > 0)
  {
    unsigned long nap = loopDelay - (millis() - start);
    Serial.print("Napping ...");
    Serial.println(nap);
    nap = loopDelay < nap ? loopDelay : nap;
    if (nap > 0)
    {
      delay(nap);
    }
  }
}
