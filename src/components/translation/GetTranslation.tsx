'use server';
import { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import parse from 'html-react-parser';

type TranslationEditorProps = {
  children?: ReactNode;
  namespace: string;
  id: string;
  raw?: boolean;
  asString?: boolean;
  replace?: { search: string; value: string }[];
};

export async function GetTranslation({
  children,
  namespace = '',
  id = '',
  raw = false,
  replace = [],
  asString = false,
}: TranslationEditorProps) {
  const t = await getTranslations(namespace);
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
    // <TranslationEditor namespace={namespace} id={id}>
      <>{raw ? parse(text) : text || children}</>
    // </TranslationEditor>
  );
}
