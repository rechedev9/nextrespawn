"use client";

import { useState } from "react";
import { config } from "@/config";
import { Separator } from "@/components/ui/separator";

export function FAQ(): React.ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <h2 className="text-3xl font-bold text-center mb-12">
        Frequently asked questions
      </h2>
      <div className="space-y-0">
        {config.faq.map((item, i) => (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex justify-between items-center py-4 text-left font-medium hover:text-primary transition-colors"
            >
              {item.question}
              <span className="ml-4 shrink-0 text-muted-foreground">
                {openIndex === i ? "−" : "+"}
              </span>
            </button>
            {openIndex === i && (
              <p className="pb-4 text-muted-foreground text-sm">{item.answer}</p>
            )}
            {i < config.faq.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </section>
  );
}
