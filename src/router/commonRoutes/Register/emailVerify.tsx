import { Box, Heading, Text } from "@chakra-ui/react";

export default function EmailVerify({ email }: { email: string }) {
  return (
    <Box
      boxShadow="lg"
      borderRadius="2xl"
      p={6}
      textAlign="center"
      maxW="md"
      mb={4}
      bg="white"
    >
      <Heading as="h3" size="lg" color="gray.800">
        Verification link sent!
      </Heading>
      <Text color="gray.600" mt={2} textAlign="left">
        Please check your inbox at <b>{email}</b> and click the verification link to complete the registration process.
      </Text>
      <Text fontSize="sm" color="gray.500" mt={2} textAlign="left">
        If you don't receive the email, check your spam folder or try resending it.
      </Text>
    </Box>
  );
}
