const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Remplacez par votre clé secrète Stripe
const router = express.Router();

router.get('/', (req, res) => {
  res.json('API Stripe pour paiements NFC');
});

// Route pour générer un token de test
router.post('/create-token', async (req, res) => {
  try {
    // Retourne un token de test prédéfini
    res.json({
      success: true,
      token: 'tok_visa', // Token de test fourni par Stripe
    });
  } catch (error) {
    console.error('Erreur lors de la création du token:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Route pour traiter une demande de paiement avec un token
router.post('/process-nfc', async (req, res) => {
  try {
    const { cardData, amount, currency, description } = req.body;

    if (!cardData || !amount || !currency) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required payment data' 
      });
    }

    // Create a payment method from the EMV data
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card_present',
      card_present: {
        emv_data: cardData
      }
    });

    // Create and confirm the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      payment_method: paymentMethod.id,
      payment_method_types: ['card_present'],
      capture_method: 'manual',
      confirm: true
    });

    // Handle the payment result
    if (paymentIntent.status === 'requires_capture') {
      // Capture the payment
      const capturedPayment = await stripe.paymentIntents.capture(
        paymentIntent.id
      );
      
      res.json({
        success: true,
        paymentIntent: capturedPayment,
        message: 'Payment captured successfully'
      });
    } else {
      throw new Error(`Unexpected payment status: ${paymentIntent.status}`);
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/process-nfc2', async (req, res) => {
  try {
    const { paymentMethodId, amount, currency, description } = req.body;

    // Validation des données envoyées
    if (!paymentMethodId || !amount || !currency) {
      return res.status(400).json({ success: false, error: 'Données manquantes' });
    }

    // Créez une intention de paiement avec le PaymentMethod
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Montant en centimes (ex : 50000 pour 500,00 €)
      currency: currency,
      description: description || 'Paiement via NFC',
      payment_method: paymentMethodId, // Utilisez un PaymentMethodId valide
      confirm: true, // Confirmer automatiquement le paiement
    });

    // Vérifier le statut du paiement
    if (paymentIntent.status === 'succeeded') {
      res.json({
        success: true,
        paymentIntent,
        message: 'Paiement effectué avec succès',
      });
    } else {
      res.json({
        success: false,
        paymentIntent,
        message: `Statut du paiement: ${paymentIntent.status}`,
      });
    }
  } catch (error) {
    console.error('Erreur Stripe:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount = 50, currency = 'eur', description = 'NFC Payment' } = req.body;

    console.log('Creating PaymentIntent:', { amount, currency, description });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount),
      currency: currency.toLowerCase(),
      description,
      payment_method_types: ['card'],
      capture_method: 'automatic',
      confirm: false,
      payment_method_options: {
        card: {
          request_three_d_secure: 'any'
        }
      }
    });

    console.log('PaymentIntent created with ID:', paymentIntent.id);

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment Intent creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add endpoint to retrieve payment status
router.get('/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.status(200).json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = router;
