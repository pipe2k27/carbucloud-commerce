import React from "react";

type RichTextDisplayProps = {
  content?: string;
  className?: string;
  fallbackText?: string;
};

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({
  content,
  className = "",
  fallbackText = "Sin Especificar",
}) => {
  if (!content) {
    return <span className={className}>{fallbackText}</span>;
  }

  const formatText = (text: string) => {
    // Convert line breaks to <br> tags
    let formatted = text.replace(/\n/g, "<br>");

    // Convert **text** to <strong>text</strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Convert *text* to <em>text</em>
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

    return formatted;
  };

  return (
    <div
      className={`whitespace-pre-wrap ${className}`}
      dangerouslySetInnerHTML={{ __html: formatText(content) }}
    />
  );
};

export default RichTextDisplay;
