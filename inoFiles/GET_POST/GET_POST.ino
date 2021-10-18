/**
   BasicHTTPSClient.ino

    Created on: 20.08.2018

*/

#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <ESP8266HTTPClient.h>

#include <WiFiClientSecureBearSSL.h>
// Fingerprint for URL, expires, needs to be updated before installing
const char fingerprint[] PROGMEM = "E5 49 97 52 0C EB 31 2E 0E 85 5E 8B D6 F0 F8 5C C1 2D BB 6B";
const char *configURL = "https://iot-azure.vercel.app/api/store/1/config";
const char *recordURL = "https://iot-azure.vercel.app/api/store/1/record";
const bool useSecure = true;

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
  // Please update your SSID and password
  WiFiMulti.addAP("***SSID***", "***PASSWORD***");
}

String openChannel(bool get, String message)
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
    const char *url;
    if (get)
    {
      url = configURL;
    }
    else
    {
      url = recordURL;
    }
    if (https.begin(*client, url))
    { // HTTPS
      int httpCode;
      if (get)
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
        if (get)
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
          //          Serial.println(payload);
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

bool current = false;
int loopCount = 0;

void loop()
{
  loopCount += 1;
  String message = "{\"loopCount\": " + String(loopCount) + "}";
  String payload = openChannel(current, message);
  Serial.println(payload);
  current = !current;
  delay(15000);
}
