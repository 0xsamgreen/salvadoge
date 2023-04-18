const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;

app.post('/generate-images', async (req, res) => {
    const { setting, verb } = req.body;
    console.log(`Photograph of a ${setting} ${verb}`);
  
    // Construct the prompt for DALL-E
    const prompt = `Create an image of a ${setting} scene with a ${verb} action`;
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: 'image-alpha-001',
          size: '512x512',
          prompt,
          n: 1, // Generate 1 image
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
        }
      );
  
      const images = response.data.data.map((image) => ({
        id: image.id,
        url: image.url,
      }));

      console.log("Generated images:", images);
  
      res.json(images);
    } catch (error) {
      console.error('Error generating images:', error);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
