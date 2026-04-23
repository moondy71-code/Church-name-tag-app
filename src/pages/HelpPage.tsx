import { helpContent } from "@/lib/helpContent";
import { getLang } from "@/lib/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type CardVariant = "default" | "warning" | "danger";

function getCardClasses(variant: CardVariant = "default") {
  switch (variant) {
    case "warning":
      return "border-yellow-300 bg-yellow-50";
    case "danger":
      return "border-red-300 bg-red-50";
    default:
      return "border-border bg-card";
  }
}

export default function HelpPage() {
  const lang = getLang() === "en" ? "en" : "ko";
  const content = helpContent[lang];
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 space-y-6">
    <div className="space-y-3">
  <Button
    type="button"
    variant="outline"
    onClick={() => navigate("/")}
    className="gap-2"
  >
    <ArrowLeft className="w-4 h-4" />
    {lang === "en" ? "Back" : "돌아가기"}
  </Button>

  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
    {content.pageTitle}
  </h1>

  <p className="text-sm sm:text-base text-muted-foreground leading-7">
    {content.intro}
  </p>
</div>

      <Accordion type="single" collapsible className="w-full space-y-3">
        {content.sections.map((section) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="border rounded-2xl px-4 bg-background"
          >
            <AccordionTrigger className="text-left text-base sm:text-lg font-semibold hover:no-underline">
              {section.title}
            </AccordionTrigger>

            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-4">
                {section.paragraphs?.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-sm sm:text-base leading-7 text-foreground"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.items?.map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl border p-4 sm:p-5 space-y-3 ${getCardClasses(
                      item.variant
                    )}`}
                  >
                    <h3 className="text-sm sm:text-base font-semibold">
                      {item.title}
                    </h3>

                    <div className="space-y-2">
                      {item.description.map((line, i) => (
                        <p
                          key={i}
                          className="text-sm sm:text-base leading-7 text-foreground"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <section className="rounded-2xl border p-4 sm:p-5 bg-card space-y-3">
        <h2 className="text-lg sm:text-xl font-semibold">
          {content.contactTitle}
        </h2>
        <p className="text-sm sm:text-base leading-7 text-muted-foreground">
          {content.contactDescription}
        </p>
        <p className="text-sm sm:text-base font-medium break-all">
          {content.email}
        </p>
      </section>
    </div>
  );
}