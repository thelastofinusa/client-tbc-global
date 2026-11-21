import React from "react";
import { Container } from "~/components/shared/container";

export const BeliefsComponent = () => {
  return (
    <section aria-label="Impact" className="relative flex-1 overflow-x-clip">
      <div className="bg-muted absolute grid h-full md:grid-cols-2">
        <div className="h-full bg-red-500" />
        <div className="h-full bg-blue-500" />
      </div>
      <Container className="relative py-16 md:py-24">
        BeliefsComponent
      </Container>
    </section>
  );
};
