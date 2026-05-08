import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import { config } from "@/config";

interface Props {
  readonly name: string;
  readonly appUrl: string;
}

export function WelcomeEmail({ name, appUrl }: Props): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {config.appName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to {config.appName}</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Your account is ready. Head to your dashboard to get started.
          </Text>
          <Link href={`${appUrl}/dashboard`} style={button}>
            Go to dashboard
          </Link>
          <Hr style={hr} />
          <Text style={footer}>
            {config.appName} · <Link href={config.domain}>{config.domain}</Link>
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
const button = {
  display: "inline-block",
  backgroundColor: config.colors.primary,
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold",
};
const hr = { border: "1px solid #e5e7eb", margin: "24px 0" };
const footer = { fontSize: "12px", color: "#9ca3af" };
