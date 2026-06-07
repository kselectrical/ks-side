import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BookingForm } from '../components/BookingForm';
import { Breadcrumbs } from '../components/Breadcrumbs';
import type { CartItem } from '../types';
import type { BusinessConfig } from '../data';
import type { BookingData } from '../firebase';

interface CheckoutPageProps {
  cart: Record<string, CartItem>;
  onClearCart: () => void;
  selectedLocation: string;
  onSubmitBooking: (bookingDetails: Omit<BookingData, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  businessConfig: BusinessConfig;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  onClearCart,
  selectedLocation,
  onSubmitBooking,
  businessConfig
}) => {
  return (
    <>
      <Helmet>
        <title>Secure Checkout & Booking Slots | KS Electrical</title>
        <meta name="description" content="Securely specify your doorstep service address, schedule your technical repairs slot, and confirm your doorstep booking." />
        <link rel="canonical" href="https://ks-demo.web.app/checkout" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Checkout / Book Slot' }]} />

      <div className="bg-white py-12 border-b border-gray-100 text-center">
        <BookingForm
          cart={cart}
          onClearCart={onClearCart}
          selectedLocation={selectedLocation}
          onSubmitBooking={onSubmitBooking}
          businessConfig={businessConfig}
        />
      </div>
    </>
  );
};
export default CheckoutPage;
