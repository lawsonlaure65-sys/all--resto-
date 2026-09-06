'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Payment {
  id: string;
  order_id: string;
  amount_xof: number;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  phone_number: string;
  created_at: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProviderName = (method: string) => {
    const providers: Record<string, string> = {
      airtel_money: 'Airtel Money',
      moov_money: 'Moov Money',
      orange_zamany: 'Orange Zamany',
      flooz: 'Flooz',
      mynita: 'MyNita',
      amanata: 'Amanata',
      all_iza: 'All-Iza Business',
      zeyna: 'Zeyna',
    };
    return providers[method] || method;
  };

  const totalPaid = payments
    .filter(p => p.payment_status === 'completed')
    .reduce((sum, p) => sum + p.amount_xof, 0);

  const totalPending = payments
    .filter(p => p.payment_status === 'pending')
    .reduce((sum, p) => sum + p.amount_xof, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-full md:max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          💳 Paiements Mobile Money
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <p className="text-gray-600 text-sm">Total encaissé</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {totalPaid.toLocaleString()} FCFA
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <p className="text-gray-600 text-sm">En attente</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {totalPending.toLocaleString()} FCFA
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <p className="text-gray-600 text-sm">Transactions</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {payments.length}
            </p>
          </div>
        </div>

        {/* Liste des paiements */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Transaction</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Commande</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Provider</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Téléphone</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Montant</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-mono text-sm text-gray-700">
                        {payment.transaction_id || 'En attente'}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-900">{payment.order_id}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-700">{getProviderName(payment.payment_method)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-700">{payment.phone_number}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">
                        {payment.amount_xof.toLocaleString()} FCFA
                      </p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.payment_status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : payment.payment_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-700">
                        {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
