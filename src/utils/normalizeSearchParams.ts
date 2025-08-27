type FieldsIn = { keyword?: string; title?: string; author?: string; authors?: string;};
type FieldsOut = { keyword?: string; title?: string; author?: string };

export function normalizeSearchFields(input: FieldsIn): FieldsOut {
  const out: FieldsOut = {};
  const k = input.keyword?.trim();
  const t = input.title?.trim();
  const a = (input.author ?? input.authors)?.trim();

  if (k) out.keyword = k;
  if (t) out.title = t;
  if (a) out.author = a;
  return out;
}