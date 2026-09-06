'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const paymentProviders = [
  {
    id: 'airtel_money',
    name: 'Airtel Money',
    logo: '🔴',
    color: 'bg-red-600',
    description: 'Paiement instantané',
  },
  {
    id: 'moov_money',
    name: 'Moov Money',
    logo: '🔵',
    color: 'bg-blue-600',
    description: 'Paiement sécurisé',
  },
  {
    id: 'orange_zamany',
    name: 'Orange Zamany',
    logo: '🟠',
    color: 'bg-orange-500',
    description: 'Rapide et fiable',
  },
  {
    id: 'flooz',
    name: 'Flooz',
    logo: '💳',
    color: 'bg-purple-600',
    description: 'Mobile money',
  },
  {
    id: 'mynita',
    name: 'MyNita',
    logo: '📱',
    color: 'bg-green-600',
    description: 'Paiement mobile',
  },
  {
    id: 'amanata',
    name: 'Amanata',
    logo: '💰',
    color: 'bg-teal-600',
    description: 'Service de paiement',
  },
  {
    id: 'all_iza',
    name: 'All-Iza Business',
    logo: '🏦',
    color: 'bg-indigo-600',
    description: 'Business payment',
  },
  {
    id: 'zeyna',
    name: 'Zeyna',
    logo: '✨',
    color: 'bg-pink-600',
    description: 'Paiement digital',
  },
];

export default function CheckoutPaymentPage() {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  const orderId = searchParams.get('order_id');
  const amount = parseInt(searchParams.get('amount') || '0');

  const handlePayment = async () => {
    if (!selectedProvider) {
      setError('Veuillez sélectionner un moyen de paiement');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Créer le paiement en base
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          amount_xof: amount,
          payment_method: selectedProvider,
          payment_status: 'pending',
          phone_number: phoneNumber,
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Simuler l'appel API au provider (à remplacer par les vraies API)
      // Ici on simule un succès après 2 secondes
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mettre à jour le statut du paiement
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          payment_status: 'completed',
          transaction_id: `TXN-${Date.now()}`,
          provider_response: { status: 'success' },
        })
        .eq('id', payment.id);

      if (updateError) throw updateError;

      // Mettre à jour la commande
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
        })
        .eq('id', orderId);

      if (orderError) throw orderError;

      alert('✅ Paiement réussi ! Votre commande est confirmée.');
      router.push('/checkout/success?order_id=' + orderId);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du paiement');
      
      // Mettre à jour le statut en échec
      await supabase
        .from('payments')
        .update({ payment_status: 'failed' })
        .eq('order_id', orderId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-full md:max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          💳 Paiement
        </h1>

        {/* Résumé de la commande */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📦 Résumé de la commande
          </h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700">Montant total</span>
            <span className="text-2xl font-bold text-gray-900">
              {amount.toLocaleString()} FCFA
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Commande #{orderId}</p>
          </div>
        </div>

        {/* Sélection du provider */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📱 Choisissez votre moyen de paiement
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedProvider === provider.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${provider.color} rounded-full flex items-center justify-center text-white text-xl`}>
                    {provider.logo}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{provider.name}</p>
                    <p className="text-sm text-gray-600">{provider.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Numéro de téléphone */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📞 Numéro de téléphone
          </h2>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+227 XX XX XX XX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-600 mt-2">
            Entrez le numéro associé à votre compte mobile money
          </p>
        </div>

        {/* Bouton de paiement */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading || !selectedProvider || !phoneNumber}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Traitement en cours...' : `Payer ${amount.toLocaleString()} FCFA`}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          🔒 Paiement sécurisé et crypté
        </p>
      </div>
    </div>
  );
}
