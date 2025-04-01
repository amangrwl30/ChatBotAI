# Shopify Facebook Messenger AI Chatbot

This is an AI-powered chatbot that integrates with Facebook Messenger and connects to your Shopify store to provide automated customer support.

## Features

- Product inventory queries
- Price inquiries
- Repair service pricing
- Store information (hours, location, contact details)
- Natural language processing for customer queries
- Spelling and grammar error tolerance
- Product condition information
- Direct purchase links

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file with the following variables:
   ```
   SHOPIFY_SHOP_URL=your-shopify-store.myshopify.com
   SHOPIFY_ACCESS_TOKEN=your-shopify-access-token
   OPENAI_API_KEY=your-openai-api-key
   FACEBOOK_APP_SECRET=your-facebook-app-secret
   FACEBOOK_PAGE_ACCESS_TOKEN=your-facebook-page-access-token
   FACEBOOK_VERIFY_TOKEN=your-verify-token
   ```

4. Run the application:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

5. Set up Facebook Messenger webhook:
   - Go to your Facebook Developer Console
   - Create a new app or select existing one
   - Set up Messenger webhook with your server URL
   - Configure the webhook URL as: `https://your-domain/webhook`
   - Set the verify token to match FACEBOOK_VERIFY_TOKEN

## Configuration

The chatbot can be configured through the following environment variables:

- `SHOPIFY_SHOP_URL`: Your Shopify store URL
- `SHOPIFY_ACCESS_TOKEN`: Your Shopify API access token
- `OPENAI_API_KEY`: Your OpenAI API key
- `FACEBOOK_APP_SECRET`: Your Facebook App Secret
- `FACEBOOK_PAGE_ACCESS_TOKEN`: Your Facebook Page Access Token
- `FACEBOOK_VERIFY_TOKEN`: A custom token for webhook verification

## Usage

The chatbot will automatically respond to customer messages on your Facebook Messenger page. It can handle:

- Product inquiries
- Price checks
- Repair service pricing
- Store information requests
- Product condition queries
- Purchase assistance

## Security

- All API keys and secrets are stored in environment variables
- Facebook webhook verification is implemented
- HTTPS is required for production deployment 


## Reference Work

We own an E-commerce electronic Shopify store.

We are looking to integrate an AI chatbot into our business facebook messenger. It needs to be able to respond to customer queries by pulling information from our online store.

For example, if a customer asked "What iPhone 12 do you have in?" or "how much do you charge for an iPhone 13 screen", the chatbot would provide a list of relevant product titles and prices from our online store.

The chatbot should be able to recognise spelling and grammatical errors like "du u have any 12 in?". It also needs to recognise customers will say “any 13 in” whereas they mean “Do you have any iPhone 13 in stock?”

Customers will also message us asking how much we'll buy items for, opening hours, location, phone number and problems that they have with devices, so it needs to handle these types of queries as well.

We'd like the chatbot to be able to give responses such as:
Hi, we have these iPhone 12s currently in stock:
iPhone 12 128GB Unlocked Black (C) M23227 (£225.00)
iPhone 12 128GB Unlocked Blue (C) M23398 (£195.00)
iPhone 12 64GB Unlocked Black (A) M22907 (£265.00)
iPhone 12 64GB Unlocked Black (A) M22986 (£265.00)

We also would like to only display one product if there is duplicates - the M number above is only our individual stock number.

If the customer wishes to purchase, a link should be sent to the item they’re interested in or a link to the Shopify collection for that model. If a customer further queries the product, such as "what condition is it in?”, then tell them about our condition criteria and explain that the (a) is the condition in the product title. The grading criteria should be translated as follows: (A) tell the customer it’s like new, (B) tell the customer it’s in good condition and (C) tell the customer it’s in average condition.

When a customer queries a repair price for a device, it needs to lookup the pricing from our website, e.g iPhone 12 OLED screen replacement would be £105.

We use Shopify for our products sorted into collections and have our API keys. We have our OpenAI API key for the chat bot. We have AWS lightsail for hosting.