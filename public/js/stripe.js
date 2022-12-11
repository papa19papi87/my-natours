import axios from 'axios';
import { showAlert } from './alert';

let stripe = null;

if ('Stripe' in window) {
  stripe = Stripe(
    'pk_test_51Kg6g3FdosWjbtwzWMEaSVtuiVDE4IT7uAUrKJPb17jyFQlgQlwfVGjpyx5Kvr5eB4eELDGJOqo07elzpGcmx6iM00KGAS3cJs'
  );
}

export const bookTour = async (tourId) => {
  try {
    //  1)get checkout session from api
    const session = await axios.post(
      `/api/v1/booking/checkout-session/${tourId}`
    );
    console.log(session);
    // const session = await axios.post((window.location = session.data.url));
    // window.location = response.data.url;

    // create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
