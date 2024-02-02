import PptxGenJS from "pptxgenjs";
export const generatePPT = ({
  content,
}: {
  content?: {
    mainTitle: string;
    sections: {
      title: string;
      content: string[];
      sources: { url: string; title: string }[];
      images: string[];
    }[];
  };
}): string => {
  if (!content) return "no content provided";
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";
  pres.defineSlideMaster({
    title: "MASTER_SLIDE",
    background: { color: "FFFFFF" },
    objects: [
      { rect: { x: 0, y: 0, w: "100%", h: 0.75, fill: { color: "F1F1F1" } } },
      {
        placeholder: {
          text: "Title Placeholder",
          options: {
            name: "title",
            x: 0,
            y: 0,
            w: "100%",
            h: 0.75,
            fontSize: 32,
            type: "title",
            align: "left",
            color: "#fe5000",
          },
        },
      },
      {
        placeholder: {
          options: {
            name: "body",
            type: "body",
            x: 0.6,
            y: 1.5,
            w: 12,
            h: 5.25,
            align: "left",
          },
          text: "Placeholder Text",
        },
      },
    ],
    slideNumber: { x: 0.3, y: "95%" },
  });

  pres.defineSlideMaster({
    title: "TITLE_SLIDE",
    background: { color: "FFFFFF" },
    objects: [
      {
        placeholder: {
          text: "Title Placeholder",
          options: {
            name: "title",
            x: 0.6,
            y: 1.5,
            w: "60%",
            h: 3,
            fontSize: 60,
            type: "title",
            align: "left",
            bold: true,
            color: "#fe5000",
          },
        },
      },
    ],
    slideNumber: { x: 0.3, y: "95%" },
  });
  const titleSlide = pres.addSlide({ masterName: "TITLE_SLIDE" });
  titleSlide.addText(content?.mainTitle, {
    placeholder: "title",
  });
  // 2. Add a Slide
  content?.sections.forEach((section) => {
    const slide = pres.addSlide({ masterName: "MASTER_SLIDE" });
    const textboxText = section.title;
    const textboxOpts = { placeholder: "title" };
    slide.addText(textboxText, textboxOpts);
    const bulletPoints = section.content.map((content) => {
      return {
        text: content,
        options: { bullet: true, indentLevel: 1, breakLine: true },
      };
    });
    slide.addText(bulletPoints, { x: 1, y: 2.2, placeholder: "body" });
  });

  const thankYouSlide = pres.addSlide({ masterName: "TITLE_SLIDE" });
  thankYouSlide.addText("Thank you!", {
    placeholder: "title",
  });
  pres.writeFile();
  return "powerpoint generated";
};
