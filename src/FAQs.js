import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Box,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const faqData = [
  {
    question: "What is Alba Wildlife Cruises?",
    answer:
      "Alba Wildlife Cruises operates a passenger ferry between the mainland and the three islands of Eigg, Rum, and Muck. The company provides picturesque vistas, island-hopping services, food, and mail delivery to these islands.",
  },
  {
    question: "How do I make a booking?",
    answer:
      "Once it is available, you can book by phone, email, or through the online booking system. If you need help, please contact us directly.",
  },
  {
    question: "Are there any discounts for frequent customers?",
    answer:
      "Once your booking is confirmed, you can print your boarding pass directly from the website. Be sure to take it with you when you board the ferry.",
  },
];

const FaqPage = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Frequently asked Question (FAQs)</Typography>
      <Box>
        {faqData.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};
export default FaqPage;
