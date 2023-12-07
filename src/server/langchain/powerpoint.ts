import PptxGenJS from "pptxgenjs";
export const generatePPT = ({
  content,
}: {
  content?: {
    sections: {
      title: string;
      content: string[];
      sources: { url: string; title: string }[];
      images: string[];
    }[];
  };
}): string => {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";
  pres.defineSlideMaster({
    title: "PLACEHOLDER_SLIDE",
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
            w: 6,
            h: 0.75,
            fontSize: 32,
            type: "title",
            align: "left",
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
  // 2. Add a Slide
  content?.sections.forEach((section) => {
    const slide = pres.addSlide({ masterName: "PLACEHOLDER_SLIDE" });
    const textboxText = section.title;
    const textboxOpts = { placeholder: "title" };
    const bulletPoints = section.content.map((content) => {
      return {
        text: content,
        options: { bullet: true, indentLevel: 1 },
      };
    });
    slide.addText(textboxText, textboxOpts);
    slide.addText(bulletPoints, { x: 1, y: 2.2, placeholder: "body" });
  });

  pres.writeFile();
  return content ? "powerpoint generated" : "no content provided";
};
