import PptxGenJS from "pptxgenjs";
export const generatePPT = ({
  content,
}: {
  content?: { sections: { title: string; content: string[] }[] };
}): string => {
  //@ts-ignore
  let pres = new PptxGenJS();
  // 2. Add a Slide
  content?.sections.forEach((section) => {
    const slide = pres.addSlide(); // 3. Add one or more objects (Tables, Shapes, Images, Text and Media) to the Slide
    let textboxText = section.title;
    let textboxOpts = { x: 1, y: 1, fontSize: 32, color: "363636" };
    const bulletPoints = section.content.map((content) => {
      return {
        text: content,
        options: { bullet: true, indentLevel: 1 },
      };
    });
    slide.addText(textboxText, textboxOpts);
    slide.addText(bulletPoints, { x: 1, y: 2.2 });
  });

  pres.writeFile();
  return content ? "powerpoint generated" : "no content provided";
};
