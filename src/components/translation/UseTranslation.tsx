import { ReactNode } from 'react';
import parse from 'html-react-parser';
import { useTranslations } from "next-intl";

type TranslationEditorProps = {
  children?: ReactNode;
  namespace: string;
  id: string;
  raw?: boolean;
  asString?: boolean;
  replace?: { search: string; value: string }[];
};

export function UseTranslation({
  children,
  namespace = '',
  id = '',
  raw = false,
  replace = [],
  asString = false,
}: TranslationEditorProps) {
  const t = useTranslations(namespace);
  let text: string = '';
  if (t.has(id)) {
    if (raw) {
      text = t.raw(id);
    } else {
      text = t(id);
    }
  }
  replace?.forEach(({ search, value }) => {
    text = text.replace(search, value);
  });
  if (asString) {
    return text || children?.toString() || '';
  }
  return (
    <>
      {raw ? parse(text) : text || children}
    </>
  );
}
