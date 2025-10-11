module.exports = (username, bookingDetails) => {
  const { listing, checkIn, checkOut, guests, totalPrice } = bookingDetails;

  return `
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <!-- Import Google Font -->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
  </style>
  
  <div style="background: linear-gradient(135deg, #fc5c79 0%, #ff8c42 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <!-- Elegant Joya Text - Matching the brand style -->
    <h1 style="color: white; margin: 0; font-family: 'Dancing Script', cursive; font-weight: 600; font-size: 48px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 2px;">Joya</h1>
    <p style="color: white; margin: 10px 0 0 0; font-weight: 500;">Booking Confirmed!</p>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-bottom: 20px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-weight: 600;">Hello ${username}!</h2>
    
    <p style="color: #666; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      Great news! Your booking has been confirmed. Here are your booking details:
    </p>
    
    <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #fc5c79;">
      <h3 style="color: #fc5c79; margin-top: 0;">${listing.title}</h3>
      <p style="color: #666; margin: 5px 0;"><strong>Location:</strong> ${
        listing.location
      }</p>
      <p style="color: #666; margin: 5px 0;"><strong>Check-in:</strong> ${new Date(
        checkIn
      ).toLocaleDateString()}</p>
      <p style="color: #666; margin: 5px 0;"><strong>Check-out:</strong> ${new Date(
        checkOut
      ).toLocaleDateString()}</p>
      <p style="color: #666; margin: 5px 0;"><strong>Guests:</strong> ${guests}</p>
      <p style="color: #fc5c79; margin: 15px 0 0 0; font-size: 18px;"><strong>Total Price: ₹${totalPrice.toLocaleString(
        "en-IN"
      )}</strong></p>
    </div>
    
    <p style="color: #666; line-height: 1.6;">
      We hope you have a wonderful stay! If you have any questions, feel free to contact us.
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      <p style="color: #999; font-size: 12px; margin: 0;">
        This is an automated email from Joya Platform. Please do not reply to this email.
      </p>
    </div>
  </div>
</div>
`;
};
