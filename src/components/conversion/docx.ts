import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";

const processor = unified().use(markdown).use(docx, { output: "blob" });

export default async function convert(text: string): Promise<Blob> {
  const doc = await processor.process(text);
  const blob = (await doc.result) as Blob;
  
  return blob;
}