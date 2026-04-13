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
  readonly url: string;
  readonly email: string;
}

export function MagicLinkEmail({ url, email }: Props): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>Sign in to {config.appName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Sign in to {config.appName}</Heading>
          <Text style={text}>
            We received a sign-in request for <strong>{email}</strong>. Click the
            button below to sign in. The link expires in 10 minutes.
          </Text>
          <Link href={url} style={button}>
            Sign in
          </Link>
          <Hr style={hr} />
          <Text style={footer}>
            If you did not request this, you can safely ignore this email.
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
