"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JWTExpirationCalculator() {
  const expirationTimestampSeconds = 1755257504; // Your JWT exp time in seconds
  const currentTimestampMilliseconds = 1752665504807; // Your current time in milliseconds

  const expirationTimestampMilliseconds = expirationTimestampSeconds * 1000;
  const timeLeftMilliseconds =
    expirationTimestampMilliseconds - currentTimestampMilliseconds;

  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    if (timeLeftMilliseconds <= 0) {
      setRemainingTime({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      });
      return;
    }

    const totalSeconds = Math.floor(timeLeftMilliseconds / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setRemainingTime({ days, hours, minutes, seconds, isExpired: false });
  }, [timeLeftMilliseconds]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">JWT Token Expiration</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            <p className="text-lg font-medium">
              Expiration Timestamp (seconds):
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {expirationTimestampSeconds}
            </p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-medium">
              Current Timestamp (milliseconds):
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {currentTimestampMilliseconds}
            </p>
          </div>

          {remainingTime.isExpired ? (
            <div className="text-xl px-4 py-2">Token Expired!</div>
          ) : (
            <div>
              <p className="text-lg font-medium mb-2">
                Time Left Until Expiration:
              </p>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">
                    {remainingTime.days}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Days
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">
                    {remainingTime.hours}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Hours
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">
                    {remainingTime.minutes}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Minutes
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">
                    {remainingTime.seconds}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Seconds
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
