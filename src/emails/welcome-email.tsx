import { Html, Head, Body, Container, Section, Text, Button, Img } from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
    username: string;
    verificationLink: string;
}

export default function WelcomeEmail({ username, verificationLink }: WelcomeEmailProps): React.ReactElement {
    return (
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
                    <Text style={heading}>Welcome to NextPress!</Text>
                    <Text style={paragraph}>
                        Hi {username},
                    </Text>
                    <Text style={paragraph}>
                        We&#39;re excited to have you on board. NextPress is a powerful CMS built with Next.js,
                        designed to make content management a breeze.
                    </Text>
                    <Section style={buttonContainer}>
                        <Button pX={12} pY={12} style={button} href={verificationLink}>
                            Verify your email
                        </Button>
                    </Section>
                    <Text style={paragraph}>
                        If you have any questions, feel free to reach out to our support team.
                    </Text>
                    <Text style={paragraph}>
                        Best regards,<br />
                        The NextPress Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};

const logo = {
    margin: '0 auto',
};

const heading = {
    fontSize: '32px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#484848',
    textAlign: 'center' as const,
};

const paragraph = {
    fontSize: '18px',
    lineHeight: '1.4',
    color: '#484848',
    textAlign: 'left' as const,
    marginTop: '20px',
};

const buttonContainer = {
    textAlign: 'center' as const,
    marginTop: '32px',
};

const button = {
    backgroundColor: '#5469d4',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
};

