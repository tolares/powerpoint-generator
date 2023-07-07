import PptxGenJS from "pptxgenjs";
export const generatePPT = ({
  content,
}: {
  content?: { sections: { title: string; content: string[] }[] };
}): string => {
  //@ts-ignore
  let pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";
  pres.defineSlideMaster({
    title: "PLACEHOLDER_SLIDE",
    background: { color: "FFFFFF" },
    objects: [
      { rect: { x: 0, y: 0, w: "100%", h: 0.75, fill: { color: "F1F1F1" } } },
      {
        text: {
          text: "Title Placeholder",
          options: { name: "title", x: 0, y: 0, w: 6, h: 0.75, fontSize: 32 },
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
          },
          text: "(custom placeholder text!)",
        },
      },
    ],
    slideNumber: { x: 0.3, y: "95%" },
  });
  // 2. Add a Slide
  content?.sections.forEach((section) => {
    const slide = pres.addSlide({ masterName: "PLACEHOLDER_SLIDE" });
    let textboxText = section.title;
    let textboxOpts = { placeholder: "title" };
    const bulletPoints = section.content.map((content) => {
      return {
        text: content,
        options: { bullet: true, indentLevel: 1, placeholder: "body" },
      };
    });
    slide.addText(textboxText, textboxOpts);
    slide.addText(bulletPoints, { x: 1, y: 2.2 });
  });

  pres.writeFile();
  return content ? "powerpoint generated" : "no content provided";
};
