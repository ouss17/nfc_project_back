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
    const { nfcData, amount, currency, description } = req.body;

    // Validation des données envoyées
    if (!nfcData || !amount || !currency) {
      return res.status(400).json({ success: false, error: 'Données manquantes' });
    }

    // Créez une intention de paiement avec le token
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Montant en centimes (par exemple, 50000 pour 500,00 €)
      currency: currency,
      description: description || 'Paiement via NFC',
      payment_method_data: {
        type: 'card',
        card: {
          token: nfcData, // Utilisez un token valide, ex : 'tok_visa'
        },
      },
      confirm: true, // Confirmer automatiquement le paiement
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    // Vérifier le statut du paiement
    if (paymentIntent.status === 'succeeded') {
      res.json({
        success: true,
        paymentIntent,
        message: 'Paiement effectué avec succès'
      });
    } else {
      res.json({
        success: false,
        paymentIntent,
        message: `Statut du paiement: ${paymentIntent.status}`
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
  const { amount, currency, payment_method } = req.body;

  try {
    // create payment intent with amount, currency, and payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card','card_present'], // For NFC transactions
      payment_method : "pm_card_visa",
      capture_method: 'automatic',
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});


module.exports = router;
