import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { orderId, amount, paymentMethod, phoneNumber } = await request.json();

    // Initialiser Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'
    );

    // Créer le paiement
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        amount_xof: amount,
        payment_method: paymentMethod,
        payment_status: 'pending',
        phone_number: phoneNumber,
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Appeler l'API du provider (exemple pour Airtel Money)
    let transactionId;
    let providerResponse;

    switch (paymentMethod) {
      case 'airtel_money':
        transactionId = `AIRTEL-${Date.now()}`;
        providerResponse = { status: 'success' };
        break;

      case 'moov_money':
        transactionId = `MOOV-${Date.now()}`;
        providerResponse = { status: 'success' };
        break;

      case 'orange_zamany':
        transactionId = `ORANGE-${Date.now()}`;
        providerResponse = { status: 'success' };
        break;

      case 'flooz':
        transactionId = `FLOOZ-${Date.now()}`;
        providerResponse = { status: 'success' };
        break;

      case 'mynita':
        transactionId = `MYN-${Date.now().toString().slice(-6)}`;
        providerResponse = { status: 'success' };
        break;

      case 'amanata':
        transactionId = `AMA-${Date.now().toString().slice(-6)}`;
        providerResponse = { status: 'success' };
        break;

      case 'all_iza':
        transactionId = `IZZA-${Date.now().toString().slice(-6)}`;
        providerResponse = { status: 'success' };
        break;

      case 'zeyna':
        transactionId = `ZEY-${Date.now().toString().slice(-6)}`;
        providerResponse = { status: 'success' };
        break;

      default:
        transactionId = `TXN-${Date.now()}`;
        providerResponse = { status: 'success' };
    }

    // Mettre à jour le paiement
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_status: 'completed',
        transaction_id: transactionId,
        provider_response: providerResponse,
      })
      .eq('id', payment.id);

    if (updateError) throw updateError;

    // Mettre à jour la commande
    await supabase
      .from('orders')
      .update({ payment_status: 'paid' })
      .eq('id', orderId);

    return NextResponse.json({
      success: true,
      transactionId,
      message: 'Paiement réussi',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
