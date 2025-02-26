const markdownSample = () => {
    return `
    # Markdown Syntax Reference

# Heading 1  
## Heading 2  
### Heading 3  
#### Heading 4  
##### Heading 5  
###### Heading 6  

## Emphasis

*Italic* or _Italic_  
**Bold** or __Bold__  
***Bold and Italic***  
~~Strikethrough~~  

## Lists

### Unordered List
- Item 1
- Item 2
  - Sub-item 1
  - Sub-item 2

### Ordered List
1. First item
2. Second item
   1. Sub-item 1
   2. Sub-item 2

## Links

[OpenAI](https://openai.com)  

## Images

![Alt Text](https://fastly.picsum.photos/id/579/536/354.jpg?hmac=L2H2E8SPUhG3vCptobqnf4mK-FRP-OWUkkW-rPLdYvc)

## Code Blocks

### Inline Code
\`inline code\`

### Block Code
\`\`\`
print("Hello, Markdown!")
\`\`\`

### Code with Language
\`\`\`python
def hello():
    print("Hello, Markdown!")
\`\`\`

## Blockquotes

> This is a blockquote.
>
> It can span multiple lines.

## Horizontal Rule

---

## Tables

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |

## Task List

- [x] Task 1
- [ ] Task 2
- [ ] Task 3

## Emoji

:smile: :rocket: :+1:

## Footnotes

This is a reference to a footnote[^1].

[^1]: This is the footnote content.

## HTML in Markdown

<div style="color: red;">This is red text in HTML.</div>

## Escaping Characters

\\*This is not italic\\*

`
}
export default markdownSample;