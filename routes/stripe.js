const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Remplacez par votre clé secrète Stripe
const router = express.Router();

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
    });

    res.json({
      success: true,
      paymentIntent, // Retourne l'objet PaymentIntent
    });
  } catch (error) {
    console.error('Erreur Stripe:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


module.exports = router;
