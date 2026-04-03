import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { config } from "@/config";

interface Props {
  readonly name: string;
  readonly planName: string;
  readonly amount: string;
  readonly date: string;
}

export function ReceiptEmail({
  name,
  planName,
  amount,
  date,
}: Props): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>Your {config.appName} receipt</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment confirmed</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Thank you for your purchase. Here is your receipt.
          </Text>

          <table width="100%" style={table}>
            <tbody>
              <tr>
                <td style={tdLabel}>Plan</td>
                <td style={tdValue}>{planName}</td>
              </tr>
              <tr>
                <td style={tdLabel}>Amount</td>
                <td style={tdValue}>{amount}</td>
              </tr>
              <tr>
                <td style={tdLabel}>Date</td>
                <td style={tdValue}>{date}</td>
              </tr>
            </tbody>
          </table>

          <Hr style={hr} />
          <Text style={footer}>
            Questions? Reply to this email or visit{" "}
            {config.domain}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "24px",
  borderRadius: "8px",
  maxWidth: "560px",
};
const h1 = { fontSize: "24px", fontWeight: "bold", color: "#1a1a1a" };
const text = { fontSize: "16px", color: "#374151", lineHeight: "1.5" };
const table = {
  borderCollapse: "collapse" as const,
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  margin: "16px 0",
};
const tdLabel = {
  padding: "10px 16px",
  color: "#6b7280",
  fontSize: "14px",
  borderBottom: "1px solid #e5e7eb",
};
const tdValue = {
  padding: "10px 16px",
  color: "#111827",
  fontWeight: "bold",
  fontSize: "14px",
  borderBottom: "1px solid #e5e7eb",
};
const hr = { border: "1px solid #e5e7eb", margin: "24px 0" };
const footer = { fontSize: "12px", color: "#9ca3af" };
