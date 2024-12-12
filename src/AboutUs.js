import React from "react";
import { Box, Typography, Container, Grid, Paper, styled } from "@mui/material";
const ImageWarpper = styled(Paper)({
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
});
const AboutUs = () => {
  return (
    <Container maxWidth="md">
      <Box mt={4} textAlign="center">
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontSize: { xs: "2rem", sm: "3rem" } }}
        >
          About Alba Wildlife Cruises
        </Typography>
        <Typography
          variant="h6"
          paragraph
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          Alba Wildlife Cruises is a ferry company based in the picturesque port
          of Mallaig on the west coast of Scotland.
        </Typography>
        <Typography
          variant="h6"
          paragraph
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          The company specialises in providing ferry services to the three
          beautiful islands of Eigg, Rum and Muck, offering both passenger and
          cargo services.
        </Typography>
        <Typography
          variant="h6"
          paragraph
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          The ferry can accommodate up to 30 passengers and is also used to
          transport food and mail to these islands, which support a small local
          community.
        </Typography>

        <Grid contaiber spacing={2}>
          <Grid item xs={12} md={6}>
            <ImageWarpper>
              <img
                src="https://www.scenic.eu/-/media/project/scenic/scenic-tours/explore-images/greenland-and-iceland/iceland-top-banner/se_scenic-eclipse-reine-lofoten-islands-norway_desktop.jpg?h=585&iar=0&w=1400&rev=8afd7c5592c943f9b8eb8db0395dc3cd&hash=7F578F931A98F6CF7582B2083AD89F0A"
                alt="Alba Wildlife Cruises"
                style={{ width: "100%", height: "auto" }}
              ></img>
            </ImageWarpper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
export default AboutUs;
