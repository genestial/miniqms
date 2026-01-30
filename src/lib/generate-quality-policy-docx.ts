import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

/**
 * Generate a Word document from the Quality Policy template text
 */
export async function generateQualityPolicyDocx(templateText: string): Promise<Blob> {
  // Split the template into sections
  const lines = templateText.split('\n')
  const children: Paragraph[] = []
  
  let currentSection: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip empty lines at the start
    if (!line && currentSection.length === 0) continue
    
    // Detect headings (all caps or lines ending with colon)
    if (line && line === line.toUpperCase() && line.length < 50 && !line.includes('[')) {
      if (currentSection.length > 0) {
        children.push(
          new Paragraph({
            text: currentSection.join(' '),
            spacing: { after: 200 },
          })
        )
        currentSection = []
      }
      children.push(
        new Paragraph({
          text: line,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      )
    } else if (line.match(/^\d+\.\s/)) {
      // Numbered list items
      if (currentSection.length > 0) {
        children.push(
          new Paragraph({
            text: currentSection.join(' '),
            spacing: { after: 200 },
          })
        )
        currentSection = []
      }
      children.push(
        new Paragraph({
          text: line,
          spacing: { before: 100, after: 100 },
        })
      )
    } else if (line && !line.startsWith('---')) {
      // Regular text
      if (line.includes('[') && line.includes(']')) {
        // Placeholder text - make it bold and italic
        const parts = line.split(/(\[.*?\])/g)
        const runs: TextRun[] = []
        parts.forEach((part) => {
          if (part.startsWith('[') && part.endsWith(']')) {
            runs.push(
              new TextRun({
                text: part,
                bold: true,
                italics: true,
                color: '0066CC',
              })
            )
          } else if (part.trim()) {
            runs.push(new TextRun(part))
          }
        })
        if (runs.length > 0) {
          children.push(
            new Paragraph({
              children: runs,
              spacing: { after: 200 },
            })
          )
        }
      } else {
        currentSection.push(line)
      }
    } else if (line.startsWith('---')) {
      // Separator - add current section and a break
      if (currentSection.length > 0) {
        children.push(
          new Paragraph({
            text: currentSection.join(' '),
            spacing: { after: 200 },
          })
        )
        currentSection = []
      }
    }
  }
  
  // Add remaining section
  if (currentSection.length > 0) {
    children.push(
      new Paragraph({
        text: currentSection.join(' '),
        spacing: { after: 200 },
      })
    )
  }
  
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  })
  
  const blob = await Packer.toBlob(doc)
  return blob
}
