"use client";

import {
  type SpringOptions,
  type UseInViewOptions,
  useInView,
  useMotionValue,
  useSpring,
} from "motion/react";
import * as React from "react";

type CountingNumberProps = Omit<React.ComponentProps<"span">, "children"> & {
  number: number;
  fromNumber?: number;
  decimalPlaces?: number;
  decimalSeparator?: string;
  thousandSeparator?: string | boolean;
  padStart?: boolean;
  transition?: SpringOptions;
  delay?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: UseInViewOptions["margin"];
};

const formatNumber = (
  value: number,
  decimalPlaces: number,
  decimalSeparator: string,
  thousandSeparator: string | boolean,
  padStart: boolean,
  integerLength: number,
) => {
  let formatted =
    decimalPlaces > 0
      ? value.toFixed(decimalPlaces)
      : Math.round(value).toString();

  if (decimalPlaces > 0) {
    formatted = formatted.replace(".", decimalSeparator);
  }

  const [rawInteger, decimal] = formatted.split(decimalSeparator);
  let integer = rawInteger ?? "";

  if (padStart) {
    integer = integer.padStart(integerLength, "0");
  }

  if (thousandSeparator) {
    const separator =
      typeof thousandSeparator === "string" ? thousandSeparator : ",";
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }

  return decimal ? `${integer}${decimalSeparator}${decimal}` : integer;
};

function CountingNumber({
  ref,
  number,
  fromNumber = 0,
  decimalPlaces = 0,
  decimalSeparator = ".",
  thousandSeparator = false,
  padStart = false,
  transition = {
    stiffness: 120,
    damping: 25,
  },
  delay = 0,
  inView = true,
  inViewOnce = true,
  inViewMargin = "0px",
  ...props
}: CountingNumberProps) {
  const localRef = React.useRef<HTMLSpanElement>(null);

  const setRefs = React.useCallback(
    (node: HTMLSpanElement | null) => {
      localRef.current = node;

      if (!ref) return;

      if (typeof ref === "function") {
        ref(node);
      } else {
        ref.current = node;
      }
    },
    [ref],
  );

  const isInView = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });

  const motionValue = useMotionValue(fromNumber);
  const springValue = useSpring(motionValue, transition);

  const integerLength = Math.floor(Math.abs(number)).toString().length;

  React.useEffect(() => {
    if (inView && !isInView) return;

    const timeout = window.setTimeout(() => {
      motionValue.set(number);
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [number, delay, motionValue, inView, isInView]);

  React.useEffect(() => {
    const unsubscribe = springValue.on("change", (value) => {
      if (!localRef.current) return;

      localRef.current.textContent = formatNumber(
        value,
        decimalPlaces,
        decimalSeparator,
        thousandSeparator,
        padStart,
        integerLength,
      );
    });

    return unsubscribe;
  }, [
    springValue,
    decimalPlaces,
    decimalSeparator,
    thousandSeparator,
    padStart,
    integerLength,
  ]);

  const initialText = formatNumber(
    fromNumber,
    decimalPlaces,
    decimalSeparator,
    thousandSeparator,
    padStart,
    integerLength,
  );

  return (
    <span ref={setRefs} data-slot="counting-number" {...props}>
      {initialText}
    </span>
  );
}

export { CountingNumber, type CountingNumberProps };
