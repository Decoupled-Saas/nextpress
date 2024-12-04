import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Img,
} from "@react-email/components";

interface SubscriptionConfirmationProps {
  username: string;
  planName: string;
  endDate: string;
}

export const SubscriptionConfirmation: React.FC<
  SubscriptionConfirmationProps
> = ({ username, planName, endDate }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
          width="80"
          height="80"
          alt="NextPress Logo"
          style={logo}
        />
        <Text style={heading}>Subscription Confirmed!</Text>
        <Text style={paragraph}>Hi {username},</Text>
        <Text style={paragraph}>
          Thank you for subscribing to NextPress. Your subscription has been
          successfully processed.
        </Text>
        <Section style={detailsContainer}>
          <Text style={detailsText}>
            <strong>Plan:</strong> {planName}
            <br />
            <strong>Valid until:</strong> {endDate}
          </Text>
        </Section>
        <Text style={paragraph}>
          You now have access to all our premium content. Enjoy exploring
          NextPress!
        </Text>
        <Section style={buttonContainer}>
          <Button
            pX={12}
            pY={12}
            style={button}
            href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
          >
            Go to Dashboard
          </Button>
        </Section>
        <Text style={paragraph}>
          If you have any questions about your subscription, please don&#39;t
          hesitate to contact our support team.
        </Text>
        <Text style={paragraph}>
          Best regards,
          <br />
          The NextPress Team
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const logo = {
  margin: "0 auto",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
  textAlign: "left" as const,
  marginTop: "20px",
};

const detailsContainer = {
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  padding: "20px",
  marginTop: "32px",
};

const detailsText = {
  fontSize: "16px",
  lineHeight: "1.4",
  color: "#484848",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
};

const button = {
  backgroundColor: "#5469d4",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

export default SubscriptionConfirmation;
