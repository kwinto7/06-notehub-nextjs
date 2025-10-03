interface Props {
  message: string;
}
export default function ErrorBox({ message }: Props) {
  return <div style={{ padding: 12, color: "crimson" }}>{message}</div>;
}