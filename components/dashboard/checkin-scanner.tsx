"use client";

import { format } from "date-fns";
import jsQR from "jsqr";
import {
  CameraIcon,
  CameraOffIcon,
  CheckCircle2Icon,
  CircleAlertIcon,
  KeyboardIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Button } from "~/components/reusable/shadcn/button";
import { Card } from "~/components/reusable/shadcn/card";
import { Input } from "~/components/reusable/shadcn/input";
import { Label } from "~/components/reusable/shadcn/label";
import { submitCheckIn } from "~/lib/dashboard/attendance";
import {
  type CheckInData,
  isExpired,
  parseCheckIn,
} from "~/lib/dashboard/checkin";

type Result =
  | { kind: "success"; data: CheckInData; at: number }
  | { kind: "duplicate"; data: CheckInData }
  | { kind: "error"; message: string };

export function CheckInScanner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const frameRef = React.useRef<number | null>(null);

  const [scanning, setScanning] = React.useState(false);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<Result | null>(null);
  const [manual, setManual] = React.useState("");

  const stopCamera = React.useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    for (const track of streamRef.current?.getTracks() ?? []) track.stop();
    streamRef.current = null;
    setScanning(false);
  }, []);

  const handleData = React.useCallback(
    (data: CheckInData) => {
      stopCamera();

      if (isExpired(data)) {
        setResult({
          kind: "error",
          message:
            "This code has expired. Ask the usher to show the current one.",
        });
        return;
      }

      // The server verifies the signed code and records the attendance
      // against the signed-in member.
      void submitCheckIn({ serviceId: data.serviceId, code: data.code })
        .then((outcome) => {
          if (outcome.status === "error") {
            setResult({ kind: "error", message: outcome.message });
            return;
          }
          const confirmed: CheckInData = {
            serviceId: outcome.service.id,
            service: outcome.service.name,
            day: outcome.service.day,
            time: outcome.service.time,
            code: outcome.code,
            expiresAt: data.expiresAt,
          };
          setResult(
            outcome.status === "added"
              ? { kind: "success", data: confirmed, at: outcome.at }
              : { kind: "duplicate", data: confirmed },
          );
        })
        .catch(() =>
          setResult({
            kind: "error",
            message:
              "Something went wrong. Check your connection and try again.",
          }),
        );
    },
    [stopCamera],
  );

  const handleText = React.useCallback(
    (text: string) => {
      const data = parseCheckIn(text);
      if (!data) {
        stopCamera();
        setResult({
          kind: "error",
          message: "That QR code isn’t a church check-in code.",
        });
        return;
      }
      handleData(data);
    },
    [handleData, stopCamera],
  );

  // Opened from a phone camera scan: the link already holds the check-in data.
  React.useEffect(() => {
    if (!searchParams.get("code")) return;
    const data = parseCheckIn(`?${searchParams.toString()}`);
    router.replace("/dashboard/scan");
    if (data) handleData(data);
  }, [searchParams, router, handleData]);

  React.useEffect(() => stopCamera, [stopCamera]);

  const startCamera = async () => {
    setResult(null);
    setCameraError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("This browser can’t open the camera.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setScanning(true);

      const tick = () => {
        const canvas = canvasRef.current;
        const el = videoRef.current;
        if (!canvas || !el) return;

        if (el.readyState === el.HAVE_ENOUGH_DATA && el.videoWidth > 0) {
          const scale = Math.min(1, 640 / el.videoWidth);
          canvas.width = Math.round(el.videoWidth * scale);
          canvas.height = Math.round(el.videoHeight * scale);
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
            const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(image.data, image.width, image.height, {
              inversionAttempts: "dontInvert",
            });
            if (code?.data) {
              handleText(code.data);
              return;
            }
          }
        }
        frameRef.current = requestAnimationFrame(tick);
      };
      frameRef.current = requestAnimationFrame(tick);
    } catch {
      setCameraError(
        "Camera access was blocked. Allow the camera in your browser, or enter the code below.",
      );
    }
  };

  const submitManual = (e: React.FormEvent) => {
    e.preventDefault();
    const value = manual.trim();
    if (!value) return;

    const parsed = parseCheckIn(value);
    if (parsed) {
      handleData(parsed);
      setManual("");
      return;
    }

    // A bare code: the server works out which service it belongs to.
    void submitCheckIn({ code: value })
      .then((outcome) => {
        if (outcome.status === "error") {
          setResult({ kind: "error", message: outcome.message });
          return;
        }
        const confirmed: CheckInData = {
          serviceId: outcome.service.id,
          service: outcome.service.name,
          day: outcome.service.day,
          time: outcome.service.time,
          code: outcome.code,
          expiresAt: 0,
        };
        setResult(
          outcome.status === "added"
            ? { kind: "success", data: confirmed, at: outcome.at }
            : { kind: "duplicate", data: confirmed },
        );
        setManual("");
      })
      .catch(() =>
        setResult({
          kind: "error",
          message: "Something went wrong. Check your connection and try again.",
        }),
      );
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card variant="surface" className="gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold">Scan the QR code</h2>
          <p className="text-muted-foreground text-xs">
            Point your camera at the code the usher is showing.
          </p>
        </div>

        <div className="bg-navy relative aspect-square w-full overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            muted
            className="size-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {!scanning && (
            <div className="absolute inset-0 grid place-items-center p-6 text-center text-white">
              <div className="flex flex-col items-center gap-3">
                <CameraOffIcon className="size-8 opacity-70" />
                <p className="text-sm text-white/80">Camera is off</p>
              </div>
            </div>
          )}

          {scanning && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-8 border-2 border-white/70"
            />
          )}
        </div>

        {cameraError && (
          <p className="text-destructive text-xs leading-relaxed">
            {cameraError}
          </p>
        )}

        {scanning ? (
          <Button variant="outline" size="lg" onClick={stopCamera}>
            Stop camera
          </Button>
        ) : (
          <Button variant="red" size="lg" onClick={startCamera}>
            <CameraIcon />
            Start scanning
          </Button>
        )}

        <form
          onSubmit={submitManual}
          className="border-line flex flex-col gap-2 border-t pt-4"
        >
          <Label htmlFor="manual-code" className="flex items-center gap-1.5">
            <KeyboardIcon className="size-3.5" aria-hidden="true" />
            Can’t scan? Enter the code or paste the link
          </Label>
          <div className="flex gap-2">
            <Input
              id="manual-code"
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="e.g. 7K2M9QX4TB"
              autoComplete="off"
            />
            <Button type="submit" variant="dark">
              Check in
            </Button>
          </div>
        </form>
      </Card>

      <ResultPanel result={result} onReset={() => setResult(null)} />
    </div>
  );
}

