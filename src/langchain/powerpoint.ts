import PptxGenJS from "pptxgenjs";
export const generatePPT = ({
  content,
}: {
  content?: {
    sections: {
      title: string;
      content: string[];
      sources?: { url: string; title: string }[];
      images?: string[];
    }[];
  };
}): string => {
  const pres = new PptxGenJS();
  // 2. Add a Slide
  content?.sections.forEach((section) => {
    const slide = pres.addSlide();
    const textboxText = section.title;
    const textboxOpts = { x: 1, y: 1, fontSize: 32, color: "363636" };
    const bulletPoints = section.content.map((content) => {
      return {
        text: content,
        options: { bullet: true, indentLevel: 1 },
      };
    });
    slide.addText(textboxText, textboxOpts);
    slide.addText(bulletPoints, { x: 1, y: 2.2 });

    if (section.sources) {
      const links = section.sources?.map((link) => {
        return {
          text: `[Source: ${link.url}] ${link.title}`,
        };
      });
      slide.addText(links, { x: 1, y: 3.2 });
    }
  });

  pres.writeFile();
  return content ? "powerpoint generated" : "no content provided";
};
