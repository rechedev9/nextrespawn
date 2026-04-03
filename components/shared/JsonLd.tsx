// JSON-LD structured data component using React's native script-children support.
// React 18+ allows children on <script> elements, so no dangerouslySetInnerHTML needed.
// https://react.dev/reference/react-dom/components/script

interface Props {
  readonly data: Record<string, unknown>;
}

export function JsonLd({ data }: Props): React.ReactElement {
  return (
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  );
}