function ResultPanel({
  result,
  onReset,
}: {
  result: Result | null;
  onReset: () => void;
}) {
  if (!result) {
    return (
      <Card
        variant="surface"
        className="text-muted-foreground items-center justify-center gap-2 text-center text-sm"
      >
        <p className="text-foreground font-serif text-lg font-bold">
          Waiting for a scan
        </p>
        <p className="max-w-xs text-xs leading-relaxed">
          When you scan a code, the service details appear here and your
          attendance is recorded.
        </p>
      </Card>
    );
  }

  if (result.kind === "error") {
    return (
      <Card variant="surface" className="gap-4">
        <CircleAlertIcon className="text-destructive size-8" />
        <div>
          <h2 className="font-serif text-xl font-extrabold">
            Couldn’t check you in
          </h2>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {result.message}
          </p>
        </div>
        <Button variant="outline" className="w-max" onClick={onReset}>
          Try again
        </Button>
      </Card>
    );
  }

  const { data } = result;
  const rows: [string, string][] = [
    ["Service", data.service],
    ["When", [data.day, data.time].filter(Boolean).join(", ")],
    ["Code", data.code],
    [
      "Checked in at",
      format(result.kind === "success" ? result.at : Date.now(), "h:mm:ss a"),
    ],
  ];

  return (
    <Card variant="surface" className="gap-5">
      <CheckCircle2Icon className="text-green size-8" />
      <div>
        <h2 className="font-serif text-xl font-extrabold">
          {result.kind === "success"
            ? "You’re checked in"
            : "Already checked in today"}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {result.kind === "success"
            ? "Welcome. Your attendance has been recorded."
            : "You’d already scanned in for this service today."}
        </p>
      </div>

      <dl className="border-line divide-line divide-y border text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 px-3 py-2.5">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      <Button variant="outline" className="w-max" onClick={onReset}>
        Scan another
      </Button>
    </Card>
  );
}
