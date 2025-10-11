
import React from 'react';
import { Link } from './Link';

interface TruncatedTextLinkProps {
  text?: string;
  characters?: number;
  link?: string;
  linkText?: string;
}

const TruncatedTextLink: React.FC<TruncatedTextLinkProps> = ({
  text = '',
  characters = 100,
  link = '',
  linkText = '',
}) => {
  if (!text) {
    return (
      <Link isUnderlined={false} href={link} target="_blank">
        {linkText}
      </Link>
    );
  }

  const truncatedText = text.length > characters ? `${text.substring(0, characters)}...` : text;

  return (
    <div className="flex flex-col relative gap-2">
      <div className="whitespace-pre-wrap">{truncatedText}</div>
      <Link isUnderlined={false} href={link} target="_blank">
        {linkText}
      </Link>
    </div>
  );
};

export default TruncatedTextLink;
